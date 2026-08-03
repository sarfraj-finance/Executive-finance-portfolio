# assets/certificates/

Four redacted certificates are in place, built from the real source
documents with membership numbers, QR codes, and fine print blacked out:

- `ACCA_Membership_Redacted.pdf`
- `ACCA_AAA_Prize_Redacted.pdf`
- `SOCPA_Associate_Redacted.pdf`
- `Oxford_Brookes_Degree_Redacted.pdf`

Two are intentionally not yet present — `BCom_Degree_Redacted.pdf` and
`MCom_Financial_Management_Redacted.pdf`. The Qualifications/Education pages
already handle this gracefully (text-only fallback, no broken links). See
the main README and delivery notes for why these two are still outstanding.

**If you add any certificate here yourself:**
- Black out or crop membership/registration numbers
- Remove QR codes
- Remove any national ID, passport, or Iqama references
- Remove personal address details if visible on the certificate

A matching thumbnail in `thumbnails/` (same filename + `_thumb.jpg`) will
make the preview show as an image rather than a text-only link — see
`js/credentials.js` for exactly how that detection works.
