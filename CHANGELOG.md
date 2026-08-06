# CHANGELOG

## Full Website Rebuild — Complete Codebase

This is a ground-up rebuild, not a patch. Every file was regenerated from
a clean structure so navigation, asset paths, stylesheets, and links are
synchronized across all 15 pages.

### Added
- 12 new complete pages: experience.html, achievements.html, projects.html,
  fpa-portfolio.html, qualifications.html, education.html, references.html,
  insights.html, now.html, faq.html, resume.html, contact.html, 404.html
- 2 additional real redacted certificates: JRN_Degree_Redacted.pdf and
  MCom_Provisional_Certificate_Redacted.pdf (redacted from the actual
  source documents in this project — not fabricated)
- Full 10-file CSS architecture (variables/reset/typography/layout/
  navigation/components/pages/dashboards/responsive/print)
- 6-file JS architecture (main/navigation/animations/dashboards/
  credentials/contact)
- sitemap.xml (all 14 indexable pages), robots.txt, favicon.ico

### Changed
- Navigation restructured to: Home, Profile ▾, Experience ▾, Impact ▾,
  Finance Portfolio ▾, Credentials ▾, Insights ▾, Resume, Contact
- Every previously-disabled ("Coming Soon") link is now either a real
  page or a real same-page anchor. Zero disabled links remain anywhere
  on the site.
- Home and About pages carried over with their approved content, adapted
  to the new shared navigation/footer template

### Removed
- All "Coming Soon" badges and aria-disabled attributes (none exist
  anywhere in this release)
- The old single-file "everything in charts.js" approach — split into
  dashboards.js (charts) and credentials.js (certificate existence checks)

### Verified before delivery
- Zero broken internal links (automated scan across all 15 pages)
- Zero "Coming Soon" labels (grep across all pages)
- Zero aria-disabled attributes, zero href="#"
- HTML tag-balance check passes on all 15 pages
- Identical navigation structure confirmed byte-for-byte across all pages
  (excluding the expected aria-current differences)
- All 6 certificate data-cert paths resolve to real files — no missing
  certificates in this release
- All dashboard chart/KPI container IDs on Home and fpa-portfolio.html
  match dashboards.js render calls
- Every image has alt text
- Asset filenames and capitalization verified exact
