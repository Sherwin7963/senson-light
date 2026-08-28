# LED Sensor Light Website - GitHub Pages Deployment

B2B LED infrared sensor light foreign trade website built with React + TypeScript + Tailwind CSS.

## Quick Start - Deploy to GitHub Pages

### Method 1: Deploy via GitHub Pages Settings

1. Create a new GitHub repository (e.g., `led-sensor-light-website`)
2. Upload all files from this ZIP to the repository's `main` branch
3. Go to **Settings → Pages**
4. Under **Build and deployment → Source**, select `Deploy from a branch`
5. Select branch: `main`, folder: `/ (root)`
6. Click **Save**
7. Wait 1-2 minutes for deployment to complete
8. Your site will be available at: `https://<username>.github.io/<repo-name>/`

### Method 2: Deploy to Custom Domain

1. Follow Method 1 steps 1-3
2. Add a `CNAME` file in the root directory with your domain (e.g., `www.yourdomain.com`)
3. Configure DNS records with your domain provider
4. In GitHub Pages settings, enter your custom domain

### Method 3: Deploy with GitHub Actions (recommended for custom repos)

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

## File Structure

```
/
├── index.html          # Main entry point
├── 404.html            # SPA fallback for GitHub Pages routing
├── favicon.svg         # Site favicon
├── icons.svg           # SVG icons sprite
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine crawler rules
├── README.md           # This file
├── assets/             # Compiled JS/CSS bundles
│   ├── index-*.js      # Main application bundle
│   ├── index-*.css     # Main stylesheet
│   ├── polyfills.js    # Browser polyfills
│   ├── toolkit-*.js    # APaaS toolkit SDK
│   ├── radix-*.js      # Radix UI primitives
│   └── rolldown-*.js   # Runtime
└── images/             # Local images (16 images)
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

## Features

- 🏭 **B2B Industrial Design**: Dark theme with red accents, industrial aesthetic
- 🌍 **4 Languages**: English, Chinese, Spanish, Japanese
- 📦 **Product Catalog**: Filterable product grid with detail pages
- 📝 **Inquiry Form**: Contact form with validation
- 📱 **Fully Responsive**: Mobile, tablet, desktop
- 🔍 **SEO Optimized**: Meta tags, schema.org structured data, sitemap
- 🍪 **GDPR Compliant**: Cookie consent banner
- 💬 **WhatsApp Integration**: Floating WhatsApp button
- 🔧 **Admin Panel**: Product/advantage/testimonial management (localStorage)

## Pages

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

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS 4
- React Router DOM 7
- Vite 8 (build tool)
- shadcn/ui components
- LocalStorage for data persistence

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

MIT License
