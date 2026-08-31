# OWELL Industrial - LED Sensor Light Website (GitHub Pages Deployment)

## 部署说明

本部署包用于部署到 GitHub Pages。

### 上传步骤

1. 将本 ZIP 包内的所有文件上传到 GitHub 仓库的根目录
2. 在仓库 Settings → Pages 中选择 `main` 分支 / `root` 目录
3. 等待 GitHub Pages 构建完成即可访问

### ⚠️ 重要提示：CNAME 文件

**本部署包不包含 `CNAME` 文件。**

GitHub 仓库中已有的 `CNAME` 文件（内容为 `tanjeon.com`）用于配置自定义域名。上传本部署包时，**请不要删除或覆盖仓库中已有的 `CNAME` 文件**。

如果 `CNAME` 文件被意外删除，请在仓库根目录手动创建一个名为 `CNAME` 的文件，内容为：

```
tanjeon.com
```

### 文件结构

```
├── index.html          # 主页
├── 404.html            # SPA 路由兼容（内容同 index.html）
├── favicon.png         # 网站图标
├── assets/             # JS/CSS 资源
├── images/             # 图片资源（产品、工厂、Logo 等）
├── files/              # 文件下载（Catalog.pdf 等）
├── sitemap.xml         # 站点地图
├── robots.txt          # 爬虫规则
└── README.md           # 本说明文件
```

### 版本信息

- 版本：v23
- 构建时间：2026-08-31
