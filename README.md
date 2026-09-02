# OWELL Industrial - LED Sensor Light Website (v48)

B2B 外贸独立站，展示 LED 红外感应灯工厂实力与产品体系。

## 技术栈

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router DOM 7

## 功能

- 前台：首页、产品列表、产品详情、关于我们、联系我们、新闻中心、隐私政策
- 后台：仪表盘、产品管理、优势管理、评价管理、特性管理、首页轮播管理、类目管理、关于页面管理、新闻管理等
- 四语言切换：英文、中文、西班牙语、日语
- 数据本地持久化（localStorage）
- About 版块图片上传自动压缩（Hero / 工厂实景 / 认证图片）

## 部署到 GitHub Pages

1. 将本目录所有文件上传到 GitHub 仓库
2. 在仓库 Settings → Pages 中选择部署分支
3. 访问 `https://<username>.github.io/<repo>/`

## 版本记录

- **v48**: 修复 About 版块图片上传功能（Hero Banner 压缩、工厂实景批量压缩、工厂实景替换压缩、认证图片压缩、localStorage 配额超限错误提示）
