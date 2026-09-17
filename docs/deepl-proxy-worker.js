/**
 * Cloudflare Worker — DeepL 翻译代理 + GA4 数据代理 + GitHub API 代理
 *
 * 功能：
 * 1. DeepL API 代理 — 解决浏览器 CORS 限制，API Key 存在 Worker Secrets
 * 2. GA4 Data API 代理 — 使用 Service Account JWT 认证，代理 GA4 数据分析接口
 * 3. GitHub API 代理 — Token 存在 Worker Secrets，前端不存敏感信息
 *
 * ============================================================
 * 环境变量（Worker Secrets）配置：
 * ============================================================
 *
 * # DeepL（可选，推荐硬编码在 Worker 中更安全）
 * DEEPL_AUTH_KEY=12345678-1234-1234-1234-123456789abc:fx
 *
 * # GA4（可选）
 * GA4_PROPERTY_ID=553493228
 * GA4_CLIENT_EMAIL=ga4-proxy@your-project.iam.gserviceaccount.com
 * GA4_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
 *
 * # GitHub（可选，推荐配置以获得更好的安全性）
 * GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
 * GITHUB_OWNER=your-username
 * GITHUB_REPO=your-repo
 * GITHUB_BRANCH=main
 *
 * ============================================================
 * GitHub API 端点（前端通过 Worker 代理调用）：
 * ============================================================
 *
 * POST   /api/github/contents/:path     → 创建/更新文件（body: {content, message, branch?, sha?}）
 * GET    /api/github/contents/:path     → 获取文件内容（query: ref=branch）
 * DELETE /api/github/contents/:path     → 删除文件（body: {message, sha, branch?}）
 * POST   /api/github/issues             → 创建 Issue（body: {title, body, labels?}）
 * POST   /api/github/blobs              → 创建 blob（body: {content, encoding}）
 * POST   /api/github/trees              → 创建 tree（body: {base_tree, tree}）
 * POST   /api/github/commits            → 创建 commit（body: {message, tree, parents}）
 * PATCH  /api/github/git/refs/:ref      → 更新 ref（body: {sha, force?}）
 * GET    /api/github/git/ref/:ref       → 获取 ref
 * GET    /api/github/commits/:sha/tree  → 获取 commit 的 tree
 * GET    /api/github/actions/workflows/:workflow_id/dispatches → 触发 workflow (POST)
 * GET    /api/github/actions/workflows/:workflow_id/runs → 获取最近运行
 * GET    /api/github/repo               → 获取仓库信息
 *
 * 部署步骤：
 * 1. 登录 Cloudflare Dashboard → Workers & Pages → Create → Create Worker
 * 2. 粘贴此代码 → 保存并部署
 * 3. 在 Settings → Variables 中配置上述 Secrets
 * 4. 获取 Worker URL（如 https://your-worker.yourname.workers.dev）
 * 5. 在网站后台填写对应配置
 */

// ==================== CORS 头 ====================
// V135: 增强 CORS 配置，确保浏览器 preflight 100% 通过
// 关键原则：
//   1. Allow-Headers 必须包含前端可能发送的所有自定义 header
//   2. Allow-Methods 必须包含所有使用的 HTTP 方法
//   3. Expose-Headers 必须包含前端需要读取的响应头
//   4. OPTIONS 预检响应必须是 204 No Content，无 body
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Deepl-Plan, X-Custom-Header, Accept, Accept-Language, Content-Language, Origin, X-Github-Owner, X-Github-Repo, X-Github-Branch, X-GitHub-Api-Version, X-RateLimit-Limit, X-RateLimit-Remaining',
  'Access-Control-Expose-Headers': 'Content-Type, Content-Length, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-RateLimit-Used, X-Oauth-Scopes, Location, X-Character-Count',
  'Access-Control-Max-Age': '86400',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}

// ==================== GA4 JWT 认证 ====================
// Google OAuth2 token endpoint
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

