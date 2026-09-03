# Data Directory

This directory contains JSON data files that power the website content.

## Structure

- `products.json` - Product catalog data
- `advantages.json` - Home page advantage sections
- `testimonials.json` - Customer testimonials
- `features.json` - Feature highlights
- `hero-slides.json` - Hero carousel slides
- `about.json` - About page content
- `news.json` - News / blog posts
- `categories.json` - Product categories
- `footer.json` - Footer settings and social links
- `seo.json` - SEO meta information
- `privacy.json` - Privacy policy content
- `translations.json` - i18n translation strings

## Updating Data

Data files can be updated via the admin panel at `/admin/login`.
After saving changes, click "Sync to GitHub" to push updates here.

## Remote Data Loading

The frontend fetches data from this directory at runtime.
If a file is missing or fails to load, local fallback data is used automatically.
