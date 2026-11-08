/* =========================================================
   theme.js · 分类配色 / 缩略图兜底 / 文本转义
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;

  // 每个分类一组柔和的缩略图渐变（浅色，不抢主体）
  var PALETTE = {
    digital:    ['#EAF1FF', '#D2E1FF'],
    snacks:     ['#FFF1DF', '#FFDDBE'],
    fresh:      ['#E9F9EE', '#CFEFDB'],
    toys:       ['#F2ECFF', '#E0D3FF'],
    daily:      ['#F5F2EB', '#E7E1D3'],
    clothing:   ['#FFEFF3', '#FFDCE5'],
    appliances: ['#E9F7F8', '#CDECEF'],
    cars:       ['#EDF2F7', '#DAE3EE'],
    homes:      ['#FBF3E4', '#F1DFC1'],
    jets:       ['#EDF3FF', '#D8E5FF'],
    rockets:    ['#FFF0E9', '#FFD9C7'],
    islands:    ['#E8F8F2', '#C9EDE0']
  };

  var EMOJI = {
    digital: '📱', snacks: '🍬', fresh: '🍎', toys: '🧸', daily: '🧺',
    clothing: '👟', appliances: '🔌', cars: '🚗', homes: '🏡',
    jets: '✈️', rockets: '🚀', islands: '🏝️'
  };

  function palette(category) {
    return PALETTE[category] || ['#F5F2EB', '#E7E1D3'];
  }

  /** 生成可直接写进 style 的两个渐变端点 */
  function gradientVars(category) {
    var c = palette(category);
    return '--t1:' + c[0] + ';--t2:' + c[1] + ';';
  }

  /** 商品 emoji：优先商品自带，其次分类默认 */
  function emojiFor(product) {
    if (product && product.emoji) return String(product.emoji);
    if (product && EMOJI[product.category]) return EMOJI[product.category];
    return '';
  }

  /** 没有 emoji 时的内联 SVG 兜底（礼盒） */
  function fallbackSvg() {
    return '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">' +
      '<rect x="6" y="16" width="36" height="26" rx="5" fill="rgba(255,255,255,.75)" stroke="rgba(90,70,40,.18)"/>' +
      '<rect x="4" y="11" width="40" height="9" rx="4" fill="rgba(255,255,255,.92)" stroke="rgba(90,70,40,.18)"/>' +
      '<path d="M24 11v31" stroke="rgba(90,70,40,.22)" stroke-width="2.5"/>' +
      '<path d="M24 11c-6 0-9-2.6-9-5.2C15 3.2 17.4 2 19.6 2c3 0 4.4 2.6 4.4 9zm0 0c6 0 9-2.6 9-5.2C33 3.2 30.6 2 28.4 2c-3 0-4.4 2.6-4.4 9z" fill="rgba(255,255,255,.92)" stroke="rgba(90,70,40,.18)"/>' +
      '</svg>';
  }

  /** 转义，避免商品名里的特殊字符破坏 HTML */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  App.theme = {
    PALETTE: PALETTE,
    EMOJI: EMOJI,
    palette: palette,
    gradientVars: gradientVars,
    emojiFor: emojiFor,
    fallbackSvg: fallbackSvg,
    esc: esc
  };
})();
