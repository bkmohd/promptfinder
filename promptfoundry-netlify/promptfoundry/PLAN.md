# PromptFoundry — launch & growth plan

This is the operator's document: what was built, why, and what to do in the next 90 days. The site is the product; this is the plan around it.

---

## 1. The bet, stated honestly

The original thesis was right about demand and wrong about defensibility. "Prompt library" is the single easiest category to clone: any competitor can publish 1,000 prompts in a weekend, and Google's AI Overviews will happily summarise "10 prompts for X" without sending a click.

So the site is built around three things a copycat can't fake and an AI Overview can't replace:

1. **A tool, not a list.** The Prompt Studio outputs genuinely different prompt structures per model (XML for Claude, citation instructions for Gemini, parameter grammar for Midjourney). Copying that means doing the work.
2. **Test metadata.** Every prompt shows pass rate, last-tested date and models run. That is a real, auditable claim — and it is the only reason a visitor should trust this library over a random Medium post.
3. **Interactivity as the page's value.** Copy buttons, variable fields, model-specific outputs, an instant grader. AI Overviews summarise prose; they don't fill your variable fields or hand you a copy-ready XML prompt for Claude.

**Positioning line:** *Prompts that survive the upgrade.* The category leader will be whoever owns "tested", not whoever owns "10,000 prompts".

---

## 2. What shipped

- **25 pages**: homepage, library, roles index + 14 role pages, guides index + 3 guides, how-we-test, about, privacy, 404.
- **26 tested prompts** across 8 categories and 14 roles, each with pass rate, test date, model list, variables, example output and a note.
- **Prompt Studio**: 6 model engines, 24 LLM tasks, 6 image tasks, tone/format/guardrail controls, live strength score, copy, `.md` export, open-in links.
- **Prompt Doctor**: 9-check heuristic grader with per-check fixes, runs locally.
- **SEO foundations**: per-page titles/descriptions/canonicals, OG tags, JSON-LD (`WebSite`, `CollectionPage`, `ItemList`, `FAQPage`, `BreadcrumbList`, `Article`), sitemap, robots, internal-link mesh, deep-linkable prompts (`library.html?p=slug`).
- **Trust pages**: methodology with rubric + public changelog, about/funding, ad & affiliate disclosure.

---

## 3. Page math — and the guardrail

The programmatic surface is real: **role × task × model**.

| Layer | Count now | Realistic ceiling | Index policy |
|---|---|---|---|
| Role pages (`/roles/{role}`) | 14 | 40–60 jobs | Publish when ≥3 tested prompts |
| Task pages (`/prompts/{task}` e.g. cold email) | 24 in Studio | 150–300 | Publish when the task has a tested prompt + example output |
| Model hubs (`/models/{model}` e.g. "Claude prompts") | 0 | 6–10 | Publish with model-specific notes, not a re-list |
| Guides | 3 | 20–30 | Only where we have test data or original screenshots |

**The guardrail that keeps this from becoming a content farm:** *no page without tested material.* A role with one good prompt gets one honest page, not forty auto-generated ones. Google's scaled-content policy targets pages whose value is the volume; this site's insurance is the opposite — every page carries a date, a pass rate and a working tool link.

Practical rule of thumb: **for every 1 programmatic page you publish, add 1 real test cycle.** At 26 prompts and 260 runs, the current library supports roughly 25–30 pages. Do not go to 300 pages before you can support them.

---

## 4. 90-day content roadmap

**Weeks 1–2 — finish the foundation**
- Replace placeholder domain, email, privacy policy.
- Wire the newsletter form to a provider (Buttondown, ConvertKit, MailerLite).
- Add analytics (Plausible/Fathom). Set up Search Console + Bing Webmaster.
- Ship the 3 guides with original screenshots of test runs (real outputs, not mockups).

**Weeks 3–6 — depth before width**
- Add 14 prompts to reach 40, prioritising the highest commercial intent: cold email, LinkedIn, code review, PRD, SQL, résumé, job description, SEO brief.
- Build the first 6 **model hub** pages: `/models/chatgpt`, `/models/claude`, `/models/gemini`, `/models/grok`, `/models/midjourney`, `/models/gpt-image`. Real model notes + the prompts tested on that model.
- Publish the first public test report ("We ran 26 prompts 10× on GPT-6.1 and Claude Sonnet 5.5 — here's what broke"). This is the linkbait asset that listicles can't produce.

**Weeks 7–10 — distribution**
- Free embeddable tool: a "Prompt Doctor" badge/embed that other sites can iframe. Every embed is a backlink.
- Reddit/HN/Slack play: post the *test results*, never the homepage. r/PromptEngineering, r/ChatGPT, r/ClaudeAI, r/marketing all punish self-promo but reward data.
- Newsletter: start the Friday drop. First 1,000 subscribers matters more than the first 1,000 visitors.

