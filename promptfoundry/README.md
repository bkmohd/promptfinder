# PromptFoundry

**A field-tested prompt library + a model-aware prompt builder + a prompt grader.**
Static site, zero dependencies, no build step required to run. Built to be deployed to any static host and to scale programmatically without turning into a content farm.

---

## What's in the box

| Page | What it does |
|---|---|
| `index.html` | Homepage. Hero **Prompt Studio** (live, model-aware builder), library entry points, **Prompt Doctor**, test lab, role index, newsletter capture. |
| `library.html` | All 26 prompts with live search, topic/model/role filters, sort, deep-linkable prompts (`?p=slug`), copy + Markdown download. |
| `roles.html` + `roles/*.html` | 14 programmatic role pages (marketers, engineers, sales, product, design, data, research, support, HR, education, operations, creators, job seekers, everyday). Each has its own tests, model notes, FAQ schema, task matrix into the Studio. |
| `guides.html` + `guides/*.html` | 3 substantive guides (prompt anatomy, techniques that hold up, how to test your own prompts). |
| `how-we-test.html` | The differentiator in page form: 40-point rubric, cadence, public changelog, limitations. |
| `about.html`, `privacy.html`, `404.html` | Trust pages + ad/affiliate disclosure (privacy is a template — replace before launch). |
| `sitemap.xml`, `robots.txt` | Generated. |
| `build.js` | Static generator for role pages, guides index, sitemap. `node build.js` |

## The three tools (this is the moat)

1. **Prompt Studio** — pick model → role → task → tone → format. The output is genuinely model-aware:
   - **ChatGPT** → markdown spec + explicit self-check
   - **Claude** → XML-tagged structure (`<role> <objective> <context> …`) + `<scratchpad>`
   - **Gemini** → citation and verification instructions
   - **Grok** → real-time instruction, no preamble
   - **Midjourney** → descriptor stack + `--ar --v 8.2 --s --no` parameters
   - **GPT Image** → natural-language scene direction with legible-text rules
   - Guardrails toggle, clarifying-questions toggle, context field, live strength score, copy, download `.md`, and **Open in ChatGPT/Claude** with the prompt URL-encoded into the message.
2. **Prompt Doctor** — paste any prompt, get a 0–100 score against nine checks (role, objective, context, format, constraints, variables, examples, quality bar, clarity), with the exact fix for each failed check. Runs entirely in the browser.
3. **Test metadata** — every prompt carries a pass rate, last-tested date, models run, variables and a "what good output looks like" example. This is what makes the library credible instead of another listicle.

## Run it locally

```bash
# any static server works
python3 -m http.server 4173
# open http://localhost:4173
```

Regenerate role pages / guides / sitemap after editing content:

```bash
node build.js
```

## Project structure

```
promptfoundry/
├── index.html            # homepage + studio + doctor
├── library.html          # filterable library
├── roles.html  guides.html  how-we-test.html  about.html  privacy.html  404.html
├── roles/*.html          # generated — do not edit by hand
├── guides/*.html         # generated
├── content/guides.js     # guide copy (edit here, then node build.js)
├── content/nav.js        # shared header markup (used by build.js and all static pages)
├── build.js              # generator: role pages, guides, sitemap, robots
├── update-static-nav.js  # re-apply the shared header to the six hand-written pages
├── assets/
│   ├── data.js           # ← SINGLE SOURCE OF TRUTH: roles, prompts, models, tasks, presets
│   ├── app.js            # cards, drawer, header search, library filters, newsletter
│   ├── builder.js        # Prompt Studio engines + Prompt Doctor scoring
│   ├── voice.js          # voice input (mic) for Studio, Doctor and library search — Web Speech API
│   ├── fonts.css         # self-hosted type (Fraunces / Public Sans / IBM Plex Mono), base64 woff2
│   └── styles.css        # design system (cream / ink / ember, editable tokens at top)
├── sitemap.xml  robots.txt
└── PLAN.md               # content + SEO + monetization roadmap
```

## Editing content

**Add a prompt** → `assets/data.js`, add an object to `prompts` with `slug, title, role, category, task, models, blurb, tested, pass, template, example, tip`. It appears in the library, search, home feature grid and its role page automatically after `node build.js`.

**Add a role** → add to `roles` in `data.js`, then `node build.js`. A new role page is generated with FAQ + schema.

**Add a Studio task** → `llmTasks` in `data.js` (`id, label, role, category, objective, deliverable, vars`). Add `imageTasks` for image models.

**Change the brand** → `config` in `data.js` (name, url, email, updated date), then run a find-and-replace for `PromptFoundry` / `promptfoundry` in the HTML if you rename it, and update the favicon data-URI if you change the mark.

## Customise the design

