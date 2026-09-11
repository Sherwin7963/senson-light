# GA4 数据集成配置指南

本文档详细说明如何将 Google Analytics 4 (GA4) 数据集成到网站后台的「网站统计」页面。

## 整体架构

```
网站后台 (前端)
    │
    │  GET /api/ga4/*
    ▼
Cloudflare Worker (代理 + JWT 认证)
    │
    │  Service Account JWT → OAuth2 access_token
    │  POST Google Analytics Data API v1beta
    ▼
Google Analytics 4 Data API
    │
    ▼
GA4 Property (媒体资源)
```

**为什么需要 Worker 代理？**
- GA4 Data API 需要服务端认证（Service Account JWT），不能在浏览器直接调用
- Service Account 私钥不能暴露在前端代码中
- Cloudflare Worker 作为无服务器代理，安全地保存私钥并转发 API 请求

---

## 步骤 1：创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击顶部项目选择器 → **New Project**
3. 输入项目名称（如 `ga4-proxy-project`）→ **Create**
4. 等待项目创建完成，确保顶部已切换到新项目

## 步骤 2：启用 Google Analytics Data API

1. 在 Google Cloud Console 搜索框中输入 **Google Analytics Data API**
2. 点击进入 API 页面 → 点击 **Enable** 启用该 API
3. 等待启用完成（通常几秒钟）

> 也可以直接访问：https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com

## 步骤 3：创建 Service Account

1. 在 Google Cloud Console 左侧菜单 → **IAM & Admin** → **Service Accounts**
2. 点击 **+ CREATE SERVICE ACCOUNT**
3. 填写信息：
   - **Service account name**: `ga4-proxy`（或你喜欢的名字）
   - **Service account ID**: 自动生成，建议保持默认
   - **Description**: `GA4 API proxy for website`
4. 点击 **CREATE AND CONTINUE**
5. 权限步骤（Grant this service account access to project）：
   - 直接点击 **CONTINUE**（不需要项目级权限，后面在 GA4 后台单独授权）
6. 点击 **DONE** 完成创建

### 3.1 生成 Service Account 密钥

1. 在 Service Accounts 列表中，找到刚创建的账号，点击右侧 **Actions** → **Manage keys**
2. 点击 **ADD KEY** → **Create new key**
3. 选择 **JSON** 格式 → 点击 **CREATE**
4. 浏览器会自动下载一个 JSON 密钥文件（如 `xxx-xxxxx-xxxxxxxx.json`）
5. **安全保存此文件**，后续配置 Worker 需要用到其中的字段

打开下载的 JSON 文件，你会看到以下关键字段：
```json
{
  "client_email": "ga4-proxy@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "project_id": "your-project-id"
}
```

> ⚠️ **安全提醒**：私钥文件只能在服务器/Worker 环境中使用，绝不能提交到代码仓库或暴露在前端。

## 步骤 4：在 GA4 后台授权 Service Account

