/* =========================================================
   achievements.js · 成就系统
   成就一旦解锁就永久保留（卖出退款不会取消已解锁成就）
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;

  /** 统计清单中名称匹配某个正则的件数（用于「1000 台 iPhone」这类成就） */
  function unitsByName(items, re) {
    var n = 0;
    for (var id in items) {
      if (!Object.prototype.hasOwnProperty.call(items, id)) continue;
      if (re.test(items[id].name)) n += items[id].count;
    }
    return n;
  }

  function catUnits(state, cat) {
    return state.catUnits[cat] || 0;
  }

  var LIST = [
    {
      id: 'spend_1e8', icon: '💸', title: '小试牛刀',
      desc: '累计花掉 1 亿元',
      test: function (s) { return s.spent >= 1e8; }
    },
    {
      id: 'spend_1e9', icon: '💰', title: '十亿俱乐部',
      desc: '累计花掉 10 亿元',
      test: function (s) { return s.spent >= 1e9; }
    },
    {
      id: 'spend_1e10', icon: '🏦', title: '百亿玩家',
      desc: '累计花掉 100 亿元',
      test: function (s) { return s.spent >= 1e10; }
    },
    {
      id: 'spend_1e11', icon: '👑', title: '千亿级挥霍',
      desc: '累计花掉 1000 亿元',
      test: function (s) { return s.spent >= 1e11; }
    },
    {
      id: 'spend_1e12', icon: '🌌', title: '万亿散财童子',
      desc: '累计花掉 1 万亿元',
      test: function (s) { return s.spent >= 1e12; }
    },
    {
      id: 'iphone_1000', icon: '📱', title: '果粉毕业',
      desc: '累计买下 1000 台 iPhone',
      test: function (s) { return unitsByName(s.items, /iphone/i) >= 1000; }
    },
    {
      id: 'rocket_1', icon: '🚀', title: '我要上天',
      desc: '买下一枚火箭',
      test: function (s) { return catUnits(s, 'rockets') >= 1; }
    },
    {
      id: 'jet_1', icon: '✈️', title: '私人航空',
      desc: '买下一架私人飞机',
      test: function (s) { return catUnits(s, 'jets') >= 1; }
    },
    {
      id: 'island_1', icon: '🏝️', title: '岛主本人',
      desc: '买下一座海岛',
      test: function (s) { return catUnits(s, 'islands') >= 1; }
    },
    {
      id: 'home_1', icon: '🏡', title: '有房一族',
      desc: '买下一套豪宅',
      test: function (s) { return catUnits(s, 'homes') >= 1; }
    },
    {
      id: 'cars_10', icon: '🚗', title: '车库不够停',
      desc: '累计买下 10 辆汽车',
      test: function (s) { return catUnits(s, 'cars') >= 10; }
    },
    {
      id: 'units_10000', icon: '📦', title: '囤货狂魔',
      desc: '累计买下 10000 件商品',
      test: function (s) { return s.stats.units >= 10000; }
    },
    {
      id: 'orders_100', icon: '🧾', title: '下单达人',
      desc: '完成 100 次下单',
      test: function (s) { return s.stats.orders >= 100; }
    }
  ];

  /**
   * 检查并解锁成就
   * @returns {Array} 本次新解锁的成就定义
   */
  function check() {
    var s = App.store.state();
    var fresh = [];

    for (var i = 0; i < LIST.length; i++) {
      var def = LIST[i];
      if (s.achievements[def.id]) continue;

      var passed = false;
      try {
        passed = !!def.test(s);
      } catch (e) {
        passed = false;
      }

      if (passed) {
        s.achievements[def.id] = Date.now();
        fresh.push(def);
      }
    }

    if (fresh.length) {
      App.store.save();
      for (var j = 0; j < fresh.length; j++) {
        App.bus.emit('achievement', fresh[j]);
      }
    }
    return fresh;
  }

  App.achievements = {
    LIST: LIST,
    check: check,
    unlockedCount: function () {
      return Object.keys(App.store.state().achievements).length;
    }
  };
})();
