(function () {
  'use strict';

  var docEl = document.documentElement;
  var header = document.getElementById('site-header');
  var hero = document.getElementById('hero');
  var navToggle = document.querySelector('.nav__toggle');
  var navLinks = document.querySelector('.nav__links');
  var navItems = document.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('section[id]');
  var copyEmailButton = document.querySelector('[data-copy-email]');
  var contactStatus = document.getElementById('contact-status');

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

  function getStoredTheme() {
    try {
      return window.localStorage.getItem('theme');
    } catch (error) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      // Storage may be disabled in privacy-restricted or sandboxed contexts.
    }
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
      var saved = getStoredTheme();
      if (saved) return saved;
      return darkQuery.matches ? 'dark' : 'light';
    }

    function updateToggle() {
      var theme = getEffectiveTheme();
      themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    themeToggle.addEventListener('click', function () {
      var next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
      docEl.setAttribute('data-theme', next);
      setStoredTheme(next);
      updateToggle();
    });

    darkQuery.addEventListener('change', function () {
      if (!getStoredTheme()) updateToggle();
    });

    updateToggle();
  }

  if (copyEmailButton && contactStatus) {
    var copyStatusTimer;
    var copyButtonLabel = copyEmailButton.textContent;

    function updateCopyStatus(buttonText, statusText) {
      copyEmailButton.textContent = buttonText;
      contactStatus.textContent = statusText;
      window.clearTimeout(copyStatusTimer);
      copyStatusTimer = window.setTimeout(function () {
        copyEmailButton.textContent = copyButtonLabel;
        contactStatus.textContent = '';
      }, 4000);
    }

    copyEmailButton.addEventListener('click', function () {
      var email = copyEmailButton.getAttribute('data-copy-email');
      var copy = navigator.clipboard && window.isSecureContext
        ? navigator.clipboard.writeText(email)
        : Promise.reject(new Error('Clipboard unavailable'));

      copy.then(function () {
        updateCopyStatus('Copied', 'Email copied to clipboard.');
      }).catch(function () {
        updateCopyStatus('Failed', 'Email copy failed. Select the address and copy it manually.');
      });
    });
  }

  var workInMotionPlayer = document.querySelector('[data-work-in-motion-player]');
  if (workInMotionPlayer) {
    var workInMotionVideo = workInMotionPlayer.querySelector('[data-work-in-motion-video]');
    // Collapsed details are omitted from Chromium's accessible description.
    workInMotionVideo.setAttribute('aria-description', workInMotionPlayer.querySelector('#work-in-motion-description').textContent);
    var workInMotionPoster = workInMotionPlayer.querySelector('[data-work-in-motion-poster]');
    var workInMotionPlay = workInMotionPlayer.querySelector('[data-work-in-motion-play]');
    var workInMotionStatus = workInMotionPlayer.querySelector('[data-work-in-motion-status]');
    var workInMotionFallback = workInMotionPlayer.querySelector('[data-work-in-motion-fallback]');
    var filmDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var filmReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var filmAutoAttempted = false;
    var pendingFilmState = null;

    function filmIsDark() {
      return (docEl.getAttribute('data-theme') || (filmDarkQuery.matches ? 'dark' : 'light')) === 'dark';
    }

    function filmSource(source, extension) {
      return source.replace(extension, (filmIsDark() ? '-dark' : '') + extension);
    }

    function syncWorkInMotionTheme() {
      workInMotionPlayer.querySelector('[data-work-in-motion-dark-poster="desktop"]').media =
        filmIsDark() ? '(min-width: 769px)' : 'not all';
      workInMotionPlayer.querySelector('[data-work-in-motion-dark-poster="mobile"]').media =
        filmIsDark() ? '(max-width: 768px)' : 'not all';
      var layout = workInMotionPlayer.dataset.activated;
      if (!layout) return;
      var source = filmSource(workInMotionVideo.dataset[layout + 'Src'], '.mp4');
      if (workInMotionVideo.getAttribute('src') === source) return;
      // Preserve the original state across rapid theme changes during loading.
      pendingFilmState = pendingFilmState || {
        time: workInMotionVideo.currentTime,
        playing: !workInMotionVideo.paused && !workInMotionVideo.ended
      };
      workInMotionVideo.onloadedmetadata = function () {
        var state = pendingFilmState;
        if (!state) return;
        pendingFilmState = null;
        workInMotionVideo.currentTime = Math.min(state.time, workInMotionVideo.duration);
        if (state.playing && !document.hidden) {
          workInMotionVideo.play().catch(function () { workInMotionPlay.hidden = false; });
        }
      };
      workInMotionVideo.poster = filmSource(workInMotionVideo.dataset[layout + 'Poster'], '.webp');
      workInMotionVideo.src = source;
      workInMotionVideo.load();
    }

    syncWorkInMotionTheme();
    filmDarkQuery.addEventListener('change', syncWorkInMotionTheme);
    new MutationObserver(syncWorkInMotionTheme).observe(docEl, { attributes: true, attributeFilter: ['data-theme'] });


    function showWorkInMotionFailure(message) {
      workInMotionStatus.textContent = message;
      workInMotionStatus.hidden = false;
      workInMotionFallback.href = workInMotionVideo.currentSrc || workInMotionVideo.src;
      workInMotionFallback.hidden = false;
    }

    function activateWorkInMotion(manual) {
      filmAutoAttempted = true;
      if (pendingFilmState) pendingFilmState.playing = true;
      if (!workInMotionPlayer.dataset.activated) {
        var mobile = window.matchMedia('(max-width: 768px)').matches;
        workInMotionPlayer.dataset.activated = mobile ? 'mobile' : 'desktop';
        workInMotionVideo.classList.add(
          mobile ? 'work-in-motion__video--mobile' : 'work-in-motion__video--desktop'
        );
        workInMotionVideo.src = filmSource(mobile
          ? workInMotionVideo.dataset.mobileSrc
          : workInMotionVideo.dataset.desktopSrc, '.mp4');
        workInMotionVideo.poster = filmSource(mobile
          ? workInMotionVideo.dataset.mobilePoster
          : workInMotionVideo.dataset.desktopPoster, '.webp');
        workInMotionVideo.setAttribute('controls', '');
        workInMotionVideo.setAttribute('tabindex', '0');
        workInMotionVideo.muted = true;
        workInMotionPoster.hidden = true;
        workInMotionVideo.hidden = false;
      }
      if (workInMotionVideo.ended) workInMotionVideo.currentTime = 0;
      if (workInMotionVideo.error) workInMotionVideo.load();
      workInMotionStatus.hidden = true;
      workInMotionFallback.hidden = true;
      workInMotionPlay.hidden = true;
      if (manual) workInMotionVideo.focus({ preventScroll: true });
      workInMotionVideo.play().catch(function () {
        workInMotionPlay.hidden = false;
        if (manual && !workInMotionVideo.error) {
          showWorkInMotionFailure('Playback could not start. Use Play or the video controls to try again.');
        }
      });
    }

    workInMotionPlay.addEventListener('click', function () { activateWorkInMotion(true); });
    workInMotionPlay.hidden = false;
    workInMotionVideo.addEventListener('play', function () {
      workInMotionPlay.hidden = true;
      workInMotionPlay.setAttribute('aria-label', 'Play film');
    });
    workInMotionVideo.addEventListener('pause', function () { workInMotionPlay.hidden = false; });
    workInMotionVideo.addEventListener('ended', function () {
      workInMotionPlay.hidden = false;
      workInMotionPlay.setAttribute('aria-label', 'Replay film');
    });
    workInMotionVideo.addEventListener('error', function () {
      workInMotionPlay.hidden = false;
      showWorkInMotionFailure('The film could not load. You can still explore the projects below.');
    });

    function pauseWorkInMotion() {
      if (pendingFilmState) pendingFilmState.playing = false;
      workInMotionVideo.pause();
    }

    var filmObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];
      if (entry.intersectionRatio < 0.1) pauseWorkInMotion();
      if (entry.intersectionRatio >= 0.6 && !filmAutoAttempted && !document.hidden &&
          !filmReducedMotion.matches && !(navigator.connection && navigator.connection.saveData)) {
        activateWorkInMotion(false);
      }
    }, { threshold: [0, 0.1, 0.6], rootMargin: '-56px 0px 0px' });
    filmObserver.observe(workInMotionPlayer.querySelector('[data-work-in-motion-media]'));
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pauseWorkInMotion();
    });
    filmReducedMotion.addEventListener('change', function () {
      if (filmReducedMotion.matches) pauseWorkInMotion();
    });
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
            var active = href === '#' + activeId;
            link.classList.toggle('active', active);
            if (active) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
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