1. 访问 [Google Analytics](https://analytics.google.com/) 并登录你的 GA4 账号
2. 左下角点击 **管理（Admin）** ⚙️
3. 在「媒体资源」列（中间那一列），找到 **媒体资源访问管理**（Property Access Management）
4. 点击右上角 **+** 号 → **添加用户**（Add users）
5. 输入 Service Account 的邮箱地址（即 JSON 文件中的 `client_email`，例如 `ga4-proxy@your-project.iam.gserviceaccount.com`）
6. 分配角色：勾选 **查看者**（Viewer）权限即可（只读访问数据分析）
   - 不需要「编辑者」或「管理员」权限
7. 点击 **添加**（Add）完成授权

> 💡 等待 1-2 分钟让权限生效，然后再进行测试。

## 步骤 5：获取 GA4 Property ID

1. 在 GA4 后台 → **管理（Admin）** ⚙️
2. 在「媒体资源」列 → **媒体资源设置**（Property Settings）
3. 页面顶部可以看到 **媒体资源 ID**（一串纯数字，如 `553493228`）
4. 记下这个 ID，后续配置 Worker 需要用到

## 步骤 6：部署 Cloudflare Worker

### 6.1 准备 Worker 代码

Worker 代码位于 `docs/deepl-proxy-worker.js`（或 `public/docs/deepl-proxy-worker.js`）。

这份 Worker 已经包含两个功能：
- **DeepL 翻译代理**（原有功能）
- **GA4 数据代理**（新增功能）

两个功能共用同一个 Worker，通过路径区分：
- `POST /` → DeepL 翻译代理
- `GET /api/ga4/overview` → GA4 概览数据
- `GET /api/ga4/top-pages` → GA4 热门页面
- `GET /api/ga4/sources` → GA4 访客来源
- `GET /api/ga4/countries` → GA4 访客地区
- `GET /api/ga4/devices` → GA4 设备类型
- `GET /health` → 健康检查

### 6.2 创建 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单 → **Workers & Pages**
3. 点击 **Create** → **Create Worker**
4. 输入 Worker 名称（如 `ga4-deepl-proxy`）→ 点击 **Deploy**
5. 页面跳转到 Worker 编辑页，点击 **Edit code** 进入代码编辑器

### 6.3 部署代码

1. 删除编辑器中默认的示例代码
2. 将 `docs/deepl-proxy-worker.js` 文件的全部内容复制粘贴到编辑器中
3. 点击右上角 **Deploy** 保存代码

### 6.4 配置环境变量（Secrets）

1. 回到 Worker 详情页 → 点击 **Settings** 标签
2. 左侧菜单 → **Variables**
3. 在 **Environment Variables** → **Secrets** 区域，点击 **Add variable**
4. 添加以下 3 个 Secret 变量：

| 变量名 | 值 | 说明 |
|--------|----|------|
| `GA4_PROPERTY_ID` | `553493228` | GA4 媒体资源 ID（纯数字） |
| `GA4_CLIENT_EMAIL` | `ga4-proxy@xxx.iam.gserviceaccount.com` | Service Account 邮箱（来自 JSON 文件的 `client_email`） |
| `GA4_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | Service Account 私钥（来自 JSON 文件的 `private_key`，完整内容，包括换行符 `\n`） |

> ⚠️ **私钥粘贴注意事项**：
> - 从 JSON 文件中复制 `private_key` 字段的完整值（包括 `\n` 换行符）
> - 直接粘贴到 Secret 的 Value 框中即可，不需要额外转义
> - 确保值以 `-----BEGIN PRIVATE KEY-----` 开头，以 `-----END PRIVATE KEY-----\n` 结尾

5. 每个变量都要点击 **Encrypt** 加密保存
6. （可选）如果需要 DeepL 硬编码 API Key，再添加一个 `DEEPL_AUTH_KEY` 变量

### 6.5 获取 Worker URL

1. Worker 详情页顶部可以看到 Worker 的 URL，格式为：
   ```
   https://<worker-name>.<your-account>.workers.dev
   ```
   例如：`https://ga4-deepl-proxy.yourname.workers.dev`

2. 记下这个 URL，后续需要填写到网站后台。

### 6.6 测试 Worker

在浏览器中访问 Worker 的健康检查端点：
```
https://<your-worker-url>/health
```

应该返回类似这样的 JSON：
```json
{
  "status": "ok",
  "worker": "deepl-ga4-proxy",
  "ga4Configured": true,
  "deeplConfigured": false
}
```

- `ga4Configured: true` 表示 GA4 相关的环境变量已配置成功

---

## 步骤 7：在网站后台配置

1. 登录网站后台管理系统
2. 点击左侧菜单 **Analytics**（网站统计）
3. 在 **Google Analytics (GA4)** 配置卡片中：
   - **GA4 测量 ID**：填写你的 GA4 测量 ID（如 `G-XXXXXXXXXX`，用于前端埋点脚本注入）
   - **GA4 API Proxy URL**：填写上一步获取的 Cloudflare Worker URL（如 `https://ga4-deepl-proxy.yourname.workers.dev`）
   - 「启用 Google Analytics」开关：打开（用于前端埋点脚本注入）
4. 点击 **Save** 保存设置
5. 保存成功后，页面下方的 **GA4 Data Overview** 区域会自动加载数据

### 配置说明折叠面板

在 GA4 设置卡片中，点击「查看配置说明」可以展开查看简要的配置步骤摘要。

---

## 步骤 8：验证数据是否正常显示

1. 保存配置后，滚动到页面下方的 **GA4 Data Overview** 区域
2. 应该能看到：
   - **4 个概览卡片**：总访问量（30天）、今日访问量、跳出率、平均停留时长
   - **7 天趋势图**：柱状图展示最近 7 天会话数变化
   - **热门页面 Top10**：访问量最高的页面列表
   - **访客来源**：渠道分布条形图
   - **访客地区 Top10**：国家/地区排名
   - **设备类型**：桌面/移动/平板分布

3. 点击右上角 **Refresh Data** 按钮可以手动刷新数据

4. 如果数据加载失败，会显示红色错误提示，包含错误信息，便于排查问题。

---

## 数据接口说明

### 统一响应格式

所有 GA4 接口返回统一格式：

```json
{
  "success": true,
  "data": { ... }
}
```

错误时返回：

```json
{
  "error": "错误类型",
  "details": "详细错误信息"
}
```

### 各接口返回字段

#### `GET /api/ga4/overview` — 概览

```json
{
  "success": true,
  "data": {
    "totalSessions": 12345,
    "totalUsers": 8900,
    "todaySessions": 156,
    "todayUsers": 120,
    "bounceRate": "45.2",
    "avgDurationSeconds": 125,
    "dailyTrend": [
      { "date": "2024-01-01", "sessions": 200 },
      ...
    ]
  }
}
```

#### `GET /api/ga4/top-pages` — 热门页面

```json
{
  "success": true,
  "data": {
    "pages": [
      { "path": "/", "views": 5000, "percent": "30.5" },
      ...
    ],
    "total": 16393
  }
}
```

#### `GET /api/ga4/sources` — 访客来源

```json
{
  "success": true,
  "data": {
    "sources": [
      { "name": "Organic Search", "sessions": 4000, "percent": "32.4" },
      { "name": "Direct", "sessions": 3500, "percent": "28.3" },
      ...
    ],
    "total": 12345
  }
}
```

#### `GET /api/ga4/countries` — 访客地区

```json
{
  "success": true,
  "data": {
    "countries": [
      { "country": "United States", "users": 2500, "percent": "28.1" },
      ...
    ],
    "total": 8900
  }
}
```

#### `GET /api/ga4/devices` — 设备类型

```json
{
  "success": true,
  "data": {
    "devices": [
      { "category": "desktop", "sessions": 7000, "percent": "56.7" },
      { "category": "mobile", "sessions": 5000, "percent": "40.5" },
      { "category": "tablet", "sessions": 345, "percent": "2.8" }
    ],
    "total": 12345
  }
}
```

---

## 常见问题排查

### Q1: Worker 返回 "GA4 not configured" 错误

**原因**：Worker 的环境变量（Secrets）没有正确配置。

**排查**：
1. 确认 Worker 的 Variables → Secrets 中添加了所有 3 个变量
2. 确认变量名拼写完全正确（区分大小写）：
   - `GA4_PROPERTY_ID`
   - `GA4_CLIENT_EMAIL`
   - `GA4_PRIVATE_KEY`
3. 访问 `/health` 端点，检查 `ga4Configured` 是否为 `true`

### Q2: 返回 "Failed to get access token" 错误

**原因**：JWT 认证失败，通常是私钥或客户端邮箱配置错误。

**排查**：
1. 确认 `GA4_CLIENT_EMAIL` 与 JSON 密钥文件中的 `client_email` 完全一致
2. 确认 `GA4_PRIVATE_KEY` 是完整的私钥内容，包括 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`
3. 确认私钥中的换行符以 `\n` 形式存在（直接从 JSON 文件复制即可）
4. 确认 Service Account 没有被删除或禁用

### Q3: 返回 "User does not have sufficient permissions" 错误

**原因**：Service Account 没有被授权访问 GA4 媒体资源。

**排查**：
1. 在 GA4 后台 → 管理 → 媒体资源访问管理中，确认已添加 Service Account 邮箱
2. 确认角色至少为「查看者」（Viewer）
3. 授权后等待 1-2 分钟再测试
4. 确认授权的是正确的 GA4 媒体资源（不是 Universal Analytics）

### Q4: 返回 "Property not found" 或 "404" 错误

**原因**：GA4 Property ID 配置错误。

**排查**：
1. 确认 `GA4_PROPERTY_ID` 是纯数字（如 `553493228`）
2. 确认 Property ID 与 Service Account 授权的是同一个 GA4 媒体资源
3. 在 GA4 后台 → 管理 → 媒体资源设置中确认 Property ID

### Q5: 数据全是 0 或显示 "No data"

**原因**：GA4 媒体资源本身没有数据，或者日期范围内没有访问。

**排查**：
1. 确认 GA4 媒体资源已正确安装了跟踪代码
2. 确认最近 30 天内有实际访问
3. 在 GA4 后台的「实时」报告中查看是否有实时数据
4. 检查 GA4 测量 ID 是否正确（前端埋点用的 ID）

### Q6: CORS 错误

**原因**：Worker 的 CORS 头配置问题。

**排查**：
1. 确认使用的是本指南提供的 Worker 代码（已包含 CORS 处理）
2. 检查请求是否是简单 GET 请求（不需要 preflight）
3. 访问 Worker URL 时确认响应头包含 `Access-Control-Allow-Origin: *`

### Q7: Worker 有 DeepL 功能，加上 GA4 会冲突吗？

**不会冲突**。两个功能通过 URL 路径区分：
- `POST` 请求走 DeepL 翻译代理
- `GET /api/ga4/*` 请求走 GA4 数据代理
- 互不影响，可以共用同一个 Worker

### Q8: 如何单独只使用 GA4 代理（不需要 DeepL）？

可以。Worker 代码中 DeepL 部分是独立的，不需要 DeepL 功能的话：
- 不配置 `DEEPL_AUTH_KEY` 环境变量即可
- DeepL 功能仍然可用（透传 Authorization 头），只是不会自动注入 Key
- GA4 功能完全独立，不受影响

---

## 更新 Worker 代码

如果后续有新版本的 Worker 代码（如增加新功能或修复问题）：

1. 进入 Cloudflare Worker 编辑页面（Edit code）
2. 用新版代码替换全部内容
3. 点击 **Deploy** 保存
4. 已配置的环境变量（Secrets）会保留，不需要重新配置

---

## 安全最佳实践

1. **私钥绝不提交到代码仓库**：通过 Worker Secrets 环境变量配置
2. **最小权限原则**：Service Account 只授予 GA4 的「查看者」权限
3. **定期轮换密钥**：建议每 90 天轮换一次 Service Account 密钥
4. **监控用量**：在 Google Cloud Console 监控 API 调用次数，避免异常消耗
5. **Worker 访问控制**（可选）：如果需要，可以在 Cloudflare 中配置 Access 规则限制 Worker 的访问来源

---

## 参考链接

- [Google Analytics Data API 官方文档](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [GA4 维度和指标浏览器](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)
