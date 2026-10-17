/* ============================================================
   PromptFoundry — data layer
   Single source of truth for prompts, roles, categories, models
   and the builder's task templates. Edit this file, then run
   `node build.js` to regenerate role pages + sitemap.
   ============================================================ */

window.PF = (function () {

  const config = {
    name: "PromptFoundry",
    wordmark: "promptfoundry",
    tagline: "Field-tested AI prompts.",
    description:
      "A tested prompt library, a model-aware prompt builder, and a doctor for the prompts you already wrote.",
    url: "https://promptfoundry.example",
    email: "hello@promptfoundry.example",
    updated: "2026-10-17",
    updatedLabel: "17 Oct 2026",
    newsletter: "Five freshly tested prompts, every Friday."
  };

  /* ---------------- MODELS ---------------- */
  const models = [
    {
      id: "chatgpt", name: "ChatGPT", version: "GPT-6.1", family: "OpenAI",
      badge: "GP", color: "#0E8F6E", engine: "md", chat: true, prefill: true,
      url: "https://chatgpt.com/?q=",
      note: "Markdown structure, explicit deliverables, self-check before answering."
    },
    {
      id: "claude", name: "Claude", version: "Sonnet 5.5", family: "Anthropic",
      badge: "CL", color: "#C15F3C", engine: "xml", chat: true, prefill: true,
      url: "https://claude.ai/new?q=",
      note: "XML tags, long context, careful step-by-step reasoning."
    },
    {
      id: "gemini", name: "Gemini", version: "3.8 Pro", family: "Google",
      badge: "GM", color: "#3B6FE0", engine: "gemini", chat: true, prefill: false,
      url: "https://gemini.google.com/app",
      note: "Citations, structured sections, step-by-step verification."
    },
    {
      id: "grok", name: "Grok", version: "4.7", family: "xAI",
      badge: "GK", color: "#111111", engine: "grok", chat: true, prefill: false,
      url: "https://grok.com/",
      note: "Real-time context, blunt delivery, no preamble."
    },
    {
      id: "midjourney", name: "Midjourney", version: "V8.2", family: "Midjourney",
      badge: "MJ", color: "#5B4B8A", engine: "mj", chat: false,
      url: "https://www.midjourney.com/imagine",
      note: "Descriptor grammar, parameters, negative prompts."
    },
    {
      id: "gptimage", name: "GPT Image", version: "2.5", family: "OpenAI",
      badge: "GI", color: "#C2700C", engine: "img", chat: false,
      url: "https://chatgpt.com/",
      note: "Natural-language scenes, legible text, editing instructions."
    }
  ];

  /* ---------------- CATEGORIES ---------------- */
  const categories = [
    { id: "writing",   name: "Writing",   hue: "#C15F3C", hueSoft: "#F3E2D8", desc: "Posts, newsletters, docs and edits that keep their voice." },
    { id: "growth",    name: "Sales & growth", hue: "#0E8F6E", hueSoft: "#DDF0EA", desc: "Cold email, pricing, discovery — revenue-facing work." },
    { id: "code",      name: "Engineering", hue: "#3B6FE0", hueSoft: "#E2EAFB", desc: "Reviews, debugging and queries that survive production." },
    { id: "analysis",  name: "Analysis",  hue: "#A96800", hueSoft: "#F4E8CF", desc: "Evidence, memos and synthesis with the receipts attached." },
    { id: "design",    name: "Design",    hue: "#5B4B8A", hueSoft: "#E8E4F2", desc: "Art direction and image prompts with parameters, not vibes." },
    { id: "learning",  name: "Learning",  hue: "#7C4A6B", hueSoft: "#F0E2EC", desc: "Study loops that make you explain, not re-read." },
    { id: "people",    name: "People",    hue: "#2E5E8C", hueSoft: "#DEE8F2", desc: "Hiring and support that stays structured and human." },
    { id: "everyday",  name: "Everyday",  hue: "#8A5A2B", hueSoft: "#F0E4D6", desc: "Dinner, calendars, résumés, SOPs — real life, handled." }
  ];

  /* ---------------- ROLES ---------------- */
  const roles = [
    {
      slug: "marketing", name: "Marketers", singular: "marketer", category: "Growth",
      blurb: "Campaigns, launches and copy that have to ship this week, not next quarter.",
      pins: ["Voice matching", "Launch copy", "Newsletter writing"],
      queries: ["ChatGPT prompts for marketers", "Claude prompts for campaign briefs", "AI prompts for LinkedIn posts"]
    },
    {
      slug: "sales", name: "Sales teams", singular: "seller", category: "Growth",
      blurb: "Prospecting and discovery that earns a reply instead of a delete.",
      pins: ["Cold email", "Discovery calls", "Follow-ups"],
      queries: ["ChatGPT prompts for cold email", "AI prompts for sales discovery", "Claude prompts for follow-ups"]
    },
    {
      slug: "engineering", name: "Engineers", singular: "engineer", category: "Engineering",
      blurb: "Reviews, debugging and docs that respect your on-call rotation.",
      pins: ["Code review", "Debugging", "API docs"],
      queries: ["ChatGPT prompts for code review", "Claude prompts for debugging", "AI prompts for API documentation"]
    },
    {
      slug: "product", name: "Product managers", singular: "product manager", category: "Product",
      blurb: "From messy notes to a PRD, a pricing page and a teardown that cites sources.",
      pins: ["PRDs", "Pricing copy", "Competitor teardowns"],
      queries: ["ChatGPT prompts for product managers", "AI prompts for PRDs", "Claude prompts for competitor analysis"]
    },
    {
      slug: "design", name: "Designers", singular: "designer", category: "Design",
      blurb: "Art direction and image prompts with parameters, not vibes.",
      pins: ["Posters", "Product shots", "Style systems"],
      queries: ["Midjourney prompts for designers", "GPT Image prompts for product shots", "AI prompts for art direction"]
    },
    {
      slug: "data", name: "Data analysts", singular: "analyst", category: "Data",
      blurb: "Queries and memos that survive a second look.",
      pins: ["SQL review", "Decision memos", "Metric definitions"],
      queries: ["ChatGPT prompts for data analysts", "Claude prompts for SQL review", "AI prompts for analysis memos"]
    },
    {
      slug: "research", name: "Researchers", singular: "researcher", category: "Research",
      blurb: "Synthesis that keeps the quotes, and the contradictions.",
      pins: ["Interview synthesis", "Usability notes", "Theme extraction"],
      queries: ["Claude prompts for user research", "AI prompts for interview synthesis", "ChatGPT prompts for UX research"]
    },
    {
      slug: "support", name: "Support leads", singular: "support lead", category: "CX",
      blurb: "Replies that calm the ticket without giving away the store.",
      pins: ["De-escalation", "Macro writing", "Internal notes"],
      queries: ["ChatGPT prompts for customer support", "AI prompts for angry customers", "Claude prompts for support replies"]
    },
    {
      slug: "hr", name: "People teams", singular: "people lead", category: "People",
      blurb: "Hiring that is structured, specific and legally a little safer.",
      pins: ["Interview plans", "Job posts", "Rubrics"],
      queries: ["ChatGPT prompts for hiring managers", "AI prompts for interview questions", "Claude prompts for job descriptions"]
    },
    {
      slug: "education", name: "Teachers & students", singular: "learner", category: "Learning",
      blurb: "Study loops that make you explain, not re-read.",
      pins: ["Study sprints", "Language practice", "Lesson plans"],
      queries: ["ChatGPT prompts for studying", "AI prompts for language learning", "Claude prompts for lesson plans"]
    },
    {
      slug: "operations", name: "Ops teams", singular: "ops lead", category: "Operations",
      blurb: "SOPs a new hire can follow on day one.",
      pins: ["SOPs", "Process docs", "Troubleshooting"],
      queries: ["ChatGPT prompts for operations", "AI prompts for SOPs", "Claude prompts for process documentation"]
    },
    {
      slug: "creators", name: "Creators", singular: "creator", category: "Content",
      blurb: "Edits, scripts and posts that still sound like you.",
      pins: ["Editing", "Voice matching", "Scripts"],
      queries: ["ChatGPT prompts for content creators", "AI prompts for YouTube scripts", "Claude prompts for editing"]
    },
    {
      slug: "career", name: "Job seekers", singular: "job seeker", category: "Career",
      blurb: "Résumés and interview prep that do not invent experience.",
      pins: ["Résumé tailoring", "Interview prep", "Cover notes"],
      queries: ["ChatGPT prompts for résumés", "AI prompts for job applications", "Claude prompts for interview prep"]
    },
    {
      slug: "everyday", name: "Everyday life", singular: "human", category: "Life",
      blurb: "Dinner from the fridge, and a week that fits in a calendar.",
      pins: ["Meal planning", "Weekly resets", "Travel"],
      queries: ["ChatGPT prompts for meal planning", "AI prompts for weekly planning", "Claude prompts for life admin"]
    }
  ];

  /* ---------------- PROMPTS ---------------- */
  const prompts = [
    {
      slug: "cold-email-that-gets-replies", title: "The 30-second cold email",
      role: "sales", category: "growth", task: "cold-email", models: ["chatgpt", "claude", "grok"],
      blurb: "One trigger, one proof point, one ask — built to be read on a phone.",
      tested: "2026-10-12", pass: "9/10",
      template: `You are a B2B sales writer who has booked hundreds of meetings with cold email. You write like a human, not a brochure.

# TASK
Write a cold email to [PROSPECT] ([PROSPECT_ROLE] at [COMPANY]) about [PRODUCT].

# WHAT I KNOW
- Trigger (why now): [TRIGGER]
- Proof (a specific result or number): [PROOF]
- The ask: [CTA]
- Relationship: [RELATIONSHIP]

# RULES
- Subject line: max 6 words, lowercase, no clickbait.
- Body: under 90 words. One idea, one proof point, one ask.
- Open with the trigger. Never open with "I hope this finds you well".
- No adjectives about us. Ban "revolutionary", "seamless", "game-changing".
- Write at a 6th-grade reading level.
- End with a question that can be answered in one line.

# OUTPUT
1. Three subject lines.
2. The email.
3. A 2-line follow-up to send in 4 days.

# BEFORE YOU ANSWER
If the trigger or proof is missing, ask me for it instead of inventing one.`,
      example: "Subject: your second warehouse\n\nSaw Northwind is opening a second hub in Leeds — congrats. When Acme did the same, pick times dropped 22% in six weeks after we rebuilt their slotting logic. Worth 15 minutes to see if the same applies to you?",
      tip: "A trigger beats personalisation. \"Saw you're hiring SDRs\" outperforms \"loved your website\" every time."
    },
    {
      slug: "linkedin-post-in-your-voice", title: "LinkedIn post in your own voice",
      role: "marketing", category: "writing", task: "linkedin", models: ["chatgpt", "claude"],
      blurb: "Feed the model three of your real posts. Get a post that sounds like you, not like LinkedIn.",
      tested: "2026-10-08", pass: "8/10",
      template: `You are a ghostwriter who has written for [ROLE] for years. Your job is to make this sound like me — not like LinkedIn.

# MY VOICE
Here are three posts I wrote:
[POST_1]
[POST_2]
[POST_3]
Notice my sentence length, how I open, the words I actually use, and how I end.

# THE POST
Topic: [TOPIC]
The one thing readers should take away: [POINT]
A story, number or moment I can use: [ANECDOTE]
Who it is for: [AUDIENCE]

# RULES
- 120–180 words. Short paragraphs, 1–2 lines each.
- Open with a specific moment, not a statistic.
- No hashtag spam, no "Agree?", no rocket emojis, no listicle unless I already write them.
- Match my voice from the samples. If I am dry, stay dry.
- One idea only.

# OUTPUT
1. The post.
2. Three alternative opening lines.
3. A note on which of my habits you copied — so I can check your work.`,
      example: "A client asked me to write their launch post. I sent back a question instead: what changed for the customer on Tuesday that wasn't true on Monday? Three days later we had the post. It was two sentences.",
      tip: "Three samples is the minimum. If the model's draft sounds like a conference speaker, it did not read your samples closely enough."
    },
    {
      slug: "newsletter-from-five-links", title: "Newsletter from five links",
      role: "marketing", category: "writing", task: "newsletter", models: ["claude", "gemini"],
      blurb: "Turn this week's tab pile into a 400-word issue with a through-line and sources attached.",
      tested: "2026-10-05", pass: "9/10",
      template: `You are the editor of a [NICHE] newsletter read by [AUDIENCE] — smart, busy, allergic to hype.

# SOURCE MATERIAL
This week's links and excerpts:
[SOURCES]

# TASK
Turn them into this week's issue.

# RULES
- Find the strongest through-line across the sources. If there isn't one, say so and pick the best single story.
- Every claim needs a source from the list. No outside facts unless flagged [EXTERNAL].
- Explain why each item matters to [AUDIENCE] in one sentence.
- 400 words max: subject line, preview text, three items, one closing thought.
- No "in today's fast-paced world".

# OUTPUT
Subject line (max 45 characters), preview text, then the issue in markdown. End with a one-line question for readers.`,
      example: "Subject: The quiet death of the demo call\nPreview: Three links on why buyers stopped booking demos — and what replaced them.",
      tip: "Make it find the through-line, not invent one. \"No through-line\" is a valid, useful answer."
    },
    {
      slug: "magazine-editor-edit", title: "The magazine-editor edit",
      role: "creators", category: "writing", task: "edit", models: ["chatgpt", "claude", "gemini"],
      blurb: "Cuts 30% without sanding off the voice — and tells you exactly what it changed.",
      tested: "2026-09-30", pass: "10/10",
      template: `You are a magazine editor known for cutting 30% without losing the writer's voice.

# DRAFT
[DRAFT]

# BRIEF
Publication: [PUBLICATION]
Reader: [READER]
Word target: [TARGET_WORDS]

# HOW TO EDIT
- Keep my voice and my best three lines. Name them at the end.
- Cut clichés, throat-clearing, hedges and repeated ideas.
- Replace adverb + weak verb with one strong verb.
- Fix structure first, then sentences. Flag anything that needs a fact-check.
- Do not add new claims or filler to hit the word target.

# OUTPUT
1. Edited draft at the target length.
2. A changelog: what you cut and why (5 bullets max).
3. The three lines you kept, and the one section that needs me to rewrite it.`,
      example: "Kept: \"The dashboard was beautiful. Nobody opened it.\" Cut 41 words of setup, one hedge, and a paragraph that repeated the intro in different shoes.",
      tip: "Ask for the changelog. An editor that can't explain its cuts is just a summariser."
    },
    {
      slug: "launch-announcement-three-ways", title: "Launch announcement, three ways",
      role: "marketing", category: "writing", task: "launch", models: ["chatgpt", "claude"],
      blurb: "Email, LinkedIn and a Product Hunt tagline — one voice, three formats, no exclamation marks.",
      tested: "2026-10-01", pass: "8/10",
      template: `You are a launch copywriter who has shipped [LAUNCH_COUNT] product launches.

# THE LAUNCH
Product: [PRODUCT] — [ONE_LINER]
Who it is for: [AUDIENCE]
The change it makes: [BEFORE_AFTER]
Proof: [PROOF]
Availability: [DATE_PRICE_LINK]

# TASK
Write the launch three ways:
1. Email to existing users (150 words) — warm, specific, one CTA.
2. LinkedIn post (120 words) — story first, no feature dump.
3. Product Hunt tagline (60 characters max) + a 3-line description.

# RULES
- Lead with the user's before/after, not the feature name.
- One CTA per asset.
- No "excited to announce", no "game-changer", no exclamation marks.
- Every claim must trace to the proof above.

# OUTPUT
Three assets, clearly labelled, plus one line explaining the trade-off you made in each format.`,
      example: "Tagline: Your prompt library, but tested.\n\nBefore: prompts were scattered across Notion, Slack and screenshots. After: one library with test dates.",
      tip: "The email and the LinkedIn post should not share an opening line. Different room, different entrance."
    },
    {
      slug: "prd-from-messy-notes", title: "PRD from a pile of notes",
      role: "product", category: "writing", task: "prd", models: ["claude", "chatgpt"],
      blurb: "Turns a meeting transcript into a one-page PRD engineers will actually read.",
      tested: "2026-10-11", pass: "9/10",
      template: `You are a senior product manager at a [STAGE] company. You write PRDs that engineers actually read.

# RAW MATERIAL
[NOTES]

# TASK
Turn this into a one-page PRD for [FEATURE].

# STRUCTURE
1. Problem — who hurts, how often, evidence. Quote the notes.
2. Why now — what changed.
3. Scope — three must-haves, explicit non-goals.
4. Experience — happy path in five steps, edge cases after.
5. Success metric — one number, a baseline and a target.
6. Risks and open questions — with owners.

# RULES
- Under 700 words.
- Do not invent evidence. Anything not in the notes gets tagged [ASSUMPTION].
- If the problem is unclear, stop and list the three questions I must answer first.
- No solution-jumping before the problem is stated.`,
      example: "Problem: support leads rebuild the same weekly report by hand every Monday (6 of 8 interviews). Evidence: \"I lose half a day to copy-paste.\"",
      tip: "The non-goals section is where a PRD earns its keep. Make the model fight for them."
    },
    {
      slug: "api-docs-from-code", title: "API docs from a messy file",
      role: "engineering", category: "writing", task: "api-docs", models: ["claude", "gemini"],
      blurb: "Reference docs generated from the source of truth: the code itself.",
      tested: "2026-09-28", pass: "9/10",
      template: `You are a developer-experience writer who documents APIs so well that support tickets drop.

# CODE
[CODE]

# CONTEXT
Stack: [STACK]
Who calls this: [CALLER]
Auth model: [AUTH]

# TASK
Write reference documentation for this endpoint or function.

# INCLUDE
- One-line summary and when to use it.
- Request: method, path, parameters in a table (name, type, required, default, notes).
- Example request in curl and [LANGUAGE].
- Response: success shape, error codes and what to do about each.
- One realistic gotcha drawn from the code (validation, rate limit, ordering).
- A short usage example.

# RULES
- Document only what the code does. Mark anything unclear as [VERIFY].
- No marketing language. No invented parameters.`,
      example: "Returns 409 when an idempotency key is reused with a different payload — retry with a new key, do not reuse the response body.",
      tip: "Point it at the handler, not at the wiki. Documentation drifts; code is the primary source."
    },
    {
      slug: "pricing-page-objections", title: "Pricing page that answers objections",
      role: "product", category: "growth", task: "pricing", models: ["chatgpt", "claude"],
      blurb: "Rewrite the page so the top three sales objections get answered before they're raised.",
      tested: "2026-10-09", pass: "8/10",
      template: `You are a conversion copywriter who has rewritten dozens of B2B pricing pages.

# CURRENT PAGE
[CURRENT_COPY]

# CONTEXT
Plans: [PLANS]
Buyer: [BUYER]
Top objections from sales calls: [OBJECTIONS]

# TASK
Rewrite the page so it answers objections before they are raised.

# RULES
- For each plan: who it is for, the outcome it buys, what is included, what is not.
- Answer each objection in plain language, next to the plan it affects.
- Add one honest "probably not for you if…" line per plan.
- No fake urgency. No "contact us for pricing" on the base plan.
- Headings under nine words.

# OUTPUT
Page in markdown with sections, a plan table and an objection FAQ. Tag any claim needing legal review as [LEGAL].`,
      example: "Probably not for you if you send fewer than 200 emails a month. The Starter plan still works; you just don't need us yet.",
      tip: "Honest disqualifiers increase trust and reduce refunds. Ask for them explicitly or the model will skip them."
    },
    {
      slug: "discovery-call-arc", title: "The discovery-call question arc",
      role: "sales", category: "growth", task: "discovery", models: ["claude", "gemini"],
      blurb: "Twelve questions in the right order, plus what to listen for after each answer.",
      tested: "2026-10-03", pass: "9/10",
      template: `You are a sales coach who trains reps to run quiet, useful discovery calls.

# THE CALL
Rep: [REP]
Prospect: [PROSPECT]
What we sell: [PRODUCT]
What I already know: [RESEARCH]

# TASK
Build my question arc for a 25-minute call.

# RULES
- Questions only — no pitching. Twelve questions max, in order.
- Start wide (situation), narrow to impact, end on decision process.
- Questions must be answerable out loud. Only commitment questions can be yes/no.
- Include two questions that surface the cost of doing nothing.
- Include one question that tests whether I am talking to the right person.
- After each question, note what to listen for.

# OUTPUT
Numbered arc with purpose labels, then a three-line close that earns the next meeting.`,
      example: "5. \"When this goes wrong today, who feels it first?\" Listen for: a name and a department. If neither appears, the pain is not owned.",
      tip: "The best discovery question is the one you can't answer for them. Test each question against that."
    },
    {
      slug: "deescalation-support-reply", title: "De-escalation support reply",
      role: "support", category: "growth", task: "support", models: ["chatgpt", "claude"],
      blurb: "Acknowledge the frustration, fix what's fixable, and never say 'inconvenience'.",
      tested: "2026-10-07", pass: "9/10",
      template: `You are a customer support lead who resolves angry tickets without giving away the store.

# THE TICKET
Customer message: [TICKET]
Account: [ACCOUNT]
What actually happened: [FACTS]
What I can offer: [OFFER]

# TASK
Draft the reply.

# RULES
- Acknowledge the specific frustration in one line, in their words.
- Take responsibility for what is ours; be precise about what is not.
- No "we apologize for any inconvenience". No policy lecture.
- Give the fix with exact steps and a timeline.
- If policy says no, say no once, clearly, and offer what you can.
- Under 140 words. Grade 7 reading level.
- End with one next step and who owns it.

# ALSO
Give me a two-sentence internal note, and one sentence I should NOT say — with the reason.`,
      example: "Not this: \"Unfortunately, per our policy…\" It tells the customer the conversation is over before it starts.",
      tip: "The internal note is the part teams keep. It makes the reply auditable later."
    },
    {
      slug: "senior-code-review", title: "Senior-level code review",
      role: "engineering", category: "code", task: "code-review", models: ["claude", "chatgpt"],
      blurb: "A rubric, line numbers and zero praise sandwiches. Blockers first.",
      tested: "2026-10-14", pass: "10/10",
      template: `You are a staff engineer reviewing a pull request. You are direct, specific, and you rank issues by severity.

# THE CHANGE
[DIFF]

# CONTEXT
What this code does: [CONTEXT]
What the author is trying to achieve: [INTENT]

# REVIEW RUBRIC, IN ORDER
1. Correctness — logic errors, edge cases, null/empty, concurrency.
2. Security — injection, authz, secrets, unsafe deserialisation, SSRF.
3. Failure modes — timeouts, retries, partial writes, observability.
4. Performance — N+1, unbounded loops, memory, unnecessary work.
5. Readability and tests — naming, dead code, missing tests.

# OUTPUT
- Blockers (must fix): file:line, why, suggested fix in code.
- Should-fix: same format.
- Nits: max three, grouped.
- One positive note, specific.
- If the diff is too incomplete to judge, say what you need first.

# RULES
- No praise sandwiches. No restating the rubric. Cite line numbers.`,
      example: "Blocker — api/webhooks.ts:42: signature compared with ===. Use crypto.timingSafeEqual, otherwise the endpoint leaks timing information.",
      tip: "Feed it the intent, not just the diff. A reviewer without intent guesses wrong about design."
    },
    {
      slug: "debugging-partner", title: "Debugging partner that isolates first",
      role: "engineering", category: "code", task: "debug", models: ["claude", "chatgpt"],
      blurb: "No guessing. Boundaries, cheap tests, one fix at the end.",
      tested: "2026-10-06", pass: "9/10",
      template: `You are a senior debugging partner. You do not guess — you narrow.

# THE BUG
Symptom: [SYMPTOM]
Expected: [EXPECTED]
Frequency: [FREQUENCY]
Environment: [STACK]
What changed recently: [CHANGES]
What I already tried: [TRIED]

# METHOD
1. Restate the symptom as a falsifiable statement.
2. List the 3–5 boundaries the bug could live in: input, parsing, state, IO, concurrency, config, environment.
3. For each boundary, give ONE cheap test that eliminates it. Order by cost.
4. Wait for my results before proposing a fix.
5. When we find it, explain the root cause and one regression test.

# RULES
- Do not suggest fixes until the boundary is isolated.
- If you need a log line, write the exact command or snippet to run.
- Call out assumptions you are making.`,
      example: "Before any fix: does it reproduce with the cache disabled? If yes, the bug is not in the cache layer — we've eliminated one boundary for free.",
      tip: "Tell it to wait. The most expensive debugging prompts are the ones that hand you a fix in step one."
    },
    {
      slug: "sql-review", title: "SQL review before production",
      role: "data", category: "code", task: "sql", models: ["claude", "chatgpt"],
      blurb: "Catches fan-out, timezone bugs and the query that quietly scans the whole table.",
      tested: "2026-09-26", pass: "9/10",
      template: `You are a senior analytics engineer reviewing a query before it hits production.

# QUERY
[QUERY]

# CONTEXT
Warehouse: [WAREHOUSE]
Table sizes: [TABLE_SIZES]
What the query should answer: [QUESTION]
Freshness need: [FRESHNESS]

# REVIEW
1. Correctness — join fan-out, grain, dedupe, timezone, NULLs.
2. Cost — scans, partition pruning, clustering, cartesian risks.
3. Readability — CTEs, naming, comments.
4. A rewritten query in the same dialect, with comments on what changed.
5. A plain-English description of the result grain, so I can sanity-check it.

# RULES
- Assume columns are table.column. If a column is ambiguous, ask.
- Do not give indexing advice without knowing the platform.
- Flag metric definitions that look wrong as [DEFINITION?].`,
      example: "Result grain: one row per account per day, not per user. The join on events fans out before the distinct — that's why yesterday's count doubled.",
      tip: "Ask for the result grain in plain English. It catches more errors than a line-by-line review."
    },
    {
      slug: "competitor-teardown", title: "Evidence-only competitor teardown",
      role: "product", category: "analysis", task: "teardown", models: ["gemini", "grok"],
      blurb: "Every claim sourced and dated. Opinion clearly labelled.",
      tested: "2026-10-10", pass: "8/10",
      template: `You are a competitive intelligence analyst. You only report what you can cite.

# SUBJECT
Competitor: [COMPETITOR] ([URL])
Our product: [OUR_PRODUCT]
Who we sell to: [ICP]
What decision this feeds: [DECISION]

# TASK
Build an evidence-only teardown.

# SECTIONS
1. What they sell, in their own words — quote them.
2. Pricing and packaging — cite the page and access date.
3. Claimed differentiation, and whether the claim is verifiable.
4. Evidence of traction: public signals only (hiring, changelog, reviews).
5. Where they are weak or silent — what customers complain about, with sources.
6. So what: three implications for our positioning, each tied to evidence.

# RULES
- Every factual line gets a source and an access date. Anything unsourceable: [UNVERIFIED].
- Do not infer pricing from third parties. If hidden, write "not public".
- Label observation vs. opinion explicitly.`,
      example: "Pricing: no public page; G2 reviews (accessed 10 Oct 2026) mention per-seat billing. Implication: we can win on predictable pricing, but validate willingness to pay first.",
      tip: "Use a model with web access, then make it show its work. Date every source or the teardown rots."
    },
    {
      slug: "spreadsheet-to-memo", title: "Messy spreadsheet → decision memo",
      role: "data", category: "analysis", task: "sheet-memo", models: ["chatgpt", "claude"],
      blurb: "What the data can answer, what it can't, and the one number that matters.",
      tested: "2026-10-02", pass: "9/10",
      template: `You are an operations analyst who turns messy exports into one-page memos executives actually read.

# DATA
[DATA]

# CONTEXT
Time period: [PERIOD]
Known data issues: [DATA_ISSUES]
The decision this informs: [DECISION]

# TASK
1. State what the dataset can and cannot answer — before analysing.
2. Calculate the numbers that matter for this decision. Show formulas in words.
3. Give three findings, each with the number, the comparison and the "so what".
4. Recommend one action, with confidence and what would change your mind.
5. List three checks I should run to trust this.

# RULES
- No fabricated numbers. If a calculation needs missing data, say so.
- Percentages need a base (n = ?). Round sensibly.
- Separate correlation from cause, out loud.`,
      example: "The unanswered question: this export has no acquisition source, so it can tell us churn went up — not why. Recommendation: fix tracking before the next pricing test.",
      tip: "The \"cannot answer\" section is the memo. It stops a confident answer built on the wrong data."
    },
    {
      slug: "interview-synthesis", title: "Interview synthesis with receipts",
      role: "research", category: "analysis", task: "synthesis", models: ["claude", "gemini"],
      blurb: "Themes ranked by evidence, quotes kept verbatim, contradictions kept alive.",
      tested: "2026-09-29", pass: "10/10",
      template: `You are a senior UX researcher synthesising interviews without flattening the nuance.

# MATERIAL
[NOTES]

# CONTEXT
Research question: [RESEARCH_QUESTION]
Product context: [CONTEXT]

# TASK
Synthesise across participants.

# OUTPUT
1. Top three themes, ranked by how many participants raised them and how strongly. Each: one sentence plus supporting quotes with participant IDs.
2. Contradictions between participants — quote both sides.
3. Jobs to be done, written as "When ___, I want to ___, so I can ___".
4. What surprised me, and what I expected but did not hear.
5. Five decisions this research does NOT support.

# RULES
- Use participant IDs, never names. Keep quotes verbatim; mark paraphrases.
- No theme without at least two participants. Note singletons separately as "signals".
- Do not propose solutions unless asked.`,
      example: "Theme 2 (P1, P3, P5): people trust the summary until it omits one detail — then they re-read everything. \"One wrong line and I'm back to the source.\"",
      tip: "Section 5 is your defence against over-eager stakeholders. Make the model write it every time."
    },
    {
      slug: "midjourney-editorial-poster", title: "Midjourney editorial poster",
      role: "design", category: "design", task: "poster", models: ["midjourney"],
      blurb: "A tested descriptor stack and parameter set for gallery-grade posters — V8.2 ready.",
      tested: "2026-10-13", pass: "8/10",
      template: `editorial poster for [EVENT], [CITY] [YEAR], oversized [TYPE_TREATMENT], [SUBJECT], set in a [SETTING], shot on 35mm film, harsh directional light, [PALETTE] palette, deep grain, risograph texture, bold negative space, Swiss layout, printed paper feel, museum retrospective aesthetic

--ar 4:5 --style raw --v 8.2 --s 180 --no text, watermark, logo
Note: Midjourney has no role to play. The "prompt" is a descriptor stack — subject, styling, palette, composition — plus parameters. Swap one layer at a time and generating 4 versions per swap is faster than rewriting the whole prompt.`,
      example: "Tested variants: split-complementary palette (better hierarchy) vs. monochrome with one accent (higher contrast at thumbnail). The second won on every poster in the set.",
      tip: "Lock your parameters and change one descriptor per generation. You'll learn more in 12 images than in 120."
    },
    {
      slug: "gpt-image-product-shots", title: "Product shots with legible labels",
      role: "design", category: "design", task: "product-shot", models: ["gptimage"],
      blurb: "Scene, lighting, composition and exact label text — with the failure modes banned.",
      tested: "2026-10-04", pass: "9/10",
      template: `Create a [ASPECT] product photograph of [PRODUCT] on [SURFACE], shot from a [ANGLE] angle.

Scene: [SETTING].
Lighting: [LIGHTING].
Styling: [STYLING].
Composition: the product occupies the right third; generous negative space at the top for headline text. Packaging text should read exactly "[LABEL_TEXT]" — render it legibly.
Palette: [PALETTE].
Finish: editorial catalogue, natural grain, no oversaturation.

Avoid: floating products, fake bokeh, extra text, distorted labels, plastic sheen.`,
      example: "The label render held on 9 of 10 runs with short two-word text; longer copy broke the packaging every time. Keep on-pack text under 18 characters.",
      tip: "Short label text is the single biggest predictor of a usable output. Treat long text as a post-production job, not a prompting job."
    },
    {
      slug: "feynman-study-sprint", title: "The Feynman study sprint",
      role: "education", category: "learning", task: "study", models: ["chatgpt", "gemini"],
      blurb: "It asks you to explain, finds the exact break in your understanding, and teaches only that.",
      tested: "2026-10-12", pass: "10/10",
      template: `You are a tutor who teaches by making me explain, not by explaining at me.

# TOPIC
[TOPIC], at [LEVEL].

# THE LOOP
1. Ask me why I want to learn this and what I already know. Wait for my answer.
2. Give me a five-line plain-language overview — no jargon.
3. Ask me to explain it back in my own words, with an everyday analogy.
4. Find the exact point where my explanation breaks. Name it.
5. Teach only that gap, with one worked example.
6. Give me three questions that test understanding, not recall.
7. Build a five-day plan of 20-minute sessions, ending with a self-test.

# RULES
- One step at a time. Wait for me before continuing.
- Never praise vaguely. Say exactly what was right.
- If I ask you to just give me the answer, refuse once and offer a hint instead.
- Use my analogy, not yours, when correcting.`,
      example: "Your explanation broke at \"the model learns the pattern\" — that's the bit to fix. You described what happens, not why it generalises.",
      tip: "Step 4 is the whole method. If the model says \"great job!\" and moves on, the loop failed."
    },
    {
      slug: "language-tutor-corrections", title: "Language tutor that corrects what matters",
      role: "education", category: "learning", task: "language", models: ["claude", "gemini"],
      blurb: "Keeps the conversation flowing and fixes the errors that actually change meaning.",
      tested: "2026-09-27", pass: "9/10",
      template: `You are a patient [LANGUAGE] tutor. I am a [LEVEL] learner. My native language is [NATIVE].

# HOW THIS WORKS
Continue the conversation in [LANGUAGE] about [TOPIC].
After each of my messages:
1. Reply naturally, in 2–4 sentences.
2. Add a short corrections block: original → corrected → why (max 10 words).
3. Add one word or idiom I could have used, with an example.

# RULES
- Correct only errors that change meaning or sound clearly non-native. Ignore quick-chat typos.
- Never switch to my native language unless I ask.
- Introduce three new useful words per exchange, not ten.
- Do not correct me mid-thought; wait until my message ends.
- If I repeat the same mistake twice, add a mini-drill at the end.

Start by asking me one question in [LANGUAGE].`,
      example: "Original: \"Je suis allé au magasin hier mais il était fermé.\" Correct. New word: faire chou blanc — came up empty (\"J'ai fait chou blanc au magasin.\").",
      tip: "\"Only correct what matters\" is the prompt's real work. Without it, every reply becomes a red pen."
    },
    {
      slug: "structured-interview", title: "Structured interviewer with a rubric",
      role: "hr", category: "people", task: "interview", models: ["claude", "chatgpt"],
      blurb: "Six mapped questions, strong and weak answer anchors, and legally safer alternatives.",
      tested: "2026-10-08", pass: "9/10",
      template: `You are a hiring manager running a structured interview for [ROLE] at a [STAGE] company.

# CANDIDATE SIGNAL
Must-have skills: [SKILLS]
What good looks like in six months: [OUTCOMES]

# TASK
Build a 45-minute interview.

# INCLUDE
- Six questions mapped to the must-haves: four behavioural (STAR), two work-sample or scenario.
- For each: what a strong answer contains, what a weak answer sounds like, one follow-up probe.
- A scoring rubric: 1–4 anchors per must-have, not per question.
- Three legally safer alternatives to common risky questions.
- A five-minute close that leaves the candidate with an honest picture.

# RULES
- No brain teasers. No questions answerable with a Google search.
- Nothing touching age, family, health, nationality or religion.
- Questions under 25 words.`,
      example: "Must-have: prioritisation under ambiguity. Strong: names the trade-off, says what they cut and what it cost. Weak: lists everything they shipped.",
      tip: "Score the must-haves, not the questions. Six questions are a sample; the rubric is the instrument."
    },
    {
      slug: "job-description-that-filters", title: "Job description that filters for signal",
      role: "hr", category: "people", task: "jd", models: ["chatgpt", "claude"],
      blurb: "Five outcomes instead of fifteen responsibilities, plus the salary band up front.",
      tested: "2026-09-25", pass: "8/10",
      template: `You are a recruiter who writes job posts that filter for signal, not volume.

# ROLE
Title: [TITLE]
Level: [LEVEL]
Team: [TEAM]
What this person owns in 12 months: [OUTCOMES]
Salary band: [BAND] ([LOCATION])

# TASK
Write the job post.

# RULES
- First paragraph sells reality, not perks: what is hard, what is rewarding.
- Five outcomes, not fifteen responsibilities.
- "You might be a fit if…" — five honest signals, including one non-obvious one.
- Include the salary band and the interview process, with stages and timing.
- Say what we do NOT expect (degree, ten years of everything).
- 500 words max, grade 8 reading level.
- Ban "rockstar", "ninja", "family", "fast-paced".

# OUTPUT
The post, plus a three-question knockout screen for the application form.`,
      example: "You might be a fit if you have rewritten someone else's SQL and enjoyed it. That's closer to the job than any certification.",
      tip: "The honest paragraph cuts both ways. You'll get fewer applications and better ones — that's the point."
    },
    {
      slug: "dinner-from-the-fridge", title: "Dinner from whatever's in the fridge",
      role: "everyday", category: "everyday", task: "meal", models: ["chatgpt", "gemini"],
      blurb: "Twenty minutes, no shopping trip, and a use-it-up plan for what's about to spoil.",
      tested: "2026-10-11", pass: "9/10",
      template: `You are a practical home cook. You use what is in the kitchen, waste nothing, and never assume a shopping trip.

# WHAT I HAVE
Fridge and pantry: [INGREDIENTS]
Equipment: [EQUIPMENT]
Time and energy: [TIME]
Diet or dislikes: [DIET]
People: [PEOPLE]

# TASK
Give me dinner tonight.

# RULES
- Three options, ranked by effort. Each under 20 minutes of hands-on time unless I said otherwise.
- Every ingredient must come from my list, plus oil, salt, pepper and water. If something essential is missing, give a one-line substitution.
- Quantities for the number of people above.
- Steps in six lines max. No essays.
- Add one "use it up" idea for anything likely to spoil.

# OUTPUT
A table of options (dish, time, what it uses up), then the method for the top pick.`,
      example: "Top pick: charred cabbage with miso butter and rice — 18 minutes, uses the half cabbage and the miso that's been open since spring.",
      tip: "The \"use it up\" line pays for the prompt. It's the difference between dinner and a plan."
    },
    {
      slug: "weekly-reset", title: "The weekly reset that fits reality",
      role: "everyday", category: "everyday", task: "reset", models: ["claude", "chatgpt"],
      blurb: "A week built around one win condition — with a 'not this week' list so it stays true.",
      tested: "2026-10-09", pass: "8/10",
      template: `You are a calm, slightly ruthless productivity coach. My calendar is full; my list is not honest.

# INPUTS
Fixed commitments: [CALENDAR]
Open loops: [BRAIN_DUMP]
Energy pattern: [ENERGY]
One thing that would make the week a win: [WIN]
Starting date: [START_DATE]

# TASK
Plan the week.

# RULES
- Identify the single most important outcome. Everything else is support or noise.
- Max three priorities per day; max six hours of deep work per day.
- Put shallow work in explicit blocks. Leave 20% of each day unplanned.
- Flag anything that should be deleted, delegated or deferred, with the reason.
- Protect the win condition first in the calendar.
- If the brain dump exceeds capacity, say so plainly and show me what to cut.

# OUTPUT
1. One-line week thesis.
2. Day-by-day plan, in time blocks.
3. The "not this week" list.
4. A two-minute evening check-in ritual.`,
      example: "Week thesis: ship the pricing test before Thursday, and nothing else gets to be urgent. Not this week: the podcast, the Notion rebuild, and every \"quick\" call.",
      tip: "If the plan has no \"not this week\" list, it isn't a plan — it's a wish."
    },
    {
      slug: "resume-tailor", title: "Résumé rewrite against the job post",
      role: "career", category: "everyday", task: "resume", models: ["chatgpt", "claude"],
      blurb: "A coverage table, a rewritten top third, and the gaps to address in the interview.",
      tested: "2026-10-06", pass: "9/10",
      template: `You are a hiring manager in [INDUSTRY] who has read 10,000 résumés. You are blunt and useful.

# JOB POST
[JD]

# MY RÉSUMÉ
[RESUME]

# TASK
Rewrite my résumé for this specific job, without inventing anything.

# RULES
- Map every requirement in the post to evidence in my résumé: strong, partial, missing.
- Rewrite the top third (summary and most recent role) for a 20-second scan.
- Turn duties into outcomes with numbers I already have. Where a number is missing, leave [ADD_METRIC] — do not guess.
- Use their vocabulary where it is honest, not keyword stuffing.
- Fix passive voice, "responsible for", and tool lists without context.
- One page unless I have 10+ years.

# OUTPUT
1. Coverage table: requirement → my evidence → gap.
2. Rewritten résumé.
3. The three gaps to address in my cover note or interview.`,
      example: "Requirement: owned a P&L. Your evidence: \"managed a $1.2M budget\" — reframe as owned, not managed. Gap: no pricing experience; address it with the teardown you built.",
      tip: "Never let it invent a metric. [ADD_METRIC] is a to-do, not an embarrassment."
    },
    {
      slug: "sop-from-messy-notes", title: "SOP from messy notes",
      role: "operations", category: "everyday", task: "sop", models: ["claude", "chatgpt"],
      blurb: "A process a new hire can follow on day one — decision points as if/then, not paragraphs.",
      tested: "2026-10-01", pass: "9/10",
      template: `You are an operations lead who writes SOPs a new hire can follow on day one without asking anyone.

# INPUTS
Process: [PROCESS]
Who runs it, how often: [ROLE_CADENCE]
Current mess: [NOTES]
Tools: [TOOLS]
Known failure points: [FAILURES]

# TASK
Write the SOP.

# STRUCTURE
- Purpose and when to run it (one line each).
- Preconditions and the access needed.
- Numbered steps: each starts with a verb, each with the exact click or command.
- Decision points as if/then, not paragraphs.
- What "done" looks like — a checklist.
- Troubleshooting: the five most likely failures and fixes.
- Escalation path with roles and response times.

# RULES
- Written for someone on their first day. Expand every acronym once.
- No "as needed", "appropriate" or "ensure". Say exactly what to do.
- Mark anything I did not specify as [CONFIRM] and list those at the end.

# OUTPUT
The SOP in markdown, plus a one-page checklist version.`,
      example: "If the export is empty: check the timezone filter first (it defaults to UTC−5), then re-run with a 48-hour window. Escalate to Ops Lead if still empty after two attempts.",
      tip: "\"No 'ensure'\" is the rule that does the work. Vague verbs are where onboarding dies."
    }
  ];

  /* ---------------- BUILDER TASKS (LLM) ---------------- */
  const llmTasks = [
    { id: "cold-email", label: "Write a cold email", role: "sales", category: "growth",
      objective: "Write a cold email that earns a reply without sounding automated.",
      deliverable: "Three subject lines, one email under 100 words, and a two-line follow-up.",
      vars: [["PROSPECT", "Maya Chen, Head of Ops at Northwind Logistics"], ["PRODUCT", "slotting software for warehouses"], ["TRIGGER", "they just opened a second hub"], ["PROOF", "cut pick time 22% at a similar firm"], ["CTA", "15-minute call"]] },
    { id: "linkedin", label: "Write a LinkedIn post", role: "marketing", category: "writing",
      objective: "Write a LinkedIn post in my voice that earns saves, not just likes.",
      deliverable: "The post (120–180 words) plus three alternative opening lines.",
      vars: [["TOPIC", "why most AI rollouts stall"], ["POINT", "the prompt is not the product"], ["ANECDOTE", "a client who deleted 40 prompts"], ["AUDIENCE", "ops leaders"]] },
    { id: "newsletter", label: "Write a newsletter", role: "marketing", category: "writing",
      objective: "Turn this week's links and notes into a newsletter issue people finish.",
      deliverable: "Subject line, preview text, a 400-word issue with three items, and a closing thought.",
      vars: [["NICHE", "B2B marketing"], ["AUDIENCE", "agency owners"], ["SOURCES", "three links and your notes — paste them"]] },
    { id: "launch", label: "Announce a launch", role: "marketing", category: "writing",
      objective: "Write a product launch three ways: email, LinkedIn post, and a Product Hunt tagline.",
      deliverable: "Three assets, each with one CTA and one proof point.",
      vars: [["PRODUCT", "PromptFoundry Teams"], ["AUDIENCE", "content leads"], ["BEFORE_AFTER", "shared docs → one tested library"], ["PROOF", "team of 12 shipped in a week"]] },
    { id: "edit", label: "Edit a draft", role: "creators", category: "writing",
      objective: "Edit a draft like a magazine editor: keep the voice, cut the noise.",
      deliverable: "Edited draft at target length, a five-bullet changelog, and the three lines worth keeping.",
      vars: [["DRAFT", "paste the draft"], ["PUBLICATION", "founder blog"], ["READER", "technical buyers"], ["TARGET_WORDS", "800"]] },
    { id: "prd", label: "Write a one-page PRD", role: "product", category: "writing",
      objective: "Turn messy notes into a one-page PRD that engineers will actually read.",
      deliverable: "A one-page PRD: problem, why now, scope and non-goals, experience, metric, risks.",
      vars: [["NOTES", "paste the transcript or notes"], ["FEATURE", "shared prompt library"], ["STAGE", "Series A"], ["METRIC", "weekly active editors"]] },
    { id: "pricing", label: "Rewrite a pricing page", role: "product", category: "growth",
      objective: "Rewrite pricing copy so it answers the top objections before they are raised.",
      deliverable: "The rewritten page in markdown, a plan table, and an objection FAQ.",
      vars: [["CURRENT_COPY", "paste the current page"], ["PLANS", "Free, Pro, Team"], ["BUYER", "content leads"], ["OBJECTIONS", "too expensive / team adoption / lock-in"]] },
    { id: "api-docs", label: "Write API docs", role: "engineering", category: "writing",
      objective: "Write reference documentation for an API endpoint from its source code.",
      deliverable: "Summary, request table, curl and code examples, response shapes, and one real gotcha.",
      vars: [["CODE", "paste the route handler"], ["STACK", "Node + Fastify"], ["AUTH", "bearer token"], ["CALLER", "public API users"]] },
    { id: "code-review", label: "Review a pull request", role: "engineering", category: "code",
      objective: "Review a pull request like a staff engineer and rank every issue by severity.",
      deliverable: "Blockers, should-fix items, up to three nits, and one specific positive.",
      vars: [["DIFF", "paste the diff"], ["CONTEXT", "webhook handler, TypeScript"], ["INTENT", "verify signatures before processing"]] },
    { id: "debug", label: "Debug an issue", role: "engineering", category: "code",
      objective: "Act as a debugging partner that isolates the failure before proposing a fix.",
      deliverable: "A falsifiable symptom, a boundary list with one cheap test each, then wait.",
      vars: [["SYMPTOM", "duplicate webhook events"], ["EXPECTED", "one event per payment"], ["STACK", "Node, Postgres, Stripe"], ["CHANGES", "added retries last week"], ["TRIED", "idempotency key on write"]] },
    { id: "sql", label: "Review SQL", role: "data", category: "code",
      objective: "Review a SQL query for correctness and cost before it ships.",
      deliverable: "Correctness notes, cost risks, a rewritten query, and the result grain in plain English.",
      vars: [["QUERY", "paste the SQL"], ["WAREHOUSE", "BigQuery"], ["TABLE_SIZES", "events ~400M rows"], ["QUESTION", "weekly active accounts"]] },
    { id: "teardown", label: "Tear down a competitor", role: "product", category: "analysis",
      objective: "Build an evidence-only competitor teardown tied to a real decision.",
      deliverable: "Six sections; every fact sourced with an access date.",
      vars: [["COMPETITOR", "PromptBase"], ["URL", "competitor.com"], ["OUR_PRODUCT", "tested prompt library"], ["ICP", "content leads"], ["DECISION", "positioning"]] },
    { id: "synthesis", label: "Synthesise interviews", role: "research", category: "analysis",
      objective: "Synthesise user interviews without flattening the nuance.",
      deliverable: "Themes with participant IDs and quotes, contradictions, JTBDs, and what not to decide.",
      vars: [["NOTES", "paste notes, one block per participant"], ["RESEARCH_QUESTION", "why do teams stop using prompts?"], ["CONTEXT", "prompt library tool"]] },
    { id: "sheet-memo", label: "Turn a sheet into a memo", role: "data", category: "analysis",
      objective: "Turn a messy spreadsheet into a one-page decision memo.",
      deliverable: "What the data can and cannot answer, three findings with numbers, and one recommendation.",
      vars: [["DATA", "paste the table or describe columns"], ["PERIOD", "last 12 weeks"], ["DECISION", "whether to change pricing"], ["DATA_ISSUES", "no acquisition source"]] },
    { id: "interview", label: "Build an interview plan", role: "hr", category: "people",
      objective: "Build a structured 45-minute interview with a scoring rubric.",
      deliverable: "Six mapped questions, strong and weak answer anchors, probes, and safer alternatives.",
      vars: [["ROLE", "product designer"], ["STAGE", "Series A"], ["SKILLS", "systems thinking, research, craft"], ["OUTCOMES", "owns the design system in six months"]] },
    { id: "jd", label: "Write a job post", role: "hr", category: "people",
      objective: "Write a job post that filters for signal instead of volume.",
      deliverable: "A 500-word post plus a three-question knockout screen.",
      vars: [["TITLE", "content lead"], ["LEVEL", "senior"], ["OUTCOMES", "own the blog and the newsletter"], ["BAND", "$120–140k"], ["LOCATION", "remote, EU time zones"]] },
    { id: "study", label: "Build a study sprint", role: "education", category: "learning",
      objective: "Run a Feynman study loop: make me explain, find the gap, teach only that.",
      deliverable: "A step-by-step loop, three understanding questions, and a five-day plan.",
      vars: [["TOPIC", "statistics for A/B tests"], ["LEVEL", "beginner"], ["GOAL", "read experiment results with confidence"]] },
    { id: "language", label: "Practise a language", role: "education", category: "learning",
      objective: "Tutor me in a language through conversation with targeted corrections.",
      deliverable: "Natural replies, a corrections block, and one new idiom each turn.",
      vars: [["LANGUAGE", "Spanish"], ["LEVEL", "B1"], ["NATIVE", "English"], ["TOPIC", "ordering food and travel"]] },
    { id: "meal", label: "Plan dinner", role: "everyday", category: "everyday",
      objective: "Plan dinner tonight from only the ingredients I actually have.",
      deliverable: "Three ranked options and the method for the top pick.",
      vars: [["INGREDIENTS", "half a cabbage, rice, miso, eggs"], ["EQUIPMENT", "one pan, hob"], ["TIME", "25 minutes, low energy"], ["DIET", "vegetarian"], ["PEOPLE", "2"]] },
    { id: "reset", label: "Reset my week", role: "everyday", category: "everyday",
      objective: "Plan a realistic week around one win condition and a full calendar.",
      deliverable: "A week thesis, day-by-day time blocks, a not-this-week list, and an evening ritual.",
      vars: [["CALENDAR", "three days of workshops"], ["BRAIN_DUMP", "everything on your mind"], ["ENERGY", "mornings are best"], ["WIN", "ship the pricing test"], ["START_DATE", "Monday"]] },
    { id: "resume", label: "Tailor my résumé", role: "career", category: "everyday",
      objective: "Tailor my résumé to a specific job post without inventing anything.",
      deliverable: "A coverage table, the rewritten résumé, and the three gaps to address.",
      vars: [["JD", "paste the job description"], ["RESUME", "paste your résumé"], ["INDUSTRY", "B2B SaaS"]] },
    { id: "sop", label: "Write an SOP", role: "operations", category: "everyday",
      objective: "Write an SOP a new hire can follow on day one without asking anyone.",
      deliverable: "Purpose, preconditions, numbered steps, decision points, checklist, and troubleshooting.",
      vars: [["PROCESS", "weekly churn report"], ["ROLE_CADENCE", "ops analyst, every Monday"], ["NOTES", "paste the transcript or notes"], ["TOOLS", "Looker, Sheets, Slack"], ["FAILURES", "stale data, missing accounts"]] },
    { id: "support", label: "Answer an angry customer", role: "support", category: "people",
      objective: "Answer an angry customer in a way that de-escalates and keeps the relationship.",
      deliverable: "A reply under 140 words, an internal note, and one sentence not to say.",
      vars: [["TICKET", "paste the customer message"], ["ACCOUNT", "Team plan, 14 months"], ["FACTS", "an export failed twice"], ["OFFER", "credit plus a fix timeline"]] },
    { id: "discovery", label: "Plan a discovery call", role: "sales", category: "growth",
      objective: "Build a twelve-question discovery call arc that earns the next meeting.",
      deliverable: "Numbered questions with purpose labels and a three-line close.",
      vars: [["REP", "account executive"], ["PROSPECT", "VP Ops at a 200-person logistics firm"], ["PRODUCT", "warehouse slotting software"], ["RESEARCH", "they opened a second hub"]] }
  ];

  /* ---------------- BUILDER TASKS (IMAGE) ---------------- */
  const imageTasks = [
    { id: "poster", label: "Editorial poster", subject: "an editorial poster for [EVENT] in [CITY], oversized [TYPE_TREATMENT] typography, [SUBJECT]" },
    { id: "product-shot", label: "Product photograph", subject: "a [PRODUCT] on a [SURFACE], styled product photograph" },
    { id: "illustration", label: "Editorial illustration", subject: "a conceptual editorial illustration about [TOPIC], for a [PUBLICATION] feature" },
    { id: "character", label: "Character sheet", subject: "a character sheet for [CHARACTER], [ROLE_TRAITS], front and three-quarter views" },
    { id: "interior", label: "Interior concept", subject: "an interior concept for a [ROOM], [STYLE_PERIOD] references, natural materials" },
    { id: "food", label: "Food photography", subject: "an overhead food photograph of [DISH], served on [SURFACE]" }
  ];

  const imageSubjectVars = {
    poster: [["EVENT", "a design conference"], ["CITY", "Lagos"], ["TYPE_TREATMENT", "condensed serif"], ["SUBJECT", "a paper anvil and a spark"]],
    "product-shot": [["PRODUCT", "ceramic coffee grinder"], ["SURFACE", "raw travertine slab"]],
    illustration: [["TOPIC", "prompt fatigue"], ["PUBLICATION", "a technology magazine"]],
    character: [["CHARACTER", "a night-shift librarian"], ["ROLE_TRAITS", "tired, precise, secretly warm"]],
    interior: [["ROOM", "reading room"], ["STYLE_PERIOD", "1970s Italian"]],
    food: [["DISH", "charred cabbage with miso butter"], ["SURFACE", "weathered oak table"]]
  };

  /* ---------------- BUILDER OPTIONS ---------------- */
  const tones = [
    { id: "direct", label: "Direct", line: "Direct. Short sentences. No filler, no warm-up." },
    { id: "expert", label: "Expert", line: "Expert and precise. Assume an informed reader; define only niche terms." },
    { id: "warm", label: "Warm", line: "Warm and human. Contractions are welcome." },
    { id: "witty", label: "Dry wit", line: "Dry wit, used sparingly. Never at the reader's expense." },
    { id: "formal", label: "Formal", line: "Formal and measured. No slang, no contractions." },
    { id: "coach", label: "Coach", line: "Coach-like: clear, encouraging, and specific about the next action." }
  ];

  const aesthetics = [
    { id: "editorial", label: "Editorial", line: "editorial art direction, restrained, typographic, museum catalogue" },
    { id: "cinematic", label: "Cinematic", line: "cinematic still, anamorphic lens, dramatic practical lighting" },
    { id: "brutalist", label: "Brutalist", line: "brutalist, raw concrete textures, high contrast, utilitarian" },
    { id: "soft", label: "Soft & airy", line: "soft diffused daylight, airy negative space, pastel neutrals" },
    { id: "retro", label: "Retro print", line: "1970s print campaign, halftone grain, warm faded inks" },
    { id: "neon", label: "Neon night", line: "neon night scene, wet reflections, saturated magenta and cyan" }
  ];

  const formats = [
    { id: "short", label: "Skimmable", line: "Keep it skimmable: short paragraphs, bullets where they help." },
    { id: "steps", label: "Step-by-step", line: "Numbered steps, one action per step." },
    { id: "report", label: "Markdown report", line: "A short markdown report with H2 sections and a one-line summary at the top." },
    { id: "table", label: "Table-first", line: "Lead with a markdown table; use prose only where a table would lose nuance." },
    { id: "email", label: "Email-ready", line: "Ready to send as an email: subject line plus body, nothing else." },
    { id: "json", label: "Structured JSON", line: "Return valid JSON only, with keys deliverable, notes and next_steps. No prose outside the JSON." }
  ];

  const aspects = ["1:1", "4:5", "16:9", "9:16", "3:2"];

  const presets = [
    { label: "Cold email", model: "chatgpt", task: "cold-email", tone: "direct", format: "email" },
    { label: "Code review", model: "claude", task: "code-review", tone: "expert", format: "steps" },
    { label: "Study sprint", model: "gemini", task: "study", tone: "coach", format: "steps" },
    { label: "Poster", model: "midjourney", task: "poster", tone: "editorial", format: "4:5" },
    { label: "Product shot", model: "gptimage", task: "product-shot", tone: "editorial", format: "4:5" },
    { label: "Newsletter", model: "claude", task: "newsletter", tone: "warm", format: "report" }
  ];

  /* ---------------- HELPERS ---------------- */
  const byId = {};
  models.forEach(m => byId[m.id] = m);
  const roleById = {};
  roles.forEach(r => roleById[r.slug] = r);
  const catById = {};
  categories.forEach(c => catById[c.id] = c);
  const promptBySlug = {};
  prompts.forEach(p => promptBySlug[p.slug] = p);
  const llmTaskById = {};
  llmTasks.forEach(t => llmTaskById[t.id] = t);
  const imageTaskById = {};
  imageTasks.forEach(t => imageTaskById[t.id] = t);

  function extractVars(text) {
    const out = [];
    const re = /\[([A-Z][A-Z0-9_]{1,30})\]/g;
    let m;
    while ((m = re.exec(text))) if (out.indexOf(m[1]) === -1) out.push(m[1]);
    return out;
  }

  function wordCount(text) {
    return (text.trim().match(/\S+/g) || []).length;
  }

  return {
    config, models, categories, roles, prompts, llmTasks, imageTasks,
    imageSubjectVars, tones, aesthetics, formats, aspects, presets,
    byId, roleById, catById, promptBySlug, llmTaskById, imageTaskById,
    extractVars, wordCount
  };
})();
