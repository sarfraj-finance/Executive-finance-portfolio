# Sarfraj Solanki — Executive Finance Portfolio (Home Page)

Static, framework-free HTML/CSS/JS build. This Home page is the design
template for the rest of the site — future pages should reuse `styles.css`
and the same header/footer markup for visual consistency.

## Files
- `index.html` — Home page markup (semantic, SEO meta, schema.org data)
- `styles.css` — Full design system (tokens, components, responsive rules)
- `script.js` — Mobile nav + dropdown behavior (vanilla JS, no dependencies)
- `assets/images/headshot-placeholder.svg` — placeholder graphic

## Before going live
1. Replace `assets/images/headshot-placeholder.svg` reference in
   `index.html` (`.hero-photo` src) with your approved headshot, e.g.
   `assets/images/headshot.jpg`. Keep the `alt` text descriptive.
2. Update `<link rel="canonical">` and Open Graph URLs once your real
   domain is confirmed.
3. Add a real `og-cover.jpg` (1200x630px) for social share previews.
4. Double check every nav link — several point to pages not yet built
   (about.html, experience.html, etc.). These are placeholders for the
   site structure and should 404 gracefully until built, or be removed
   until ready.

## Deploying to GitHub Pages
1. Push this folder to a GitHub repository (e.g. `sarfraj-portfolio`).
2. Repo Settings → Pages → Source: deploy from `main` branch, root folder.
3. Site will be live at `https://<username>.github.io/<repo-name>/`.
4. For a custom domain, add a `CNAME` file with your domain name and
   configure DNS per GitHub's custom-domain instructions.

## Accessibility notes
- Skip link, visible focus states, and `prefers-reduced-motion` support
  are already implemented.
- All icons are paired with text labels — no color/icon-only signals.
- Verify contrast if you change any token colors in `styles.css`.
