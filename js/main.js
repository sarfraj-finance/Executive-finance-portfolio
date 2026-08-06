/* ==========================================================================
   js/main.js — Entry point, loaded first. Small shared utilities plus the
   footer-year update used on every page.
   ========================================================================== */
(function () {
  'use strict';
  window.SS = window.SS || {};
  window.SS.qs = function (selector, scope) { return (scope || document).querySelector(selector); };
  window.SS.qsa = function (selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); };
  window.SS.prefersReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
})();

document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
