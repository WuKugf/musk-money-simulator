/* =========================================================
   categories.js · 分类标签栏（含「全部」）
   分类元数据优先使用 window.MUSK_CATEGORIES；
   数据未就绪时使用与数据契约一致的内置兜底列表，保证页面可用。
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var AppUI = App.ui = App.ui || {};

  // 与数据契约完全一致的内置兜底（仅用于商品库尚未加载时占位渲染）
  var FALLBACK = [
    { id: 'digital',    name: '数码电子', emoji: '📱' },
    { id: 'snacks',     name: '零食饮品', emoji: '🍬' },
    { id: 'fresh',      name: '生鲜水果', emoji: '🍉' },
    { id: 'toys',       name: '玩具潮玩', emoji: '🧸' },
    { id: 'daily',      name: '日常百货', emoji: '🧺' },
    { id: 'clothing',   name: '衣物球鞋', emoji: '👟' },
    { id: 'appliances', name: '家电',     emoji: '🔌' },
    { id: 'cars',       name: '汽车',     emoji: '🚗' },
    { id: 'homes',      name: '豪宅',     emoji: '🏡' },
    { id: 'jets',       name: '私人飞机', emoji: '✈️' },
    { id: 'rockets',    name: '火箭',     emoji: '🚀' },
    { id: 'islands',    name: '海岛',     emoji: '🏝️' }
  ];

  var list = [];
  var nameMap = {};
  var navEl = null;
  var active = 'all';

  function normalize(raw) {
    var source = Array.isArray(raw) && raw.length ? raw : FALLBACK;
    var seen = {};
    var out = [];
    source.forEach(function (c) {
      if (!c || !c.id) return;
      if (seen[c.id]) return;
      seen[c.id] = true;
      out.push({
        id: String(c.id),
        name: String(c.name || c.id),
        emoji: String(c.emoji || '✦')
      });
    });
    return out;
  }

  function render() {
    if (!navEl) return;
    var html = '<button type="button" class="cat' + (active === 'all' ? ' is-active' : '') +
      '" data-cat="all"><span class="cat-emoji">✦</span>全部</button>';

    list.forEach(function (c) {
      html += '<button type="button" class="cat' + (active === c.id ? ' is-active' : '') +
        '" data-cat="' + App.theme.esc(c.id) + '">' +
        '<span class="cat-emoji">' + c.emoji + '</span>' +
        App.theme.esc(c.name) +
        '</button>';
    });

    navEl.innerHTML = html;
  }

  function setActive(id) {
    active = id || 'all';
    if (!navEl) return;
    var buttons = navEl.querySelectorAll('.cat');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('is-active', buttons[i].getAttribute('data-cat') === active);
    }
  }

  function init(rawCategories) {
    navEl = document.getElementById('cats');
    list = normalize(rawCategories);
    nameMap = {};
    list.forEach(function (c) { nameMap[c.id] = c; });

    if (navEl) {
      navEl.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.cat') : null;
        if (!btn) return;
        var id = btn.getAttribute('data-cat') || 'all';
        if (id === active) return;
        setActive(id);
        App.bus.emit('filter:category', id);
      });
    }

    render();
  }

  AppUI.categories = {
    FALLBACK: FALLBACK,
    init: init,
    setActive: setActive,
    list: function () { return list.slice(); },
    nameOf: function (id) {
      return nameMap[id] ? nameMap[id].name : '';
    }
  };
})();
