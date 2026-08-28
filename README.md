# LED Sensor Light Website - GitHub Pages Deployment

B2B LED infrared sensor light foreign trade website built with React + TypeScript + Tailwind CSS.

## 🚀 Quick Start - Deploy to GitHub Pages

### Method 1: Upload ZIP contents directly (Simplest)

1. **Extract** the ZIP file to your local computer
2. **Create** a new GitHub repository (e.g., `led-sensor-light-website`)
3. **Upload all files** (not the folder itself) from the extracted ZIP to the repository's `main` branch root directory
4. **Enable GitHub Pages**:
   - Go to **Settings → Pages**
   - Under **Build and deployment → Source**, select `Deploy from a branch`
   - Select branch: `main`, folder: `/ (root)`
   - Click **Save**
5. **Wait** 1-2 minutes for deployment to complete
6. **Visit**: `https://<username>.github.io/<repo-name>/`

### Method 2: Deploy with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

## ✅ Important Notes for GitHub Pages

- **Subpath support**: This app is pre-configured to work with GitHub Pages subpath URLs (`/repo-name/`). The basename is auto-detected from the URL.
- **SPA routing**: `404.html` handles SPA fallback. When users visit deep links directly, they'll be redirected to the home page which then restores the correct route.
- **Relative paths**: All asset paths (`./assets/`, `./images/`) are relative, so the site works regardless of the repository name.
- **No build step needed**: The ZIP contains pre-built static files. Just upload and go.

## 📁 File Structure

```
/
├── index.html          # Main entry point (relative asset paths)
├── 404.html            # SPA fallback for GitHub Pages routing
├── favicon.svg         # Site favicon
├── icons.svg           # SVG icons sprite
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine crawler rules
├── README.md           # This file
├── assets/             # Compiled JS/CSS bundles (9 files)
│   ├── index-*.js      # Main application bundle
│   ├── index-*.css     # Main stylesheet
│   ├── polyfills.js    # Browser polyfills
│   ├── toolkit-*.js    # APaaS toolkit SDK
│   ├── radix-*.js      # Radix UI primitives
│   └── rolldown-*.js   # Runtime
└── images/             # Local images (16 images, zero external links)
    ├── hero-slide-1.jpg
    ├── hero-slide-2.jpg
    ├── hero-slide-3.jpg
    ├── product-1.jpg
    ├── product-2.jpg
    ├── product-3.jpg
    ├── product-4.jpg
    ├── about-hero.jpg
    ├── factory-assembly.jpg
    ├── factory-production.jpg
    ├── factory-qc.jpg
    ├── factory-rd.jpg
    ├── factory-showroom.jpg
    ├── factory-warehouse.jpg
    ├── oem-odm.jpg
    └── why-choose-us.jpg
```

## ✨ Features

- 🏭 **B2B Industrial Design**: Dark theme with red accents, industrial aesthetic
- 🌍 **4 Languages**: English, Chinese, Spanish, Japanese
- 📦 **Product Catalog**: Filterable product grid with detail pages
- 📝 **Inquiry Form**: Contact form with validation
- 📱 **Fully Responsive**: Mobile, tablet, desktop
- 🔍 **SEO Optimized**: Meta tags, schema.org structured data, sitemap
- 🍪 **GDPR Compliant**: Cookie consent banner
- 💬 **WhatsApp Integration**: Floating WhatsApp button
- 🔧 **Admin Panel**: Product/advantage/testimonial management (localStorage)

## 🔗 Pages

### Frontend (Customer-facing)
- `/` - Home page with hero, advantages, products, testimonials
- `/products` - Product listing with category filters
- `/products/:id` - Product detail page
- `/about` - About us / company profile
- `/contact` - Contact / inquiry form
- `/privacy-policy` - Privacy policy (GDPR)

### Backend (Admin)
- `/admin/login` - Admin login (password: `admin123`)
- `/admin/dashboard` - Dashboard with KPIs
- `/admin/products` - Product management (CRUD)
- `/admin/advantages` - Advantage management (CRUD)
- `/admin/testimonials` - Testimonial management (CRUD)

## 🛠️ Tech Stack

- React 19 + TypeScript
- Tailwind CSS 4
- React Router DOM 7
- Vite 8 (build tool)
- shadcn/ui components
- LocalStorage for data persistence

## 🌐 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 📄 License

MIT License
