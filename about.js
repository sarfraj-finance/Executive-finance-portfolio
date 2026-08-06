/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE IDENTITY
   js/about.js — About page ONLY. Home page JS is untouched.

   Handles: staggered scroll-reveal for the journey timeline, philosophy
   cards, process-flow steps, strength cards, and value items. Reuses the
   same reveal/IntersectionObserver approach as js/animations.js (which
   this page also loads for the shared footer-year + base reveal logic).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tag elements for staggered reveal ---------- */
  var staggerGroups = [
    '.journey-node',
    '.philosophy-card',
    '.process-step',
    '.strength-card',
    '.mindset-item',
    '.value-item'
  ];

  staggerGroups.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.classList.add('reveal', 'reveal-stagger');
      el.style.setProperty('--reveal-delay', (Math.min(i, 8) * 80) + 'ms');
    });
  });

  /* ---------- Reveal observer (scoped to this page's newly-tagged elements) ---------- */
  var revealEls = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(function (el) { observer.observe(el); });

});
