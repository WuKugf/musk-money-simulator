/* =========================================================
   reward.js · 下单惊喜卡片
   - 每次购买成功弹出一张卡片
   - 连续购买会叠成一叠（最多同时 3 张），点击可关闭
   - 带彩带粒子与闪光效果
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var AppUI = App.ui = App.ui || {};

  var layer = null;
  var MAX_VISIBLE = 3;
  var stack = []; // 从旧到新的 slot 元素

  function reflow() {
    for (var i = 0; i < stack.length; i++) {
      var distance = stack.length - 1 - i; // 0 = 最前面的新卡片
      var slot = stack[i];
      slot.classList.remove('is-behind-1', 'is-behind-2');
      slot.style.zIndex = String(10 + i);
      if (distance === 1) slot.classList.add('is-behind-1');
      if (distance >= 2) slot.classList.add('is-behind-2');
    }
  }

  function removeSlot(slot, animate) {
    var idx = stack.indexOf(slot);
    if (idx === -1) return;
    stack.splice(idx, 1);
    reflow();

    if (!animate) {
      if (slot.parentNode) slot.parentNode.removeChild(slot);
      return;
    }

    var card = slot.querySelector('.reward-card');
    App.motion.fadeOut(card, function () {
      if (slot.parentNode) slot.parentNode.removeChild(slot);
    });
  }

  function buildCard(payload) {
    var t = App.theme;
    var product = payload.product || {};
    var catName = AppUI.categories.nameOf(product.category) || product.category || '商品';
    var emoji = t.emojiFor(product);
    var name = product.name || payload.item && payload.item.name || '神秘商品';

    var slot = document.createElement('div');
    slot.className = 'reward-slot';

    slot.innerHTML =
      '<div class="reward-card" role="dialog" aria-label="下单成功">' +
        '<button class="reward-close" type="button" aria-label="关闭卡片">✕</button>' +
        '<div class="reward-kicker">下单成功</div>' +
        '<div class="reward-thumb" style="' + t.gradientVars(product.category) + '">' +
          (emoji ? t.esc(emoji) : t.fallbackSvg()) +
        '</div>' +
        '<div class="reward-name">' + t.esc(name) + '</div>' +
        '<div class="reward-cat">' + t.esc(catName) + (product.sub ? ' · ' + t.esc(product.sub) : '') + '</div>' +
        '<div class="reward-rows">' +
          '<div class="reward-row"><span>单价</span><b>' + t.esc(App.economy.fmt(payload.unitPrice)) + '</b></div>' +
          '<div class="reward-row"><span>数量</span><b>× ' + Number(payload.qty).toLocaleString('zh-CN') + '</b></div>' +
          '<div class="reward-row"><span>余额</span><b>' + t.esc(App.economy.fmt(payload.balance)) + '</b></div>' +
        '</div>' +
        '<div class="reward-total">' +
          '<span class="rt-label">本次花费</span>' +
          '<span class="rt-value">' + t.esc(App.economy.fmt(payload.cost)) + '</span>' +
        '</div>' +
        '<div class="reward-note">第 ' + Number(payload.orderNo || 1).toLocaleString('zh-CN') + ' 单 · 虚拟消费，仅供娱乐</div>' +
      '</div>';

    return slot;
  }

  function show(payload) {
    if (!layer || !payload) return;
    if (!layer.parentNode) layer = document.getElementById('reward-layer');
    if (!layer) return;

    // 超过上限时移除最旧的一张，避免堆叠过高
    while (stack.length >= MAX_VISIBLE) {
      removeSlot(stack[0], true);
    }

    var slot = buildCard(payload);
    layer.appendChild(slot);
    stack.push(slot);
    reflow();

    var card = slot.querySelector('.reward-card');
    App.motion.popIn(card, { y: 26, duration: 0.55 });

    // 彩带从卡片中心爆出
    setTimeout(function () {
      App.confetti.burstFrom(card, { count: 72, power: 1.05 });
    }, 90);

    // 点击卡片任意位置关闭
    slot.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.reward-close')) {
        e.stopPropagation();
      }
      removeSlot(slot, true);
    });
  }

  function closeAll(animate) {
    while (stack.length) {
      removeSlot(stack[stack.length - 1], !!animate);
    }
  }

  function init() {
    layer = document.getElementById('reward-layer');

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && stack.length) {
        removeSlot(stack[stack.length - 1], true);
      }
    });
  }

  AppUI.reward = {
    init: init,
    show: show,
    closeAll: closeAll
  };
})();
