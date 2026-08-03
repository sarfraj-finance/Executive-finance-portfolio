/* ==========================================================================
   SARFRAJ SOLANKI — EXECUTIVE FINANCE PORTFOLIO
   js/navigation.js — all header/nav behavior, vanilla JS, no dependencies.

   Handles:
   - Mobile navigation toggle, closed automatically after a link is chosen
   - Keyboard- and mouse-accessible dropdowns, single source of truth
     (the .is-open class) so only one dropdown is ever open at a time
   - Escape key closes any open dropdown and the mobile menu
   - Disabled ("Coming soon") links are inert — click is blocked
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');
  var dropdownItems = document.querySelectorAll('.has-dropdown');

  function closeAllDropdowns(exceptItem) {
    dropdownItems.forEach(function (item) {
      if (item !== exceptItem && item.classList.contains('is-open')) {
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

  /* ---------- Dropdown menus: single-open-at-a-time, click + hover ---------- */
  dropdownItems.forEach(function (item) {
    var toggle = item.querySelector('.dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var wasOpen = item.classList.contains('is-open');
      closeAllDropdowns(item);
      if (!wasOpen) {
        item.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    item.addEventListener('mouseenter', function () {
      closeAllDropdowns(item);
      item.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', function () {
      item.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
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
      var hadOpenDropdown = document.querySelector('.has-dropdown.is-open');
      closeAllDropdowns();
      closeMobileMenu();
      if (hadOpenDropdown) {
        var toggle = hadOpenDropdown.querySelector('.dropdown-toggle');
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
