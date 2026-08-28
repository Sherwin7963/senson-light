# LED Sensor Light Website - GitHub Pages Deployment

OWELL Industrial LED 红外感应灯外贸独立站 - GitHub Pages 部署包。

## 功能特性

- 🏭 工业风黑红配色 B2B 外贸网站
- 🌐 四语言支持（English / 简体中文 / Español / 日本語）
- 🛒 产品展示 + 分类筛选 + 产品详情页
- 📝 询盘表单 + WhatsApp 悬浮按钮
- 🏢 关于我们（工厂实力、发展历程、资质认证、OEM 能力）
- 📱 完全响应式，适配桌面 / 平板 / 移动端
- 🔒 后台管理系统（产品、优势、评价、轮播、SEO、翻译等全功能 CRUD）
- 🔑 后台密码可修改，默认密码 `admin123`

## 部署步骤

### 1. 文件清单

```
├── index.html          # 主页
├── 404.html            # SPA 路由回退（与 index.html 内容一致）
├── assets/             # JS / CSS 资源
├── images/             # 16 张本地图片
├── favicon.svg         # 网站图标
├── sitemap.xml         # SEO 站点地图
├── robots.txt          # 爬虫规则
└── README.md           # 本说明
```

### 2. GitHub Pages 部署

**方式一：直接上传仓库**

1. 新建 GitHub 仓库（如 `led-sensor-light-website`）
2. 将解压后的所有文件上传到仓库根目录
3. 仓库 Settings → Pages → Source 选择 `Deploy from a branch`
4. Branch 选择 `main` / 根目录 `/`，保存
5. 等待几分钟，访问 `https://<username>.github.io/<repo-name>/`

**方式二：手动部署**

将所有文件直接上传到任意静态托管服务（Vercel / Netlify / Cloudflare Pages / 自己的服务器）。

### 3. 后台访问方式

部署成功后，在网站 URL 后追加 `/admin/login` 访问管理后台：

```
https://<your-domain>/admin/login
```

- **默认密码**：`admin123`
- **修改密码**：登录后台 → 左侧菜单「修改密码」→ 输入当前密码和新密码 → 确认修改
- 修改密码后立即生效，下次登录请使用新密码

### 4. 后台功能

| 菜单项 | 说明 |
|-------|------|
| Dashboard | 数据概览仪表盘 |
| Hero Slides | 首页轮播图管理 |
| Products | 产品增删改查 |
| Categories | 产品分类管理 |
| Features | 首页特性管理 |
| Advantages | 核心优势管理 |
| Testimonials | 客户评价管理 |
| About Page | 关于页面全部内容（里程碑/画廊/认证/OEM 等） |
| Images | 图片素材库 |
| Translate Settings | 多语言翻译批量设置 |
| SEO Settings | SEO 元信息配置 |
| Change Password | 修改后台登录密码 |

### 5. 数据存储说明

本项目为纯前端静态站点，所有管理后台数据存储在浏览器 localStorage 中：

- 产品数据 → `__app_ledlight_products`
- 优势数据 → `__app_ledlight_advantages`
- 评价数据 → `__app_ledlight_testimonials`
- 后台登录状态 → `__app_ledlight_admin_auth`
- 后台密码 → `__app_ledlight_admin_password`

> ⚠️ localStorage 按浏览器隔离，不同浏览器 / 设备数据不共享。

### 6. 常见问题

**Q: 直接打开子路径（如 /products）显示 404？**
A: GitHub Pages 使用 404.html 作为 SPA 回退，已配置好。如部署到其他平台，请确保所有路由都返回 index.html。

**Q: 忘记后台密码怎么办？**
A: 打开浏览器开发者工具 → Application → Local Storage → 删除 `__app_ledlight_admin_password` 键，即可恢复默认密码 `admin123`。

**Q: 图片资源路径不对？**
A: 部署包使用相对路径（./assets/、./images/），适用于 GitHub Pages 子路径部署。如部署在根域名，同样兼容。

## 版本信息

- **版本**: v10
- **技术栈**: React 19 + TypeScript + Vite + Tailwind CSS
- **最新更新**: 添加后台修改密码功能、公司简介段落可动态增减

---

*由 妙搭 (MiaoDa) 生成*
