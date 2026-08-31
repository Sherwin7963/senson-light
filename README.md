# OWELL Industrial - LED Sensor Light Website

GitHub Pages 部署包

## 部署说明

1. 将本 ZIP 包中的所有文件解压到 GitHub 仓库根目录
2. **重要：不要覆盖仓库中已有的 CNAME 文件**（当前域名为 tanjeon.com）
3. 本部署包中**不包含 CNAME 文件**，避免覆盖现有域名配置
4. 确保 GitHub Pages 设置正确，Source 选择 main 分支 / root 目录
5. 等待几分钟后访问 https://tanjeon.com

## 文件结构

```
├── index.html          # 主页面
├── 404.html            # SPA 路由回退（内容与 index.html 一致）
├── favicon.png         # 网站图标
├── assets/             # JS / CSS 资源
├── images/             # 图片资源（产品、工厂、Logo 等 18 张）
├── files/              # 文件下载（产品目录 Catalog.pdf）
├── sitemap.xml         # 站点地图
├── robots.txt          # 爬虫规则
├── icons.svg           # 图标精灵
├── routes.json         # 路由配置
└── README.md           # 本文件
```

## 注意事项

- 所有资源使用相对路径，支持子路径部署和自定义域名
- 404.html 用于 SPA 路由回退，确保刷新页面不会 404
- 产品目录 PDF 约 20MB，请确保仓库 LFS 或存储限制充足
- 如需更新内容，重新构建后替换对应文件即可
