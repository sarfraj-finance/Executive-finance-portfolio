# Sarfraj Solanki — Executive Finance Portfolio

Full 16-page static site. No frameworks, no build step — plain HTML/CSS/JS,
ready to deploy directly to GitHub Pages.

## Structure

```
Executive-finance-portfolio/
├── index.html, about.html, future-vision.html, experience.html,
│   timeline.html, achievements.html, projects.html, fpa-portfolio.html,
│   insights.html, qualifications.html, education.html, references.html,
│   now.html, faq.html, resume.html, contact.html
│
├── styles/
│   ├── main.css          — design tokens, reset, header/nav/footer structure
│   ├── components.css    — buttons, cards, badges, forms, page-specific UI
│   ├── animations.css    — all motion, scroll-reveal, reduced-motion support
│   └── responsive.css    — all breakpoints (tablet, mobile, print)
│
├── js/
│   ├── main.js           — small shared utilities, loaded first
│   ├── navigation.js     — nav toggle, dropdowns, Escape key, disabled links
│   ├── animations.js     — scroll-reveal (IntersectionObserver), footer year
│   ├── charts.js         — canvas chart renderer for the FP&A Portfolio page
│   └── contact.js        — mailto-based contact form handler
│
├── assets/
│   ├── images/           — Headshot.png, favicon.png, og-image.jpg
│   ├── icons/            — linkedin.svg, email.svg, location.svg, download.svg
│   ├── documents/        — Sarfraj_Solanki_Resume.pdf
│   ├── certificates/     — empty; see its own README before adding anything
│   ├── logos/            — empty; see its own README (usage-rights caution)
│   └── seo/              — empty; see its own README (future SEO assets)
│
├── sitemap.xml
├── robots.txt
├── favicon.ico
└── README.md (this file)
```

## A note on the FP&A Portfolio filename

Your original spec listed this page as `fp&a-portfolio.html`. The `&`
character breaks URLs (needs percent-encoding as `%26`), Git tooling, and
most static hosts. Every reference across the site uses **`fpa-portfolio.html`**
instead — nothing links to the ampersand version.

## What's real vs. what's still outstanding

- **Real, in place:** `assets/documents/Sarfraj_Solanki_Resume.pdf` (converted
  directly from your approved resume docx) and four redacted certificates —
  ACCA Membership, ACCA AAA Prize, SOCPA Associate, and Oxford Brookes Degree —
  built from your actual source documents, with registration numbers, QR
  codes, and fine print blacked out.
- **Not yet produced, on purpose:** `BCom_Degree_Redacted.pdf` and
  `MCom_Financial_Management_Redacted.pdf`. See the note in the delivery
  message for why — in short, one source document needed a page-by-page
  identification I wasn't confident enough in to publish blind, and the
  other (Amity Master's) has no conferred degree certificate yet, only
  semester results. Both Qualifications/Education cards degrade gracefully
  to text-only until those files exist — this is the working "missing
  certificate" fallback, not a bug.
- Every certificate/resume path is wired correctly; dropping a real file in
  at the exact same filename is all that's needed to bring a card online.

## Deploying to GitHub Pages

1. Push this entire folder to the repository root (matching the
   `Executive-finance-portfolio` name implied by the sitemap/canonical URLs).
2. Repo Settings → Pages → Source: deploy from `main` branch, root folder.
3. Site goes live at `https://sarfraj-finance.github.io/Executive-finance-portfolio/`
   — this exact URL is already baked into every canonical tag, Open Graph
   tag, the JSON-LD structured data, and `sitemap.xml`. If you use a
   different repo name or a custom domain, those all need updating too
   (a simple find-and-replace across every `.html` file, plus `sitemap.xml`
   and `robots.txt`).

## Known limitation: the contact form

This is a static site with no backend, so `contact.html`'s form can't
"send" anything server-side. `js/contact.js` builds a pre-filled `mailto:`
link and opens the visitor's own email client on submit — it does not
silently send email on your behalf. When you're ready for a real
form-to-inbox flow, swap in a service like Formspree or a small serverless
function and point the form's submission at that instead.