/**
 * 将 base64url 编码转换为 ArrayBuffer（用于 Web Crypto）
 */
function b64urlToBuffer(b64url) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * 解析 PEM 格式私钥，提取 base64 编码部分
 * 处理场景：
 *   - JSON 转义的 \n （环境变量常见）
 *   - PEM 标记行（BEGIN / END）
 *   - 换行符、回车符、空格
 *   - base64 填充缺失（长度不是 4 的倍数）
 */
function parsePrivateKey(pemKey) {
  if (!pemKey || typeof pemKey !== 'string') {
    throw new Error('Private key is empty or not a string');
  }

  let key = pemKey;

  // 1. 处理 JSON 转义符（\n → \n，\r → \r，\\ → \）
  key = key.replace(/\\n/g, '\n');
  key = key.replace(/\\r/g, '\r');
  key = key.replace(/\\\\/g, '\\');

  // 2. 去除 PEM 标记行
  key = key.replace(/-----BEGIN [A-Z0-9 ]*KEY-----/g, '');
  key = key.replace(/-----END [A-Z0-9 ]*KEY-----/g, '');

  // 3. 去除所有空白字符（换行、回车、空格、制表符）
  key = key.replace(/[\s\r\n\t]+/g, '');

  // 4. 去除可能存在的引号（环境变量被包裹）
  key = key.replace(/^["']|["']$/g, '');

  // 5. 验证 base64 字符合法性
  if (!/^[A-Za-z0-9+/=]+$/.test(key)) {
    const invalidChars = key.replace(/[A-Za-z0-9+/=]/g, '');
    throw new Error(
      `Private key contains invalid base64 characters: "${invalidChars.slice(0, 20)}"` +
      (invalidChars.length > 20 ? '...' : ''),
    );
  }

  // 6. 移除尾部填充后重新补齐（保证恰好是 4 的倍数）
  key = key.replace(/=+$/g, '');
  while (key.length % 4 !== 0) {
    key += '=';
  }

  return key;
}

/**
 * 从 PEM 格式私钥中提取 base64 并转为 ArrayBuffer
 */
function extractPrivateKeyBytes(pemKey) {
  const b64 = parsePrivateKey(pemKey);
  return b64urlToBuffer(b64);
}

/**
 * 使用 Service Account 私钥生成 JWT 并换取 access_token
 * - token 缓存 55 分钟（实际有效期 60 分钟）
 */
let cachedToken = null;
let cachedTokenExpiry = 0;

async function getAccessToken(clientEmail, privateKeyPem) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedTokenExpiry) {
    return cachedToken;
  }

  // 构造 JWT header & payload
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: GA4_SCOPE,
    aud: TOKEN_ENDPOINT,
    exp: now + 3600,
    iat: now,
  };

  // base64url 编码（兼容 Unicode，替代已废弃的 unescape）
  const encodeB64Url = (obj) => {
    const jsonStr = JSON.stringify(obj);
    // 使用 Uint8Array + btoa 安全编码 Unicode 字符串
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const b64 = btoa(binary);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const headerB64 = encodeB64Url(header);
  const payloadB64 = encodeB64Url(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  // 使用 Web Crypto API 签名
  const keyBytes = extractPrivateKeyBytes(privateKeyPem);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  // 将签名转为 base64url
  const sigBytes = new Uint8Array(signatureBuffer);
  let sigBinary = '';
  for (let i = 0; i < sigBytes.length; i++) {
    sigBinary += String.fromCharCode(sigBytes[i]);
  }
  const signatureB64 = btoa(sigBinary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const jwt = `${signingInput}.${signatureB64}`;

  // 换取 access_token
  const formBody = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  });

  const resp = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody.toString(),
  });

  const data = await resp.json();
  if (!resp.ok || !data.access_token) {
    throw new Error(
      `Failed to get access token: ${resp.status} ${data.error || data.error_description || ''}`,
    );
  }

  cachedToken = data.access_token;
  cachedTokenExpiry = now + 3300; // 55 分钟
  return cachedToken;
}

