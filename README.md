# Sarfraj Solanki — Executive Finance Portfolio (Full Website)

Complete, synchronized 15-page website. One shared navigation and footer,
one design system, real assets throughout, zero "Coming Soon" labels.

## Pages
index.html · about.html · experience.html · achievements.html · projects.html ·
fpa-portfolio.html · qualifications.html · education.html · references.html ·
insights.html · now.html · faq.html · resume.html · contact.html · 404.html

## Architecture

```
styles/
  variables.css   — design tokens (navy/ivory/gold, type scale, spacing)
  reset.css       — minimal reset
  typography.css  — type scale, headings, pull-quote
  layout.css      — containers, section rhythm, page-hero, footer
  navigation.css  — sticky header, dropdowns (click-only), mobile menu
  components.css  — buttons, cards, pillars, achievements, credentials, motion
  pages.css       — page-specific layout (experience, philosophy, process
                    flow, mindset, career direction, global perspective,
                    insights, FAQ, references, contact form, 404)
  dashboards.css  — FP&A dashboard components (Home + fpa-portfolio.html)
  responsive.css  — all breakpoints
  print.css       — browser print / PDF export

js/
  main.js         — shared utilities, footer year
  navigation.js   — ONE shared file, identical on every page: click-only
                    dropdowns, single-open, close on outside-click/Escape/
                    link-select, sticky-header scroll state
  animations.js   — scroll-reveal, staggered reveal, metric counters,
                    About page role-cycler
  dashboards.js   — SVG chart engine (line/bar/waterfall/donut/heatmap),
                    used on Home and fpa-portfolio.html
  credentials.js  — checks each certificate exists before showing a
                    preview; falls back to text if missing (none are
                    missing in this release — all 6 are real)
  contact.js      — mailto-based contact form handler

assets/
  images/          Headshot.png (real photo), favicon.png, og-image.jpg
  documents/        Sarfraj_Solanki_Resume.pdf (real, converted from approved docx)
  icons/             linkedin.svg, email.svg, location.svg, download.svg
  certificates/      6 real redacted certificates (see below)
  certificates/thumbnails/  matching preview thumbnails
```

## Certificates — all 6 are real, none are placeholders

Built by redacting your actual uploaded documents (registration numbers,
QR codes, and fine print blacked out; generous margins used since exact
pixel-perfect redaction can't be guaranteed blind — please visually
verify each one before this goes live):

- ACCA_Membership_Redacted.pdf
- ACCA_AAA_Prize_Redacted.pdf
- SOCPA_Associate_Redacted.pdf
- Oxford_Brookes_Degree_Redacted.pdf
- JRN_Degree_Redacted.pdf (Bachelor of Commerce)
- MCom_Provisional_Certificate_Redacted.pdf (Amity Master of Commerce —
  this is the provisional certificate, since the final conferred degree
  certificate doesn't exist yet; convocation is Nov/Dec 2026 per the
  document itself)

## Navigation

One shared structure across all 15 pages:
Home · Profile ▾ · Experience ▾ · Impact ▾ · Finance Portfolio ▾ ·
Credentials ▾ · Insights ▾ · Resume · Contact

Two dropdown items point to same-page anchors rather than separate files,
since no separate pages exist for them:
- Profile → Career Direction = `about.html#career-direction`
- Experience → Career Timeline = `experience.html#career-timeline`
- Finance Portfolio → Management Reporting / Working Capital Analysis /
  Scenario Analysis = anchors within `fpa-portfolio.html`

Every other dropdown item and every top-level link points to a real,
complete page. Zero disabled links, zero `href="#"`, zero "Coming Soon."

## Deploying

Push this folder's contents to your repo root and enable GitHub Pages.
Canonical, Open Graph, and JSON-LD URLs across all 15 pages point to
`https://sarfraj-finance.github.io/Executive-finance-portfolio/`.
