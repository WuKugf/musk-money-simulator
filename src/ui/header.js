/* =========================================================
   header.js · 顶部资金面板（余额 / 已花掉 / 消费进度）
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var AppUI = App.ui = App.ui || {};

  var els = {};
  var firstRender = true;

  function fmtMoney(v) {
    return '¥' + Math.round(v).toLocaleString('zh-CN');
  }

  function fmtPercentValue(v) {
    if (v <= 0) return '0%';
    if (v < 0.01) return v.toFixed(4) + '%';
    if (v < 1) return v.toFixed(3) + '%';
    return v.toFixed(2) + '%';
  }

  function render(detail) {
    var s = App.store.state();
    var total = App.store.TOTAL;
    var pct = total > 0 ? (s.spent / total) * 100 : 0;
    var source = detail && detail.source;

    if (firstRender || !App.motion.reduced) {
      // 首次直接落值，首帧不做从 0 滚动的长动画（避免看起来像 bug）
      if (firstRender) {
        App.setNumber(els.balance, s.balance, fmtMoney);
        App.setNumber(els.spent, s.spent, fmtMoney);
        App.setNumber(els.percent, pct, fmtPercentValue);
      } else {
        App.tweenNumber(els.balance, s.balance, { format: fmtMoney, duration: 720 });
        App.tweenNumber(els.spent, s.spent, { format: fmtMoney, duration: 720 });
        App.tweenNumber(els.percent, pct, { format: fmtPercentValue, duration: 720 });
      }
    } else {
      App.setNumber(els.balance, s.balance, fmtMoney);
      App.setNumber(els.spent, s.spent, fmtMoney);
      App.setNumber(els.percent, pct, fmtPercentValue);
    }

    if (els.balanceSub) {
      els.balanceSub.textContent = '≈ ' + App.economy.compact(s.balance) + ' · 初始 2.9 万亿';
    }
    if (els.spentSub) {
      els.spentSub.textContent = s.spent > 0
        ? '≈ ' + App.economy.compact(s.spent) + ' · 共 ' + s.stats.orders + ' 单'
        : '还没有开始花钱';
    }
    if (els.bar) {
      var width = s.spent > 0 ? Math.max(1.2, Math.min(100, pct)) : 0;
      els.bar.style.width = width.toFixed(2) + '%';
    }

    if (!firstRender && source === 'purchase') {
      App.motion.pulse(els.balanceWrap);
    }

    firstRender = false;
  }

  function init() {
    els.balance = document.getElementById('fund-balance');
    els.spent = document.getElementById('fund-spent');
    els.percent = document.getElementById('fund-percent');
    els.balanceSub = document.getElementById('fund-balance-sub');
    els.spentSub = document.getElementById('fund-spent-sub');
    els.bar = document.getElementById('fund-bar');
    els.balanceWrap = els.balance ? els.balance.parentNode : null;

    App.bus.on('state:change', render);
    render();
  }

  AppUI.header = { init: init, render: render };
})();
