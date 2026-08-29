# OWELL Industrial - LED Sensor Light Website

## 项目简介

OWELL Industrial 官方外贸独立站，专注 LED 红外感应灯产品展示与询盘转化。
工业黑红风格，支持英文/中文/西班牙语/日语四语言切换。

## 技术栈

- React 19 + TypeScript
- Tailwind CSS v4
- Vite 8 构建

## GitHub Pages 部署步骤

### 方法一：直接上传到仓库（推荐）

1. 新建 GitHub 仓库（如 `led-sensor-light-website`）
2. 将本 ZIP 解压后的**所有文件**直接上传到仓库根目录
3. 进入仓库 Settings → Pages
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main` / `root`
6. 保存，等待 1-2 分钟后访问 `https://<username>.github.io/<repo-name>/`

### 方法二：使用 gh-pages 分支

```bash
# 在项目根目录
npm run build
npx gh-pages -d dist
```

## 文件结构

```
/
├── index.html          # 入口页面
├── 404.html            # SPA 路由回退（内容与 index.html 相同）
├── assets/             # JS/CSS 资源
├── images/             # 图片资源（17 张）
├── files/              # 文件下载（Catalog.pdf）
├── favicon.svg         # 网站图标
├── icons.svg           # 图标雪碧图
├── sitemap.xml         # SEO 站点地图
├── robots.txt          # 爬虫规则
├── routes.json         # 路由配置
└── README.md           # 本文件
```

## 功能特性

- 响应式设计（桌面/平板/手机）
- 四语言切换（EN / 中文 / ES / 日本語）
- 产品展示与筛选
- 询盘表单
- GDPR Cookie 弹窗
- WhatsApp 悬浮按钮
- SEO 优化（meta / sitemap / robots）
- 后台管理系统（本地存储数据）

## 后台管理

- 访问路径：`/admin/login`
- 默认密码：`admin123`
- 数据存储：浏览器 localStorage