All colours, fonts and radii are tokens at the top of `assets/styles.css` (`--paper`, `--ink`, `--ember`, `--serif`, `--sans`, plus `--iris`, `--amber`, `--pine` accents…). No CDN, no images — the whole site is self-contained, which makes it fast and keeps it working in sandboxed previews.

- **Type** is self-hosted in `assets/fonts.css` (base64-embedded `woff2`, latin subsets): **Fraunces** for display/headings, **Public Sans** for body/UI, **IBM Plex Mono** for labels, metadata and prompt blocks. To swap a face, replace the `@font-face` blocks in `fonts.css` (the token names in `styles.css` stay the same).
- **Colour** is driven per-category: each category in `data.js` carries a `hue`/`hueSoft` pair. Category cards, prompt-card labels, filter chips, the drawer and variable chips all pick the accent up automatically from that data. Model badges use each model's `color`. Role cards rotate through the `ember → iris → amber → pine` palette in CSS (`.role-card:nth-child(...)` in `styles.css`).
- **Voice input** (`assets/voice.js`) uses the browser's Web Speech API. Mic buttons appear in the header search bar (every page), the Studio context field and the Prompt Doctor textarea. It's fully client-side — audio never leaves the browser. On browsers without `SpeechRecognition` the buttons hide themselves; if the user blocks the mic a toast explains why. (Requires a secure context — `https://` or `localhost`.)

## The header

A single slim bar (64px) that gets out of the way:

- **`Browse` dropdown** — one control instead of a row of links. Left column lists every prompt type (category) with a colour dot and live count, linking straight to `library.html?category=…`; right column is the page index (Full library, Prompt Studio, Role pages, Guides, How we test, About). Closes on outside click, Esc, or selecting a link.
- **Search bar in the header** — a real `<input>` on every page, with a mic for voice search. On the library page it filters the grid live as you type and the query is kept in the URL (`?q=…`); on any other page, Enter jumps to the filtered library. Active category/model/role filters show as a thin non-sticky “Filtered by … ✕” pill row on the library page only. There is no separate search or filter section anywhere.
- **Auto-hide on scroll** — on desktop the header slides up as you scroll down and returns as soon as you scroll up (or reach the top). While the `Browse` menu is open it stays pinned. It is the only sticky element on the site, so nothing is ever covered. On mobile the header is in-flow (two rows: brand + menu, then a full-width search bar) and never hides.
- **Mobile** — the `Browse` dropdown is hidden (its menu lives in the hamburger sheet, which lists every category).
- The whole header (desktop dropdown + mobile menu) is generated from **`content/nav.js`** so it can't drift between pages. After editing it, run `node build.js` (regenerates role/guide pages + both index pages) and `node update-static-nav.js` (re-applies the header to the six hand-written pages).

## Tested

Verified in headless Chromium at 1440px and 390px:
- No console errors on any page
- Header: Browse dropdown opens/closes (button, Esc, outside click), 8 category links + counts, category click lands on the pre-filtered library, auto-hide on scroll down / restore on scroll up, dropdown stays pinned while open, no other sticky element exists, mobile header is two rows with a full-width search bar and the mobile menu shows the category grid
- Type: all six `@font-face` loads register as `loaded` (Fraunces, Public Sans, IBM Plex Mono) on home, library and role pages
- Anchors: `#builder` / `#library` / `#doctor` land 96px down (`scroll-padding-top`), so the sticky nav never covers a section head
- Studio: all six model engines, presets, deep links (`?task=&role=&model=`), guardrails toggle, copy → clipboard, download `.md`, open-in links
- Voice: mic present in the header search (all pages), Studio and Doctor; clicking enters the listening state (pulse + "Listening…" toast); unsupported browsers hide the control
- Colour: category accents flow from `data.js` into cat cards, chips, drawer and variable chips (verified via computed styles); role-card and stat palettes rotate ember/iris/amber/pine
- Doctor: scoring, ring, checks, fixes
- Library: header-search live filter (typing updates grid + `?q` URL, clearing restores), “Filtered by” pills with ✕ clear, URL state (q/category/model/role), deep-linked drawer
- Drawer: related prompts, share link, Markdown download
- Enter in the header search from any non-library page → `library.html?q=…`
- 0 broken internal links across 25 pages

## Deploy

Any static host works — it's plain HTML/CSS/JS:

- **Netlify / Cloudflare Pages:** drag the folder in, or connect the repo. No build command needed (or set it to `node build.js` if you want regeneration on deploy).
- **Vercel:** framework preset "Other", output directory `.`.
- **GitHub Pages:** push and enable Pages.

Then:
1. Replace `https://promptfoundry.example` with your real domain (in `config` in `data.js`, plus the `<link rel="canonical">` and OG tags in each HTML head).
2. Replace the privacy policy template with a reviewed one, and wire the newsletter form to your email provider (currently it validates and confirms client-side only).
3. Add analytics (privacy-friendly by default) and an ad script only after reading `PLAN.md` → monetization.
