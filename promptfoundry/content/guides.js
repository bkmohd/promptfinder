/* Guide content for PromptFoundry — consumed by build.js */
"use strict";

module.exports = [
  {
    slug: "prompt-anatomy",
    tag: "Fundamentals",
    title: "The anatomy of a prompt that survives a model upgrade",
    desc: "The seven layers every reliable prompt needs — role, objective, context, deliverable, format, constraints and a quality bar — with a worked example you can copy.",
    kicker: "Guide · Fundamentals · 8 min read",
    lede: "Most prompts fail for the same boring reason: they describe a wish, not a job. This is the structure we use on the test bench — the same one behind every prompt in the library.",
    body: `
<p>When a prompt underperforms, it is rarely because the model is weak. It is because the prompt left the important decisions to chance. The seven layers below remove most of that chance. They are ordered on purpose: role and objective set direction, context and deliverable define the work, format and constraints define the shape, and the quality bar tells the model how to check itself.</p>

<h2>1. Role: a point of view, not a magic spell</h2>
<p>"You are a world-class expert" does almost nothing. A role is useful when it encodes <em>judgement</em> — what to prioritise, what to refuse, what to notice. Compare:</p>
<ul>
<li>Weak: "You are an expert marketer."</li>
<li>Useful: "You are a senior marketer at a 40-person B2B company. You write for operators, not investors. You would rather be specific than clever."</li>
</ul>
<p>The second version tells the model which trade-offs to make. That is the whole job of a role.</p>

<h2>2. Objective: one verb, one outcome</h2>
<p>State the job in the first two lines, starting with a verb: write, review, debug, synthesise, plan, rewrite. If your prompt contains three objectives, the model will average them into one mediocre output. Split it into three prompts, or make one objective primary and the others explicit sub-steps.</p>

<h2>3. Context: who it is for and what is true</h2>
<p>Models are excellent at filling gaps with plausible-sounding defaults. Every gap you leave is a place where the output drifts toward the generic. Give it: the audience, the situation, the inputs, the constraints you already know, and — critically — what you have already tried or ruled out.</p>

<h2>4. Deliverable: name the artefact</h2>
<p>"Give me some ideas" produces a list of ideas. "Give me three subject lines, one email under 100 words, and a two-line follow-up" produces something you can use. Name the artefact, its parts, and its order.</p>

<h2>5. Format: the shape is part of the answer</h2>
<p>Structure is not decoration. A table forces comparison; a numbered list forces sequence; JSON forces you to define keys in advance. If the output feeds another system, specify the schema exactly and tell the model what to do when a field is unknown.</p>

<h2>6. Constraints: bans work better than adjectives</h2>
<p>"Make it engaging" is unenforceable. "Under 90 words, no exclamation marks, never open with 'I hope this finds you well'" is enforceable. Real constraints are checkable. Write the ones you would actually reject an answer for. (Yes, this is where most prompts earn their keep.)</p>

<h2>7. Quality bar: make it check its own work</h2>
<p>The final layer is the one people skip. Tell the model how to verify its output before it answers:</p>
<ul>
<li>Check the output against every constraint above and fix it silently.</li>
<li>If a required input is missing, ask up to three questions before starting.</li>
<li>Label any assumption as [ASSUMPTION] rather than inventing facts.</li>
</ul>

<h2>Two things that make a prompt reusable</h2>
<p><strong>Variables.</strong> Wrap anything that changes in [SQUARE_BRACKETS]. A prompt with variables is a template you can run fifty times; a prompt without them is a one-off you will rewrite.</p>
<p><strong>A test date.</strong> Models change under you. Write the model version and the date you last checked the prompt. A prompt that was great on last quarter's model is a rumour until you re-run it. Our <a href="../how-we-test.html">test protocol</a> is public if you want to copy the habit.</p>

<h2>The whole thing on one page</h2>
<pre style="background:#17130E;color:#D8CCB8;padding:18px;border-radius:10px;font-family:var(--mono);font-size:11.5px;line-height:1.7;overflow:auto"># ROLE
You are a senior [DISCIPLINE] at a [COMPANY TYPE]. You prioritise [VALUE],
refuse [BEHAVIOUR], and write for [AUDIENCE].

# OBJECTIVE
[ONE VERB] [ONE OUTCOME].

# CONTEXT
- Audience: [WHO]
- Situation: [WHY NOW]
- Inputs: [PASTED MATERIAL]
- Already tried / ruled out: [HISTORY]

# DELIVERABLE
[ARTEFACT], in this order: [PARTS 1–3].

# FORMAT
[LENGTH, STRUCTURE, OUTPUT TYPE]

# CONSTRAINTS
- [CHECKABLE BAN 1]
- [CHECKABLE BAN 2]
- Never invent facts, numbers or quotes. Mark unknowns [NEED_DATA].

# QUALITY BAR
Check the output against every constraint above and fix it silently.
If any input is missing or ambiguous, ask up to three clarifying questions first.</pre>
<p>That structure is what the <a href="../index.html#builder">Prompt Studio</a> generates, adapted per model — XML for Claude, citations and verification for Gemini, a plain spec for ChatGPT, and descriptor stacks plus parameters for image models.</p>

<h2>What to do next</h2>
<p>Take the prompt you use most and grade it with the <a href="../index.html#doctor">Prompt Doctor</a>. It scores nine layers like these and tells you which one is missing. Then rebuild it once, properly, and keep the test date.</p>`
  },
  {
    slug: "prompting-techniques",
    tag: "Techniques",
    title: "Seven prompting techniques that hold up — and three that don't",
    desc: "Few-shot examples, decomposition, scratchpads, output schemas, negative constraints, self-checks and role framing — tested. Plus the popular techniques that quietly waste tokens.",
    kicker: "Guide · Techniques · 9 min read",
    lede: "Prompt advice spreads faster than prompt evidence. These seven techniques survived our test bench across six models. The last three are the popular ones we stopped using.",
    body: `
<h2>1. Few-shot examples</h2>
<p>One or two examples of the output you want is still the highest-leverage addition to most prompts. Examples communicate length, register, structure and edge-case handling faster than any adjective.</p>
<ul>
<li><strong>Use it when:</strong> the output has a house style, a specific structure, or a tone that is hard to describe.</li>
<li><strong>Watch out:</strong> the model will copy your example's <em>content</em>, not just its shape. Pick examples whose subject matter differs from the task.</li>
</ul>

<h2>2. Decomposition</h2>
<p>Asking for the plan first and the artefact second beats asking for both at once. "List the sections, wait for my approval, then write section one" produces better long documents than "write a 2,000-word report", because it stops the model from committing to a structure before it has thought about one.</p>

<h2>3. Scratchpad before answer</h2>
<p>On reasoning-heavy tasks, a scratchpad — a place to think before the deliverable — measurably reduces confident errors. With Claude, XML tags like <code>&lt;scratchpad&gt;</code> work; with other models, "think through the trade-offs in three bullets, then give your recommendation" is enough. The point is separation: reasoning in one place, artefact in another, so the artefact stays clean.</p>

<h2>4. Explicit output schemas</h2>
<p>If the output feeds a spreadsheet, a database or another model, define the schema. Name the keys, the types and what to return when a value is unknown. Vague JSON is worse than prose: it fails silently downstream. "Return valid JSON with keys deliverable, assumptions and next_steps; use null for unknown values" is the minimum.</p>

<h2>5. Negative constraints</h2>
<p>Models are better at avoiding specific, checkable things than at achieving vague qualities. "No exclamation marks. Never open with 'I hope this finds you well'. Ban the words revolutionary and seamless." Each ban is testable, which means you can tell whether it worked — and reject the output when it didn't. Bans also survive model upgrades better than adjectives, because they describe observable behaviour.</p>

<h2>6. Self-check instructions</h2>
<p>One line — "before you answer, check the output against every constraint and fix it silently" — is the cheapest quality gain available. A stronger version tells the model what to do with uncertainty: "if a required input is missing, ask up to three questions instead of inventing an answer." This is the difference between a confident wrong answer and a useful pause.</p>

<h2>7. Role framing with judgement, not adjectives</h2>
<p>Roles work when they describe priorities and refusals, not status. "You are a staff engineer who blocks on security and can live with ugly code" outperforms "you are a 10x expert engineer" because it tells the model which trade-off to make when two constraints collide. Every real task has that collision; most prompts leave it unresolved.</p>

<h2>Three popular techniques that underperformed</h2>
<h3>"Act as a world-class expert" (no specifics)</h3>
<p>In our runs, generic status-pumping changed tone more than quality. What moved output quality was specificity about the audience and the judgement to apply. The magic phrase is not magic; the missing context is the problem.</p>
<h3>Asking for "10x" or "best possible" output</h3>
<p>Superlatives give the model no lever. "Best possible" cannot be checked, so it cannot be met. Replace the superlative with a rubric: "every bullet must contain a number, a named party and a next action" is a quality bar. "Make it world-class" is a mood.</p>
<h3>Longer and longer prompts</h3>
<p>Length is not rigour. Past a point, extra paragraphs dilute the instructions that matter. We cut prompts that fail into their essential constraints first. If a prompt is over 400 words, ask what you could delete without changing the behaviour — and delete it. Keep the rest for edge cases as a separate prompt.</p>

<h2>How to know if a technique actually worked</h2>
<p>Run it ten times, score the outputs against a fixed rubric, and keep the results next to the prompt. Without that, you are remembering your best sample, not measuring quality. Our <a href="../guides/prompt-testing.html">testing guide</a> has the exact protocol, and <a href="../how-we-test.html">the lab page</a> shows what it looks like in practice.</p>`
  },
  {
    slug: "prompt-testing",
    tag: "Testing",
    title: "How to test your own prompts (without building a lab)",
    desc: "A practical ten-run protocol: freeze the inputs, score against four criteria, log the misses, and re-test when a model ships. Includes a copyable prompt-and-rubric template.",
    kicker: "Guide · Testing · 7 min read",
    lede: "You do not need infrastructure to know whether a prompt works. You need ten runs, a fixed rubric and the discipline to write down the failures.",
    body: `
<p>Most prompt quality is guesswork dressed up as intuition. You try a prompt, the output is good, you save it. Three weeks later it is mediocre and you cannot tell whether the prompt changed, the model changed, or you are remembering one lucky sample. A small test habit fixes that.</p>

<h2>Step 1 — Freeze the inputs</h2>
<p>Write down the exact inputs you will use, and use the same ones every run. If the prompt has variables, fill them once with realistic values and save that filled version. Otherwise you are testing the input, not the prompt.</p>

<h2>Step 2 — Run it ten times</h2>
<p>Ten runs, fresh context each time, default settings. Ten is enough to separate "usually works" from "worked once" without becoming a research project. Keep all ten outputs — the failures are the useful part.</p>

<h2>Step 3 — Score against four criteria</h2>
<table>
<thead><tr><th>Criterion</th><th>Question</th><th>Points</th></tr></thead>
<tbody>
<tr><td><strong>Usable</strong></td><td>Could you ship this with minor edits?</td><td>15</td></tr>
<tr><td><strong>On format</strong></td><td>Did it respect the length, structure and output type?</td><td>10</td></tr>
<tr><td><strong>Fact-safe</strong></td><td>Any invented numbers, sources or quotes? Assumptions labelled?</td><td>10</td></tr>
<tr><td><strong>On voice</strong></td><td>Does it sound like the brief — or like generic model-speak?</td><td>5</td></tr>
</tbody>
</table>
<p>Score each run out of 40. A prompt that averages above 34 is ready. Below 28, something structural is missing — usually context, format or constraints. Between the two, it works for internal drafts but not customer-facing work.</p>

<h2>Step 4 — Write down the misses</h2>
<p>For every failed run, note the failure mode in five words or fewer: <em>invented a statistic</em>, <em>ignored the word limit</em>, <em>sounded like a press release</em>. Patterns appear after a handful of runs, and patterns tell you which line of the prompt to fix. One failed run is noise; the same failure four times is a design flaw.</p>

<h2>Step 5 — Re-test when the model changes</h2>
<p>This is the step almost everyone skips. Prompts are coupled to model behaviour: instruction-following, refusal thresholds and default verbosity all shift between releases. Keep a test date and the model version with every prompt. When a new version ships, re-run your ten. If the pass rate drops, the prompt needs work — not a screenshot from launch week.</p>

<div class="callout"><strong>A useful habit:</strong> store prompts as files with a header — model version, last tested date, pass rate, known failure modes. The header is what turns a prompt collection into a test log. Ours looks like the metadata block on every prompt in <a href="../library.html">the library</a>.</div>

<h2>The folder structure that actually works</h2>
<pre style="background:#17130E;color:#D8CCB8;padding:18px;border-radius:10px;font-family:var(--mono);font-size:11.5px;line-height:1.7;overflow:auto">prompts/
  cold-email/
    prompt.md        # the template, with [VARIABLES]
    inputs.md        # the frozen filled inputs
    results/
      2026-10-12-gpt-6.1.md   # ten outputs, scored
      2026-10-12-sonnet-5.5.md
    notes.md         # failure modes, fixes tried</pre>
<p>That is the whole system. No dashboard, no tooling — just the ability to answer "when did you last check this, and what broke?"</p>

<h2>Copy the template</h2>
<pre style="background:#17130E;color:#D8CCB8;padding:18px;border-radius:10px;font-family:var(--mono);font-size:11.5px;line-height:1.7;overflow:auto"># [PROMPT TITLE]

Model: [MODEL + VERSION]
Last tested: [YYYY-MM-DD]
Pass rate: [X/10]
Known failures: [FAILURE MODE 1], [FAILURE MODE 2]

---

[PROMPT TEMPLATE WITH [VARIABLES]]</pre>
<p>Three lines of metadata turn a prompt into something you can trust — and re-test. If you would rather not do it manually, every prompt on this site ships with its metadata in the drawer, and the <a href="../index.html#builder">Studio</a> can export a prompt as a Markdown file with the header included.</p>

<h2>When testing is overkill</h2>
<p>For one-off tasks, run it twice and move on. The protocol earns its keep when a prompt is used weekly, shared with a team, or embedded in a product. That is also the moment a prompt stops being a prompt and becomes infrastructure — and infrastructure deserves a test date.</p>`
  }
];
