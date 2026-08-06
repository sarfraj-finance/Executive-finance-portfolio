# Sarfraj Solanki — Executive Finance Identity (Home Page Release)

A premium executive personal website — not a CV template, not a student
portfolio. Built for senior finance professionals, executive recruiters,
CFOs, FP&A leaders, and MBA admissions reviewers.

## Design system
- **Palette:** deep navy / midnight / charcoal (primary), warm ivory / stone
  grey / white (secondary), muted gold/bronze (accent only — no neon, no
  multiple accent colors).
- **Typography:** Playfair Display (editorial headings), Inter (body/UI),
  IBM Plex Mono (financial figures and metadata).
- **Layout:** narrow executive container (1180px max), reading sections
  capped at 820px, deliberate section-to-section background rhythm
  (navy hero → ivory → white → stone → navy dashboards → dark CTA → dark
  footer).

## Structure (11 sections, in order)
1. Premium sticky navigation (transparent-over-hero → solid ivory + blur
   on scroll)
2. Executive hero (split layout, real headshot, floating credential labels)
3. Recruiter & Leadership Snapshot (two-column facts, not a boxed grid)
4. Selected Proof Metrics (6 only, animated count-up on scroll)
5. Executive Profile Narrative (148-word narrative + pull quote)
6. Core Finance Capabilities (4 editorial pillars, not skill-tag rows)
7. Selected Business Achievements (4, large metric + title + one sentence)
8. Executive Finance Dashboard Showcase (3 dashboards, SVG charts)
9. Strategic Direction (4 short columns, replaces the old tag cloud)
10. Executive Call to Action (dark section, no casual language)
11. Premium Footer

## Charts
All charts are inline SVG (not canvas) — they render reliably in local
browsers, GitHub Pages, Chrome print, and PDF export. Every figure derives
from one consistent SAR 12.4m annual revenue base, so nothing contradicts
across the three dashboards. All data is explicitly fictional/illustrative;
the disclaimer appears once at the section level per spec.

## What's real vs. disabled
- **Real:** headshot (`assets/images/Headshot.png`, your actual photo),
  resume (`assets/documents/Sarfraj_Solanki_Resume.pdf`, converted from
  your approved docx), all icons, favicon, OG image.
- **Functional:** Home, Resume (view + download), Email, LinkedIn, and
  "Finance Portfolio" (anchors down to the dashboard showcase on this same
  page).
- **Disabled with "Coming soon"** (only inside dropdown menus, per spec —
  top-level items like "Insights" are simply muted without a visible
  badge): Profile, Experience, Impact, Credentials dropdown items, and the
  detailed FP&A Portfolio page.

## Known print limitation
The dashboard section keeps its dark navy background in print/PDF export
(chart text is styled light for on-screen contrast against navy; forcing
it to swap to dark-on-white for print risked making labels invisible
instead). Browsers preserve this correctly when "background graphics" is
enabled in the print dialog. Worth a real print test before relying on it.

## Deploying
Push this folder's contents to your repo root and enable GitHub Pages.
Canonical, Open Graph, and JSON-LD URLs already point to
`https://sarfraj-finance.github.io/Executive-finance-portfolio/`.
