(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var hero = document.getElementById('hero');
  var navToggle = document.querySelector('.nav__toggle');
  var navLinks = document.querySelector('.nav__links');
  var navItems = document.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('section[id]');

  function isHeroVisible() {
    if (!hero) return false;
    return hero.getBoundingClientRect().bottom > 56;
  }

  function updateScrolledState() {
    if (!header) return;
    var menuOpen = navToggle && navToggle.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('scrolled', menuOpen || !isHeroVisible());
  }

  if (hero && header) {
    var heroObserver = new IntersectionObserver(
      function () {
        updateScrolledState();
      },
      { threshold: 0, rootMargin: '-56px 0px 0px 0px' }
    );
    heroObserver.observe(hero);
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('open', !expanded);
      updateScrolledState();
    });
  }

  navItems.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        setTimeout(updateScrolledState, 350);
      }
    });
  });

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
          link.classList.toggle('active', href === '#' + activeId);
        });
      },
      { rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
})();
