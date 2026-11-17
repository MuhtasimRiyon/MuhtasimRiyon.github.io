(function () {
  'use strict';

  var storageKey = 'muhtasim-portfolio.theme';
  var root = document.documentElement;

  function applyTheme(theme) {
    theme = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    var button = document.querySelector('.theme-toggle');
    if (button) {
      var nextTheme = theme === 'dark' ? 'light' : 'dark';
      button.setAttribute('aria-label', 'Switch to ' + nextTheme + ' theme');
    }
  }

  // Apply before styles paint; dark stays the default even on a light OS theme.
  var savedTheme;
  try {
    savedTheme = window.localStorage.getItem(storageKey);
  } catch (error) {
    // Switching still works when browser storage is unavailable.
  }
  applyTheme(savedTheme);

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('.theme-toggle');
    if (!button) return;
    applyTheme(root.getAttribute('data-theme'));
    button.hidden = false;
    window.requestAnimationFrame(function () {
      root.classList.add('theme-ready');
    });
    button.addEventListener('click', function () {
      var theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      try {
        window.localStorage.setItem(storageKey, theme);
      } catch (error) {
        // Keep the selected theme for this page without persistent storage.
      }
    });
  });

  window.addEventListener('storage', function (event) {
    if (event.key === storageKey || event.key === null) {
      applyTheme(event.newValue);
    }
  });
})();
