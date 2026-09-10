# Cloudflare Workers 代理设置指南

> 使用 Cloudflare Worker 作为 DeepL API 的代理，彻底解决浏览器 CORS 限制问题。
> 这是**最稳定、最推荐**的实时翻译方案。

---

## 目录

1. [原理说明](#原理说明)
2. [准备工作](#准备工作)
3. [步骤 1：注册 Cloudflare 账号](#步骤-1注册-cloudflare-账号)
4. [步骤 2：创建 Worker](#步骤-2创建-worker)
5. [步骤 3：粘贴代理代码](#步骤-3粘贴代理代码)
6. [步骤 4：部署 Worker](#步骤-4部署-worker)
7. [步骤 5：在网站后台配置](#步骤-5在网站后台配置)
8. [步骤 6：测试翻译](#步骤-6测试翻译)
9. [费用说明](#费用说明)
10. [常见问题 FAQ](#常见问题-faq)

---

## 原理说明

DeepL API **不支持**浏览器直接调用（CORS 跨域限制）。

传统解决方案是用 CORS 代理服务，但：
- 公共代理不稳定、速度慢
- 有流量上限
- 可能泄露你的 API Key

**Cloudflare Worker 方案**：
- 你自己的专属代理，**100% 可控**
- 全球 300+ 节点，**速度极快**
- 免费额度 10 万次/天，**完全够用**
- API Key **绝不离开 Worker**（如果配置了环境变量）

工作流程：
```
浏览器 → Cloudflare Worker → DeepL API
     ←                      ←
    （CORS 响应）           （翻译结果）
```

---

## 准备工作

- ✅ 一个邮箱（注册 Cloudflare 用）
- ✅ DeepL API Key（免费版或专业版均可）
- ✅ 网站后台管理权限

> 💡 还没有 DeepL API Key？去 [DeepL 官网](https://www.deepl.com/pro-api) 注册，免费版每月有 50 万字符额度。

---

## 步骤 1：注册 Cloudflare 账号

1. 打开 [Cloudflare 官网](https://www.cloudflare.com/)
2. 点击右上角 **Sign Up**（注册）
3. 输入邮箱和密码，点击 **Create Account**
4. 去邮箱点击验证链接
5. 登录后进入 Cloudflare Dashboard

> 💡 不需要绑定信用卡也能用 Worker 免费版。

---

## 步骤 2：创建 Worker

1. 在 Cloudflare Dashboard 左侧菜单，点击 **Workers & Pages**
2. 点击右侧的 **Create** 按钮
3. 选择 **Create Worker**（不是 Pages）
4. 给你的 Worker 起个名字，例如 `deepl-proxy`
   - 最终 URL 会是 `https://deepl-proxy.yourname.workers.dev`
5. 点击 **Deploy** 部署（先用默认代码，下一步替换）

---

## 步骤 3：粘贴代理代码

1. 部署成功后，点击 **Edit code**（编辑代码）
2. 删除左侧编辑器里的所有默认代码
3. 复制下面的完整代码，粘贴进去：

```javascript
// Cloudflare Worker — DeepL API Proxy
// 支持 DeepL Free Plan 和 Pro Plan
// 支持 CORS 预检请求
// 正确传递 Authorization header

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Deepl-Plan',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request) {
    // CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 只接受 POST 请求
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    try {
      // 通过 X-Deepl-Plan header 判断使用 free 还是 pro 端点
      const plan = request.headers.get('X-Deepl-Plan') === 'pro' ? 'pro' : 'free';
      const targetBase =
        plan === 'free'
          ? 'https://api-free.deepl.com/v2/translate'
          : 'https://api.deepl.com/v2/translate';

      // 读取请求体
      const bodyText = await request.text();

      // 构造转发请求头
      const forwardHeaders = new Headers();
      forwardHeaders.set('Content-Type', 'application/x-www-form-urlencoded');

      // 透传 Authorization header（DeepL API Key）
      const authHeader = request.headers.get('Authorization');
      if (authHeader) forwardHeaders.set('Authorization', authHeader);

      // 转发到 DeepL API
      const deeplResponse = await fetch(targetBase, {
        method: 'POST',
        headers: forwardHeaders,
        body: bodyText,
      });

      // 读取 DeepL 响应
      const responseBody = await deeplResponse.text();
      const responseHeaders = new Headers({
        ...CORS_HEADERS,
        'Content-Type': deeplResponse.headers.get('content-type') || 'application/json',
      });

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
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        },
      );
    }
  },
};
```

---

## 步骤 4：部署 Worker

1. 代码粘贴完成后，点击右上角的 **Deploy** 按钮
2. 等待 10-30 秒部署完成
3. 部署成功后，你会看到 Worker 的 URL，例如：
   ```
   https://deepl-proxy.yourname.workers.dev
   ```
4. **复制这个 URL**，下一步要用

> 💡 你也可以绑定自定义域名（在 Worker → Triggers → Custom Domains 里添加）。

---

## 步骤 5：在网站后台配置

1. 登录网站后台管理
2. 左侧菜单 → **Translate Settings**（翻译设置）
3. 找到 **Custom Proxy URL (Recommended)** 输入框
4. 粘贴你刚才复制的 Worker URL，例如：
   ```
   https://deepl-proxy.yourname.workers.dev
   ```
5. 在 **DeepL API Key** 填入你的 DeepL API Key
6. 选择正确的 **Plan**（Free 或 Pro）
7. 点击 **Save Settings** 保存

---

## 步骤 6：测试翻译

1. 在同一个翻译设置页面，点击 **Test DeepL API** 按钮
2. 如果显示绿色的 **API Key is valid**，说明配置成功！
3. 你也可以去产品编辑页面，尝试编辑一个产品名称，翻译按钮应该能正常工作

---

## 费用说明

### Cloudflare Worker

| 方案 | 每日请求数 | 费用 |
|------|-----------|------|
| **Free** | 100,000 次/天 | **免费** |
| Paid (Workers Paid) | 10,000,000 次/月 | $5/月起 |

> 一般的企业官网，免费版**完全够用**。即使每天翻译 1000 次也用不完额度。

### DeepL API

| 方案 | 每月额度 | 费用 |
|------|---------|------|
| **Free** | 500,000 字符 | **免费** |
| Pro (Starter) | 不限字符 | €5.49/月 + €0.00002/字符 |
| Pro (Advanced) | 不限字符 + 更高优先级 | €29.99/月 + €0.00002/字符 |

> 💡 一般的企业官网，产品+新闻全部翻译完通常在 1-5 万字符之间，**免费版足够**。

---

## 常见问题 FAQ

### Q1: 测试时显示 CORS 错误？

**A:** 检查以下几点：
1. Worker 代码是否完整粘贴（注意不要少了大括号）
2. Worker 是否已经 Deploy（点击了 Deploy 按钮）
3. URL 是否正确（不带尾部斜杠也可以，代码里会自动处理）
4. 可以在浏览器控制台看 Network 标签，看请求有没有到 Worker

### Q2: 显示 403 Forbidden？

**A:** 这是 DeepL API 返回的，通常原因：
1. API Key 错误或已过期
2. Free Key 用在了 Pro 端点（或反过来）
3. 免费版额度已用完

检查后台的 Plan 选择是否和你的 DeepL 账号一致。

### Q3: Worker 会不会泄露我的 API Key？

**A:** 不会。API Key 只在浏览器 → Worker → DeepL 之间传递，Worker 不记录日志（默认配置下）。
如果你想更安全，可以把 API Key 直接写在 Worker 的环境变量里，浏览器端就不需要传 Key 了。

### Q4: 可以限制只有我的网站能调用吗？

**A:** 可以。修改 Worker 代码中的 `Access-Control-Allow-Origin`，把 `*` 换成你的域名：
```javascript
'Access-Control-Allow-Origin': 'https://yourdomain.com',
```
但注意：这只是浏览器层面的限制，别人仍然可以通过其他方式调用你的 Worker URL。如果需要更强的安全措施，可以加一个简单的 Token 验证。

### Q5: 翻译速度怎么样？

**A:** 非常快。Cloudflare Worker 全球有 300+ 节点，通常延迟在 50-200ms 之间。翻译本身的速度由 DeepL API 决定，通常一段 100 字的文本翻译需要 200-500ms。

### Q6: 我之前用的是 CORS Proxy，要关掉吗？

**A:** 不需要关。配置了自定义代理 URL 后，系统会**优先使用自定义代理**，CORS Proxy 会作为兜底备用（如果自定义代理暂时不可用）。

### Q7: 可以同时用多个 Worker 吗？

**A:** 当前版本只支持配置一个自定义代理 URL。一个 Worker 足够应对正常流量。

---

## 进阶：把 API Key 存到 Worker 环境变量（更安全）

如果你不想在浏览器端保存 API Key，可以把 Key 存在 Worker 端：

1. 进入 Worker → **Settings** → **Variables**
2. 在 **Environment Variables** 下点击 **Add variable**
3. 变量名填 `DEEPL_AUTH_KEY`，值填你的 DeepL API Key
4. 勾选 **Encrypt** 加密保存
5. 修改 Worker 代码，把 `Authorization` 改成从环境变量读取：

```javascript
// 找到这一行：
// const authHeader = request.headers.get('Authorization');
// if (authHeader) forwardHeaders.set('Authorization', authHeader);

// 替换为：
const apiKey = globalThis.DEEPL_AUTH_KEY || '';
if (apiKey) {
  forwardHeaders.set('Authorization', `DeepL-Auth-Key ${apiKey}`);
}
```

6. 重新 Deploy

这样浏览器端就不需要传 API Key 了，更安全。

---

有问题？参考 [Cloudflare Workers 官方文档](https://developers.cloudflare.com/workers/)。
