/* =========================================================
   grid.js · 商品网格（虚拟滚动）
   9000+ 商品不会一次性渲染：只渲染视口附近的行，
   首屏 DOM 数量保持在较低水平，滚动时按需替换窗口内容。
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var AppUI = App.ui = App.ui || {};

  var scrollEl = null;
  var sizerEl = null;
  var winEl = null;
  var emptyEl = null;
  var countEl = null;
  var emptyTitle = null;
  var emptyDesc = null;
  var emptyReset = null;

  var all = [];          // 全量商品（规范化后）
  var filtered = [];     // 当前筛选结果
  var byId = {};
  var qty = {};          // 商品 id -> 输入框里的数量

  var view = {
    query: '',
    category: 'all',
    loading: true
  };

  var cols = 4;
  var rowH = 284;
  var gap = 16;
  var pad = 22;
  var padTop = 6;
  var lastWidth = -1;
  var lastStart = -1;
  var lastEnd = -1;
  var scrollRaf = 0;
  var resizeTimer = 0;

  /* ---------------- 数据规范化 ---------------- */
  function prepare(raw) {
    if (!Array.isArray(raw)) return [];
    var out = [];
    var catNameOf = AppUI.categories ? AppUI.categories.nameOf : function () { return ''; };

    for (var i = 0; i < raw.length; i++) {
      var p = raw[i];
      if (!p || typeof p !== 'object') continue;

      var price = Math.round(Number(p.price));
      if (!isFinite(price) || price <= 0) continue;

      var cat = String(p.category || '');
      var catName = catNameOf(cat);
      var tags = Array.isArray(p.tags) ? p.tags.join(' ') : '';

      out.push({
        id: String(p.id != null ? p.id : ('idx-' + i)),
        name: String(p.name || '未命名商品'),
        category: cat,
        sub: String(p.sub || ''),
        price: price,
        emoji: String(p.emoji || ''),
        _s: (String(p.name || '') + ' ' + String(p.sub || '') + ' ' + catName + ' ' + tags).toLowerCase()
      });
    }
    return out;
  }

  /* ---------------- 布局参数 ---------------- */
  function measure(force) {
    if (!scrollEl) return;
    var w = scrollEl.clientWidth;
    if (!force && w === lastWidth) return;
    lastWidth = w;

    var cs = getComputedStyle(scrollEl);
    pad = parseFloat(cs.getPropertyValue('--pad')) || 22;
    padTop = parseFloat(cs.getPropertyValue('--pad-top')) || 6;
    gap = parseFloat(cs.getPropertyValue('--card-gap')) || 16;
    var cardH = parseFloat(cs.getPropertyValue('--card-h')) || 268;
    rowH = cardH + gap;

    var avail = Math.max(120, w - pad * 2);
    var minW = w < 620 ? 148 : 220;
    cols = Math.max(1, Math.min(6, Math.floor((avail + gap) / (minW + gap))));

    if (winEl) winEl.style.setProperty('--cols', String(cols));
  }

  /* ---------------- 卡片模板 ---------------- */
  function cardHtml(p) {
    var t = App.theme;
    var emoji = t.emojiFor(p);
    var catName = AppUI.categories.nameOf(p.category) || p.category || '商品';
    var price = App.economy.cardPrice(p.price);
    var n = qty[p.id];
    if (!n || n < 1) n = 1;

    var over = p.price * n > App.store.state().balance;

    return '<article class="p-card' + (over ? ' is-over' : '') + '" data-id="' + t.esc(p.id) + '">' +
        '<div class="p-thumb" style="' + t.gradientVars(p.category) + '">' +
          '<span class="p-cat">' + t.esc(catName) + '</span>' +
          '<span class="p-emoji">' + (emoji ? t.esc(emoji) : t.fallbackSvg()) + '</span>' +
        '</div>' +
        '<h3 class="p-name" title="' + t.esc(p.name + ' · ' + catName) + '">' + t.esc(p.name) + '</h3>' +
        '<div class="p-price" title="' + t.esc(price.exact || '') + '">' + price.text + '</div>' +
        '<div class="p-actions">' +
          '<div class="stepper">' +
            '<button type="button" data-act="minus" aria-label="减少购买数量">−</button>' +
            '<input class="qty" type="text" inputmode="numeric" maxlength="7" value="' + n + '" aria-label="购买数量">' +
            '<button type="button" data-act="plus" aria-label="增加购买数量">+</button>' +
          '</div>' +
          '<button type="button" class="buy" data-act="buy">购买</button>' +
        '</div>' +
      '</article>';
  }

  function skeletonHtml(count) {
    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<div class="p-card p-card--skeleton">' +
          '<div class="sk sk-thumb"></div>' +
          '<div class="sk sk-line mid"></div>' +
          '<div class="sk sk-line short"></div>' +
          '<div class="sk sk-line price"></div>' +
          '<div class="sk sk-actions"></div>' +
        '</div>';
    }
    return html;
  }

  /* ---------------- 渲染 ---------------- */
  function layout(force) {
    if (!scrollEl || !winEl) return;
    if (view.loading) return;

    measure(false);

    var total = filtered.length;

    if (!total) {
      emptyEl.hidden = false;
      winEl.innerHTML = '';
      winEl.classList.add('is-static');
      winEl.style.transform = 'none';
      sizerEl.style.height = '100%';
      lastStart = lastEnd = -1;
      updateEmptyText();
      updateCount();
      return;
    }

    emptyEl.hidden = true;
    winEl.classList.remove('is-static');

    var totalRows = Math.ceil(total / cols);
    var contentH = padTop + totalRows * rowH - gap + 36;
    sizerEl.style.height = Math.max(contentH, scrollEl.clientHeight) + 'px';

    var vh = scrollEl.clientHeight;
    var st = scrollEl.scrollTop;

    // 只渲染视口内的行，并在下方多渲染一行作为缓冲，控制首屏 DOM 数量
    var firstRow = Math.max(0, Math.floor((st - padTop) / rowH));
    var lastRow = Math.min(totalRows - 1, Math.floor((st + vh - padTop) / rowH) + 1);

    var start = firstRow * cols;
    var end = Math.min(total, (lastRow + 1) * cols);

    winEl.style.transform = 'translateY(' + (padTop + firstRow * rowH) + 'px)';

    if (!force && start === lastStart && end === lastEnd) return;

    lastStart = start;
    lastEnd = end;

    var html = '';
    for (var i = start; i < end; i++) {
      html += cardHtml(filtered[i]);
    }
    winEl.innerHTML = html;

    updateCount();
  }

  function updateCount() {
    if (!countEl) return;

    if (view.loading) {
      countEl.innerHTML = '商品库加载中 <span class="loading-dots"><i></i><i></i><i></i></span>';
      return;
    }

    var total = filtered.length;
    if (!total) {
      countEl.textContent = '没有匹配的商品';
      return;
    }

    if (view.query) {
      countEl.innerHTML = '找到 <b>' + total.toLocaleString('zh-CN') + '</b> 件 · 「' +
        App.theme.esc(view.query) + '」';
    } else if (view.category !== 'all') {
      var name = AppUI.categories.nameOf(view.category) || '分类';
      countEl.innerHTML = App.theme.esc(name) + ' · <b>' + total.toLocaleString('zh-CN') + '</b> 件商品';
    } else {
      countEl.innerHTML = '共 <b>' + total.toLocaleString('zh-CN') + '</b> 件可买商品';
    }
  }

  function updateEmptyText() {
    if (!emptyTitle || !emptyDesc) return;

    if (!all.length) {
      emptyTitle.textContent = '商品库还在路上';
      emptyDesc.textContent = '商品数据尚未加载完成，请稍后刷新页面再试。';
      return;
    }

    if (view.query) {
      emptyTitle.textContent = '没有找到「' + view.query + '」';
      emptyDesc.textContent = '试试更短的关键词，比如「iPhone」「火箭」「榴莲」，或者切换分类看看。';
    } else if (view.category !== 'all') {
      emptyTitle.textContent = '这个分类暂时没有商品';
      emptyDesc.textContent = '换一个分类，或者看看全部商品吧。';
    } else {
      emptyTitle.textContent = '暂时没有可购买的商品';
      emptyDesc.textContent = '商品库可能是空的，生成数据后刷新页面即可。';
    }
  }

  /* ---------------- 筛选 ---------------- */
  function applyFilter(resetScroll) {
    var tokens = view.query ? view.query.split(/\s+/) : [];

    if (!tokens.length && view.category === 'all') {
      filtered = all;
    } else {
      var res = [];
      for (var i = 0; i < all.length; i++) {
        var p = all[i];
        if (view.category !== 'all' && p.category !== view.category) continue;

        var hit = true;
        for (var j = 0; j < tokens.length; j++) {
          if (p._s.indexOf(tokens[j]) === -1) {
            hit = false;
            break;
          }
        }
        if (hit) res.push(p);
      }
      filtered = res;
    }

    if (resetScroll !== false && scrollEl) scrollEl.scrollTop = 0;
    lastStart = lastEnd = -1;
    layout(true);
  }

  /* ---------------- 交互 ---------------- */
  function setQty(id, n, card) {
    qty[id] = n;

    if (!card) return;
    var p = byId[id];
    if (!p) return;

    var over = p.price * n > App.store.state().balance;
    card.classList.toggle('is-over', over);
  }

  function failTip(res, p) {
    if (res.reason === 'insufficient') {
      // 直接告诉玩家按当前余额还能买几件，比丢一串天文数字更友好
      var affordable = p ? Math.floor(App.store.state().balance / p.price) : 0;
      AppUI.toast.error(
        '余额不够啦',
        affordable > 0
          ? '按现在的余额，这件最多还能买 ' + affordable.toLocaleString('zh-CN') + ' 件。少买几件试试？'
          : '余额已经买不起这件商品了，先去清单里卖点东西回血吧。'
      );
    } else if (res.reason === 'too-many') {
      AppUI.toast.error('数量太多啦', '单次最多购买 ' + res.max.toLocaleString('zh-CN') + ' 件，可以分多次下单。');
    } else {
      AppUI.toast.error('数量无效', '请输入 1 以上的整数件数。');
    }
  }

  function buy(id, card, btn) {
    var p = byId[id];
    if (!p) return;

    var input = card.querySelector('.qty');
    var n = parseInt(input ? input.value : '1', 10);
    if (!isFinite(n) || n < 1) n = 1;

    var res = App.economy.purchase(p, n);

    if (!res.ok) {
      failTip(res, p);
      App.motion.shake(card);
      if (input) {
        input.value = String(n);
      }
      return;
    }

    // 成功：数量归 1，并做一次金额飘字
    qty[id] = 1;
    if (input) input.value = '1';
    card.classList.remove('is-over');

    if (btn && btn.getBoundingClientRect) {
      var r = btn.getBoundingClientRect();
      App.motion.floatCost(r.left + r.width / 2, r.top + 6, '−' + App.economy.fmt(res.cost));
    }
  }

  function onWindowClick(e) {
    var actEl = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!actEl) return;

    var card = actEl.closest('.p-card');
    if (!card) return;

    var id = card.getAttribute('data-id');
    var act = actEl.getAttribute('data-act');
    var input = card.querySelector('.qty');
    if (!input) return;

    if (act === 'minus' || act === 'plus') {
      var n = parseInt(input.value, 10);
      if (!isFinite(n) || n < 1) n = 1;

      n += act === 'plus' ? 1 : -1;
      if (n < 1) n = 1;
      if (n > App.economy.MAX_QTY) n = App.economy.MAX_QTY;

      input.value = String(n);
      setQty(id, n, card);
      return;
    }

    if (act === 'buy') {
      buy(id, card, actEl);
    }
  }

  function onWindowInput(e) {
    var input = e.target;
    if (!input || !input.classList || !input.classList.contains('qty')) return;

    var card = input.closest('.p-card');
    if (!card) return;

    var id = card.getAttribute('data-id');
    var cleaned = String(input.value || '').replace(/[^\d]/g, '');
    if (cleaned !== input.value) input.value = cleaned;

    var n = parseInt(cleaned, 10);
    setQty(id, isFinite(n) && n > 0 ? n : 1, card);
  }

  function onWindowFocusIn(e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains('qty')) {
      setTimeout(function () {
        try { t.select(); } catch (err) { /* 忽略 */ }
      }, 0);
    }
  }

  function onWindowKeyDown(e) {
    if (e.key !== 'Enter') return;
    var t = e.target;
    if (!t || !t.classList || !t.classList.contains('qty')) return;

    var card = t.closest('.p-card');
    if (!card) return;
    var btn = card.querySelector('.buy');
    buy(card.getAttribute('data-id'), card, btn);
  }

  function onWindowBlur(e) {
    var t = e.target;
    if (!t || !t.classList || !t.classList.contains('qty')) return;

    var card = t.closest('.p-card');
    if (!card) return;

    var n = parseInt(t.value, 10);
    if (!isFinite(n) || n < 1) n = 1;
    if (n > App.economy.MAX_QTY) n = App.economy.MAX_QTY;

    t.value = String(n);
    setQty(card.getAttribute('data-id'), n, card);
  }

  /* ---------------- 对外 ---------------- */
  function setProducts(raw) {
    all = prepare(raw);
    byId = {};
    for (var i = 0; i < all.length; i++) {
      byId[all[i].id] = all[i];
    }

    view.loading = false;
    winEl.classList.remove('is-static');
    measure(true);
    applyFilter();
  }

  function setLoading() {
    view.loading = true;
    if (!winEl) return;

    measure(true);
    winEl.classList.add('is-static');
    winEl.style.transform = 'none';
    sizerEl.style.height = 'auto';
    emptyEl.hidden = true;
    winEl.innerHTML = skeletonHtml(Math.max(6, Math.min(cols * 3, 15)));
    updateCount();
  }

  /** 商品数据长时间未就绪时的友好占位 */
  function showPlaceholder(title, desc) {
    view.loading = true;
    if (!winEl) return;

    winEl.classList.add('is-static');
    winEl.style.transform = 'none';
    sizerEl.style.height = 'auto';
    emptyEl.hidden = true;
    winEl.innerHTML =
      '<div class="grid-placeholder">' +
        '<div class="gp-emoji">🛍️</div>' +
        '<h3>' + App.theme.esc(title) + '</h3>' +
        '<p>' + App.theme.esc(desc) + '</p>' +
      '</div>';
    if (countEl) countEl.textContent = '商品库加载中…';
  }

  function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(function () {
      scrollRaf = 0;
      if (!view.loading) layout(false);
    });
  }

  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resizeTimer = 0;
      measure(true);
      lastStart = lastEnd = -1;
      layout(true);
    }, 140);
  }

  /** 余额变化后刷新「余额不足」高亮（不重建卡片，保留输入框焦点） */
  function refreshBalance() {
    if (!winEl) return;
    var s = App.store.state();
    var cards = winEl.querySelectorAll('.p-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var p = byId[card.getAttribute('data-id')];
      if (!p) continue;
      var input = card.querySelector('.qty');
      var n = input ? parseInt(input.value, 10) : 1;
      if (!isFinite(n) || n < 1) n = 1;
      card.classList.toggle('is-over', p.price * n > s.balance);
    }
  }

  function init() {
    scrollEl = document.getElementById('grid-scroll');
    sizerEl = document.getElementById('grid-sizer');
    winEl = document.getElementById('grid-window');
    emptyEl = document.getElementById('grid-empty');
    countEl = document.getElementById('result-count');
    emptyTitle = document.getElementById('empty-title');
    emptyDesc = document.getElementById('empty-desc');
    emptyReset = document.getElementById('empty-reset');

    if (!scrollEl || !winEl) return;

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    winEl.addEventListener('click', onWindowClick);
    winEl.addEventListener('input', onWindowInput);
    winEl.addEventListener('focusin', onWindowFocusIn);
    winEl.addEventListener('keydown', onWindowKeyDown);
    winEl.addEventListener('blur', onWindowBlur, true);

    if (emptyReset) {
      emptyReset.addEventListener('click', function () {
        if (AppUI.search) AppUI.search.reset();
        view.query = '';
        view.category = 'all';
        if (AppUI.categories) AppUI.categories.setActive('all');
        applyFilter();
      });
    }

    App.bus.on('filter:query', function (q) {
      view.query = String(q || '').trim().toLowerCase();
      applyFilter();
    });

    App.bus.on('filter:category', function (id) {
      view.category = id || 'all';
      applyFilter();
    });

    App.bus.on('state:change', refreshBalance);

    measure(true);
    setLoading();
  }

  AppUI.grid = {
    init: init,
    setProducts: setProducts,
    setLoading: setLoading,
    showPlaceholder: showPlaceholder,
    refresh: function () { layout(true); },
    refreshBalance: refreshBalance,
    counts: function () {
      return { all: all.length, filtered: filtered.length, rendered: winEl ? winEl.children.length : 0 };
    }
  };
})();
