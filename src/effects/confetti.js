/* =========================================================
   confetti.js · 彩带粒子特效（Canvas 实现，无第三方依赖）
   ========================================================= */
(function () {
  'use strict';

  var App = window.App;
  var canvas = null;
  var ctx = null;
  var dpr = 1;
  var particles = [];
  var running = false;
  var lastTime = 0;
  var COLORS = ['#FF6B4A', '#FFB347', '#FFD86B', '#3FC59A', '#4C8DF6', '#B18CFF', '#FF8FB1', '#FFFFFF'];
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function resize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init() {
    canvas = document.getElementById('fx-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize, { passive: true });
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function spawn(x, y, count, power) {
    for (var i = 0; i < count; i++) {
      var angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
      var speed = (4 + Math.random() * 9) * power;
      var isRibbon = Math.random() < 0.28;

      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed,
        g: 0.26 + Math.random() * 0.14,
        drag: 0.988,
        w: isRibbon ? 4 + Math.random() * 3 : 5 + Math.random() * 6,
        h: isRibbon ? 10 + Math.random() * 8 : 5 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.34,
        color: pick(COLORS),
        life: 0,
        ttl: 62 + Math.random() * 46,
        wobble: Math.random() * Math.PI * 2
      });
    }

    // 粒子数量上限，避免疯狂点击时卡顿
    if (particles.length > 520) {
      particles.splice(0, particles.length - 520);
    }
  }

  function tick(now) {
    if (!ctx) {
      running = false;
      return;
    }

    var dt = lastTime ? Math.min((now - lastTime) / 16.67, 2.2) : 1;
    lastTime = now;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];

      p.life += dt;
      if (p.life >= p.ttl) {
        particles.splice(i, 1);
        continue;
      }

      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.g;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.wobble += 0.16;

      var progress = p.life / p.ttl;
      var alpha = progress > 0.72 ? (1 - progress) / 0.28 : 1;

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * (0.6 + Math.abs(Math.cos(p.wobble)) * 0.4));
      ctx.restore();
    }

    if (particles.length > 0) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      running = false;
      lastTime = 0;
    }
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = 0;
    requestAnimationFrame(tick);
  }

  /**
   * 在屏幕坐标处爆一束彩带
   * @param {number} x 视口 x
   * @param {number} y 视口 y
   * @param {Object} [opts] { count, power }
   */
  function burst(x, y, opts) {
    if (reduce || !ctx) return;
    opts = opts || {};
    spawn(
      typeof x === 'number' ? x : window.innerWidth / 2,
      typeof y === 'number' ? y : window.innerHeight / 2,
      opts.count || 64,
      opts.power || 1
    );
    start();
  }

  /** 从 DOM 元素中心爆发 */
  function burstFrom(el, opts) {
    if (!el || !el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, opts);
  }

  App.confetti = {
    init: init,
    burst: burst,
    burstFrom: burstFrom
  };
})();
