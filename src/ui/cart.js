/* =========================================================
   cart.js · 购物清单（聚合统计 / 卖出退款 / 清空 / 移动端抽屉）
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var AppUI = App.ui = App.ui || {};

  var listEl = null;
  var summaryEl = null;
  var totalEl = null;
  var badgeEl = null;
  var overlayEl = null;
  var panelEl = null;

  var INITIAL_LIMIT = 60;
  var showAll = false;

  function sortedItems() {
    var items = App.store.state().items;
    var arr = [];
    for (var id in items) {
      if (Object.prototype.hasOwnProperty.call(items, id)) arr.push(items[id]);
    }
    arr.sort(function (a, b) { return b.updatedAt - a.updatedAt; });
    return arr;
  }

  function rowHtml(it) {
    var t = App.theme;
    var emoji = it.emoji || t.EMOJI[it.category] || '🎁';
    var sub = it.sub || '';
    var catName = AppUI.categories.nameOf(it.category) || '';

    return '<div class="cart-row" data-id="' + t.esc(it.id) + '">' +
        '<div class="cart-row-thumb" style="' + t.gradientVars(it.category) + '">' + t.esc(emoji) + '</div>' +
        '<div class="cart-row-main">' +
          '<div class="cart-row-name" title="' + t.esc(it.name + (sub ? ' · ' + sub : '')) + '">' + t.esc(it.name) + '</div>' +
          '<div class="cart-row-meta">' +
            t.esc(App.economy.fmt(it.price)) + ' × <span class="cart-row-num">' + it.count.toLocaleString('zh-CN') + '</span>' +
            (catName ? ' · ' + t.esc(catName) : '') +
          '</div>' +
        '</div>' +
        '<div class="cart-row-side">' +
          '<div class="cart-row-sub">' + t.esc(App.economy.fmt(it.price * it.count)) + '</div>' +
          '<div class="cart-row-actions">' +
            '<button type="button" class="mini-btn" data-act="sell-one">卖1</button>' +
            '<button type="button" class="mini-btn sell-all" data-act="sell-all">全卖</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function render() {
    if (!listEl) return;

    var s = App.store.state();
    var items = sortedItems();
    var units = App.economy.totalUnits();
    var value = App.economy.totalValue();

    // 顶部与徽标
    if (summaryEl) {
      summaryEl.textContent = items.length
        ? items.length.toLocaleString('zh-CN') + ' 种 · 共 ' + units.toLocaleString('zh-CN') + ' 件'
        : '还没有买东西';
    }
    if (totalEl) {
      App.setNumber(totalEl, value, function (v) {
        return App.economy.fmt(v);
      });
    }
    if (badgeEl) {
      if (units > 0) {
        badgeEl.hidden = false;
        badgeEl.textContent = units > 999 ? '999+' : String(units);
      } else {
        badgeEl.hidden = true;
      }
    }

    // 列表
    if (!items.length) {
      listEl.innerHTML =
        '<div class="cart-empty">' +
          '<div class="ce-emoji">🧾</div>' +
          '<p>清单还空着<br>去左边挑点东西，把马斯克的钱花掉吧</p>' +
        '</div>';
      showAll = false;
      return;
    }

    var visible = showAll ? items : items.slice(0, INITIAL_LIMIT);
    var html = visible.map(rowHtml).join('');

    if (!showAll && items.length > INITIAL_LIMIT) {
      html += '<button type="button" class="cart-more" data-act="show-all">还有 ' +
        (items.length - INITIAL_LIMIT).toLocaleString('zh-CN') + ' 种，显示全部</button>';
    }

    listEl.innerHTML = html;
  }

  function openDrawer() {
    document.body.classList.add('cart-open');
    if (overlayEl) overlayEl.hidden = false;
  }

  function closeDrawer() {
    document.body.classList.remove('cart-open');
    if (overlayEl) overlayEl.hidden = true;
  }

  function onListClick(e) {
    var btn = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!btn) return;

    var act = btn.getAttribute('data-act');

    if (act === 'show-all') {
      showAll = true;
      render();
      return;
    }

    var row = btn.closest('.cart-row');
    if (!row) return;

    var id = row.getAttribute('data-id');
    var item = App.store.state().items[id];
    if (!item) return;

    if (act === 'sell-one') {
      var r1 = App.economy.sell(id, 1);
      if (r1.ok) {
        AppUI.toast.success('已卖出 1 件', '退回 ' + App.economy.fmt(r1.refund));
      }
    } else if (act === 'sell-all') {
      var count = item.count;
      var r2 = App.economy.sell(id, count);
      if (r2.ok) {
        AppUI.toast.success('已全部卖出', '共 ' + count.toLocaleString('zh-CN') +
          ' 件，退回 ' + App.economy.fmt(r2.refund));
      }
    }
  }

  function clearCart() {
    var value = App.economy.totalValue();
    var items = sortedItems();
    if (!items.length) {
      AppUI.toast.info('清单是空的', '先去挑点喜欢的商品吧。');
      return;
    }

    var types = items.length;
    var units = App.economy.totalUnits();

    AppUI.modal.confirm({
      icon: '🧾',
      title: '清空购物清单？',
      html: '<p>将把清单里的 <b>' + types + '</b> 种、共 <b>' + units.toLocaleString('zh-CN') +
        '</b> 件商品全部卖回，退回 <b>' + App.economy.fmt(value) + '</b>。</p>' +
        '<p>物品记录会被清空，但已解锁的成就会保留。</p>',
      okText: '清空并退款',
      cancelText: '再想想',
      danger: true
    }).then(function (ok) {
      if (!ok) return;
      var res = App.economy.clearAll();
      showAll = false;
      if (res.ok) {
        AppUI.toast.success('清单已清空', '退回 ' + App.economy.fmt(res.refund));
      }
    });
  }

  function init() {
    listEl = document.getElementById('cart-list');
    summaryEl = document.getElementById('cart-summary');
    totalEl = document.getElementById('cart-total');
    badgeEl = document.getElementById('fab-badge');
    overlayEl = document.getElementById('cart-overlay');
    panelEl = document.getElementById('cart-panel');

    if (listEl) listEl.addEventListener('click', onListClick);

    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!btn) return;

      var act = btn.getAttribute('data-act');
      if (act === 'open-cart') {
        openDrawer();
      } else if (act === 'close-cart') {
        closeDrawer();
      } else if (act === 'clear-cart') {
        clearCart();
      }
    });

    if (overlayEl) overlayEl.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });

    // 点击清单内的商品行时避免误触抽屉关闭
    if (panelEl) {
      panelEl.addEventListener('click', function (e) {
        if (e.target === panelEl) e.stopPropagation();
      });
    }

    App.bus.on('state:change', render);
    App.bus.on('state:reset', function () {
      showAll = false;
      closeDrawer();
      render();
    });

    render();
  }

  AppUI.cart = {
    init: init,
    render: render,
    open: openDrawer,
    close: closeDrawer
  };
})();
