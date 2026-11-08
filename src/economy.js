/* =========================================================
   economy.js · 资金与交易
   - 余额扣减 / 退款
   - 金额格式化（完整数字 + 亿/万亿缩写）
   - 交易上限保护
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var TOTAL = App.store.TOTAL;

  // 单次最多购买件数（防止误输入天量数字）
  var MAX_QTY = 9999999;

  function toInt(n) {
    var v = Math.round(Number(n));
    return isFinite(v) ? v : 0;
  }

  /* ---------------- 格式化 ---------------- */

  /** 千分位完整金额：¥1,234,567 */
  function fmt(n) {
    return '¥' + toInt(n).toLocaleString('zh-CN');
  }

  /** 纯数字千分位：1,234,567 */
  function fmtNum(n) {
    return toInt(n).toLocaleString('zh-CN');
  }

  function trimFixed(x) {
    return x >= 100 ? String(Math.round(x)) : x.toFixed(2).replace(/\.?0+$/, '');
  }

  /** 中文缩写：2.9万亿 / 12.5亿 / 3.2万 */
  function compact(n) {
    n = Math.max(0, toInt(n));
    if (n >= 1e12) return trimFixed(n / 1e12) + '万亿';
    if (n >= 1e8) return trimFixed(n / 1e8) + '亿';
    if (n >= 1e4) return trimFixed(n / 1e4) + '万';
    return n.toLocaleString('zh-CN');
  }

  /** 消费百分比：极小值保留 4 位小数，避免一直是 0.00% */
  function percent(spent) {
    var p = (Number(spent) || 0) / TOTAL * 100;
    if (p <= 0) return '0%';
    if (p < 0.01) return p.toFixed(4) + '%';
    if (p < 1) return p.toFixed(3) + '%';
    return p.toFixed(2) + '%';
  }

  /** 商品卡片价格：大额用亿/万亿缩写，返回精确值做 title */
  function cardPrice(price) {
    var p = Math.max(0, toInt(price));
    if (p >= 1e6) {
      return { text: compact(p), exact: fmt(p), compacted: true };
    }
    return { text: p.toLocaleString('zh-CN'), exact: '', compacted: false };
  }

  /* ---------------- 统计 ---------------- */

  function totalUnits() {
    var items = App.store.state().items;
    var n = 0;
    for (var id in items) {
      if (Object.prototype.hasOwnProperty.call(items, id)) n += items[id].count;
    }
    return n;
  }

  function totalValue() {
    var items = App.store.state().items;
    var sum = 0;
    for (var id in items) {
      if (Object.prototype.hasOwnProperty.call(items, id)) sum += items[id].price * items[id].count;
    }
    return sum;
  }

  /* ---------------- 交易 ---------------- */

  /**
   * 购买商品
   * @param {Object} product 商品对象（来自 MUSK_PRODUCTS）
   * @param {number} qty 数量
   * @returns {Object} { ok, reason?, cost?, qty?, item?, orderNo?, ... }
   */
  function purchase(product, qty) {
    var s = App.store.state();
    var n = Math.floor(Number(qty));

    if (!product || typeof product !== 'object') {
      return { ok: false, reason: 'invalid' };
    }
    if (!isFinite(n) || n < 1) {
      return { ok: false, reason: 'invalid', min: 1 };
    }
    if (n > MAX_QTY) {
      return { ok: false, reason: 'too-many', max: MAX_QTY };
    }

    var price = Math.max(0, toInt(product.price));
    if (price <= 0) {
      return { ok: false, reason: 'invalid' };
    }

    var cost = price * n;
    if (cost > s.balance) {
      return {
        ok: false,
        reason: 'insufficient',
        cost: cost,
        short: cost - s.balance,
        balance: s.balance
      };
    }

    // 扣款
    s.balance -= cost;
    s.spent += cost;
    s.stats.orders += 1;
    s.stats.units += n;

    var cat = String(product.category || '');
    if (cat) s.catUnits[cat] = (s.catUnits[cat] || 0) + n;

    // 聚合到清单（同一商品累加件数）
    var id = String(product.id || ('p-' + price + '-' + String(product.name || '')));
    var item = s.items[id];
    if (!item) {
      item = {
        id: id,
        name: String(product.name || '未知商品'),
        price: price,
        emoji: String(product.emoji || '🎁'),
        category: cat,
        sub: String(product.sub || ''),
        count: 0,
        updatedAt: 0
      };
      s.items[id] = item;
    }
    item.count += n;
    item.updatedAt = Date.now();

    App.store.save();

    var payload = {
      product: product,
      item: item,
      qty: n,
      cost: cost,
      unitPrice: price,
      balance: s.balance,
      orderNo: s.stats.orders
    };

    App.bus.emit('state:change', { source: 'purchase', payload: payload });
    App.bus.emit('purchase', payload);
    return { ok: true, cost: cost, qty: n, item: item, balance: s.balance, orderNo: s.stats.orders };
  }

  /**
   * 卖出某商品（按原单价退款）
   * @returns {Object} { ok, reason?, refund?, qty?, remain? }
   */
  function sell(productId, qty) {
    var s = App.store.state();
    var item = s.items[productId];
    if (!item) return { ok: false, reason: 'missing' };

    var n = Math.floor(Number(qty));
    if (!isFinite(n) || n < 1) n = 1;
    if (n > item.count) n = item.count;

    var refund = item.price * n;
    item.count -= n;
    if (item.count <= 0) delete s.items[productId];

    s.balance += refund;
    s.spent = Math.max(0, s.spent - refund);
    if (s.stats.units >= n) s.stats.units -= n;

    var cat = item.category;
    if (cat && s.catUnits[cat]) {
      s.catUnits[cat] = Math.max(0, s.catUnits[cat] - n);
    }

    App.store.save();

    var payload = {
      item: item,
      qty: n,
      refund: refund,
      balance: s.balance,
      remain: item.count
    };
    App.bus.emit('state:change', { source: 'sell', payload: payload });
    App.bus.emit('sell', payload);
    return { ok: true, refund: refund, qty: n, remain: item.count };
  }

  /** 卖光某个商品 */
  function sellAll(productId) {
    var item = App.store.state().items[productId];
    if (!item) return { ok: false, reason: 'missing' };
    return sell(productId, item.count);
  }

  /** 清空清单：所有物品按原价退回资金 */
  function clearAll() {
    var s = App.store.state();
    var refund = totalValue();
    var types = Object.keys(s.items).length;

    s.items = {};
    s.catUnits = {};
    s.balance = Math.min(TOTAL, s.balance + refund);
    s.spent = Math.max(0, s.spent - refund);
    s.stats.units = 0;

    App.store.save();
    App.bus.emit('state:change', { source: 'clear', payload: { refund: refund, types: types } });
    return { ok: true, refund: refund, types: types };
  }

  App.economy = {
    MAX_QTY: MAX_QTY,
    fmt: fmt,
    fmtNum: fmtNum,
    compact: compact,
    percent: percent,
    cardPrice: cardPrice,
    totalUnits: totalUnits,
    totalValue: totalValue,
    purchase: purchase,
    sell: sell,
    sellAll: sellAll,
    clearAll: clearAll
  };
})();
