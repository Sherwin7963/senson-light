# LED Sensor Light Website - GitHub Pages 部署包

## 部署说明

### 方式一：部署到仓库根路径（推荐，使用自定义域名或 username.github.io）

1. 将本目录所有文件上传到 GitHub 仓库
2. 在仓库 Settings → Pages 中选择分支和目录（/ root）
3. 等待部署完成

### 方式二：部署到子路径（如 username.github.io/repo-name）

**重要**：子路径部署需要修改资源路径前缀。

部署到子路径时，需要在 index.html 和 404.html 中将所有 `./assets/`、`./images/`、`./files/` 等相对路径替换为 `/repo-name/assets/` 等绝对路径（repo-name 替换为你的仓库名）。

推荐方式：使用自定义域名，避免子路径问题。

## 文件结构

- `index.html` - 主页面
- `404.html` - SPA 路由回退（内容同 index.html）
- `assets/` - JS/CSS 资源
- `images/` - 所有图片资源
  - `news/` - 新闻封面图（4张）
  - `avatars/` - 客户评价头像（4张）
  - `product-*.jpg` - 产品图片
  - `factory-*.jpg` - 工厂照片
  - `hero-slide-*.jpg` - Hero 轮播图
  - `owell-logo.png` - Logo
  - `wechat-qr.png` - 微信二维码
  - `about-hero.jpg` / `oem-odm.jpg` / `why-choose-us.jpg` - 其他页面配图
- `files/Catalog.pdf` - 产品目录 PDF
- `favicon.png` - 网站图标
- `sitemap.xml` - SEO 站点地图
- `robots.txt` - 搜索引擎爬虫规则

## 功能特性

- 前台：首页、产品列表、产品详情、关于我们、联系我们、新闻中心、隐私政策
- 后台：登录、仪表盘、产品管理、优势管理、评价管理、新闻管理、分类管理、翻译设置、底部设置、修改密码
- 多语言：英文、简体中文、西班牙语、日语
- SEO：sitemap、robots.txt、JSON-LD、语义化标签
- 数据持久化：localStorage
