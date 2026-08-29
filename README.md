# Owell Lighting - LED Sensor Light Website (GitHub Pages Deployment)

B2B LED infrared sensor light foreign trade website built with React + TypeScript + Tailwind CSS.

## Quick Deployment to GitHub Pages

1. Create a new **public** GitHub repository (e.g., `led-sensor-light-website`)
2. Upload **all files and folders** from this ZIP to the repository root
3. Go to **Settings → Pages**
4. Under **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main` / `(root)`
5. Click **Save** and wait ~1 minute for deployment
6. Your site will be live at `https://<username>.github.io/<repo-name>/`

## File Structure

```
/
├── index.html              # Main entry point
├── 404.html                # SPA fallback (same as index.html for client-side routing)
├── assets/                 # JS/CSS bundles
│   ├── index-*.js
│   ├── index-*.css
│   ├── polyfills.js
│   ├── radix-*.js
│   ├── toolkit-*.js
│   └── rolldown-runtime-*.js
├── images/                 # 17 product & factory images
│   ├── owell-logo.png
│   ├── hero-slide-1~3.jpg
│   ├── product-1~4.jpg
│   ├── factory-*.jpg (6)
│   ├── about-hero.jpg
│   ├── oem-odm.jpg
│   └── why-choose-us.jpg
├── files/
│   └── Catalog.pdf         # Product catalog (~19MB)
├── favicon.svg
├── icons.svg
├── sitemap.xml
├── robots.txt
└── README.md
```

## Features

- 🌐 **4 Languages**: English, 中文, Español, 日本語
- 🏭 **Product Catalog**: Filterable product listing with detail pages
- 📝 **Inquiry Forms**: Contact page & per-product inquiry
- 🔐 **Admin Dashboard**: Content management for products, advantages, testimonials
- 🍪 **GDPR Cookie Consent**: Compliant cookie banner
- 💬 **WhatsApp Integration**: Floating WhatsApp button
- 🔍 **SEO Optimized**: Meta tags, sitemap, robots.txt, schema.org
- 📱 **Fully Responsive**: Desktop, tablet, mobile

## Admin Access

- URL: `/#/admin/login` (or `/admin/login` depending on your router config)
- Default password: `admin123`
- Change the password in `src/hooks/useAdminAuth.ts` before production use

## Technologies

- React 19 + TypeScript
- Tailwind CSS 4
- React Router DOM 7
- Vite 8 (build tool)
- shadcn/ui components

## License

For internal use by Owell Lighting / Jiujiang Ouwei Industrial Co., Ltd.