// ==================== GA4 Data API 调用 ====================
const GA4_API_ENDPOINT = 'https://analyticsdata.googleapis.com/v1beta';

async function callGa4RunReport(propertyId, accessToken, body) {
  const url = `${GA4_API_ENDPOINT}/properties/${propertyId}:runReport`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(
      `GA4 API error (${resp.status}): ${data.error?.message || JSON.stringify(data)}`,
    );
  }
  return data;
}

// 辅助：从 GA4 响应中提取行数据
function extractRows(data) {
  const rows = data.rows || [];
  const dimensionHeaders = (data.dimensionHeaders || []).map((h) => h.name);
  const metricHeaders = (data.metricHeaders || []).map((h) => h.name);

  return rows.map((row) => {
    const obj = {};
    dimensionHeaders.forEach((name, i) => {
      obj[name] = row.dimensionValues?.[i]?.value ?? '';
    });
    metricHeaders.forEach((name, i) => {
      obj[name] = row.metricValues?.[i]?.value ?? '0';
    });
    return obj;
  });
}

// ==================== 各 GA4 端点处理 ====================

/**
 * 概览数据：总访问量(30天)、今日访问量、7天趋势、跳出率、平均停留时长
 */
async function handleGa4Overview(propertyId, accessToken) {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // GA4 Data API 要求日期格式为 YYYY-MM-DD（带横线）
  // 或使用相对日期：today / yesterday / NdaysAgo
  const fmtDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 并行调用多个 report
  const [totalData, todayData, trendData, bounceData, durationData] = await Promise.all([
    // 总访问量（30 天）
    callGa4RunReport(propertyId, accessToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    }),
    // 今日访问量
    callGa4RunReport(propertyId, accessToken, {
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    }),
    // 7 天趋势
    callGa4RunReport(propertyId, accessToken, {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'yesterday' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    // 跳出率（30 天）
    callGa4RunReport(propertyId, accessToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [{ name: 'bounceRate' }],
    }),
    // 平均停留时长（30 天）
    callGa4RunReport(propertyId, accessToken, {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [{ name: 'userEngagementDuration' }, { name: 'activeUsers' }],
    }),
  ]);

  const total = extractRows(totalData)[0] || { sessions: '0', activeUsers: '0' };
  const todayRow = extractRows(todayData)[0] || { sessions: '0', activeUsers: '0' };
  const trendRows = extractRows(trendData);
  const bounceRow = extractRows(bounceData)[0] || { bounceRate: '0' };
  const durRow = extractRows(durationData)[0] || { userEngagementDuration: '0', activeUsers: '1' };

  // 计算平均停留时长（秒）
  const avgDuration =
    parseFloat(durRow.userEngagementDuration || '0') / Math.max(1, parseFloat(durRow.activeUsers || '1'));

  // 构造 7 天趋势数组（按日期排序，补零）
  // GA4 date dimension 返回格式为 YYYYMMDD（无横线），需要转为 YYYY-MM-DD
  const trendMap = {};
  trendRows.forEach((r) => {
    const d = r.date || '';
    if (d.length === 8) {
      // YYYYMMDD → YYYY-MM-DD
      const formatted = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
      trendMap[formatted] = parseInt(r.sessions || '0', 10);
    }
  });

  const dailyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = fmtDate(d);
    dailyTrend.push({
      date: dateKey,
      sessions: trendMap[dateKey] || 0,
    });
  }

  return {
    totalSessions: parseInt(total.sessions || '0', 10),
    totalUsers: parseInt(total.activeUsers || '0', 10),
    todaySessions: parseInt(todayRow.sessions || '0', 10),
    todayUsers: parseInt(todayRow.activeUsers || '0', 10),
    bounceRate: parseFloat(bounceRow.bounceRate || '0').toFixed(1),
    avgDurationSeconds: Math.round(avgDuration),
    dailyTrend,
  };
}

