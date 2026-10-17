/* =============================================================
   PromptFoundry — Prompt Studio + Prompt Doctor
   Six model-specific output engines (markdown, XML, Gemini,
   Grok, Midjourney parameter grammar, GPT Image direction)
   and a heuristic prompt grader.
   ============================================================= */
(function () {
  "use strict";
  var PF = window.PF, UI = window.PFUI;
  if (!PF || !UI) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- Prompt analysis (shared by Studio + Doctor) ---------------- */
  var CHECKS = [
    { id: "role", label: "Assigns a role or point of view", weight: 12,
      test: function (t) { return /\b(you are|act as|as a|as an|role of|imagine you|you're)\b/i.test(t) || /<role>/i.test(t); },
      fix: "Open with “You are a …” so the model commits to an expertise instead of averaging everyone." },
    { id: "objective", label: "States one clear objective", weight: 16,
      test: function (t) { return /\b(write|create|draft|analys|analyze|design|review|build|plan|summar|summarize|explain|compare|audit|produce|generate|rewrite|improve|debug|teach|outline|calculate|synthesi|research|interview|organize|organise)/i.test(t.slice(0, 600)); },
      fix: "Name the single job in the first two lines, starting with a verb." },
    { id: "context", label: "Gives context and audience", weight: 14,
      test: function (t) { return /\b(audience|context|background|for (a|my|our|the)|reader|customer|user|team|company|product|prospect|draft|notes|data|query|job post|resume|résumé)\b/i.test(t); },
      fix: "Add who it is for, what they already know, and why it matters." },
    { id: "format", label: "Specifies format and length", weight: 14,
      test: function (t) { return /\b(format|bullet|table|list|json|markdown|words|sections?|paragraphs?|email|steps?|columns?|slides|output)\b/i.test(t); },
      fix: "Ask for an exact shape: “a table”, “3 bullets”, “under 120 words”." },
    { id: "constraints", label: "Sets constraints or tone", weight: 12,
      test: function (t) { return /\b(tone|avoid|don't|do not|must|limit|max|under|between|only|without|style|constraint|rules?|no )\b/i.test(t); },
      fix: "Add bans and bounds — “no jargon”, “never invent statistics”, “under 90 words”." },
    { id: "variables", label: "Leaves variables to fill", weight: 8,
      test: function (t) { return /\[[A-Z][A-Z0-9_]{1,30}\]|\{\{[^}]+\}\}/.test(t); },
      fix: "Use [PLACEHOLDERS] so the prompt is a reusable template, not a one-off." },
    { id: "examples", label: "Anchors with an example", weight: 8,
      test: function (t) { return /\b(example|sample|e\.g\.|for instance|like this|reference)\b/i.test(t); },
      fix: "One good example beats three adjectives. Paste a sample of the output you want." },
    { id: "quality", label: "Defines a quality bar", weight: 10,
      test: function (t) { return /\b(quality|check|ensure|verify|criteria|before you|rubric|self-check|proofread)\b/i.test(t); },
      fix: "Tell it how to check its own work — and what to do when inputs are missing." },
    { id: "clarity", label: "No vague filler", weight: 6,
      test: function (t) { return !/\b(nice|great|amazing|cool|stuff|things|etc\.|some |maybe|kind of|really|good)\b/i.test(t); },
      fix: "Replace “good”, “nice” and “some” with observable criteria." }
  ];

  function analyze(text) {
    var words = PF.wordCount(text || "");
    var checks = CHECKS.map(function (c) {
      return { id: c.id, label: c.label, ok: !!text && c.test(text), fix: c.fix, weight: c.weight };
    });
    var score = checks.reduce(function (s, c) { return s + (c.ok ? c.weight : 0); }, 0);
    if (words < 12) score = Math.min(score, 30);
    if (words > 900) score = Math.max(0, score - 6);
    var label, sub;
    if (score >= 85) { label = "Field-ready"; sub = "This does the work most prompts skip. Paste it and go."; }
    else if (score >= 65) { label = "Solid bones"; sub = "It will work. A few additions will make it reliable across models."; }
    else if (score >= 40) { label = "Needs a spine"; sub = "The model will guess at the important parts. Add role, format and constraints."; }
    else { label = "Rescue needed"; sub = "Right now this is a wish, not an instruction. Start with the fixes below."; }
    return { score: score, checks: checks, words: words, label: label, sub: sub };
  }

  /* ---------------- Personas & task helpers ---------------- */
  var PERSONA = {
    everyday: "a practical, resourceful helper who works with what is actually available",
    career: "a hiring manager who has read ten thousand résumés and a blunt, useful career coach",
    education: "a patient teacher who makes the learner do the thinking",
    support: "a customer support lead who de-escalates without giving away the store",
    creators: "an editor with strong taste and no patience for filler",
    operations: "an operations lead who documents processes so well that new hires stop asking questions",
    research: "a senior researcher who protects nuance and evidence",
    hr: "a hiring manager who runs structured, fair interviews",
    sales: "a sales coach who has run thousands of discovery calls",
    marketing: "a senior marketer who ships work that sounds human",
    engineering: "a staff engineer with excellent judgement about production risk",
    product: "a senior product manager engineers actually trust",
    design: "an art director with a precise eye and a working knowledge of image models",
    data: "a senior analytics engineer with a low tolerance for sloppy numbers"
  };

  function personaFor(roleSlug, task) {
    var role = PF.roleById[roleSlug] || PF.roleById[task.role];
    var sing = role ? role.singular : "specialist";
    return PERSONA[roleSlug] || PERSONA[task.role] || ("an experienced " + sing + " with excellent judgement");
  }

  function varLabel(k) {
    var s = k.replace(/_/g, " ").toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function isImage(modelId) {
    var m = PF.byId[modelId];
    return m && (m.engine === "mj" || m.engine === "img");
  }

  var LIGHT = {
    editorial: "soft directional daylight, long shadows, museum lighting",
    cinematic: "dramatic practical lighting, volumetric haze, deep shadows",
    brutalist: "hard overhead light, stark shadows, raw textures",
    soft: "diffused window light, airy highlights, gentle falloff",
    retro: "warm tungsten light, faded colour, subtle halation",
    neon: "neon practicals, wet reflections, saturated magenta and cyan"
  };
  var PALETTE = {
    editorial: "bone, ink and a single vermilion accent",
    cinematic: "teal shadows against warm skin tones",
    brutalist: "concrete grey, black and safety orange",
    soft: "oat, chalk and pale sage",
    retro: "burnt orange, mustard and faded cream",
    neon: "magenta, cyan and deep indigo"
  };

  /* ---------------- The builders ---------------- */
  function buildPrompt(state) {
    var model = PF.byId[state.model];
    if (!model) return { text: "", model: null };
    if (model.engine === "mj" || model.engine === "img") return buildImage(state, model);
    return buildText(state, model);
  }

  function buildText(state, model) {
    var task = PF.llmTaskById[state.task] || PF.llmTasks[0];
    var tone = PF.tones.filter(function (t) { return t.id === state.tone; })[0] || PF.tones[0];
    var format = PF.formats.filter(function (f) { return f.id === state.format; })[0] || PF.formats[0];
    var persona = personaFor(state.role === "auto" ? task.role : state.role, task);
    var inputs = task.vars.map(function (v) {
      return "- " + varLabel(v[0]) + ": [" + v[0] + "]" + (v[1] ? " — e.g. " + v[1] : "");
    }).join("\n");
    if (state.context && state.context.trim()) inputs += "\n- Extra context from me: " + state.context.trim();

    var guardrails = state.guardrails
      ? "\n- Never invent facts, numbers, quotes, sources or customer names. If a value is needed and unknown, write [NEED_DATA].\n- Label any assumption as [ASSUMPTION]."
      : "";
    var quality = "Before you respond, check the output against every constraint above and fix it silently. " +
      (state.clarify
        ? "If any input is missing or ambiguous, ask up to three clarifying questions before starting."
        : "If anything is missing, state the assumption you made instead of inventing details.");

    var modelNote = "";
    if (model.id === "chatgpt") modelNote = "Deliver the output directly. No preamble, no explanation of what you are about to do.";
    if (model.id === "claude") modelNote = "Think the task through in <scratchpad> first. Put only the final deliverable outside the tags.";
    if (model.id === "gemini") modelNote = "For every factual claim, cite a source with a link. If you cannot verify something, label it [UNVERIFIED]. Work step by step.";
    if (model.id === "grok") modelNote = "Use real-time information where it matters, say clearly when something may be out of date, and skip the preamble.";

    var lines = [];
    if (model.engine === "xml") {
      lines.push(
        "<role>\nYou are " + persona + ".\n</role>",
        "",
        "<objective>\n" + task.objective + "\n</objective>",
        "",
        "<context>\n" + inputs + "\n</context>",
        "",
        "<deliverable>\n" + task.deliverable + "\n</deliverable>",
        "",
        "<format>\n" + format.line + "\n</format>",
        "",
        "<style>\n" + tone.line + " Plain language, concrete nouns, active voice.\n</style>",
        "",
        "<constraints>\n- Follow every instruction above; do not add sections I did not ask for.\n- Use my inputs exactly; do not replace them with generic placeholders unless I left one empty." + guardrails + "\n</constraints>",
        "",
        "<quality_bar>\n" + quality + "\n</quality_bar>",
        "",
        "<model_note>\n" + modelNote + "\n</model_note>"
      );
    } else {
      lines.push(
        "# ROLE\nYou are " + persona + ".",
        "",
        "# OBJECTIVE\n" + task.objective,
        "",
        "# CONTEXT\n" + inputs,
        "",
        "# DELIVERABLE\n" + task.deliverable,
        "",
        "# FORMAT\n" + format.line,
        "",
        "# STYLE\n" + tone.line + " Plain language, concrete nouns, active voice.",
        "",
        "# CONSTRAINTS\n- Follow every instruction above; do not add sections I did not ask for.\n- Use my inputs exactly; do not replace them with generic placeholders unless I left one empty." + guardrails,
        "",
        "# QUALITY BAR\n" + quality
      );
      if (modelNote) lines.push("", "# MODEL NOTE\n" + modelNote);
    }

    return { text: lines.join("\n"), task: task, model: model };
  }

  function imageSubject(state, task) {
    var subj = task.subject || "an image for [BRIEF]";
    var map = PF.imageSubjectVars[task.id] || [];
    map.forEach(function (pair) {
      // put the example after the variable in a compact way
      subj = subj.replace("[" + pair[0] + "]", "[" + pair[0] + "]");
    });
    return subj;
  }

  function buildImage(state, model) {
    var task = PF.imageTaskById[state.task] || PF.imageTasks[0];
    var aesthetic = PF.aesthetics.filter(function (t) { return t.id === state.tone; })[0] || PF.aesthetics[0];
    var aspect = PF.aspects.indexOf(state.format) !== -1 ? state.format : "4:5";
    var extra = (state.context || "").trim();
    var subject = imageSubject(state, task);
    var vars = PF.imageSubjectVars[task.id] || [];
    var exampleNote = vars.length
      ? "Subject variables: " + vars.map(function (v) { return "[" + v[0] + "] (e.g. " + v[1] + ")"; }).join(", ") + "."
      : "";

    if (model.engine === "mj") {
      var text = subject + ", " + aesthetic.line + ", " + LIGHT[aesthetic.id] + ", " + PALETTE[aesthetic.id] +
        " palette, strong composition, generous negative space, printed paper feel" +
        (extra ? ", " + extra : "") +
        "\n\n--ar " + aspect + " --style raw --v 8.2 --s " + (state.stylize || "180") + " --no text, watermark, logo, extra fingers";
      return { text: text, task: task, model: model, note: exampleNote };
    }

    var text2 = "Create a " + aspect + " image: " + subject + ".\n\n" +
      "Style: " + aesthetic.line + ".\n" +
      "Lighting: " + LIGHT[aesthetic.id] + ".\n" +
      "Palette: " + PALETTE[aesthetic.id] + ".\n" +
      "Composition: strong focal point, clean edges, generous negative space for type.\n" +
      (extra ? "Additional direction: " + extra + ".\n" : "") +
      "Finish: natural grain, realistic materials, editorial catalogue quality, no oversaturation.\n" +
      "Text in image: keep any visible text minimal, legible and under 18 characters.\n\n" +
      "Avoid: stock-photo clichés, floating objects, distorted hands, extra text, watermarks, plastic skin.";
    return { text: text2, task: task, model: model, note: exampleNote };
  }

  /* ---------------- Studio UI ---------------- */
  var state = {
    model: "chatgpt", role: "auto", task: "cold-email", tone: "direct", format: "short",
    guardrails: true, clarify: true, context: "", stylize: "180"
  };
  var built;

  function taskList() { return isImage(state.model) ? PF.imageTasks : PF.llmTasks; }
  function toneList() { return isImage(state.model) ? PF.aesthetics : PF.tones; }

  function fillSelect(el, items, value) {
    el.innerHTML = items.map(function (it) {
      var val = it.id != null ? it.id : it;
      var label = it.label != null ? it.label : it;
      return '<option value="' + val + '"' + (val === value ? " selected" : "") + ">" + label + "</option>";
    }).join("");
  }

  function syncUI() {
    var model = PF.byId[state.model];
    var img = isImage(state.model);
    $$("#modelSeg button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-model") === state.model);
      b.setAttribute("aria-pressed", b.getAttribute("data-model") === state.model ? "true" : "false");
    });
    fillSelect($("#bTask"), taskList().map(function (t) { return { id: t.id, label: t.label }; }), state.task);
    fillSelect($("#bTone"), toneList().map(function (t) { return { id: t.id, label: t.label }; }), state.tone);
    fillSelect($("#bFormat"),
      img ? PF.aspects.map(function (a) { return { id: a, label: a + (a === "4:5" ? " — portrait" : a === "16:9" ? " — landscape" : a === "9:16" ? " — story" : a === "1:1" ? " — square" : " — classic") }; })
          : PF.formats.map(function (f) { return { id: f.id, label: f.label }; }),
      state.format);
    $("#roleField").style.display = img ? "none" : "";
    $("#llmToggles").style.display = img ? "none" : "flex";
    $("#stylizeField").style.display = state.model === "midjourney" ? "" : "none";
    $("#toneLabel").textContent = img ? "Aesthetic" : "Tone";
    $("#formatLabel").textContent = img ? "Aspect ratio" : "Output format";
    var ctxText = $("#contextLabelText") || $("#contextLabel");
    ctxText.textContent = img ? "Extra direction (optional)" : "Anything specific? (optional)";
    $("#bStylize").value = state.stylize;

    var note = $("#studioNote");
    if (note) {
      if (model.engine === "mj") note.textContent = "Midjourney has no role to play — the prompt is a descriptor stack plus parameters. Swap one layer at a time.";
      else if (model.engine === "img") note.textContent = "GPT Image reads direction, not commands. Short, concrete scenes beat adjective piles — and keep on-image text under 18 characters.";
      else if (model.id === "claude") note.textContent = "Claude gets an XML structure — it follows tags closely and keeps reasoning inside <scratchpad>.";
      else if (model.id === "gemini") note.textContent = "Gemini gets citation and verification instructions built in; unverifiable claims must be labelled.";
      else if (model.id === "grok") note.textContent = "Grok gets a real-time instruction and no preamble — blunt in, blunt out.";
      else note.textContent = "ChatGPT gets a markdown spec with an explicit self-check before it answers.";
    }
    render();
  }

  function render() {
    built = buildPrompt(state);
    var out = $("#bOutput");
    if (!out) return;
    out.innerHTML = UI.highlights(built.text);
    out.scrollTop = 0;
    var words = PF.wordCount(built.text);
    $("#bWords").textContent = words + " words";
    var strengthEl = $("#bStrength");
    if (isImage(state.model)) {
      var params = state.model === "midjourney" ? "parameters locked" : "direction set";
      strengthEl.innerHTML = '<b style="color:#8FDCB8">' + params + "</b>";
      var noteEl = $("#bVarNote");
      if (noteEl) noteEl.textContent = built.note || "";
    } else {
      var a = analyze(built.text);
      strengthEl.innerHTML = "strength <b>" + a.score + "/100</b>";
      var noteEl2 = $("#bVarNote");
      if (noteEl2) noteEl2.textContent = PF.extractVars(built.text).length + " variables to fill after pasting";
    }
    var open = $("#bOpen");
    var model = PF.byId[state.model];
    if (open && model) {
      if (model.chat && model.prefill && model.url) {
        open.href = model.url + encodeURIComponent(built.text);
        open.innerHTML = "Open in " + model.name + " ↗";
      } else if (model.chat && model.url) {
        open.href = model.url;
        open.innerHTML = "Open " + model.name + " ↗";
      } else if (state.model === "midjourney") {
        open.href = "https://www.midjourney.com/imagine";
        open.innerHTML = "Open Midjourney ↗";
      } else {
        open.href = "https://chatgpt.com/";
        open.innerHTML = "Open ChatGPT ↗";
      }
    }
  }

  function setModel(id) {
    var m = PF.byId[id];
    if (!m) return;
    var wasImage = isImage(state.model);
    var willImage = isImage(id);
    state.model = id;
    if (wasImage !== willImage) {
      state.task = willImage ? "poster" : "cold-email";
      state.tone = willImage ? "editorial" : "direct";
      state.format = willImage ? "4:5" : "short";
    }
    if (id === "midjourney") state.tone = PF.aesthetics.some(function (t) { return t.id === state.tone; }) ? state.tone : "editorial";
    if (id === "gptimage" && state.tone === "cinematic") state.tone = "editorial";
    syncUI();
  }

  function applyPreset(p) {
    state.model = p.model;
    var img = isImage(p.model);
    state.task = p.task;
    state.tone = p.tone;
    state.format = p.format;
    // keep role if it exists for the task domain
    syncUI();
    var studio = $("#builder");
    if (studio && studio.getBoundingClientRect().top < -40) {
      studio.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function readQuery() {
    var params = new URLSearchParams(location.search);
    var model = params.get("model");
    if (model && PF.byId[model]) state.model = model;
    var role = params.get("role");
    if (role && PF.roleById[role]) state.role = role;
    var task = params.get("task");
    var img = isImage(state.model);
    if (task && (img ? PF.imageTaskById[task] : PF.llmTaskById[task])) state.task = task;
    if (!img) {
      state.tone = "direct";
      state.format = "short";
    }
  }

  function initStudio() {
    var studio = $("#builder");
    if (!studio) return;
    readQuery();
    var roleSel = $("#bRole");
    roleSel.innerHTML = '<option value="auto">Auto — best fit for the task</option>' +
      PF.roles.map(function (r) { return '<option value="' + r.slug + '">' + r.name + "</option>"; }).join("");
    roleSel.value = state.role;

    syncUI();

    $("#modelSeg").addEventListener("click", function (e) {
      var b = e.target.closest("[data-model]");
      if (b) setModel(b.getAttribute("data-model"));
    });
    roleSel.addEventListener("change", function () { state.role = roleSel.value; render(); });
    $("#bTask").addEventListener("change", function (e) {
      state.task = e.target.value;
      // sensible tone/format defaults for image tasks
      render();
    });
    $("#bTone").addEventListener("change", function (e) { state.tone = e.target.value; render(); });
    $("#bFormat").addEventListener("change", function (e) { state.format = e.target.value; render(); });
    $("#bContext").addEventListener("input", function (e) { state.context = e.target.value; });
    $("#bGuardrails").addEventListener("change", function (e) { state.guardrails = e.target.checked; render(); });
    $("#bClarify").addEventListener("change", function (e) { state.clarify = e.target.checked; render(); });
    $("#bStylize").addEventListener("change", function (e) { state.stylize = e.target.value; render(); });

    $("#bCopy").addEventListener("click", function () {
      UI.copyText(built.text, isImage(state.model) ? "Prompt copied — paste it into the model" : "Prompt copied — fill the [BRACKETS] and send");
      var btn = $("#bCopy");
      var old = btn.innerHTML;
      btn.innerHTML = UI.icons.check + " Copied";
      setTimeout(function () { btn.innerHTML = old; }, 1600);
    });
    $("#bDownload").addEventListener("click", function () {
      var text = "# PromptFoundry Studio\n" +
        "Model: " + PF.byId[state.model].name + " " + PF.byId[state.model].version + "\n" +
        "Task: " + (built.task ? built.task.label : "") + "\n" +
        "Built: " + new Date().toISOString().slice(0, 10) + "\n\n---\n\n" + built.text + "\n";
      var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "prompt-" + state.task + ".md";
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      UI.toast("Markdown file downloaded", "↓");
    });
    $("#bShuffle").addEventListener("click", function () {
      var tasks = taskList();
      var tones = toneList();
      var formats = isImage(state.model) ? PF.aspects : PF.formats.map(function (f) { return f.id; });
      var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
      var t = pick(tasks); state.task = t.id || t;
      state.tone = pick(tones).id;
      state.format = pick(formats);
      syncUI();
      UI.toast("Shuffled. Something unexpected, probably useful.", "↻");
    });
    $$(".preset").forEach(function (b, i) {
      b.addEventListener("click", function () {
        var p = PF.presets[parseInt(b.getAttribute("data-preset") || i, 10)];
        if (p) applyPreset(p);
      });
    });
    // deep link anchor
    if (location.hash === "#builder") {
      setTimeout(function () { studio.scrollIntoView({ behavior: "smooth", block: "center" }); }, 300);
    }
  }

  /* ---------------- Prompt Doctor ---------------- */
  function initDoctor() {
    var wrap = $("#doctor");
    if (!wrap) return;
    var ta = $("#doctorText");
    var run = $("#doctorRun");
    var sample = $("#doctorSample");
    var result = $("#doctorResult");
    var count = $("#doctorCount");
    var ringFg = $("#ringFg");
    var CIRC = 2 * Math.PI * 34;

    ringFg.style.strokeDasharray = CIRC.toFixed(1);
    ringFg.style.strokeDashoffset = CIRC.toFixed(1);

    ta.addEventListener("input", function () {
      count.textContent = PF.wordCount(ta.value) + " words · " + ta.value.length + " characters";
    });

    function grade() {
      var text = ta.value.trim();
      if (!text) {
        UI.toast("Paste a prompt first — even a rough one.", "!");
        ta.focus();
        return;
      }
      var a = analyze(text);
      result.classList.add("show");
      $("#doctorScore").textContent = a.score;
      $("#doctorLabel").textContent = a.label;
      $("#doctorSub").textContent = a.sub;
      var color = a.score >= 80 ? "#0F6249" : a.score >= 55 ? "#A96800" : "#E34A1B";
      ringFg.style.stroke = color;
      ringFg.style.strokeDashoffset = (CIRC * (1 - a.score / 100)).toFixed(1);
      $("#doctorScore").style.color = color;

      $("#doctorChecks").innerHTML = a.checks.map(function (c) {
        return '<div class="check ' + (c.ok ? "pass" : "fail") + '"><span class="ic">' + (c.ok ? "✓" : "✕") + "</span><span>" + c.label + "</span></div>";
      }).join("");

      var failed = a.checks.filter(function (c) { return !c.ok; }).slice(0, 3);
      var fix = $("#doctorFix");
      if (failed.length) {
        fix.innerHTML = "<b>Fix first:</b> " + failed.map(function (c) { return c.fix; }).join(" ");
        fix.classList.add("show");
      } else {
        fix.innerHTML = "<b>No weak spots detected.</b> Keep the test date with the prompt — models change, prompts drift.";
        fix.classList.add("show");
      }
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    run.addEventListener("click", grade);
    sample.addEventListener("click", function () {
      ta.value = "write a good blog post about our new AI tool. make it interesting and SEO friendly. add some stats. thanks";
      ta.dispatchEvent(new Event("input"));
      grade();
    });
    ta.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); grade(); }
    });
  }

  function init() {
    initStudio();
    initDoctor();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
