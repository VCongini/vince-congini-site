(function () {
  'use strict';

  var docEl = document.documentElement;
  var header = document.getElementById('site-header');
  var hero = document.getElementById('hero');
  var navToggle = document.querySelector('.nav__toggle');
  var navLinks = document.querySelector('.nav__links');
  var navItems = document.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('section[id]');

  docEl.classList.add('js-enabled');

  function getRootStyleValue(name) {
    return getComputedStyle(docEl).getPropertyValue(name).trim();
  }

  function getCssPixels(name, fallback) {
    var value = parseFloat(getRootStyleValue(name));
    return Number.isFinite(value) ? value : fallback;
  }

  function getCssMilliseconds(name, fallback) {
    var raw = getRootStyleValue(name);
    var value = parseFloat(raw);

    if (!Number.isFinite(value)) return fallback;
    return raw.indexOf('ms') > -1 ? value : value * 1000;
  }

  function getNavHeight() {
    return getCssPixels('--nav-height', 56);
  }

  function getMenuTransitionDuration() {
    return getCssMilliseconds('--nav-transition-duration', 300);
  }

  function isHeroVisible() {
    if (!hero) return false;
    return hero.getBoundingClientRect().bottom > getNavHeight();
  }

  function updateScrolledState() {
    if (!header) return;
    var menuOpen = navToggle && navToggle.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('scrolled', menuOpen || !isHeroVisible());
  }

  function closeMobileMenu(options) {
    if (!navToggle || !navLinks || navToggle.getAttribute('aria-expanded') !== 'true') {
      return;
    }

    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';

    if (options && options.deferScrolledState) {
      setTimeout(updateScrolledState, getMenuTransitionDuration() + 50);
    } else {
      updateScrolledState();
    }
  }

  if (hero && header) {
    var heroObserver = new IntersectionObserver(
      function () {
        updateScrolledState();
      },
      { threshold: 0, rootMargin: '-' + getNavHeight() + 'px 0px 0px 0px' }
    );
    heroObserver.observe(hero);
  }

  if (navToggle && navLinks) {
    navToggle.setAttribute('aria-label', 'Open menu');

    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navToggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
      navLinks.classList.toggle('open', !expanded);
      document.body.style.overflow = !expanded ? 'hidden' : '';
      updateScrolledState();
    });
  }

  navItems.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu({ deferScrolledState: true });
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMobileMenu();
      if (navToggle) navToggle.focus();
    }
  });

  var mobileQuery = window.matchMedia('(max-width: 768px)');
  mobileQuery.addEventListener('change', function (e) {
    if (!e.matches) closeMobileMenu();
  });

  var themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getEffectiveTheme() {
      var saved = localStorage.getItem('theme');
      if (saved) return saved;
      return darkQuery.matches ? 'dark' : 'light';
    }

    function updateToggle() {
      var theme = getEffectiveTheme();
      themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }

    themeToggle.addEventListener('click', function () {
      var next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
      docEl.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggle();
    });

    darkQuery.addEventListener('change', function () {
      if (!localStorage.getItem('theme')) updateToggle();
    });

    updateToggle();
  }

  var visibleSections = new Set();

  if (sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        var sectionIds = Array.from(sections).map(function (s) {
          return s.id;
        });
        var activeId = sectionIds.find(function (id) {
          return visibleSections.has(id);
        });

        navItems.forEach(function (link) {
          var href = link.getAttribute('href');
          if (href && href.charAt(0) === '#') {
            link.classList.toggle('active', href === '#' + activeId);
          }
        });
      },
      { rootMargin: '-' + (getNavHeight() + 24) + 'px 0px -40% 0px' }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
})();
