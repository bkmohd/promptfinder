/* =============================================================
   PromptFoundry — shared nav markup
   Used by build.js (generated pages) and static-nav-update.js
   (the hand-written pages), so the header never drifts.

   Usage: navHtml(PF, active, prefix)
     active: "library" | "studio" | "roles" | "guides" | "lab" | "about" | ""
     prefix: "../" for nested pages (roles/, guides/), "" for root pages
   ============================================================= */
"use strict";

module.exports = function navHtml(PF, active, p) {
  const counts = {};
  for (const pr of PF.prompts) counts[pr.category] = (counts[pr.category] || 0) + 1;

  const catItem = (c, withCount) =>
    `<a class="ndp-item" href="${p}library.html?category=${c.id}"><i class="ndp-dot" style="background:${c.hue || "var(--faint)"}"></i>${c.name}${withCount ? `<span class="ndp-c">${counts[c.id] || 0}</span>` : ""}</a>`;

  const dropCats = PF.categories.map(c => catItem(c, true)).join("\n            ");
  const mmCats = PF.categories.map(c => catItem(c, false)).join("\n      ");

  const pages = [
    ["library", "Full library", `${p}library.html`],
    ["studio", "Prompt Studio", `${p}index.html#builder`],
    ["roles", "Role pages", `${p}roles.html`],
    ["guides", "Guides", `${p}guides.html`],
    ["lab", "How we test", `${p}how-we-test.html`],
    ["about", "About", `${p}about.html`]
  ];
  const dropPages = pages
    .map(([id, label, href]) => `<a class="ndp-item" href="${href}"${active === id ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("\n          ");
  const mmPages = pages
    .map(([id, label, href]) => `<a href="${href}"${active === id ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("\n    ");

  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="nav">
  <div class="container nav-inner">
    <a class="brand" href="${p}index.html" aria-label="PromptFoundry home">
      <svg class="mark" viewBox="0 0 28 28" aria-hidden="true"><rect x="1" y="1" width="26" height="26" rx="7" fill="#15120D"/><path d="M14 6.6v14.8M6.6 14h14.8M8.8 8.8l10.4 10.4M19.2 8.8L8.8 19.2" stroke="#F5F0E6" stroke-width="1.4" stroke-linecap="round"/><circle cx="14" cy="14" r="2.7" fill="#E34A1B"/></svg>
      promptfoundry <span class="beta">beta</span>
    </a>
    <div class="nav-drop">
      <button class="nav-drop-btn" data-drop aria-expanded="false" aria-controls="navDropPanel">Browse
        <svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="nav-drop-panel" id="navDropPanel">
        <div class="ndp-col">
          <span class="ndp-label">Browse by prompt type</span>
          <div data-drop-cats>
            ${dropCats}
          </div>
        </div>
        <div class="ndp-col">
          <span class="ndp-label">Pages</span>
          ${dropPages}
        </div>
      </div>
    </div>
    <form class="nav-search" role="search" action="${p}library.html" method="get">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      <input id="navSearch" name="q" type="search" placeholder="Search prompts…" aria-label="Search prompts" autocomplete="off">
      <button type="button" class="mic-btn nav-mic" data-voice-target="navSearch" title="Dictate your search" aria-label="Dictate your search by voice">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>
      </button>
    </form>
    <div class="nav-actions">
      <a class="btn small dark nav-cta-desktop" href="${p}index.html#builder">Open Studio →</a>
      <button class="menu-btn" data-menu aria-expanded="false" aria-controls="mobileMenu" aria-label="Menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobileMenu">
    <span class="mm-label">Browse by prompt type</span>
    <div class="mm-cats">
      ${mmCats}
    </div>
    <span class="mm-label">Pages</span>
    ${mmPages}
    <div class="mm-actions"><a class="btn small block" href="${p}index.html#builder">Open the Studio →</a></div>
  </div>
</header>`;
};
