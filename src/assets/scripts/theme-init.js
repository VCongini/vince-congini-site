(function () {
  'use strict';

  var documentElement = document.documentElement;
  documentElement.classList.add('js-enabled');

  try {
    var theme = window.localStorage.getItem('theme');

    if (theme === 'light' || theme === 'dark') {
      documentElement.setAttribute('data-theme', theme);
    }
  } catch (error) {
    // Theme preference is optional when storage is unavailable.
  }
}());
