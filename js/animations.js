/* ==========================================================================
   js/animations.js — Scroll-reveal, staggered reveal, and metric counter
   animation. Shared across every page. Respects prefers-reduced-motion.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Auto-tag common repeating elements for staggered reveal ---------- */
  var staggerGroups = [
    '.journey-node', '.philosophy-card', '.process-step', '.strength-card',
    '.mindset-item', '.value-item', '.card-grid > .card', '.achievement-block',
    '.case-study', '.insight-card', '.reference-card'
  ];
  staggerGroups.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.classList.add('reveal', 'reveal-stagger');
      el.style.setProperty('--reveal-delay', (Math.min(i, 8) * 70) + 'ms');
    });
  });

  /* ---------- Reveal observer ---------- */
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
      }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------- Metric counter animation ---------- */
  function animateCounter(el) {
    var raw = el.getAttribute('data-count-to');
    if (!raw) return;
    var suffix = el.getAttribute('data-count-suffix') || '';
    var target = parseFloat(raw);
    if (isNaN(target)) return;
    if (prefersReducedMotion) { el.textContent = raw + suffix; return; }
    var duration = 900, startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
      else el.textContent = raw + suffix;
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
          if (entry.isIntersecting) { animateCounter(entry.target); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      counterEls.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ---------- Hero role cycler (About page only) ---------- */
  var cyclerEl = document.getElementById('roleCycler');
  if (cyclerEl) {
    var roles = ['Senior Accountant', 'Advancing toward FP&A', 'Future Finance Leader'];
    if (prefersReducedMotion) {
      cyclerEl.textContent = roles[0];
    } else {
      var idx = 0;
      cyclerEl.textContent = roles[0];
      cyclerEl.style.transition = 'opacity 350ms ease';
      setInterval(function () {
        idx = (idx + 1) % roles.length;
        cyclerEl.style.opacity = '0';
        setTimeout(function () { cyclerEl.textContent = roles[idx]; cyclerEl.style.opacity = '1'; }, 350);
      }, 2600);
    }
  }

});
