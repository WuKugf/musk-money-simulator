/* =========================================================
   app.js · 启动入口
   负责：初始化各模块、加载商品数据、串联购买/成就/重置流程
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var AppUI = App.ui = App.ui || {};

  var POLL_INTERVAL = 600;
  var POLL_MAX = 25; // 约 15 秒

  /* ---------------- 首次进入提示 ---------------- */
  function maybeShowIntro() {
    if (App.store.state().introSeen) return;

    setTimeout(function () {
      var marked = false;
      function mark() {
        if (marked) return;
        marked = true;
        App.store.markIntroSeen();
      }

      var handle = AppUI.modal.open({
        icon: '💸',
        title: '欢迎，你现在有 2.9 万亿',
        html:
          '<p>这是马斯克约 <b>4000 亿美元</b> 身家的虚拟人民币换算（约 <b>2.9 万亿</b>），纯属娱乐设定，不是真实资产。</p>' +
          '<ul>' +
            '<li>顶部搜索或点分类，找到想要的东西</li>' +
            '<li>填数量、点「购买」，余额会实时扣减，还会掉出一张惊喜卡片</li>' +
            '<li>右侧清单可以卖出退款、一键清空，或者重开一局</li>' +
          '</ul>' +
          '<p>所有金额与交易都是虚拟的，不涉及真实支付；进度只保存在本机浏览器。</p>',
        actions: [
          {
            text: '开始花钱',
            kind: 'primary',
            close: true,
            onClick: mark
          }
        ],
        onClose: mark
      });

      if (!handle) mark();
    }, 380);
  }

  /* ---------------- 商品数据加载 ---------------- */
  function loadProducts() {
    var tries = 0;

    function attempt() {
      var list = window.MUSK_PRODUCTS;

      if (Array.isArray(list) && list.length > 0) {
        AppUI.grid.setProducts(list);
        console.info('[花光马斯克的钱] 商品库已加载：' + list.length.toLocaleString('zh-CN') + ' 件');
        return;
      }

      tries += 1;

      if (tries > POLL_MAX) {
        AppUI.grid.showPlaceholder(
          '商品库还在加载中…',
          '如果长时间没有出现商品，请确认 src/data/products.js 已经生成，然后刷新页面。'
        );
        AppUI.toast.info('商品库未就绪', '页面已用占位内容保持可用，商品数据生成后刷新即可。');
        return;
      }

      setTimeout(attempt, POLL_INTERVAL);
    }

    attempt();
  }

  /* ---------------- 重开一局 ---------------- */
  function confirmReset() {
    AppUI.modal.confirm({
      icon: '🔄',
      title: '重开一局？',
      html:
        '<p>余额、购物清单和成就进度都会被清空，恢复到 <b>¥2.9 万亿</b> 初始资产。</p>' +
        '<p>此操作不可撤销。</p>',
      okText: '重开一局',
      cancelText: '继续花钱',
      danger: true
    }).then(function (ok) {
      if (!ok) return;

      App.store.reset();
      AppUI.search.reset();
      AppUI.categories.setActive('all');
      App.bus.emit('filter:category', 'all');
      AppUI.reward.closeAll(true);

      AppUI.toast.success('新的一局开始了', '你又有 ¥2.9 万亿可以花。');
    });
  }

  /* ---------------- 事件串联 ---------------- */
  function wire() {
    // 购买成功 → 惊喜卡片 + 成就检查
    App.bus.on('purchase', function (payload) {
      AppUI.reward.show(payload);

      var fresh = App.achievements.check();
      for (var i = 0; i < fresh.length; i++) {
        AppUI.toast.achievement(fresh[i]);
      }
    });

    // 重置时清掉所有惊喜卡片
    App.bus.on('state:reset', function () {
      AppUI.reward.closeAll(false);
    });

    // 顶部 / 清单里的「重开一局」
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-act="reset"]') : null;
      if (btn) confirmReset();
    });

    // 离开页面前立即落盘，避免防抖丢失最后一次存档
    window.addEventListener('beforeunload', function () {
      App.store.saveNow();
    });
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    App.store.init();

    App.confetti.init();
    AppUI.header.init();
    AppUI.categories.init(window.MUSK_CATEGORIES);
    AppUI.search.init();
    AppUI.grid.init();
    AppUI.reward.init();
    AppUI.cart.init();

    wire();
    loadProducts();
    maybeShowIntro();

    // 方便调试：控制台可查看当前状态与渲染数量
    window.__MUSK__ = {
      state: App.store.state,
      stats: function () { return AppUI.grid.counts(); },
      reset: App.store.reset
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
