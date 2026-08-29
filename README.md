# LED Sensor Light Website - GitHub Pages Deployment (v16)

B2B LED infrared sensor light foreign trade website. Built with React + TypeScript + Tailwind CSS.

## Quick Deploy

1. Unzip this file
2. Upload all contents to your GitHub repository (or any static hosting)
3. Enable GitHub Pages → Settings → Pages → Source: main branch / root
4. Your site will be live at `https://<username>.github.io/<repo>/`

## Admin Panel

- **URL**: `/admin/login` (e.g. `https://your-domain.com/admin/login`)
- **Default password**: `admin123`
- **Change password**: After login, go to sidebar → Change Password

### Admin Features
- Dashboard: KPI overview (products, advantages, testimonials, inquiries)
- Products: CRUD with image URL, specs, features, categories
- Advantages: CRUD for home page advantages section
- Testimonials: CRUD for customer testimonials
- Inquiries: View all form submissions, search/filter, update status, delete, resend email
- Email Settings: Configure Formspree for automatic inquiry email notifications
- Hero Slides / Features / Categories / About / Images / Translate / SEO settings
- **About page display settings** — Toggle Strict QC Process and Global Certifications sections

## PDF Catalog

- **File**: `files/Catalog.pdf` (built-in PDF catalog, ~19MB)
- **Viewing**: PDF.js based in-browser viewer on About Us page
- **Download**: Direct download without opening new tab
- **Admin**: Upload custom catalog PDF from admin panel → Catalog Management

## v16 What's New

- **PDF.js viewer** — Replaced iframe with PDF.js to avoid Chromium blocking
- **Direct PDF download** — fetch + Blob + a.click(), no new tab
- **About page section toggles** — Admin can show/hide Strict QC Process and Global Certifications sections
- **Renamed default PDF** — Catalog2026.pdf → Catalog.pdf
- **Product Catalog section moved** — Positioned after Company Milestones on About page
- **Inquiry form: Name field added** — Name is now a required field
- **Formspree integration** — Automatic email notification on new inquiries
- **Admin change password** — Change admin login password from sidebar
- **Dynamic intro paragraphs** — About page company intro paragraphs can be added/removed/reordered
- **Product card white background** — Product images have near-white background for better contrast
- **Product images 1:1 aspect ratio** — Uniform square display on product cards
- **Inquiry management** — Full CRUD for inquiry submissions in admin panel
- All previous features included

## File Structure

```
/
├── index.html          # Main entry
├── 404.html            # Same as index.html (for SPA routing on GitHub Pages)
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── routes.json
├── assets/             # JS and CSS bundles
├── images/             # 16 local images (hero, products, factory, etc.)
├── files/              # Catalog.pdf (product catalog PDF)
└── README.md           # This file
```

## Local Testing

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS 4
- Vite 8
- React Router DOM 7
- shadcn/ui components
- Framer Motion animations
- localStorage for data persistence
- Formspree for email delivery (optional)
- PDF.js for in-browser PDF viewing
- 4 languages: English (default), 中文, Español, 日本語
