# LED Sensor Light Website - GitHub Pages Deployment

## 部署说明

### 方法一：直接上传到 GitHub Pages

1. 在 GitHub 创建仓库
2. 将本压缩包所有文件上传到仓库根目录（或 `gh-pages` 分支）
3. 仓库设置 → Pages → Source 选择部署分支（main / gh-pages）
4. 保存后等待几分钟即可通过 `https://<username>.github.io/<repo>/` 访问

### 方法二：手动构建

```bash
npm install
npm run build
```

## 文件结构

```
/
├── index.html          # 主页面（SPA 入口）
├── 404.html            # SPA 路由回退（与 index.html 内容一致）
├── favicon.svg         # 网站图标
├── robots.txt          # 搜索引擎爬虫规则
├── sitemap.xml         # 站点地图
├── README.md           # 本文件
├── assets/             # JS / CSS / 字体资源
│   ├── index-*.js      # 主应用脚本
│   ├── index-*.css     # 主样式表
│   ├── radix-*.js      # UI 组件库
│   ├── toolkit-*.js    # 平台 SDK
│   └── polyfills.js    # 浏览器兼容
├── images/             # 图片资源（产品/工厂/Logo/微信二维码等）
└── files/              # 下载文件（产品目录 PDF 等）
```

## 功能特性

- 黑红工业风 B2B LED 灯具外贸网站
- 前台 6 页面 + 后台 5 页面
- 四语言切换（EN/中/ES/日）
- 产品管理 / 优势管理 / 评价管理（localStorage）
- 询盘表单 + WhatsApp 悬浮按钮
- GDPR Cookie 同意弹窗
- 响应式适配桌面/平板/手机

## 注意事项

- 本项目为纯前端静态站点，无后端服务
- 所有数据（产品/评价/优势/设置）使用浏览器 localStorage 持久化
- 后台默认密码：`admin123`，入口路径：`/admin/login`
- 部署到子路径时已使用相对路径（`base: './'`），支持任意子目录部署
