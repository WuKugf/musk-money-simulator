/* =========================================================
   toast.js · 轻提示 / 成就提示
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var AppUI = App.ui = App.ui || {};
  var layer = null;

  function ensureLayer() {
    if (!layer) layer = document.getElementById('toast-layer');
    return layer;
  }

  function remove(el) {
    if (!el || !el.parentNode) return;
    el.classList.add('is-out');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 230);
  }

  /**
   * 显示一条提示
   * @param {Object} opts { type: 'info'|'error'|'success'|'achievement', icon, title, desc, duration }
   */
  function show(opts) {
    opts = opts || {};
    var host = ensureLayer();
    if (!host) return null;

    // 最多同时显示 4 条，超出时先移除最早的
    while (host.children.length >= 4) {
      host.removeChild(host.children[0]);
    }

    var type = opts.type || 'info';
    var el = document.createElement('div');
    el.className = 'toast toast--' + type;

    var icon = opts.icon || (type === 'error' ? '⚠️' : type === 'success' ? '✅' : type === 'achievement' ? '🏆' : '💡');
    var title = opts.title || '';
    var desc = opts.desc || '';

    el.innerHTML =
      '<div class="toast-icon">' + icon + '</div>' +
      '<div class="toast-body">' +
        '<div class="toast-title">' +
          (type === 'achievement' ? '<em>成就</em>' : '') +
          App.theme.esc(title) +
        '</div>' +
        (desc ? '<div class="toast-desc">' + App.theme.esc(desc) + '</div>' : '') +
      '</div>';

    host.appendChild(el);

    var duration = opts.duration || (type === 'achievement' ? 6000 : 2600);
    var timer = setTimeout(function () { remove(el); }, duration);

    el.addEventListener('click', function () {
      clearTimeout(timer);
      remove(el);
    });

    return el;
  }

  AppUI.toast = {
    show: show,

    info: function (title, desc) {
      return show({ type: 'info', title: title, desc: desc });
    },

    error: function (title, desc) {
      return show({ type: 'error', title: title, desc: desc });
    },

    success: function (title, desc) {
      return show({ type: 'success', title: title, desc: desc });
    },

    /** 成就提示：与惊喜卡片同源风格，但更克制 */
    achievement: function (def) {
      return show({
        type: 'achievement',
        icon: def.icon || '🏆',
        title: def.title,
        desc: '已解锁 · ' + (def.desc || ''),
        duration: 4600
      });
    }
  };
})();
