#!/usr/bin/env node
/* =============================================================
   PromptFoundry static builder
   Generates: roles/{slug}.html · roles.html · sitemap.xml
   Usage: node build.js
   ============================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/data.js"), "utf8"), sandbox, { filename: "data.js" });
const PF = sandbox.window.PF;
const navHtml = require("./content/nav.js");
const C = PF.config;
const GUIDES = require("./content/guides.js");

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const lower = s => s.charAt(0).toLowerCase() + s.slice(1);
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const fmtDate = iso => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h8"></path></svg>';

function modelBadges(ids) {
  return '<div class="model-badges">' + ids.map(id => {
    const m = PF.byId[id];
    if (!m) return "";
    return `<span class="mb" style="background:${m.color};color:${m.color === "#E8CF6A" ? "#15120D" : "#fff"}" title="${esc(m.name + " " + m.version)}">${m.badge}</span>`;
  }).join("") + "</div>";
}

function promptCard(p) {
  const cat = PF.catById[p.category] || { name: p.category };
  const vars = PF.extractVars(p.template);
  const snippet = p.template.split("\n").filter(Boolean).slice(0, 3).join("\n");
  return `<article class="p-card" data-slug="${p.slug}">
  <div class="p-top"><span class="cat">${esc(cat.name)}</span>
    <button class="icon-btn" data-copy-prompt="${p.slug}" aria-label="Copy ${esc(p.title)}" title="Copy prompt">${COPY_ICON}</button>
  </div>
  <h3><button data-open="${p.slug}">${esc(p.title)}</button></h3>
  <p class="blurb">${esc(p.blurb)}</p>
  <pre class="snippet" aria-hidden="true">${esc(snippet)}</pre>
  <div class="p-meta">
    <div style="display:flex;align-items:center;gap:9px">${modelBadges(p.models)}<span class="p-vars">${vars.length} vars</span></div>
    <span class="pass" title="Passed ${esc(p.pass)} test runs"><i></i>${esc(p.pass)}</span>
  </div>
  <div class="p-card-footer">
    <button class="card-link" data-open="${p.slug}">Preview prompt →</button><span class="jump-hint">Tap to open</span>
    <span class="p-vars">${esc(fmtDate(p.tested))}</span>
  </div>
</article>`;
}

function studioCard(role) {
  const task = PF.llmTasks.find(t => t.role === role.slug) || PF.llmTasks[0];
  return `<a class="p-card" href="../index.html?task=${task.id}&role=${role.slug}&model=chatgpt#builder" style="border-style:dashed;justify-content:center;gap:14px">
  <span class="cat">Build your own</span>
  <h3 style="font-size:22px">Need a ${esc(role.singular)} prompt that isn't here?</h3>
  <p class="blurb" style="min-height:0">Pick your role, task, tone and format in the Studio. The output adapts to ChatGPT, Claude, Gemini, Grok, Midjourney or GPT Image — with variables and guardrails built in.</p>
  <span class="card-link">Open the Studio →</span>
</a>`;
}

function head({ title, desc, canonical, jsonld }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${C.url}/${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${C.url}/${canonical}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%2315120D'/%3E%3Cpath d='M16 7v18M7 16h18M9.6 9.6l12.8 12.8M22.4 9.6L9.6 22.4' stroke='%23F5F0E6' stroke-width='1.6' stroke-linecap='round'/%3E%3Ccircle cx='16' cy='16' r='3.2' fill='%23E34A1B'/%3E%3C/svg%3E">
<link rel="stylesheet" href="../assets/fonts.css">
<link rel="stylesheet" href="../assets/styles.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>`;
}

function nav(active) {
  return navHtml(PF, active, "../");
}

function footer() {
  return `<footer class="footer">
  <div class="container">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="../index.html" aria-label="PromptFoundry home">
          <svg class="mark" viewBox="0 0 28 28" aria-hidden="true"><rect x="1" y="1" width="26" height="26" rx="7" fill="#15120D"/><path d="M14 6.6v14.8M6.6 14h14.8M8.8 8.8l10.4 10.4M19.2 8.8L8.8 19.2" stroke="#F5F0E6" stroke-width="1.4" stroke-linecap="round"/><circle cx="14" cy="14" r="2.7" fill="#E34A1B"/></svg>
          promptfoundry
        </a>
        <p>Field-tested prompts, a model-aware builder and a test log. Independent — not affiliated with OpenAI, Anthropic, Google, xAI or Midjourney.</p>
        <p class="mono" style="font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--faint)">Updated ${C.updatedLabel} · ${PF.prompts.length} prompts on the bench</p>
      </div>
      <div class="foot-col">
        <h4>Library</h4>
        <ul>
          <li><a href="../library.html">All prompts</a></li>
          ${PF.categories.slice(0, 5).map(c => `<li><a href="../library.html?category=${c.id}">${esc(c.name)}</a></li>`).join("\n          ")}
        </ul>
      </div>
      <div class="foot-col">
        <h4>Roles</h4>
        <ul>
          ${PF.roles.slice(0, 5).map(r => `<li><a href="../roles/${r.slug}.html">${esc(r.name)}</a></li>`).join("\n          ")}
          <li><a href="../roles.html">All role pages</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h4>Site</h4>
        <ul>
          <li><a href="../index.html#builder">Prompt Studio</a></li>
          <li><a href="../index.html#doctor">Prompt Doctor</a></li>
          <li><a href="../guides.html">Guides</a></li>
          <li><a href="../how-we-test.html">How we test</a></li>
          <li><a href="../about.html">About &amp; funding</a></li>
          <li><a href="../privacy.html">Privacy</a></li>
          <li><a href="mailto:${C.email}">Advertise / contact</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <p>© 2026 PromptFoundry. Prompt test results are specific to the model versions and inputs listed on each page. Ads and affiliate links may fund the site; they never change a test score. Model names are trademarks of their owners.</p>
      <div class="legal"><a href="../privacy.html">Privacy</a><a href="../how-we-test.html">Editorial standards</a><a href="../about.html">About</a></div>
    </div>
  </div>
</footer>`;
}

/* ---------------- Role pages ---------------- */
function rolePage(role) {
  const rolePrompts = PF.prompts.filter(p => p.role === role.slug);
  const n = rolePrompts.length;
  const modelNames = PF.models.map(m => m.name + " " + m.version).join(", ");
  const title = `${n} tested AI prompts for ${lower(role.name)} | GPT-6.1, Claude & Gemini | PromptFoundry`;
  const desc = `${n} field-tested ${lower(role.name)} prompts with variables, pass rates and model notes. ${role.blurb} Free to copy and adapt.`;
  const canonical = `roles/${role.slug}.html`;

  const faqs = [
    {
      q: `How were these ${lower(role.name)} prompts tested?`,
      a: `Each prompt was run ten times per model with identical inputs, then scored against a 40-point rubric: works without edits (15), follows the requested format (10), handles facts safely (10) and sounds like the brief (5). Pass rates shown on each card come from the last completed cycle (${C.updatedLabel}). Failures stay visible.`
    },
    {
      q: `Which AI model should a ${role.singular} use?`,
      a: `Start with the models listed on the prompt itself. In our current cycle, Claude Sonnet 5.5 and GPT-6.1 score highest on structured documents, Gemini 3.8 on research with citations, Grok 4.7 when current information matters, and Midjourney V8.2 or GPT Image 2.5 for visuals. Every prompt page lists the models it was actually run on.`
    },
    {
      q: `Can I use these prompts at work?`,
      a: `Yes. Prompts are free to copy, adapt and use commercially. You may not repackage the library wholesale or resell it as a prompt pack. Attribution is welcome but not required.`
    }
  ];

  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": title,
        "url": `${C.url}/${canonical}`,
        "description": desc,
        "isPartOf": { "@type": "WebSite", "name": C.name, "url": C.url }
      },
      {
        "@type": "ItemList",
        "name": `${cap(role.name)} prompts`,
        "numberOfItems": n,
        "itemListElement": rolePrompts.map((p, i) => ({
          "@type": "ListItem", "position": i + 1,
          "name": p.title, "url": `${C.url}/library.html?p=${p.slug}`
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": C.url + "/" },
          { "@type": "ListItem", "position": 2, "name": "Roles", "item": C.url + "/roles.html" },
          { "@type": "ListItem", "position": 3, "name": role.name }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question", "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }
    ]
  };

  const tasks = rolePrompts.map(p => PF.llmTaskById[p.task]).filter(Boolean);
  const extraTasks = PF.llmTasks.filter(t => !tasks.some(x => x.id === t.id)).slice(0, Math.max(0, 4 - tasks.length));
  const matrixTasks = tasks.concat(extraTasks).slice(0, 6);

  const related = (() => {
    const idx = PF.roles.findIndex(r => r.slug === role.slug);
    const out = [];
    for (let i = 1; i <= 4; i++) out.push(PF.roles[(idx + i) % PF.roles.length]);
    return out;
  })();

  const newDate = rolePrompts.map(p => p.tested).sort().slice(-1)[0] || C.updated;

  return `${head({ title, desc, canonical, jsonld })}
<body data-page="role" data-depth="1">
${nav("roles")}
<main id="main">
  <section class="role-hero">
    <div class="container">
      <div class="breadcrumb"><a href="../index.html">Home</a><span class="sep">/</span><a href="../roles.html">Roles</a><span class="sep">/</span><span>${esc(role.name)}</span></div>
      <span class="kicker">Role page · ${esc(role.category)} · updated ${esc(fmtDate(newDate))}</span>
      <h1 style="margin-top:16px">Prompts for <em>${esc(lower(role.name))}.</em></h1>
      <p class="lede">${esc(role.blurb)} Built for the work that lands on a ${esc(role.singular)}'s desk: ${role.pins.map(esc).join(", ")}. Every prompt below carries a pass rate, model notes and variables you can fill in.</p>
      <div class="pins">${role.pins.map(p => `<span class="pin">${esc(p)}</span>`).join("")}<span class="pin">${n} tested ${n === 1 ? "prompt" : "prompts"}</span></div>
      <div class="proof-row">
        <div class="proof"><b>${n} prompts</b><span>tested in the current cycle</span></div>
        <div class="proof"><b>${esc(fmtDate(newDate))}</b><span>last re-test on this page</span></div>
        <div class="proof"><b>6 models</b><span>GPT-6.1 · Claude · Gemini · Grok + image</span></div>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:44px">
    <div class="container">
      <div class="section-head">
        <div class="section-title">
          <span class="kicker">The tested set</span>
          <h2 class="h2">Start with the task in front of you.</h2>
        </div>
        <p class="section-note">Open any prompt for the full text, variables and example output. Copy it, or rebuild it in the Studio for your context.</p>
      </div>
      <div class="prompt-grid">
        ${rolePrompts.map(promptCard).join("\n        ")}
        ${n < 3 ? studioCard(role) : ""}
      </div>
      <p class="load-note" style="text-align:left;margin-top:26px">Only prompts that have cleared a test cycle are listed here. This page grows as new ${esc(lower(role.name))} prompts pass — no padding, no auto-generated filler.</p>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head">
        <div class="section-title">
          <span class="kicker">Build the next one</span>
          <h2 class="h2">Role × task × model.</h2>
        </div>
        <p class="section-note">The Studio pre-fills your role and the task. Change the tone, format and model from there.</p>
      </div>
      <div class="role-matrix">
        ${matrixTasks.map(t => `<div class="matrix-item"><span>${esc(t.label)}</span><a href="../index.html?task=${t.id}&role=${role.slug}#builder">Build it →</a></div>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head">
        <div class="section-title">
          <span class="kicker">Go deeper</span>
          <h2 class="h2">The method behind the prompts.</h2>
        </div>
        <p class="section-note">Three guides that explain the structure, the techniques and the testing habit — so you can build your own.</p>
      </div>
      <div class="resource-grid">
        ${GUIDES.map(g => `<a class="resource-card" href="../guides/${g.slug}.html"><span class="rc-tag">${esc(g.tag)}</span><b>${esc(g.title)}</b><p>${esc(g.desc)}</p><span class="card-link" style="margin-top:6px">Read the guide →</span></a>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="doctor-grid" style="grid-template-columns:1fr 1fr;gap:48px;align-items:start">
        <div>
          <span class="kicker">Questions</span>
          <h2 class="h2" style="margin:14px 0 22px">The honest answers.</h2>
          <div class="faq">
            ${faqs.map((f, i) => `<details${i === 0 ? " open" : ""}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("\n            ")}
          </div>
        </div>
        <div>
          <span class="kicker">Keep browsing</span>
          <h2 class="h2" style="margin:14px 0 22px">Other jobs, same bench.</h2>
          <div class="related-roles">
            ${related.map(r => `<a class="rr-pill" href="../roles/${r.slug}.html">${esc(r.name)} →</a>`).join("\n            ")}
          </div>
          <div style="margin-top:26px;padding:22px;border:1px solid var(--line);border-radius:14px;background:var(--card)">
            <b style="font-family:var(--serif);font-size:19px;letter-spacing:-.01em">Tested on current models</b>
            <p class="small muted" style="margin-top:8px">${esc(modelNames)}. Prompts are re-run monthly and when a model version changes.</p>
            <a class="link-arrow" href="../how-we-test.html" style="margin-top:14px;display:inline-flex">Read the methodology →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-band">
    <div class="container">
      <div class="cta-inner">
        <div>
          <span class="kicker">The Friday drop</span>
          <h2 class="h2" style="margin-top:16px">New ${esc(lower(role.name))} prompts,<br>tested before they ship.</h2>
          <p>Five prompts a week with test dates and model notes. No listicles, no hype.</p>
        </div>
        <div class="newsletter">
          <form data-newsletter novalidate>
            <label for="nlEmail">Email address</label>
            <div class="nl-row" style="margin-top:8px">
              <input id="nlEmail" type="email" placeholder="you@company.com" autocomplete="email" required>
              <button class="btn light" type="submit">Get the drop →</button>
            </div>
            <p class="nl-note" style="margin-top:10px">Free · unsubscribe in one click · no spam</p>
          </form>
          <p class="nl-success">You're in. First dispatch lands Friday — check your inbox for the starter set.</p>
        </div>
      </div>
    </div>
  </section>
</main>
${footer()}
<script src="../assets/data.js"></script>
<script src="../assets/app.js"></script>
</body>
</html>
`;
}


/* ---------------- Guides ---------------- */
function guidePage(g, idx) {
  const next = GUIDES[(idx + 1) % GUIDES.length];
  const canonical = `guides/${g.slug}.html`;
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": g.title,
        "description": g.desc,
        "url": `${C.url}/${canonical}`,
        "dateModified": C.updated,
        "author": { "@type": "Organization", "name": C.name, "url": C.url },
        "publisher": { "@type": "Organization", "name": C.name, "url": C.url },
        "isPartOf": { "@type": "WebSite", "name": C.name, "url": C.url }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": C.url + "/" },
          { "@type": "ListItem", "position": 2, "name": "Guides", "item": C.url + "/guides.html" },
          { "@type": "ListItem", "position": 3, "name": g.title }
        ]
      }
    ]
  };
  return `${head({ title: `${g.title} | PromptFoundry`, desc: g.desc, canonical, jsonld })}
<body data-page="guide" data-depth="1">
${nav("guides")}
<main id="main">
  <section class="page-hero">
    <div class="container">
      <div class="breadcrumb" style="display:flex;gap:8px;font-family:var(--mono);font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:20px"><a href="../index.html">Home</a><span>/</span><a href="../guides.html">Guides</a><span>/</span><span>${esc(g.tag)}</span></div>
      <span class="kicker">${esc(g.kicker)}</span>
      <h1 class="display">${esc(g.title)}</h1>
      <p class="lede">${esc(g.lede)}</p>
    </div>
  </section>
  <div class="container">
    <article class="prose">
      ${g.body}
      <div class="author-note">
        <span class="av">PF</span>
        <div><b>The PromptFoundry test bench</b><p>Written from the prompts and test logs on this site. Updated ${esc(C.updatedLabel)}. Independent and ad-funded — <a href="../about.html">how we're funded →</a></p></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:22px">
        <span class="kicker">Next guide</span>
        <a class="btn ghost" href="${next.slug}.html">${esc(next.title)} →</a>
      </div>
    </article>
  </div>
  <section class="cta-band">
    <div class="container">
      <div class="cta-inner">
        <div>
          <span class="kicker">The Friday drop</span>
          <h2 class="h2" style="margin-top:16px">Five fresh prompts.<br>Tested before they ship.</h2>
          <p>One email a week with test dates and model notes. No hype.</p>
        </div>
        <div class="newsletter">
          <form data-newsletter novalidate>
            <label for="nlEmail">Email address</label>
            <div class="nl-row" style="margin-top:8px">
              <input id="nlEmail" type="email" placeholder="you@company.com" autocomplete="email" required>
              <button class="btn light" type="submit">Get the drop →</button>
            </div>
            <p class="nl-note" style="margin-top:10px">Free · unsubscribe in one click · no spam</p>
          </form>
          <p class="nl-success">You're in. First dispatch lands Friday — check your inbox for the starter set.</p>
        </div>
      </div>
    </div>
  </section>
</main>
${footer()}
<script src="../assets/data.js"></script>
<script src="../assets/app.js"></script>
</body>
</html>
`;
}

function guidesIndex() {
  const title = "Prompt engineering guides — structure, techniques and testing | PromptFoundry";
  const desc = "Three practical guides: the anatomy of a reliable prompt, seven prompting techniques that hold up, and how to test your own prompts with a ten-run protocol.";
  const jsonld = { "@context": "https://schema.org", "@type": "CollectionPage", "name": title, "url": C.url + "/guides.html", "description": desc };
  return `${head({ title, desc, canonical: "guides.html", jsonld }).replace(/\.\.\//g, "")}
<body data-page="guides" data-depth="0">
${navHtml(PF, "roles", "")}
<main id="main">
  <section class="library-hero">
    <div class="container">
      <span class="kicker">Guides · the method</span>
      <h1 class="display" style="font-size:clamp(38px,4.6vw,60px);max-width:18ch">Learn the structure, then break the <em>rules.</em></h1>
      <p class="lede">Three guides on how prompts actually work: the anatomy we use on the bench, the techniques that survived testing, and the habit that keeps a prompt useful after the next model release.</p>
    </div>
  </section>
  <section class="lib-results" style="padding-top:44px">
    <div class="container">
      <div class="resource-grid" style="grid-template-columns:1fr;gap:14px">
        ${GUIDES.map((g, i) => `<a class="resource-card" href="guides/${g.slug}.html" style="flex-direction:row;gap:22px;align-items:center;padding:24px">
          <span style="font-family:var(--serif);font-size:34px;color:var(--line);font-weight:600;flex:none">0${i + 1}</span>
          <span style="display:flex;flex-direction:column;gap:6px">
            <span class="rc-tag">${esc(g.tag)} · 7–9 min</span>
            <b style="font-size:21px">${esc(g.title)}</b>
            <p>${esc(g.desc)}</p>
            <span class="card-link" style="margin-top:4px">Read the guide →</span>
          </span>
        </a>`).join("\n        ")}
        <a class="resource-card" href="how-we-test.html" style="flex-direction:row;gap:22px;align-items:center;padding:24px">
          <span style="font-family:var(--serif);font-size:34px;color:var(--line);font-weight:600;flex:none">04</span>
          <span style="display:flex;flex-direction:column;gap:6px">
            <span class="rc-tag">The lab · methodology</span>
            <b style="font-size:21px">How we test prompts</b>
            <p>The full 40-point rubric, the re-test schedule and the public changelog behind every pass rate on this site.</p>
            <span class="card-link" style="margin-top:4px">Read the methodology →</span>
          </span>
        </a>
      </div>
    </div>
  </section>
</main>
${footer().replace(/\.\.\//g, "")}
<script src="assets/data.js"></script>
<script src="assets/app.js"></script>
</body>
</html>
`;
}

/* ---------------- Roles index ---------------- */

function rolesIndex() {
  const title = "AI prompts by role — 14 tested role pages | PromptFoundry";
  const desc = "Browse field-tested AI prompts by job: marketers, engineers, sales, product, design, data, research, support, HR, education, operations, creators, job seekers and everyday life.";
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "url": C.url + "/roles.html",
    "description": desc
  };
  return `${head({ title, desc, canonical: "roles.html", jsonld }).replace(/\.\.\//g, "")}
<body data-page="roles" data-depth="0">
${navHtml(PF, "guides", "")}
<main id="main">
  <section class="library-hero">
    <div class="container">
      <span class="kicker">The role index · ${PF.roles.length} pages live</span>
      <h1 class="display" style="font-size:clamp(38px,4.6vw,60px);max-width:18ch">Prompts for the job you <em>actually</em> do.</h1>
      <p class="lede">Generic prompt lists are written for everyone, which means they work for no one. Each page below is built around one job: the tasks that come up weekly, the models that handle them, and the failure modes to avoid.</p>
      <div class="library-stats">
        <span><b>${PF.roles.length}</b> role pages</span>
        <span><b>${PF.prompts.length}</b> tested prompts</span>
        <span><b>${PF.models.length}</b> models covered</span>
      </div>
    </div>
  </section>
  <section class="lib-results" style="padding-top:44px">
    <div class="container">
      <div class="roles-grid">
        ${PF.roles.map(r => {
          const n = PF.prompts.filter(p => p.role === r.slug).length;
          return `<a class="role-card" href="roles/${r.slug}.html">
          <div class="rc-top"><span class="rc-cat">${esc(r.category)} · ${n} tested</span><span class="rc-arrow">↗</span></div>
          <h3>${esc(r.name)}</h3>
          <p>${esc(r.blurb)}</p>
          <div class="rc-foot"><span class="cnt">${r.pins.slice(0, 2).map(esc).join(" · ")}</span><span>View page →</span></div>
        </a>`;
        }).join("\n        ")}
      </div>

      <div style="margin-top:64px;display:grid;grid-template-columns:.9fr 1.1fr;gap:48px;align-items:start" class="roles-explainer">
        <div>
          <span class="kicker">How this scales</span>
          <h2 class="h2" style="margin-top:14px">One page per job.<br>Not one page per keyword.</h2>
        </div>
        <div class="prose" style="padding:0;max-width:none">
          <p>Prompt content is the most obviously programmatic category in AI search: every role has real tasks, every task has real searches, and every model has different behaviour. That is a legitimate reason to build role × task × model pages — not a reason to publish ten thousand thin ones.</p>
          <p>So we keep the quality bar visible. A role page only lists prompts that have cleared a test cycle. Pages without enough tested material stay unpublished until they earn it. Each page carries its own test date, its own model results, and a task matrix that links straight into the Studio with the role pre-filled.</p>
          <p><strong>The flywheel:</strong> the Studio generates a prompt in seconds → we test the best outputs → the ones that pass become library entries and role pages → those pages send people back into the Studio with better inputs.</p>
          <a class="link-arrow" href="how-we-test.html">How a prompt gets on this site →</a>
        </div>
      </div>

      <div style="margin-top:64px;padding:30px;border:1px solid var(--line);border-radius:18px;background:var(--card);display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap">
        <div><span class="kicker">Your job not here yet?</span><h3 class="h3" style="margin-top:10px">Build the prompt anyway.</h3><p class="small muted" style="margin-top:6px">The Studio works for any role — pick a task, set the tone and format, and adapt it to six models.</p></div>
        <a class="btn" href="index.html#builder">Open the Studio <span class="ar">→</span></a>
      </div>
    </div>
  </section>
</main>
${footer().replace(/\.\.\//g, "")}
<script src="assets/data.js"></script>
<script src="assets/app.js"></script>
</body>
</html>
`;
}

/* ---------------- Write ---------------- */
fs.mkdirSync(path.join(ROOT, "roles"), { recursive: true });
PF.roles.forEach(role => {
  fs.writeFileSync(path.join(ROOT, "roles", role.slug + ".html"), rolePage(role));
});
fs.writeFileSync(path.join(ROOT, "roles.html"), rolesIndex());

fs.mkdirSync(path.join(ROOT, "guides"), { recursive: true });
GUIDES.forEach((g, i) => {
  fs.writeFileSync(path.join(ROOT, "guides", g.slug + ".html"), guidePage(g, i));
});
fs.writeFileSync(path.join(ROOT, "guides.html"), guidesIndex());

const urls = [
  ["", "1.0", "weekly"],
  ["library.html", "0.9", "weekly"],
  ["roles.html", "0.8", "weekly"],
  ...PF.roles.map(r => [`roles/${r.slug}.html`, "0.7", "monthly"]),
  ["guides.html", "0.7", "monthly"],
  ...GUIDES.map(g => [`guides/${g.slug}.html`, "0.6", "monthly"]),
  ["how-we-test.html", "0.6", "monthly"],
  ["about.html", "0.3", "yearly"],
  ["privacy.html", "0.2", "yearly"]
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, pr, cf]) => `  <url>
    <loc>${C.url}/${u}</loc>
    <lastmod>${C.updated}</lastmod>
    <changefreq>${cf}</changefreq>
    <priority>${pr}</priority>
  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${C.url}/sitemap.xml\n`);

console.log("Built " + PF.roles.length + " role pages, " + GUIDES.length + " guides, indexes, sitemap.xml and robots.txt");
