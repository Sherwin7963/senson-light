# OWELL Industrial - LED Sensor Light Website

B2B LED 红外感应灯外贸独立站 - GitHub Pages 部署包 v50

## 部署说明

将本目录所有文件上传到 GitHub Pages 仓库的根目录即可。

## 文件结构

```
├── index.html          # 主页（SPA 入口）
├── 404.html            # SPA Fallback（BrowserRouter 刷新支持）
├── favicon.png         # 网站图标
├── sitemap.xml         # SEO 站点地图（含产品详情页 URL）
├── robots.txt          # 搜索引擎爬虫规则
├── README.md           # 本文件
├── assets/             # JS / CSS 构建产物
├── images/             # 所有图片资源
│   ├── news/           # 新闻封面图（4 张）
│   └── avatars/        # 评价头像（4 张）
└── files/
    └── Catalog.pdf     # 产品目录 PDF
```

## 功能特性

- 前台：首页、产品列表、产品详情、关于我们、联系我们、新闻中心、隐私政策
- 后台：仪表盘、产品管理、优势管理、评价管理、About 管理、新闻管理、轮播图管理、设置
- 四语言支持：English / 中文 / Español / 日本語
- 深色工业风格（黑红配色）
- localStorage 数据持久化
- 响应式设计，适配桌面/平板/移动端

## v50 更新内容

- 修复 About 版块 localStorage 配额超限问题
  - 全面收紧图片压缩参数（Hero / Gallery / Certifications）
  - v2 数据迁移：自动压缩历史上传的大图
  - 管理页新增 Storage Usage 存储用量可视化卡片
  - 新增一键压缩所有图片功能
  - 新增 compressBase64 工具函数支持 base64 图片再压缩

## 技术栈

- React 19 + TypeScript
- Tailwind CSS 4
- Vite 8
- React Router DOM 7
