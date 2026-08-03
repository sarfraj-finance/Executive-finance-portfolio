/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/main.js — Entry point. Loaded first, before navigation.js,
   animations.js, charts.js, and contact.js on pages that need them.

   This file intentionally stays small: it holds only truly global
   utilities that other scripts might rely on. Page-specific behavior
   belongs in its own file (navigation, animations, charts, contact)
   so each concern stays easy to find and maintain.
   ========================================================================== */

(function () {
  'use strict';

  // Small helper other scripts can reuse instead of repeating the same
  // querySelector + null-check pattern everywhere.
  window.SS = window.SS || {};

  window.SS.qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  window.SS.qsa = function (selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  };

  // Flag used by other scripts to skip animation-heavy code paths.
  window.SS.prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

})();
