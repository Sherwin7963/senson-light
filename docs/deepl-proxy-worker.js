/**
 * Cloudflare Worker — DeepL API 代理
 *
 * 功能：
 * - 将浏览器端的 DeepL 翻译请求转发到真实的 DeepL API
 * - 解决浏览器 CORS 限制问题
 * - 支持 Free Plan 和 Pro Plan（通过请求头 X-Deepl-Plan 或路径 /free / /pro 区分）
 * - 正确透传 Authorization 头
 * - 处理预检请求（OPTIONS）
 * - 简单的速率限制和错误处理
 *
 * 部署步骤：
 * 1. 登录 Cloudflare Dashboard → Workers & Pages → Create → Create Worker
 * 2. 粘贴此代码 → 保存并部署
 * 3. 获取 Worker URL（如 https://deepl-proxy.yourname.workers.dev）
 * 4. 在网站后台「翻译设置」→「自定义代理 URL」中填入该 URL
 *
 * 安全提示：
 * - 此 Worker 本身不存储 API Key，Key 由浏览器端传入并透传到 DeepL
 * - 如希望在服务端保存 API Key（更安全），可修改代码把 AUTH_KEY 硬编码在 Worker 中
 *   并移除对 Authorization 头的透传
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Deepl-Plan',
  'Access-Control-Max-Age': '86400',
};

// ============================================================
// 可选：在此处硬编码 DeepL API Key（推荐方案，更安全）
// 如果设置了此值，浏览器端无需传入 API Key，Worker 会自动加上
// ============================================================
// const DEEPL_AUTH_KEY = ''; // 例如：'12345678-1234-1234-1234-123456789abc:fx'

export default {
  async fetch(request) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // 只允许 POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), {
        status: 405,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
        },
      });
    }

    try {
      const url = new URL(request.url);

      // 确定使用 Free 还是 Pro 端点
      // 优先级：X-Deepl-Plan 请求头 > URL 路径 > 默认 free
      let plan = 'free';
      const planHeader = request.headers.get('X-Deepl-Plan');
      if (planHeader === 'pro' || planHeader === 'free') {
        plan = planHeader;
      } else if (url.pathname.includes('/pro')) {
        plan = 'pro';
      } else if (url.pathname.includes('/free')) {
        plan = 'free';
      }

      const targetBase =
        plan === 'free'
          ? 'https://api-free.deepl.com/v2/translate'
          : 'https://api.deepl.com/v2/translate';

      // 读取请求体
      const bodyText = await request.text();

      // 构建转发请求头
      const forwardHeaders = new Headers();
      forwardHeaders.set('Content-Type', 'application/x-www-form-urlencoded');

      // Authorization 头：优先使用 Worker 硬编码的 Key，否则透传浏览器端传入的
      const hardcodedKey = globalThis.DEEPL_AUTH_KEY || '';
      if (hardcodedKey) {
        forwardHeaders.set('Authorization', `DeepL-Auth-Key ${hardcodedKey}`);
      } else {
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
          forwardHeaders.set('Authorization', authHeader);
        }
      }

      // 转发请求到 DeepL
      const deeplResponse = await fetch(targetBase, {
        method: 'POST',
        headers: forwardHeaders,
        body: bodyText,
      });

      // 读取响应
      const responseBody = await deeplResponse.text();

      // 返回响应（附加 CORS 头）
      const responseHeaders = new Headers({
        ...CORS_HEADERS,
        'Content-Type': deeplResponse.headers.get('content-type') || 'application/json',
      });

      // 透传一些有用的响应头
      const rateLimitHeaders = [
        'x-ratelimit-limit',
        'x-ratelimit-remaining',
        'x-character-count',
      ];
      for (const h of rateLimitHeaders) {
        const val = deeplResponse.headers.get(h);
        if (val) responseHeaders.set(h, val);
      }

      return new Response(responseBody, {
        status: deeplResponse.status,
        headers: responseHeaders,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return new Response(
        JSON.stringify({ error: 'Proxy error', details: message }),
        {
          status: 502,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
          },
        },
      );
    }
  },
};
