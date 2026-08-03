/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/animations.js — Scroll-reveal for elements marked with the .reveal
   class, and the footer copyright year. Uses IntersectionObserver so
   there's no scroll-event polling. Fails safely: if IntersectionObserver
   isn't supported, .reveal elements are simply made visible immediately.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer: auto-update copyright year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    // No observer support, or the user asked for reduced motion:
    // show everything immediately, no animation.
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
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) { observer.observe(el); });

});
