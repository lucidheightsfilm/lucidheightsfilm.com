// =============================================================
// nav.js — Lucid Heights Film
// Single source of truth for navigation across all pages.
//
// USAGE: Add to every page just before </body>:
//   <script src="{path-to-root}nav.js"></script>
//   <script>buildNav('page-slug');</script>
//
// PAGE SLUGS:
//   homepage   → buildNav('')
//   work       → buildNav('work')
//   weddings   → buildNav('weddings')
//   commercial → buildNav('commercial')
//   realestate → buildNav('realestate')
//   contact    → buildNav('contact')
//   booknow    → buildNav('booknow')
//   thankyou   → buildNav('')   (no active link)
//
// TO ADD A PAGE: add one entry to the `pages` array below.
// =============================================================

function buildNav(activePage) {
  const base = document.documentElement.dataset.root || '';

  // ── ADD / REMOVE NAV LINKS HERE ──────────────────────────
  const pages = [
    { label: 'Work',        slug: 'work',        href: base + 'work/index.html' },
    { label: 'Weddings',    slug: 'weddings',    href: base + 'weddings/index.html' },
    { label: 'Commercial',  slug: 'commercial',  href: base + 'commercial/index.html' },
    { label: 'Real Estate', slug: 'realestate',  href: base + 'realestate/index.html' },
    { label: 'Contact',     slug: 'contact',     href: base + 'contact/index.html' },
  ];
  // ─────────────────────────────────────────────────────────

  const close = `document.getElementById('navDrawer').classList.remove('open');document.body.style.overflow='';`;
  const open  = `document.getElementById('navDrawer').classList.add('open');document.body.style.overflow='hidden';`;

  const navLinks = pages.map(p => {
    const active = p.slug === activePage ? ' class="active"' : '';
    return `<li><a href="${p.href}"${active}>${p.label}</a></li>`;
  }).join('\n    ');

  const drawerLinks = pages.map(p =>
    `<a href="${p.href}" onclick="${close}">${p.label}</a>`
  ).join('\n  ');

  const booknowActive = activePage === 'booknow' ? ' active' : '';

  document.getElementById('nav').innerHTML = `
    <a href="${base}index.html" class="nav-logo">Lucid <span>Heights</span> Film</a>
    <ul class="nav-links">
      ${navLinks}
      <li><a href="${base}booknow/index.html" class="nav-cta${booknowActive}">Book Now</a></li>
    </ul>
    <button class="menu-toggle" aria-label="Menu" onclick="${open}">
      <span></span><span></span><span></span>
    </button>
  `;

  document.getElementById('navDrawer').innerHTML = `
    <button class="nav-drawer-close" onclick="${close}">✕</button>
    <a href="${base}index.html" onclick="${close}">Home</a>
    ${drawerLinks}
    <a href="${base}booknow/index.html" class="drawer-cta" onclick="${close}">Book Now</a>
  `;
}
