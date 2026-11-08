/* =========================================================
   modal.js · 弹窗（二次确认 / 首次进入提示）
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var AppUI = App.ui = App.ui || {};
  var layer = null;
  var current = null;

  function ensureLayer() {
    if (!layer) layer = document.getElementById('modal-layer');
    return layer;
  }

  function esc(str) {
    return App.theme.esc(str);
  }

  function close() {
    var host = ensureLayer();
    if (!host || !host.classList.contains('is-open')) return;
    host.classList.remove('is-open');
    host.innerHTML = '';
    current = null;
  }

  /**
   * 打开一个弹窗
   * @param {Object} opts
   *   title      标题
   *   html       正文 HTML
   *   icon       顶部图标（emoji）
   *   actions    [{ text, kind: 'primary'|'ghost'|'danger', onClick, close: true }]
   *   dismissible 点击遮罩是否可关闭（默认 true）
   *   onClose    关闭回调
   * @returns {{close: Function, el: HTMLElement}|null}
   */
  function open(opts) {
    opts = opts || {};
    var host = ensureLayer();
    if (!host) return null;

    close();
    current = { onClose: opts.onClose || null };

    var actions = opts.actions || [{ text: '知道了', kind: 'primary', close: true }];
    var actionsHtml = actions.map(function (a, i) {
      var kind = a.kind || 'ghost';
      return '<button type="button" class="btn btn-' + kind + '" data-i="' + i + '">' + esc(a.text || '确定') + '</button>';
    }).join('');

    host.innerHTML =
      '<div class="modal-backdrop" data-close="1"></div>' +
      '<div class="modal-card" role="dialog" aria-modal="true">' +
        (opts.icon ? '<div class="modal-icon">' + opts.icon + '</div>' : '') +
        '<h3 class="modal-title">' + esc(opts.title || '') + '</h3>' +
        '<div class="modal-body">' + (opts.html || '') + '</div>' +
        '<div class="modal-actions">' + actionsHtml + '</div>' +
      '</div>';

    host.classList.add('is-open');

    var card = host.querySelector('.modal-card');
    if (card) App.motion.popIn(card, { y: 14, duration: 0.32 });

    var dismissible = opts.dismissible !== false;

    host.querySelectorAll('.modal-actions .btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-i'), 10);
        var action = actions[idx];
        if (!action) return;
        var shouldClose = action.close !== false;
        if (action.onClick) action.onClick();
        if (shouldClose) close();
      });
    });

    var backdrop = host.querySelector('.modal-backdrop');
    if (backdrop && dismissible) {
      backdrop.addEventListener('click', close);
    }

    return { close: close, el: host };
  }

  /**
   * 二次确认弹窗
   * @returns {Promise<boolean>} 用户是否确认
   */
  function confirm(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var settled = false;

      function done(value) {
        if (settled) return;
        settled = true;
        resolve(value);
      }

      open({
        icon: opts.icon || '🤔',
        title: opts.title || '确认操作',
        html: opts.html || '',
        dismissible: true,
        onClose: function () { done(false); },
        actions: [
          {
            text: opts.cancelText || '取消',
            kind: 'ghost',
            close: true,
            onClick: function () { done(false); }
          },
          {
            text: opts.okText || '确定',
            kind: opts.danger ? 'danger-soft' : 'primary',
            close: true,
            onClick: function () { done(true); }
          }
        ]
      });
    });
  }

  // ESC 关闭
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  AppUI.modal = {
    open: open,
    confirm: confirm,
    close: close
  };
})();