/**
 * 热门页面 Top10
 */
async function handleGa4TopPages(propertyId, accessToken) {
  const data = await callGa4RunReport(propertyId, accessToken, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10,
  });

  const rows = extractRows(data);
  const total = rows.reduce((sum, r) => sum + parseInt(r.screenPageViews || '0', 10), 0);

  return {
    pages: rows.map((r) => ({
      path: r.pagePath || '/',
      views: parseInt(r.screenPageViews || '0', 10),
      percent: total > 0 ? ((parseInt(r.screenPageViews || '0', 10) / total) * 100).toFixed(1) : '0',
    })),
    total,
  };
}

/**
 * 访客来源
 */
async function handleGa4Sources(propertyId, accessToken) {
  const data = await callGa4RunReport(propertyId, accessToken, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });

  const rows = extractRows(data);
  const total = rows.reduce((sum, r) => sum + parseInt(r.sessions || '0', 10), 0);

  return {
    sources: rows.map((r) => ({
      name: r.sessionDefaultChannelGroup || 'Direct',
      sessions: parseInt(r.sessions || '0', 10),
      percent: total > 0 ? ((parseInt(r.sessions || '0', 10) / total) * 100).toFixed(1) : '0',
    })),
    total,
  };
}

/**
 * 访客地区 Top10
 */
async function handleGa4Countries(propertyId, accessToken) {
  const data = await callGa4RunReport(propertyId, accessToken, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 10,
  });

  const rows = extractRows(data);
  const total = rows.reduce((sum, r) => sum + parseInt(r.activeUsers || '0', 10), 0);

  return {
    countries: rows.map((r) => ({
      country: r.country || 'Unknown',
      users: parseInt(r.activeUsers || '0', 10),
      percent: total > 0 ? ((parseInt(r.activeUsers || '0', 10) / total) * 100).toFixed(1) : '0',
    })),
    total,
  };
}

/**
 * 设备类型分布
 */
async function handleGa4Devices(propertyId, accessToken) {
  const data = await callGa4RunReport(propertyId, accessToken, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });

  const rows = extractRows(data);
  const total = rows.reduce((sum, r) => sum + parseInt(r.sessions || '0', 10), 0);

  return {
    devices: rows.map((r) => ({
      category: r.deviceCategory || 'desktop',
      sessions: parseInt(r.sessions || '0', 10),
      percent: total > 0 ? ((parseInt(r.sessions || '0', 10) / total) * 100).toFixed(1) : '0',
    })),
    total,
  };
}

// ==================== DeepL 代理 ====================
async function handleDeepl(request, env) {
  try {
    const url = new URL(request.url);

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

    const bodyText = await request.text();
    const forwardHeaders = new Headers();
    forwardHeaders.set('Content-Type', 'application/x-www-form-urlencoded');

    // V135: 同时支持 env.secrets（Worker 配置）和 globalThis（旧兼容）
    // Cloudflare Workers 的 Secrets 通过 env 参数传入，不是 globalThis
    const hardcodedKey = env?.DEEPL_AUTH_KEY || globalThis.DEEPL_AUTH_KEY || '';
    if (hardcodedKey) {
      forwardHeaders.set('Authorization', `DeepL-Auth-Key ${hardcodedKey}`);
    } else {
      // 没有硬编码 key → 从前端请求的 Authorization header 透传
      const authHeader = request.headers.get('Authorization');
      if (authHeader) forwardHeaders.set('Authorization', authHeader);
    }

    const deeplResponse = await fetch(targetBase, {
      method: 'POST',
      headers: forwardHeaders,
      body: bodyText,
    });

    const responseBody = await deeplResponse.text();
    const responseHeaders = new Headers({
      ...CORS_HEADERS,
      'Content-Type': deeplResponse.headers.get('content-type') || 'application/json',
    });

    for (const h of ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-character-count']) {
      const val = deeplResponse.headers.get(h);
      if (val) responseHeaders.set(h, val);
    }

    return new Response(responseBody, {
      status: deeplResponse.status,
      headers: responseHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: 'Proxy error', details: message }, 502);
  }
}

