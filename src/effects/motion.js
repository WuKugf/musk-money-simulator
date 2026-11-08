/* =========================================================
   motion.js · 动画适配层
   GSAP 可用时用 GSAP；不可用时自动降级为 CSS keyframes（effects.css）
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var gsap = window.gsap && typeof window.gsap.fromTo === 'function' ? window.gsap : null;

  if (!gsap) {
    console.info('[花光马斯克的钱] GSAP 未能加载（可能无网络），已自动降级为 CSS 动画。');
  }

  function addFallbackClass(el, cls, duration) {
    el.classList.remove(cls);
    // 强制重排，确保同一个类可以重复触发动画
    void el.offsetWidth;
    el.classList.add(cls);
    if (el.__fxTimer) clearTimeout(el.__fxTimer);
    el.__fxTimer = setTimeout(function () {
      el.classList.remove(cls);
      el.__fxTimer = 0;
    }, duration || 600);
  }

  /** 弹入：位移 + 缩放 + 透明度 */
  function popIn(el, opts) {
    if (!el) return;
    opts = opts || {};
    var fromY = typeof opts.y === 'number' ? opts.y : 18;
    var dur = typeof opts.duration === 'number' ? opts.duration : 0.52;
    var delay = opts.delay || 0;

    el.style.opacity = '';

    if (reduce) {
      el.style.opacity = '1';
      return;
    }

    if (gsap) {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.86, y: fromY },
        {
          opacity: 1, scale: 1, y: 0,
          duration: dur, delay: delay,
          ease: 'back.out(1.6)',
          clearProps: 'transform'
        }
      );
    } else {
      addFallbackClass(el, 'fx-in', 1000);
    }
  }

  /** 退出：淡出 + 缩小 */
  function fadeOut(el, done) {
    if (!el) {
      if (done) done();
      return;
    }
    if (reduce) {
      if (done) done();
      return;
    }
    if (gsap) {
      gsap.to(el, {
        opacity: 0,
        scale: 0.9,
        y: -14,
        duration: 0.26,
        ease: 'power2.in',
        onComplete: function () {
          if (done) done();
        }
      });
    } else {
      el.classList.add('fx-out');
      setTimeout(function () {
        if (done) done();
      }, 240);
    }
  }

  /** 左右抖动，用于余额不足等负反馈 */
  function shake(el) {
    if (!el) return;
    if (reduce) return;
    if (gsap) {
      gsap.fromTo(el,
        { x: 0 },
        {
          keyframes: [
            { x: -6, duration: 0.06 },
            { x: 5, duration: 0.06 },
            { x: -4, duration: 0.06 },
            { x: 3, duration: 0.06 },
            { x: 0, duration: 0.08 }
          ],
          ease: 'none',
          clearProps: 'transform'
        }
      );
    } else {
      addFallbackClass(el, 'fx-shake', 500);
    }
  }

  /** 轻微脉冲，用于资金数字变化 */
  function pulse(el) {
    if (!el) return;
    if (reduce) return;
    if (gsap) {
      gsap.fromTo(el,
        { scale: 1 },
        { scale: 1.045, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', clearProps: 'transform' }
      );
    } else {
      addFallbackClass(el, 'fx-pulse', 560);
    }
  }

  /** 从元素中心飞出一个小金额提示（不依赖 canvas） */
  function floatCost(x, y, text) {
    if (reduce) return;
    var el = document.createElement('div');
    el.className = 'float-cost';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1000);
  }

  App.motion = {
    gsap: !!gsap,
    reduced: reduce,
    popIn: popIn,
    fadeOut: fadeOut,
    shake: shake,
    pulse: pulse,
    floatCost: floatCost
  };
})();
