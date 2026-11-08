/* =========================================================
   tween.js · 数字平滑滚动（不依赖 GSAP，保证兜底可用）
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function defaultFormat(v) {
    return Math.round(v).toLocaleString('zh-CN');
  }

  /**
   * 让元素里的数字从当前值平滑滚动到目标值
   * @param {HTMLElement} el 目标元素
   * @param {number} to 目标数字
   * @param {Object} [opts] { format, duration, from }
   */
  function tweenNumber(el, to, opts) {
    if (!el) return;
    opts = opts || {};

    var format = typeof opts.format === 'function' ? opts.format : defaultFormat;
    var target = Number(to) || 0;
    var from = typeof el.__num === 'number' ? el.__num :
      (typeof opts.from === 'number' ? opts.from : target);
    var dur = typeof opts.duration === 'number' ? opts.duration : 620;

    if (el.__raf) {
      cancelAnimationFrame(el.__raf);
      el.__raf = 0;
    }

    if (reduced || dur <= 0) {
      el.__num = target;
      el.textContent = format(target);
      return;
    }

    var startTime = 0;

    function step(now) {
      if (!startTime) startTime = now;
      var t = Math.min(1, (now - startTime) / dur);
      var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      var value = from + (target - from) * eased;

      el.__num = value;
      el.textContent = format(value);

      if (t < 1) {
        el.__raf = requestAnimationFrame(step);
      } else {
        el.__num = target;
        el.textContent = format(target);
        el.__raf = 0;
      }
    }

    el.__raf = requestAnimationFrame(step);
  }

  /** 直接设值（不做动画），用于首屏初始化 */
  function setNumber(el, value, format) {
    if (!el) return;
    if (el.__raf) {
      cancelAnimationFrame(el.__raf);
      el.__raf = 0;
    }
    el.__num = Number(value) || 0;
    el.textContent = (typeof format === 'function' ? format : defaultFormat)(el.__num);
  }

  App.tweenNumber = tweenNumber;
  App.setNumber = setNumber;
})();