// ==================== GA4 路由处理 ====================
async function handleGa4Request(pathname, env) {
  // keyInfo 提到 try 外面，避免 catch 中访问时报 ReferenceError
  let keyInfo = 'unavailable';

  try {
    const propertyId = env?.GA4_PROPERTY_ID || globalThis.GA4_PROPERTY_ID;
    const clientEmail = env?.GA4_CLIENT_EMAIL || globalThis.GA4_CLIENT_EMAIL;
    const privateKey = env?.GA4_PRIVATE_KEY || globalThis.GA4_PRIVATE_KEY;

    if (!propertyId || !clientEmail || !privateKey) {
      return jsonResponse(
        { error: 'GA4 not configured', stage: 'config', details: 'Please set GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY in Worker secrets.' },
        500,
      );
    }

    // 调试：检查私钥解析状态（不输出完整私钥，只输出长度和前几字符）
    try {
      const parsed = parsePrivateKey(privateKey);
      keyInfo = `parsed key length=${parsed.length}, starts with=${parsed.slice(0, 6)}...`;
    } catch (parseErr) {
      return jsonResponse(
        {
          error: 'GA4 private key parse error',
          stage: 'key-parse',
          details: parseErr instanceof Error ? parseErr.message : String(parseErr),
        },
        500,
      );
    }

    // 获取 access_token
    let accessToken;
    try {
      accessToken = await getAccessToken(clientEmail, privateKey);
    } catch (tokenErr) {
      const msg = tokenErr instanceof Error ? tokenErr.message : String(tokenErr);
      return jsonResponse(
        {
          error: 'Failed to get GA4 access token',
          stage: 'token-fetch',
          details: msg,
          keyInfo,
        },
        500,
      );
    }

    // 路由分发 — 每个端点都包 try/catch，精确定位错误阶段
    let handlerFn = null;
    let handlerName = 'unknown';

    if (pathname === '/api/ga4/overview') {
      handlerFn = handleGa4Overview;
      handlerName = 'overview';
    } else if (pathname === '/api/ga4/top-pages') {
      handlerFn = handleGa4TopPages;
      handlerName = 'top-pages';
    } else if (pathname === '/api/ga4/sources') {
      handlerFn = handleGa4Sources;
      handlerName = 'sources';
    } else if (pathname === '/api/ga4/countries') {
      handlerFn = handleGa4Countries;
      handlerName = 'countries';
    } else if (pathname === '/api/ga4/devices') {
      handlerFn = handleGa4Devices;
      handlerName = 'devices';
    }

    if (!handlerFn) {
      return jsonResponse({ error: 'Not found', stage: 'routing' }, 404);
    }

    try {
      const data = await handlerFn(propertyId, accessToken);
      return jsonResponse({ success: true, data });
    } catch (apiErr) {
      const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
      return jsonResponse(
        {
          error: `GA4 ${handlerName} API error`,
          stage: 'api-call',
          endpoint: handlerName,
          details: msg,
          keyInfo,
        },
        500,
      );
    }
  } catch (outerErr) {
    // 最外层兜底：捕获任何意料之外的异常，确保 Worker 不会崩溃（Error 1101）
    const message = outerErr instanceof Error ? outerErr.message : String(outerErr);
    return jsonResponse(
      {
        error: 'GA4 unexpected error',
        stage: 'unknown',
        details: message,
        keyInfo,
      },
      500,
    );
  }
}

// ==================== GitHub API 代理 ====================
// 将前端的 GitHub API 请求转发到 api.github.com，Token 从 Secrets 读取
// 前端永远看不到 Token，敏感信息只在 Worker 里

const GITHUB_API_BASE = 'https://api.github.com';

