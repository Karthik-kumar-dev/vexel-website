# Vexel — Landing Page

Marketing site for **Vexel**, the open-source AI prompt enhancer.

## Structure

```
vexel-website/
├── index.html       # Page markup + SEO (meta, OG, JSON-LD)
├── css/style.css     # Design system, layout, animations
├── js/script.js      # Scroll reveals, particles, crystal parallax,
│                      # transformation demo, GitHub stats, etc.
├── assets/favicon.svg
├── robots.txt
└── sitemap.xml
```

## Run locally

No build step — it's plain HTML/CSS/JS.

```bash
# from the vexel-website folder
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just open `index.html` directly in a browser (the GitHub stats fetch
requires `http(s)://`, not `file://`, due to CORS — use the server above
for full functionality).

## Before deploying

1. Replace `https://vexel.app` everywhere (meta tags, canonical, sitemap,
   robots.txt, JSON-LD) with your real domain.
2. Add a real `assets/og-image.png` (1200×630) for social share previews.
3. Update the GitHub repo URL if it changes from
   `https://github.com/Karthik-kumar-dev/vexel`.
4. Update the download link in the hero / install section once you have a
   tagged release with a Windows installer attached.

## Deploy (GitHub Pages)

1. Push this folder's contents to your repo (e.g. on a `gh-pages` branch or
   the `/docs` folder of `main`).
2. In repo Settings → Pages, set the source to that branch/folder.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

## SEO checklist included

- Descriptive `<title>` and meta description
- Open Graph + Twitter card tags
- `SoftwareApplication` and `FAQPage` JSON-LD structured data
- `robots.txt` and `sitemap.xml`
- Semantic HTML, alt text, skip link, focus-visible states
- `prefers-reduced-motion` respected throughout
