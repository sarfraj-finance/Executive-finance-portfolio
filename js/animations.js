/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE IDENTITY
   js/animations.js — Scroll-reveal (.reveal elements), footer year, and a
   restrained metric counter animation for proof metrics and achievement
   figures. Everything here respects prefers-reduced-motion and fails safe
   (content is simply shown immediately) if IntersectionObserver isn't
   supported.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer: auto-update copyright year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------- Metric counter animation (proof metrics + achievements) ----------
     Only animates numeric values (e.g. "6", "30%", "2:1" is left as static
     text since it isn't a plain count). Respects reduced motion by simply
     showing the final value with no animation. */
  function animateCounter(el) {
    var raw = el.getAttribute('data-count-to');
    if (!raw) return;
    var suffix = el.getAttribute('data-count-suffix') || '';
    var target = parseFloat(raw);
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = raw + suffix;
      return;
    }

    var duration = 900;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic, no bounce
      var current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
      else el.textContent = raw + suffix; // land exactly on the true value
    }
    window.requestAnimationFrame(step);
  }

  var counterEls = document.querySelectorAll('[data-count-to]');
  if (counterEls.length) {
    if (!('IntersectionObserver' in window)) {
      counterEls.forEach(animateCounter);
    } else {
      var counterObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counterEls.forEach(function (el) { counterObserver.observe(el); });
    }
  }

});