function getGithubHeaders(env) {
  const token = env?.GITHUB_TOKEN || globalThis.GITHUB_TOKEN || '';
  const headers = {
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'OWELL-Website-Sync-Worker',
  };
  if (token) {
    // GitHub API 同时支持 Bearer 和 token 两种格式
    // Fine-grained PAT 推荐用 Bearer，classic PAT 两种都支持
    // 使用 token 格式兼容性最好（GitHub 文档标准写法）
    headers.Authorization = `token ${token}`;
  }
  return headers;
}

function getGithubConfig(env) {
  return {
    owner: env?.GITHUB_OWNER || globalThis.GITHUB_OWNER || '',
    repo: env?.GITHUB_REPO || globalThis.GITHUB_REPO || '',
    branch: env?.GITHUB_BRANCH || globalThis.GITHUB_BRANCH || 'main',
    token: env?.GITHUB_TOKEN || globalThis.GITHUB_TOKEN || '',
  };
}

/**
 * 转发 GitHub API 请求
 * @param {Request} request
 * @param {*} env
 * @param {string} apiPath GitHub API 路径（如 /repos/owner/repo/contents/path）
 * @param {string} method HTTP 方法
 * @param {*} body 请求体（JSON 对象，可选）
 */
async function proxyGithubRequest(request, env, apiPath, method, body) {
  const url = `${GITHUB_API_BASE}${apiPath}`;
  const headers = { ...getGithubHeaders(env) };

  // 透传客户端的 Accept 头（如有）
  const clientAccept = request.headers.get('Accept');
  if (clientAccept && clientAccept !== 'application/json') {
    headers.Accept = clientAccept;
  }

  const init = { method, headers };
  if (body !== undefined && body !== null) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const response = await fetch(url, init);
  const responseBody = await response.text();

  // 403 时额外返回 GitHub 的完整错误信息，方便排查
  if (response.status === 403) {
    const rateRemaining = response.headers.get('x-ratelimit-remaining');
    const rateLimit = response.headers.get('x-ratelimit-limit');
    const bodySnippet = responseBody.slice(0, 500);
    console.warn(`[GitHub Proxy] 403 Forbidden: ${method} ${apiPath}`);
    console.warn(`[GitHub Proxy] Rate limit: ${rateRemaining}/${rateLimit}`);
    console.warn(`[GitHub Proxy] Response body: ${bodySnippet}`);
  }

  // 透传需要的响应头
  const responseHeaders = new Headers({ ...CORS_HEADERS });
  const contentType = response.headers.get('content-type');
  if (contentType) responseHeaders.set('Content-Type', contentType);

  // 透传速率限制头
  for (const h of [
    'x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset',
    'x-ratelimit-used', 'x-oauth-scopes', 'location',
  ]) {
    const val = response.headers.get(h);
    if (val) responseHeaders.set(h, val);
  }

  return new Response(responseBody, {
    status: response.status,
    headers: responseHeaders,
  });
}

/**
 * 处理 GitHub 代理请求
 * 路由：/api/github/*
 */
