/* ==========================================================================
   js/navigation.js — ONE shared file, identical on every page.

   Dropdown rules (strict):
   - Closed by default
   - Open ONLY on click — no hover, no :focus-within anywhere in the CSS
   - Only one dropdown open at a time; opening one closes any other
   - Closes on outside click
   - Closes on Escape (focus returns to the toggle)
   - Closes after a link inside it is selected
   - Correct aria-expanded state at every step
   - Mobile menu closes automatically after any nav link is selected
   - Sticky header gains a solid background once scrolled past the hero
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');
  var siteHeader = document.querySelector('.site-header');
  var dropdownItems = document.querySelectorAll('.has-dropdown');

  /* ---------- Sticky header scroll state ---------- */
  if (siteHeader) {
    var scrollThreshold = 60;
    var applyScrollState = function () {
      if (window.scrollY > scrollThreshold) siteHeader.classList.add('is-scrolled');
      else siteHeader.classList.remove('is-scrolled');
    };
    applyScrollState();
    window.addEventListener('scroll', applyScrollState, { passive: true });
  }

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

  /* ---------- Close mobile menu after any nav link is selected ---------- */
  document.querySelectorAll('#primaryNav a').forEach(function (link) {
    link.addEventListener('click', function () { closeMobileMenu(); });
  });

  /* ---------- Dropdowns: CLICK ONLY ---------- */
  dropdownItems.forEach(function (item) {
    var toggle = item.querySelector('.dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var wasOpen = item.classList.contains('is-open');
      closeAllDropdowns();
      if (!wasOpen) {
        item.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Click outside closes all dropdowns ---------- */
  document.addEventListener('click', function (event) {
    dropdownItems.forEach(function (item) {
      if (item.classList.contains('is-open') && !item.contains(event.target)) {
        item.classList.remove('is-open');
        var toggle = item.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Escape closes dropdowns and mobile menu ---------- */
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

});
