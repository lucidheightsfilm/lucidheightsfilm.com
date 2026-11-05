// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animateCursor() {
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(animateCursor);
})();
document.querySelectorAll('a, button, .video-card, .pricing-card').forEach(el => {
  el.addEventListener('mouseenter', () => { if(cursor) cursor.classList.add('hover'); if(ring) ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { if(cursor) cursor.classList.remove('hover'); if(ring) ring.classList.remove('hover'); });
});

// Nav scroll
const nav = document.getElementById('nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Package cards in a [data-fit-prices] grid auto-size so they line up:
// 1. When cards sit side by side, every package name and description takes
//    the height of the tallest one, so the prices start on the same line.
// 2. Prices share one font size. It starts from the CSS size (48px) and only
//    shrinks, just enough for the longest price (e.g. "Starting at $1,049")
//    to stay on one line.
function fitPricingPrices() {
  document.querySelectorAll('[data-fit-prices]').forEach(grid => {
    const cards = grid.children;
    const sideBySide = cards.length > 1 && cards[0].offsetTop === cards[1].offsetTop;
    ['.pricing-name', '.pricing-desc'].forEach(selector => {
      const blocks = grid.querySelectorAll(selector);
      blocks.forEach(b => { b.style.minHeight = ''; });
      if (!sideBySide || blocks.length < 2) return;
      const tallest = Math.ceil(Math.max(...[...blocks].map(b => b.getBoundingClientRect().height)));
      blocks.forEach(b => { b.style.minHeight = tallest + 'px'; });
    });

    const prices = grid.querySelectorAll('.pricing-price');
    if (!prices.length) return;

    prices.forEach(p => { p.style.fontSize = ''; });
    const baseSize = parseFloat(getComputedStyle(prices[0]).fontSize);
    if (!baseSize) return;

    let ratio = 1;
    prices.forEach(p => {
      const needed = p.scrollWidth + 1; // +1 covers scrollWidth rounding down
      const available = p.clientWidth;
      if (available > 0 && needed > available) ratio = Math.min(ratio, available / needed);
    });

    if (ratio < 1) {
      const fitted = Math.floor(baseSize * ratio * 10) / 10 + 'px';
      prices.forEach(p => { p.style.fontSize = fitted; });
    }
  });
}
if (document.querySelector('[data-fit-prices]')) {
  let fitFrame = 0;
  const scheduleFit = () => { cancelAnimationFrame(fitFrame); fitFrame = requestAnimationFrame(fitPricingPrices); };
  fitPricingPrices();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFit);
  window.addEventListener('load', scheduleFit);
  window.addEventListener('resize', scheduleFit);
}

// Counter animation (homepage only)
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  (function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  })(start);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const num = entry.target.querySelector('[data-target]');
      if (num) animateCounter(num);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.counter-item').forEach(el => counterObserver.observe(el));

// Hero background video — hold the dark base, then fade in once it can play.
document.querySelectorAll('.hero-video').forEach(layer => {
  const video = layer.querySelector('video');
  if (!video) return;

  const reveal = () => layer.classList.add('is-ready');
  if (video.readyState >= 3) reveal();
  else video.addEventListener('canplay', reveal, { once: true });

  // Some browsers ignore the autoplay attribute until play() is called.
  const attempt = video.play();
  if (attempt) attempt.catch(() => {});

  setTimeout(reveal, 4000); // never leave the hero dark if the file stalls
});
