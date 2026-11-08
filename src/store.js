/* =========================================================
   store.js · 全局命名空间 / 事件总线 / 存档读写
   所有模块都通过 window.App 通信（不使用 ES Module）
   ========================================================= */
(function () {
  'use strict';

  var App = window.App = window.App || {};

  /* ---------------- 极简事件总线 ---------------- */
  var handlers = {};

  App.bus = {
    on: function (name, fn) {
      if (!handlers[name]) handlers[name] = [];
      handlers[name].push(fn);
      return fn;
    },
    off: function (name, fn) {
      var list = handlers[name];
      if (!list) return;
      var i = list.indexOf(fn);
      if (i > -1) list.splice(i, 1);
    },
    emit: function (name, payload) {
      var list = handlers[name];
      if (!list) return;
      for (var i = 0; i < list.length; i++) {
        try {
          list[i](payload);
        } catch (err) {
          console.error('[bus] 处理事件失败：' + name, err);
        }
      }
    }
  };

  /* ---------------- 常量 ---------------- */
  var KEY = 'musk-money.state.v1';

  // 马斯克身家约 4000 亿美元，按 1 美元 ≈ 7.25 元折算 ≈ 2.9 万亿人民币
  // 纯娱乐设定，不代表任何真实资产
  var TOTAL = 2900000000000;

  /* ---------------- 初始存档 ---------------- */
  function createState() {
    return {
      version: 1,
      balance: TOTAL,
      spent: 0,
      // 商品 id -> { id, name, price, emoji, category, sub, count, updatedAt }
      items: {},
      // 成就 id -> 解锁时间戳
      achievements: {},
      stats: { orders: 0, units: 0 },
      // 分类 id -> 累计购买件数
      catUnits: {},
      introSeen: false,
      createdAt: Date.now()
    };
  }

  /* ---------------- 存档校验（防止旧数据/坏数据把页面搞崩） ---------------- */
  function normalize(raw) {
    var s = createState();
    if (!raw || typeof raw !== 'object') return s;

    s.balance = Number(raw.balance);
    s.spent = Number(raw.spent);
    if (!isFinite(s.balance) || s.balance < 0) s.balance = TOTAL;
    if (!isFinite(s.spent) || s.spent < 0) s.spent = Math.max(0, TOTAL - s.balance);
    if (s.balance > TOTAL) s.balance = TOTAL;

    if (raw.items && typeof raw.items === 'object') {
      Object.keys(raw.items).forEach(function (id) {
        var it = raw.items[id];
        if (!it || typeof it !== 'object') return;
        var count = Math.floor(Number(it.count));
        var price = Math.round(Number(it.price));
        if (!isFinite(count) || count <= 0) return;
        if (!isFinite(price) || price < 0) return;
        s.items[id] = {
          id: id,
          name: String(it.name || '未知商品'),
          price: price,
          emoji: String(it.emoji || '🎁'),
          category: String(it.category || ''),
          sub: String(it.sub || ''),
          count: count,
          updatedAt: Number(it.updatedAt) || Date.now()
        };
      });
    }

    if (raw.achievements && typeof raw.achievements === 'object') {
      s.achievements = raw.achievements;
    }

    if (raw.stats && typeof raw.stats === 'object') {
      s.stats.orders = Math.max(0, Math.floor(Number(raw.stats.orders)) || 0);
      s.stats.units = Math.max(0, Math.floor(Number(raw.stats.units)) || 0);
    }

    if (raw.catUnits && typeof raw.catUnits === 'object') {
      s.catUnits = raw.catUnits;
    }

    s.introSeen = !!raw.introSeen;
    s.createdAt = Number(raw.createdAt) || Date.now();
    return s;
  }

  /* ---------------- 持久化 ---------------- */
  var state = createState();
  var saveTimer = 0;

  function storageAvailable() {
    try {
      var k = '__musk_test__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  var canPersist = storageAvailable();

  function saveNow() {
    if (!canPersist) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[store] 存档写入失败（可能是浏览器隐私模式或空间不足）', e);
    }
  }

  function save() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveTimer = 0;
      saveNow();
    }, 220);
  }

  /* ---------------- 对外接口 ---------------- */
  App.store = {
    KEY: KEY,
    TOTAL: TOTAL,
    state: function () { return state; },
    save: save,
    saveNow: saveNow,
    canPersist: canPersist,

    init: function () {
      if (!canPersist) {
        state = createState();
        return state;
      }
      var raw = null;
      try {
        raw = window.localStorage.getItem(KEY);
      } catch (e) {
        raw = null;
      }
      if (raw) {
        try {
          state = normalize(JSON.parse(raw));
        } catch (e) {
          console.warn('[store] 存档解析失败，已重置为新存档', e);
          state = createState();
        }
      } else {
        state = createState();
      }
      return state;
    },

    reset: function () {
      state = createState();
      saveNow();
      App.bus.emit('state:reset', state);
      App.bus.emit('state:change', { source: 'reset' });
      return state;
    },

    markIntroSeen: function () {
      if (state.introSeen) return;
      state.introSeen = true;
      save();
    }
  };
})();
