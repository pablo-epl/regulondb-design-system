/* spec.js — minimal vanilla helpers for the static design-system manual.
   Responsibilities:
     - mark current sidebar link active per page
     - theme toggle (auto / light / dark) persisted to localStorage
     - copy-to-clipboard for code blocks
     - show / hide code blocks under each example
*/

(function () {
  'use strict';

  // ----- 1. Active sidebar link
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ----- 2. Theme toggle
  var THEME_KEY = 'rdb-mg-spec-theme';
  function applyTheme(t) {
    var html = document.documentElement;
    if (t === 'dark' || t === 'light') {
      html.setAttribute('data-theme', t);
    } else {
      html.removeAttribute('data-theme');
    }
  }
  var saved = localStorage.getItem(THEME_KEY) || 'auto';
  applyTheme(saved);

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action="theme"]');
    if (!t) return;
    var current = localStorage.getItem(THEME_KEY) || 'auto';
    var next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    t.textContent = 'Theme: ' + next;
  });
  document.querySelectorAll('[data-action="theme"]').forEach(function (b) {
    b.textContent = 'Theme: ' + saved;
  });

  // ----- 3. Code toggle
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action="toggle-code"]');
    if (!btn) return;
    var frame = btn.closest('.card-frame');
    if (!frame) return;
    var code = frame.querySelector('.code');
    if (!code) return;
    var hidden = code.hasAttribute('hidden');
    if (hidden) code.removeAttribute('hidden');
    else        code.setAttribute('hidden', '');
    btn.textContent = hidden ? 'Hide code' : 'Show code';
  });

  // ----- 4. Copy
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action="copy"]');
    if (!btn) return;
    var frame = btn.closest('.card-frame');
    var code = frame && frame.querySelector('.code');
    if (!code) return;
    var text = code.textContent.trim();
    var done = function () {
      var prev = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = prev; }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      ta.remove(); done();
    }
  });
})();
