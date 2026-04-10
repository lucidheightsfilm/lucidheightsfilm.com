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
document.querySelectorAll('a, button, .video-card, .pricing-card, .service-card').forEach(el => {
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