**Weeks 11–13 — monetise and measure**
- Ad network decision (see below) based on session thresholds.
- Add 10 task pages from the Studio's task list, each with a tested prompt, an example output and model notes.
- Prune: any page with <5% CTR to a tool or prompt after 60 days gets merged or improved. Kill the losers loudly.

---

## 5. Monetization — in the right order

The site is ad-shaped (browsy, multi-page, US/UK-skewing), but ads should arrive **after** trust, not before. An ad-heavy prompt site in month one looks like a content farm; the same site at 50k sessions with test data looks like a publication.

**Phase 1 (0–10k sessions): affiliate + owned products.**
- Affiliate links to models/tools in model notes (labelled).
- A paid **"Tested Prompt Pack"** for a specific niche (e.g. 50 tested e-commerce prompts) — $19, no platform needed.
- A **team library build** service: "we test 30 prompts for your workflow" — high margin, uses the Studio.

**Phase 2 (10k–50k sessions): display ads.**
- Ezoic/AdSense at the low end, Mediavine/Journey (~50k sessions) higher up. RPM for this audience is strong because of the US/UK skew — but **never put ads inside the Studio output, between a prompt and its copy button, or above the fold on mobile.** That placement policy is the difference between "useful tool" and "ad page".
- Keep a hard rule in the about page: ads never change a test score. It's both true and a moat.

**Phase 3 (50k+): sponsorship.**
- A model provider or AI tool paying for a clearly-labelled "sponsored test" or newsletter slot. The test methodology is the reason they'd pay — a sponsored test that passes is worth more to them than an untested ad.

**What not to do:** pop-ups, interstitials, fake "AI detected your prompt" gimmicks, or auto-generated 10,000-page libraries. The first two kill trust; the third kills the domain.

---

## 6. SEO / GEO checklist

**Already done**
- Unique title + description per page; canonical URLs; OG/Twitter tags.
- JSON-LD: WebSite, CollectionPage, ItemList, FAQPage, BreadcrumbList, Article.
- Clean URLs (`/roles/marketing.html`, deep links via `?p=`), sitemap, robots.
- Dense internal linking: home → categories → library → role pages → Studio with role/task pre-filled; every prompt links back into the Studio.

**Next**
- Shorten titles to ≤60 chars where possible (role pages are close; check in Search Console once live).
- Add `FAQPage` schema to task pages (the "how do I prompt for X" questions).
- Create one **linkable data asset per quarter** (test report, rubric, benchmark). This category has almost no original data — publishing it is the cheapest moat available.
- Add `lastmod` accuracy to the sitemap on every test cycle.
- Watch AI Overview impressions in Search Console; if a role page is being summarised without clicks, add an interactive element to it (the Studio with the role pre-filled already is one — measure CTR).

**GEO (generative engine optimisation)**
- The Studio and Doctor are the anti-summary. Keep them above the fold on desktop, one tap on mobile.
- Publish the rubric in machine-readable form; AI answer engines cite pages with explicit methodology.
- Keep model names/versions in headings ("GPT-6.1 prompts", "Claude Sonnet 5.5 prompts") — those are the queries people actually type.

---

## 7. Metrics that matter

| Metric | Why | Target by day 90 |
|---|---|---|
| Pages with a test date | Credibility proxy | 100% |
| Prompts tested / week | The flywheel's fuel | 4 |
| Return visitor rate | Tool vs listicle | >25% |
| Newsletter subscribers | Owned distribution | 1,000 |
| Copy-button rate per session | The page is working | >35% |
| Studio sessions → copy | Builder is the moat | >50% |
| Organic sessions | The original thesis | 10k/mo |
| Ad RPM (once live) | Revenue | Track, don't chase |

---

## 8. Risks, and the built-in answer

| Risk | Answer already in the build |
|---|---|
| AI Overviews eat prompt pages | Interactivity (Studio, Doctor, copy), test data, model versions in headings |
| Zero moat / clones | Test log + changelog + model-aware outputs are expensive to fake |
| Google scaled-content penalty | Deliberate page cap tied to tested material; no auto-generated filler |
| Model provider ToS / trademark issues | Independent, disclaimed in footer + about; no logos used, only names/badges |
| Stale content after model releases | Changelog page, monthly re-test cadence, test dates on every card |
| Ad blindness / trust erosion | Placement policy, disclosure page, "ads never change a score" rule |

---

## 9. Copy-paste launch sequence

1. `node build.js` → confirm 25 pages.
2. Deploy `promptfoundry/` to Netlify/Cloudflare Pages.
3. Point domain, update `config.url` in `assets/data.js` + canonicals.
4. Search Console + sitemap submit; analytics; newsletter provider.
5. Publish the first test report as `/guides/what-broke-this-month.html`.
6. Submit to: r/PromptEngineering (data post), Hacker News "Show HN" (tool post), Indie Hackers, two AI newsletters (offer an exclusive test).
7. Set a calendar reminder: **monthly re-test day**. The product is the habit.