async function handleGithubProxy(request, env) {
  try {
    const config = getGithubConfig(env);
    const url = new URL(request.url);
    const method = request.method;

    // 去掉 /api/github/ 前缀
    const prefix = '/api/github/';
    const subPath = url.pathname.slice(prefix.length);

    // 读取请求体（需要时）
    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        body = await request.text();
      } else {
        body = await request.text();
      }
    }

    // 仓库所有者和仓库名：优先用 Worker Secrets 里的值
    // 也支持前端通过 header 指定（多仓库场景），但 Token 始终来自 Secrets
    let owner = config.owner;
    let repo = config.repo;
    let branch = config.branch;

    // 支持通过自定义 header 覆盖 owner/repo（多仓库场景）
    const headerOwner = request.headers.get('X-Github-Owner');
    const headerRepo = request.headers.get('X-Github-Repo');
    const headerBranch = request.headers.get('X-Github-Branch');
    if (headerOwner) owner = headerOwner;
    if (headerRepo) repo = headerRepo;
    if (headerBranch) branch = headerBranch;

    if (!owner || !repo) {
      return jsonResponse(
        { error: 'GitHub not configured', details: 'Set GITHUB_OWNER and GITHUB_REPO in Worker secrets, or pass X-Github-Owner and X-Github-Repo headers.' },
        400,
      );
    }

    // 路由分发
    // GET /api/github/repo → 获取仓库信息
    if (subPath === 'repo' && method === 'GET') {
      return proxyGithubRequest(
        request, env,
        `/repos/${owner}/${repo}`,
        'GET'
      );
    }

    // GET /api/github/contents/:path → 获取文件
    // POST /api/github/contents/:path → 创建/更新文件
    // DELETE /api/github/contents/:path → 删除文件
    if (subPath.startsWith('contents/')) {
      const path = subPath.slice('contents/'.length);
      const ref = url.searchParams.get('ref') || branch;
      const encodedPath = encodeURIComponent(path);
      const apiBase = `/repos/${owner}/${repo}/contents/${encodedPath}`;

      if (method === 'GET') {
        const apiPath = `${apiBase}?ref=${encodeURIComponent(ref)}`;
        return proxyGithubRequest(request, env, apiPath, 'GET');
      }

      if (method === 'POST' || method === 'PUT') {
        // body: {content, message, branch?, sha?}
        let bodyObj = {};
        try { bodyObj = JSON.parse(body || '{}'); } catch { /* ignore */ }
        // 确保 branch 存在
        if (!bodyObj.branch) bodyObj.branch = branch;
        return proxyGithubRequest(request, env, apiBase, 'PUT', bodyObj);
      }

      if (method === 'DELETE') {
        let bodyObj = {};
        try { bodyObj = JSON.parse(body || '{}'); } catch { /* ignore */ }
        if (!bodyObj.branch) bodyObj.branch = branch;
        return proxyGithubRequest(request, env, apiBase, 'DELETE', bodyObj);
      }

      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    // POST /api/github/issues → 创建 Issue
    if (subPath === 'issues' && method === 'POST') {
      return proxyGithubRequest(
        request, env,
        `/repos/${owner}/${repo}/issues`,
        'POST',
        body
      );
    }

    // POST /api/github/blobs → 创建 blob
    if (subPath === 'blobs' && method === 'POST') {
      return proxyGithubRequest(
        request, env,
        `/repos/${owner}/${repo}/git/blobs`,
        'POST',
        body
      );
    }

    // POST /api/github/trees → 创建 tree
    if (subPath === 'trees' && method === 'POST') {
      return proxyGithubRequest(
        request, env,
        `/repos/${owner}/${repo}/git/trees`,
        'POST',
        body
      );
    }

    // POST /api/github/commits → 创建 commit
    if (subPath === 'commits' && method === 'POST') {
      return proxyGithubRequest(
        request, env,
        `/repos/${owner}/${repo}/git/commits`,
        'POST',
        body
      );
    }

    // GET /api/github/git/ref/:ref → 获取 ref
    if (subPath.startsWith('git/ref/') && method === 'GET') {
      const ref = subPath.slice('git/ref/'.length);
      return proxyGithubRequest(
        request, env,
        `/repos/${owner}/${repo}/git/ref/${encodeURIComponent(ref)}`,
        'GET'
      );
    }

    // PATCH /api/github/git/refs/:ref → 更新 ref
    if (subPath.startsWith('git/refs/') && method === 'PATCH') {
      const ref = subPath.slice('git/refs/'.length);
      return proxyGithubRequest(
        request, env,
        `/repos/${owner}/${repo}/git/refs/${encodeURIComponent(ref)}`,
        'PATCH',
        body
      );
    }

    // GET /api/github/commits/:sha/tree → 获取 commit tree
    if (subPath.match(/^commits\/[a-f0-9]+\/tree$/) && method === 'GET') {
      const sha = subPath.split('/')[1];
      return proxyGithubRequest(
        request, env,
        `/repos/${owner}/${repo}/git/commits/${sha}/tree`,
        'GET'
      );
    }

    // POST /api/github/actions/workflows/:workflow_id/dispatches → 触发 workflow
    if (subPath.startsWith('actions/workflows/') && subPath.endsWith('/dispatches') && method === 'POST') {
      const workflowId = subPath.slice('actions/workflows/'.length, -'/dispatches'.length);
      return proxyGithubRequest(
        request, env,
        `/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflowId)}/dispatches`,
        'POST',
        body
      );
    }

    // GET /api/github/actions/workflows/:workflow_id/runs → 获取最近运行
    if (subPath.match(/^actions\/workflows\/[^/]+\/runs$/) && method === 'GET') {
      const workflowId = subPath.split('/')[2];
      const apiPath = `/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflowId)}/runs?per_page=${url.searchParams.get('per_page') || '1'}`;
      return proxyGithubRequest(request, env, apiPath, 'GET');
    }

    // 通用透传：/api/github/* → 直接转发到 api.github.com/*
    // 兜底：任何未明确匹配的路径都直接透传
    // 如果路径不是以 /repos/ 开头，说明前端去掉了 owner/repo 前缀，需要补回去
    let finalSubPath = subPath;
    if (!finalSubPath.startsWith('repos/') && !finalSubPath.startsWith('user') && !finalSubPath.startsWith('search/') && !finalSubPath.startsWith('rate_limit')) {
      finalSubPath = `repos/${owner}/${repo}/${finalSubPath}`;
    }
    return proxyGithubRequest(request, env, `/${finalSubPath}`, method, body || undefined);

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: 'GitHub proxy error', details: message }, 502);
  }
}

