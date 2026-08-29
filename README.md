# LED Sensor Light Website - GitHub Pages 部署包

OWELL Industrial LED 红外感应灯外贸独立站 — GitHub Pages 部署文件包 v22。

## 文件结构

```
/
├── index.html          # 主页面（SPA 入口）
├── 404.html            # GitHub Pages SPA 路由支持（与 index.html 内容一致）
├── favicon.svg         # 网站图标
├── robots.txt          # 搜索引擎爬虫规则
├── sitemap.xml         # 网站地图
├── assets/             # 构建产物（JS / CSS / sourcemap）
│   ├── index-*.js
│   ├── index-*.css
│   ├── polyfills.js
│   ├── rolldown-runtime-*.js
│   ├── radix-*.js
│   └── toolkit-*.js
├── images/             # 图片资源（18 张）
│   ├── owell-logo.png
│   ├── wechat-qr.png
│   ├── hero-slide-1/2/3.jpg
│   ├── product-1/2/3/4.jpg
│   ├── about-hero.jpg
│   ├── why-choose-us.jpg
│   ├── oem-odm.jpg
│   └── factory-*.jpg (6 张)
└── files/
    └── Catalog.pdf     # 产品目录 PDF（约 20MB）
```

## 部署到 GitHub Pages

### 方式一：直接上传仓库根目录

1. 将本 ZIP 解压到 GitHub 仓库根目录
2. 提交并推送到 `main` 分支
3. 仓库 Settings → Pages → Source 选择 `Deploy from a branch`
4. Branch 选择 `main` / `/(root)` → Save
5. 等待 1-2 分钟，访问 `https://<用户名>.github.io/<仓库名>/`

### 方式二：自定义域名

1. 按方式一部署完成
2. 仓库 Settings → Pages → Custom domain 填入你的域名（如 `www.example.com`）
3. 在域名 DNS 管理处添加 CNAME 记录指向 `<用户名>.github.io`
4. 勾选 "Enforce HTTPS"
5. 等待 DNS 生效（几分钟到 48 小时不等）

## 技术特点

- **纯静态 SPA**：基于 React 19 + Vite 8 + Tailwind CSS 4
- **SPA 路由兼容**：404.html 配合 index.html 实现子路径刷新不 404
- **响应式设计**：适配桌面、平板、移动端
- **多语言支持**：英文（默认）、中文、西班牙语、日语
- **深色工业风格**：黑红主题，B2B 外贸专业感
- **离线可用图片**：所有图片、PDF 均为本地资源，无外部 CDN 依赖

## 功能清单

### 前台
- 首页：Hero 轮播、核心优势、产品预览、Why Choose Us、客户评价、询盘表单
- 产品列表：分类筛选 + 产品卡片网格 + 询价按钮
- 产品详情：多图切换、规格参数表、卖点标签、应用场景、OEM/ODM 说明
- 关于我们：发展历程、工厂画廊、质量控制、认证展示、OEM 能力
- 联系我们：完整询盘表单、联系信息、WhatsApp 入口
- 隐私政策：GDPR 合规政策全文

### 后台管理（admin123）
- 仪表盘：KPI 概览 + 最近产品/评价
- 产品管理：增删改查 + 搜索筛选
- 优势管理：首页优势板块 CRUD
- 评价管理：客户评价 CRUD
- 图片管理：全站图片替换
- PDF 管理：产品目录上传替换
- SEO 设置：元信息、社交链接、公司信息
- Footer 设置：导航、联系方式、微信二维码
- 多语言翻译：四语言文案编辑

## 版本

- **v22** — 当前最新版本
  - favicon 路径修复为相对路径
  - 全量资源路径检查，无硬编码 GitHub Pages 路径
  - 首页轮播图加载优化
  - 联系页地图移除
  - 询盘表单"感兴趣产品"分模式显示
  - WhatsApp 号码统一从设置读取
  - Logo 组件统一使用原生 img 标签
  - PDF 渲染错误修复
