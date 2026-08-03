/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/navigation.js — vanilla JS, no dependencies.

   Dropdown rules (strict, per spec):
   - Closed by default
   - Open ONLY on click (no hover, no :focus-within)
   - Only one dropdown open at a time
   - Opening one closes any other that's open
   - Closes on outside click
   - Closes on Escape (and returns focus to the toggle)
   - Closes after a link inside it is selected
   - Correct aria-expanded state at every step
   - Mobile menu closes automatically after any nav link is selected
   - Disabled ("Coming soon") links never navigate
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');
  var dropdownItems = document.querySelectorAll('.has-dropdown');

  function closeAllDropdowns() {
    dropdownItems.forEach(function (item) {
      if (item.classList.contains('is-open')) {
        item.classList.remove('is-open');
        var toggle = item.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function closeMobileMenu() {
    if (primaryNav && primaryNav.classList.contains('is-open')) {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
  }

  /* ---------- Mobile navigation toggle ---------- */
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
  }

  /* ---------- Close the mobile menu after any nav link is selected ---------- */
  document.querySelectorAll('#primaryNav a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  /* ---------- Dropdowns: CLICK ONLY. No mouseenter/mouseleave anywhere. ---------- */
  dropdownItems.forEach(function (item) {
    var toggle = item.querySelector('.dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var wasOpen = item.classList.contains('is-open');

      // Only one dropdown open at a time: close everything first.
      closeAllDropdowns();

      // Then re-open this one only if it wasn't already the open one
      // (i.e. this click is toggling it open, not closing it).
      if (!wasOpen) {
        item.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Click outside any dropdown closes all of them ---------- */
  document.addEventListener('click', function (event) {
    dropdownItems.forEach(function (item) {
      if (item.classList.contains('is-open') && !item.contains(event.target)) {
        item.classList.remove('is-open');
        var toggle = item.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Escape key: close dropdowns and mobile menu ---------- */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      var openItem = document.querySelector('.has-dropdown.is-open');
      closeAllDropdowns();
      closeMobileMenu();
      if (openItem) {
        var toggle = openItem.querySelector('.dropdown-toggle');
        if (toggle) toggle.focus();
      }
    }
  });

  /* ---------- Disabled ("Coming soon") links: block navigation ---------- */
  document.querySelectorAll('a[aria-disabled="true"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });

});
