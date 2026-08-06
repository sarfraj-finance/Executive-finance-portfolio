/* ==========================================================================
   js/contact.js — Contact form handling for contact.html.

   KNOWN LIMITATION: this is a static GitHub Pages site with no backend, so
   there is no server to receive form submissions. This script builds a
   pre-filled mailto: link from the form fields and opens the visitor's own
   email client on submit — it does NOT send email silently or automatically.
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
    var body = encodeURIComponent(['Name: ' + name, 'Email: ' + email, '', message].join('\n'));
    window.location.href = 'mailto:sarfrajsolanki@outlook.com?subject=' + subject + '&body=' + body;
  });
});
