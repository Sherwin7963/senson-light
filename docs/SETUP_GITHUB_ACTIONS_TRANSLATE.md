# GitHub Actions 批量翻译设置指南

> 使用 GitHub Actions 自动翻译全站内容。适合需要一次性翻译大量产品/新闻/页面文案的场景。
> 与「实时翻译」互补：实时翻译用于编辑时即时翻译，批量翻译用于一次性全站翻译。

---

## 目录

1. [原理说明](#原理说明)
2. [准备工作](#准备工作)
3. [步骤 1：配置 GitHub Secrets](#步骤-1配置-github-secrets)
4. [步骤 2：确认 Workflow 文件](#步骤-2确认-workflow-文件)
5. [步骤 3：在后台触发翻译](#步骤-3在后台触发翻译)
6. [步骤 4：查看翻译进度](#步骤-4查看翻译进度)
7. [步骤 5：拉取翻译结果](#步骤-5拉取翻译结果)
8. [增量翻译 vs 全量翻译](#增量翻译-vs-全量翻译)
9. [费用说明](#费用说明)
10. [常见问题 FAQ](#常见问题-faq)

---

## 原理说明

**GitHub Actions** 是 GitHub 提供的 CI/CD 服务，可以在云端自动执行任务。

我们提供的 `auto-translate.yml` workflow 可以：
1. 读取仓库里 `data/` 目录下所有 JSON 数据文件
2. 自动识别需要翻译的多语言字段（`name_en` 等 I18nText 结构）
3. 调用 DeepL API 批量翻译
4. 翻译完成后自动提交（commit）结果回仓库

工作流程：
```
后台点击「开始翻译」
    ↓
GitHub API 触发 workflow_dispatch
    ↓
GitHub Actions 运行翻译脚本
    ↓
DeepL API 批量翻译
    ↓
翻译结果 commit 回仓库
    ↓
后台 Pull from GitHub 拉取最新数据
```

---

## 准备工作

- ✅ GitHub 仓库（已配置 GitHub Sync）
- ✅ DeepL API Key（免费版或专业版均可）
- ✅ GitHub Personal Access Token（需要 Actions 写权限）
- ✅ 网站后台管理权限

> 💡 还没有 DeepL API Key？去 [DeepL 官网](https://www.deepl.com/pro-api) 注册，免费版每月有 50 万字符额度。

---

## 步骤 1：配置 GitHub Secrets

DeepL API Key 需要配置在 GitHub Secrets 中，workflow 运行时会自动读取。

### 操作步骤

1. 打开你的 GitHub 仓库页面
2. 点击顶部的 **Settings**（设置）
3. 左侧菜单找到 **Secrets and variables** → 点击 **Actions**
4. 点击 **New repository secret**（新建仓库密钥）
5. 填写：
   - **Name**: `DEEPL_API_KEY`
   - **Secret**: 你的 DeepL API Key（类似 `abc123-def456-...`）
6. 点击 **Add secret** 保存

### 可选：配置 DeepL Plan 变量

如果你用的是 DeepL Pro 专业版，还需要设置一个变量：

1. 在同一页面，切换到 **Variables** 标签
2. 点击 **New repository variable**
3. 填写：
   - **Name**: `DEEPL_PLAN`
   - **Value**: `pro`
4. 点击 **Add variable** 保存

> 💡 Free 版不需要配置这个变量，默认就是 `free`。

---

## 步骤 2：确认 Workflow 文件

部署包中已经包含了 `auto-translate.yml` workflow 文件。

部署到 GitHub 后，确认文件路径：
```
.github/workflows/auto-translate.yml
```

### 检查方法

1. 打开 GitHub 仓库页面
2. 点击 `.github` 文件夹 → `workflows`
3. 确认有 `auto-translate.yml` 文件
4. 点击可以查看文件内容

> ⚠️ 如果文件不存在，请先完成一次 **Push to GitHub**（在后台 GitHub Sync 页面）。

---

## 步骤 3：在后台触发翻译

1. 登录网站后台管理
2. 左侧菜单 → **Auto Translate**（全站翻译）
3. 配置翻译选项：

   | 选项 | 说明 |
   |------|------|
   | **Translation Mode** | 翻译模式：增量（只翻译未翻译的）或全量（全部重新翻译） |
   | **Content Scope** | 翻译内容：全部 / 仅产品 / 仅新闻 / 仅页面文案 |
   | **Target Languages** | 目标语言：中文 / 西班牙语 / 日语（可多选） |

4. 点击 **Start Translation**（开始翻译）按钮
5. 等待几秒钟，会显示「Translation workflow triggered!」提示

---

## 步骤 4：查看翻译进度

触发成功后，你可以在同一个页面看到 **Latest Run** 面板，显示：

- **Status** - 当前状态
  - `queued` - 排队中
  - `in_progress` - 运行中
  - `completed` - 已完成
- **Conclusion** - 结果
  - `success` - 成功
  - `failure` - 失败
  - `cancelled` - 已取消
- **Run ID** - 运行编号
- **Started / Updated** - 开始和更新时间

页面会每 10 秒自动刷新状态。

### 查看详细日志

点击 **View on GitHub Actions** 链接，可以跳转到 GitHub Actions 的详细日志页面，看到：
- 翻译了多少个字段
- 成功了多少、失败了多少
- 跳过了多少（已翻译的）
- 具体的错误信息

---

## 步骤 5：拉取翻译结果

翻译完成后，数据已经被提交（commit）到了 GitHub 仓库。

你需要在后台拉取最新数据：

1. 左侧菜单 → **GitHub Sync**
2. 点击 **Pull from GitHub** 按钮
3. 等待同步完成
4. 翻译后的内容就会出现在网站上

---

## 增量翻译 vs 全量翻译

### 增量翻译（Incremental）⭐ 推荐

- **只翻译**当前为空的目标语言字段
- 已经翻译过的字段**跳过**不动
- 节省 DeepL API 额度
- 适合日常更新产品/新闻时使用

**典型场景**：
- 新增了 5 个产品，只想翻译这 5 个
- 新增了一个语言版本，需要把所有内容翻译成该语言

### 全量翻译（Full）

- **所有**字段全部重新翻译
- 已翻译的内容会被**覆盖**
- 消耗更多 API 额度
- 适合需要整体更新翻译质量的场景

**典型场景**：
- 之前用的是机器翻译，现在想换成 DeepL 高质量翻译
- 翻译风格需要统一调整

> ⚠️ 全量翻译会覆盖已有的翻译内容，谨慎使用！

---

## 费用说明

### DeepL API 费用

| 方案 | 每月额度 | 费用 |
|------|---------|------|
| **Free** | 500,000 字符 | **免费** |
| Pro (Starter) | 不限字符 | €5.49/月 + €0.00002/字符 |
| Pro (Advanced) | 不限字符 + 更高优先级 | €29.99/月 + €0.00002/字符 |

**估算**：一个中型企业官网（约 100 个产品 + 50 篇新闻 + 页面文案）
- 总字符数大约：**5 万 ~ 20 万字符**
- 免费版 50 万字符额度**完全够用**
- 翻译成 3 种语言 = 字符数 × 3

### GitHub Actions 费用

| 账户类型 | 每月额度 |
|---------|---------|
| **公开仓库** | 无限制，完全免费 |
| **私有仓库 (Free)** | 2,000 分钟/月 |
| **私有仓库 (Pro)** | 3,000 分钟/月 |

**一次全量翻译大约需要**：2-5 分钟（取决于数据量）

> 💡 对于大多数用户，GitHub Actions 额度**完全够用**。即使每个月翻译 10 次，也只用几十分钟。

---

## 常见问题 FAQ

### Q1: 点击 Start Translation 没反应？

**A:** 检查以下几点：
1. GitHub Sync 是否已经配置并测试连接成功
2. GitHub Token 是否有 **Actions: Read and write** 权限
3. 浏览器控制台有没有报错

**检查 Token 权限**：
- 打开 GitHub → Settings → Developer settings → Personal access tokens
- 找到你用的那个 Token，确认勾选了 `workflow` 或 `Actions: Read and write`

### Q2: Workflow 触发成功但状态一直是 queued？

**A:** GitHub Actions 有时需要排队，特别是免费用户。
- 通常等待 1-2 分钟就会开始
- 如果超过 10 分钟还没开始，可以取消后重新触发

### Q3: 翻译失败了怎么办？

**A:** 点击「View on GitHub Actions」查看详细日志，常见原因：

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| `DEEPL_API_KEY is not set` | 没配置 Secrets | 按步骤 1 配置 DEEPL_API_KEY |
| `403 Forbidden` / `401 Unauthorized` | API Key 错误 | 检查 DeepL API Key 是否正确 |
| `456 Quota Exceeded` | 额度用完了 | 升级 DeepL 套餐或等下个月 |
| `429 Too Many Requests` | 请求太频繁 | 脚本已内置限流，一般不会出现 |
| `Permission denied` 提交失败 | Token 没有写权限 | 检查 Token 的 repo 权限 |

### Q4: 翻译完成后网站上看不到翻译？

**A:** 翻译结果是提交到 GitHub 仓库的，你需要手动 Pull：
1. 去 GitHub Sync 页面
2. 点击 **Pull from GitHub**
3. 等待同步完成

### Q5: 可以中途取消翻译吗？

**A:** 可以。去 GitHub Actions 页面，找到正在运行的 workflow run，点击右上角的 **Cancel workflow** 按钮。
已经完成翻译的字段会保留，不会回滚。

### Q6: 翻译的准确度怎么样？

**A:** 用的是 DeepL API，这是目前业界公认翻译质量最高的机器翻译服务之一。
对于产品描述、技术参数等工业文本，翻译质量非常高。
建议翻译完成后人工校对一遍，特别是专业术语。

### Q7: 支持哪些语言？

**A:** 当前版本支持从英语翻译到：
- 中文（简体）
- 西班牙语
- 日语

翻译方向始终是 **英语 → 目标语言**。DeepL API 本身支持 30+ 种语言，如需扩展可以修改 workflow 脚本。

### Q8: 一次翻译大概需要多久？

**A:** 取决于数据量：
- 少量数据（10 个产品）：1-2 分钟
- 中等数据量（100 个产品 + 50 篇新闻）：5-15 分钟
- 大量数据（500+ 产品）：30 分钟以上

脚本有 200ms 的限流保护，避免触发 DeepL 的速率限制。

### Q9: 会不会重复翻译已经翻译过的内容？

**A:** 不会，默认使用**增量翻译模式**，只会翻译目标语言字段为空的内容。
已经翻译过的字段会自动跳过，不消耗 API 额度。

### Q10: 实时翻译和批量翻译有什么区别？

| 特性 | 实时翻译 | 批量翻译（本方案） |
|------|---------|-------------------|
| 触发方式 | 编辑时点击翻译按钮 | 后台一键触发 |
| 翻译内容 | 单个字段 | 全站批量 |
| 执行位置 | 浏览器端 | GitHub Actions 云端 |
| 速度 | 即时（1-2秒） | 较慢（批量处理） |
| 适合场景 | 日常编辑 | 首次建站、批量更新 |
| CORS 问题 | 需要代理 | 无（服务端调用） |

**推荐搭配使用**：
- 首次建站 → 用批量翻译一次性搞定所有内容
- 日常维护 → 用实时翻译逐个字段翻译

---

## 进阶：自定义翻译脚本

如果你需要修改翻译逻辑（比如增加更多语言、修改字段识别规则），
可以直接编辑 `.github/workflows/auto-translate.yml` 中的 Node.js 脚本部分。

脚本使用原生 Node.js（不需要额外依赖），主要逻辑：
1. 遍历 `data/` 目录下所有 JSON 文件
2. 递归查找 I18nText 结构（含 `en`/`zh`/`es`/`ja` 字段的对象）
3. 对每个 I18nText 调用 DeepL API 翻译
4. 写回 JSON 文件
5. Git commit + push

---

有问题？参考 [GitHub Actions 官方文档](https://docs.github.com/en/actions) 或 [DeepL API 文档](https://developers.deepl.com/docs)。
