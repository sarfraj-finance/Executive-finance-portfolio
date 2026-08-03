/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/contact.js — Contact form handling for contact.html.

   IMPORTANT / KNOWN LIMITATION:
   This is a static, no-backend site (GitHub Pages), so there is no server
   to receive form submissions. This script builds a pre-filled mailto:
   link from the form fields and opens the user's own email client on
   submit — it does NOT send email on your behalf, silently, or without
   the visitor's own mail client opening.

   When you're ready for a "real" contact form (submissions land in an
   inbox without opening the visitor's mail client), swap this out for a
   form endpoint service (e.g. Formspree, Getform, or a small serverless
   function) and point the <form> action at that endpoint instead of
   calling this script.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = form.querySelector('#contactName').value.trim();
    var email = form.querySelector('#contactEmail').value.trim();
    var message = form.querySelector('#contactMessage').value.trim();

    var subject = encodeURIComponent('Finance Opportunity — message from ' + (name || 'website contact form'));
    var bodyLines = [
      'Name: ' + name,
      'Email: ' + email,
      '',
      message
    ];
    var body = encodeURIComponent(bodyLines.join('\n'));

    var mailtoUrl = 'mailto:sarfrajsolanki@outlook.com?subject=' + subject + '&body=' + body;
    window.location.href = mailtoUrl;
  });
});
