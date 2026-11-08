/* =========================================================
   search.js · 搜索框（150ms 防抖 / 清空 / 结果由 grid 统计）
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var AppUI = App.ui = App.ui || {};

  var input = null;
  var clearBtn = null;
  var timer = 0;
  var lastQuery = '';

  function emit(query) {
    var q = String(query || '').trim();
    if (q === lastQuery) return;
    lastQuery = q;
    App.bus.emit('filter:query', q);
  }

  function syncClear() {
    if (!clearBtn || !input) return;
    clearBtn.hidden = !input.value;
  }

  function init() {
    input = document.getElementById('search-input');
    clearBtn = document.getElementById('search-clear');
    if (!input) return;

    input.addEventListener('input', function () {
      syncClear();
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = 0;
        emit(input.value);
      }, 150);
    });

    // 回车立即搜索，不用等防抖
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (timer) {
          clearTimeout(timer);
          timer = 0;
        }
        emit(input.value);
        input.blur();
      } else if (e.key === 'Escape') {
        reset();
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        reset();
        input.focus();
      });
    }

    syncClear();
  }

  function reset() {
    if (!input) return;
    input.value = '';
    syncClear();
    if (timer) {
      clearTimeout(timer);
      timer = 0;
    }
    lastQuery = '__reset__'; // 强制触发一次重置事件
    emit('');
  }

  AppUI.search = {
    init: init,
    reset: reset,
    value: function () { return input ? input.value : ''; }
  };
})();
