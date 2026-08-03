# Sarfraj Solanki — Executive Finance Portfolio (Home Page Release)

This package contains **only the Home page**, production-ready, using real
assets throughout. No other pages are included yet.

## Structure

```
index.html
styles/
  main.css          — design tokens, reset, header/nav/footer structure
  components.css    — buttons, cards, capability grid, SAR achievement
                       cards, financial-model section, dev pills
  animations.css     — motion, reduced-motion support, scroll-reveal
  responsive.css     — all breakpoints (tablet, mobile, print)
js/
  main.js            — small shared utilities
  navigation.js       — strict click-only dropdown nav (see below)
  animations.js       — scroll-reveal, footer year
  charts.js           — 8 vanilla-JS canvas charts, fictional data only
assets/
  images/Headshot.png     — real photo, converted from your uploaded headshot
  images/favicon.png
  images/og-image.jpg
  documents/Sarfraj_Solanki_Resume.pdf — real resume, converted from your approved docx
  icons/linkedin.svg, email.svg, location.svg, download.svg
robots.txt
sitemap.xml (index.html only)
favicon.ico
README.md (this file)
```

## What's real vs. what's disabled

- **Real assets**: headshot, resume PDF, favicon, OG image, all 4 icons — no
  placeholders, no fabricated content.
- **Real, verified content**: every proof stat, achievement, and capability
  level on the page is drawn from your verified Career Master Profile.
- **No MBA references anywhere** on this page, per instruction.
- **Everything not yet built is disabled, not broken**: About, Career Vision,
  Experience, Timeline, Achievements, Projects, FP&A Portfolio, Insights,
  Qualifications, Education, References, Now, FAQ, and the Learning Roadmap
  all show `aria-disabled="true"` with a "Coming soon" badge. Clicking them
  does nothing (blocked in `navigation.js`) rather than 404ing.
- **Fully functional**: Home, Resume (view in new tab from the nav/hero,
  download from the closing CTA), email (mailto with prefilled subject), and
  LinkedIn (`https://linkedin.com/in/sarfraj-s`, as previously verified in
  this project — flag if this isn't your current URL).

## Navigation behavior (per spec, verified)

- Dropdowns open **only on click** — no hover, no `:focus-within` anywhere
  in the CSS.
- Only one dropdown can be open at a time; opening one closes any other.
- Closes on outside click, on Escape (returns focus to the toggle), and
  after any link inside is selected.
- Mobile menu closes automatically after any link is chosen.
- Every dropdown toggle has correct `aria-expanded` state throughout.

## The 8 financial models

Every dataset in `js/charts.js` is fictional — SAR figures, dates, and
percentages are illustrative only, generated to demonstrate method, not
copied from any real employer. Each model includes a business question,
key assumptions, analysis, management insight, and recommended action, per
the spec. All 8 render as accessible vanilla-JS `<canvas>` charts or plain
KPI cards — no external charting library, so nothing to break on GitHub
Pages.

## Deploying

Push this folder's contents to your repo root and enable GitHub Pages
(Settings → Pages → deploy from branch root). Canonical URLs, Open Graph
tags, and JSON-LD already point to
`https://sarfraj-finance.github.io/Executive-finance-portfolio/`.

When you're ready to add more pages, drop them in alongside `index.html`
and change the corresponding nav links from `aria-disabled="true"` back to
normal — the "Coming soon" badges and disabled-click handling in
`navigation.js` are scoped to `[aria-disabled="true"]` generally, so
removing the attribute is enough to re-enable a link.