// ==================== 主入口 ====================
export default {
  async fetch(request, env) {
    // 🔴 最外层 try/catch 兜底：捕获任何未处理异常，防止 Worker 抛 Error 1101
    try {
      // 处理 CORS 预检
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }

      let url;
      try {
        url = new URL(request.url);
      } catch (urlErr) {
        return jsonResponse({ error: 'Invalid URL', stage: 'request' }, 400);
      }
      const pathname = url.pathname;

      // 路由：GitHub API 代理
      if (pathname.startsWith('/api/github/')) {
        return await handleGithubProxy(request, env);
      }

      // 路由：GA4 API
      if (pathname.startsWith('/api/ga4/')) {
        if (request.method === 'GET') {
          return await handleGa4Request(pathname, env);
        }
        return jsonResponse({ error: 'Method not allowed. Use GET.' }, 405);
      }

      // 路由：DeepL 代理（POST）
      if (request.method === 'POST') {
        return handleDeepl(request, env);
      }

      // 健康检查
      if (pathname === '/' || pathname === '/health') {
        return jsonResponse({
          status: 'ok',
          worker: 'deepl-ga4-github-proxy',
          ga4Configured: !!(env?.GA4_PROPERTY_ID || globalThis.GA4_PROPERTY_ID),
          deeplConfigured: !!(env?.DEEPL_AUTH_KEY || globalThis.DEEPL_AUTH_KEY),
          githubConfigured: !!(env?.GITHUB_TOKEN || globalThis.GITHUB_TOKEN),
          githubRepo: (env?.GITHUB_OWNER && env?.GITHUB_REPO) ? `${env.GITHUB_OWNER}/${env.GITHUB_REPO}` : null,
        });
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (fatalErr) {
      // 终极兜底：任何未被内部 catch 的错误都在这里捕获，绝不返回 Error 1101
      const message = fatalErr instanceof Error ? fatalErr.message : String(fatalErr);
      return jsonResponse(
        {
          error: 'Worker internal error',
          stage: 'fatal',
          details: message,
        },
        500,
      );
    }
  },
};
