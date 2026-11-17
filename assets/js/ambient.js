(function () {
  'use strict';

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  if (!context) return;

  canvas.className = 'ambient-background';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var width = 0;
  var height = 0;
  var points = [];
  var frame = null;
  var lastTime = 0;
  var elapsed = 0;
  var light = document.documentElement.getAttribute('data-theme') === 'light';

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    var ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    var count = Math.min(width < 600 ? 22 : 60, Math.max(14, Math.round(width * height / 18000)));
    points = [];
    for (var i = 0; i < count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.5) * 9,
        radius: 1 + Math.random() * 0.8
      });
    }
    draw(0);
  }

  function glow(x, y, radius, rgb) {
    var gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(' + rgb + ',' + (light ? 0.19 : 0.045) + ')');
    if (light) gradient.addColorStop(0.45, 'rgba(' + rgb + ',0.075)');
    gradient.addColorStop(1, 'rgba(' + rgb + ',0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function draw(delta) {
    elapsed += delta;
    context.clearRect(0, 0, width, height);

    if (light) {
      // Broad blue/mint light pools move visibly without dots or hard edges.
      var lightRadius = Math.max(width, height) * 0.58;
      glow(width * (0.2 + Math.sin(elapsed / 10) * 0.25),
        height * (0.25 + Math.sin(elapsed / 9) * 0.15), lightRadius, '83,142,192');
      glow(width * (0.8 + Math.cos(elapsed / 12) * 0.16),
        height * (0.7 + Math.sin(elapsed / 11) * 0.15), lightRadius, '85,164,153');
      return;
    }

    var rgb = '89,199,172';
    var radius = Math.min(width, height) * 0.65;
    var drift = Math.sin(elapsed / 35) * 0.08;
    glow(width * (0.15 + drift), height * 0.3, radius, rgb);
    glow(width * 0.85, height * (0.75 + Math.cos(elapsed / 40) * 0.08), radius, '80,130,170');

    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      point.x += point.vx * delta;
      point.y += point.vy * delta;
      if (point.x < -15) point.x = width + 15;
      if (point.x > width + 15) point.x = -15;
      if (point.y < -15) point.y = height + 15;
      if (point.y > height + 15) point.y = -15;
    }

    var reach = width < 600 ? 105 : 150;
    context.lineWidth = 0.7;
    for (var a = 0; a < points.length; a++) {
      for (var b = a + 1; b < points.length; b++) {
        var dx = points[a].x - points[b].x;
        var dy = points[a].y - points[b].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance >= reach) continue;
        var alpha = (1 - distance / reach) * (light ? 0.15 : 0.2);
        context.strokeStyle = 'rgba(' + rgb + ',' + alpha + ')';
        context.beginPath();
        context.moveTo(points[a].x, points[a].y);
        context.lineTo(points[b].x, points[b].y);
        context.stroke();
      }
      context.fillStyle = 'rgba(' + rgb + ',' + (light ? 0.28 : 0.42) + ')';
      context.beginPath();
      context.arc(points[a].x, points[a].y, points[a].radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  function animate(time) {
    if (time - lastTime >= 1000 / 30) {
      draw(lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0);
      lastTime = time;
    }
    frame = window.requestAnimationFrame(animate);
  }

  function updateMotion() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    lastTime = 0;
    if (document.hidden) return;
    draw(0);
    if (!reducedMotion.matches) frame = window.requestAnimationFrame(animate);
  }

  new MutationObserver(function () {
    light = document.documentElement.getAttribute('data-theme') === 'light';
    if (!document.hidden) draw(0);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', updateMotion);
  reducedMotion.addEventListener('change', updateMotion);
  window.addEventListener('pagehide', function () {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
  });
  window.addEventListener('pageshow', updateMotion);
  resize();
  updateMotion();
})();
