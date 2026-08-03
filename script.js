/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   script.js — vanilla JS only, no frameworks/dependencies.
   Handles: mobile nav toggle, keyboard-accessible dropdowns, footer year.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile navigation toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
  }

  /* ---------- Dropdown menus: keyboard + touch accessible ---------- */
  var dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (event) {
      var parentItem = toggle.closest('.has-dropdown');
      var isOpen = parentItem.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      // Close any other open dropdowns for a clean single-open state
      document.querySelectorAll('.has-dropdown.is-open').forEach(function (item) {
        if (item !== parentItem) {
          item.classList.remove('is-open');
          item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  // Close dropdowns when clicking outside of them
  document.addEventListener('click', function (event) {
    document.querySelectorAll('.has-dropdown.is-open').forEach(function (item) {
      if (!item.contains(event.target)) {
        item.classList.remove('is-open');
        item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Footer: auto-update copyright year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
