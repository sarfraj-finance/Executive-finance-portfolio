/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/credentials.js — Checks whether each redacted certificate file
   actually exists before showing a preview/download link. If a file is
   missing (not yet produced, or later removed), the card falls back to
   plain text instead of a broken link or broken image.

   Runs on qualifications.html and education.html only (wherever
   .credential-card elements with a data-cert attribute are present).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var cards = document.querySelectorAll('.credential-card[data-cert]');
  if (!cards.length) return;

  cards.forEach(function (card) {
    var certPath = card.getAttribute('data-cert');
    var thumbPath = card.getAttribute('data-cert-thumb');
    var actionsEl = card.querySelector('.credential-actions');
    if (!certPath || !actionsEl) return;

    fetch(certPath, { method: 'HEAD' })
      .then(function (response) {
        if (response && response.ok) {
          showCertificateAvailable(card, actionsEl, certPath, thumbPath);
        } else {
          showCertificateUnavailable(actionsEl);
        }
      })
      .catch(function () {
        // Network error, file:// protocol, or CORS issue — fail safe to
        // the text-only fallback rather than a broken link.
        showCertificateUnavailable(actionsEl);
      });
  });

  function showCertificateAvailable(card, actionsEl, certPath, thumbPath) {
    card.classList.add('has-certificate');

    if (thumbPath) {
      var thumbLink = document.createElement('a');
      thumbLink.href = certPath;
      thumbLink.target = '_blank';
      thumbLink.rel = 'noopener noreferrer';
      thumbLink.className = 'credential-thumb-link';

      var img = document.createElement('img');
      img.src = thumbPath;
      img.alt = 'Redacted certificate preview';
      img.className = 'credential-thumb';
      img.loading = 'lazy';
      // If the thumbnail itself fails to load, don't leave a broken image —
      // just fall back to a text-only link instead.
      img.addEventListener('error', function () {
        thumbLink.remove();
      });

      thumbLink.appendChild(img);
      actionsEl.appendChild(thumbLink);
    }

    var viewLink = document.createElement('a');
    viewLink.href = certPath;
    viewLink.target = '_blank';
    viewLink.rel = 'noopener noreferrer';
    viewLink.className = 'btn btn-tertiary btn-small';
    viewLink.textContent = 'View Redacted Certificate';
    actionsEl.appendChild(viewLink);
  }

  function showCertificateUnavailable(actionsEl) {
    var note = document.createElement('p');
    note.className = 'credential-unavailable';
    note.textContent = 'Redacted certificate not yet published for this qualification.';
    actionsEl.appendChild(note);
  }
});
