/* =============================================================
   PromptFoundry — shared UI
   Cards, drawer, header search, library filters, copy/toast.
   Vanilla JS. No build step, no dependencies.
   ============================================================= */
(function () {
  "use strict";
  var PF = window.PF;
  if (!PF) return;

  var body = document.body;
  var DEPTH = body.getAttribute("data-depth") === "1" ? 1 : 0;
  var BASE = DEPTH ? "../" : "";
  var PAGE = body.getAttribute("data-page") || "";

  var ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h8"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"></path><path d="M7 10l5 5 5-5"></path><path d="M4 20h16"></path></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 14a5 5 0 0 0 7.1 0l2.4-2.4a5 5 0 0 0-7.1-7.1L11 5.9"></path><path d="M14 10a5 5 0 0 0-7.1 0L4.5 12.4a5 5 0 0 0 7.1 7.1l1.4-1.4"></path></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"></path></svg>'
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }
  function modelName(id) {
    var m = PF.byId[id];
    return m ? m.name + " " + m.version : id;
  }
  function fmtDate(iso) {
    try {
      return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch (e) { return iso; }
  }
  function highlights(text) {
    return text.split("\n").map(function (line) {
      var l = esc(line).replace(/\[([A-Z][A-Z0-9_]{1,30})\]/g, '<span class="var">[$1]</span>');
      if (/^#\s/.test(line)) l = '<span class="sec">' + l + "</span>";
      else if (/^&lt;\/?[a-z_]+&gt;$/.test(l)) l = '<span class="tag">' + l + "</span>";
      return l;
    }).join("\n");
  }

  /* ---------------- Toast ---------------- */
  function toast(msg, icon) {
    var wrap = $(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      wrap.setAttribute("role", "status");
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<span class="tic">' + (icon || "✓") + "</span><span>" + msg + "</span>";
    wrap.appendChild(el);
    setTimeout(function () {
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 320);
    }, 2800);
  }

  /* ---------------- Copy ---------------- */
  function copyText(text, okMsg) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove();
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        toast(okMsg || "Copied to clipboard");
      }).catch(function () { fallback(); toast(okMsg || "Copied to clipboard"); });
    } else {
      fallback();
      toast(okMsg || "Copied to clipboard");
    }
  }

  function promptCopy(p) {
    copyText(p.template, "Copied <b>" + esc(p.title) + "</b> — paste it into your model");
  }

  /* ---------------- Badges & cards ---------------- */
  function badges(ids) {
    return '<div class="model-badges">' + ids.map(function (id) {
      var m = PF.byId[id];
      if (!m) return "";
      return '<span class="mb" style="background:' + m.color + '" title="' + esc(m.name + " " + m.version) + '">' + m.badge + "</span>";
    }).join("") + "</div>";
  }

  function card(p) {
    var cat = PF.catById[p.category] || { name: p.category };
    var vars = PF.extractVars(p.template);
    var snippet = p.template.split("\n").filter(Boolean).slice(0, 3).join("\n");
    return '<article class="p-card reveal" data-slug="' + p.slug + '" style="--acc:' + (cat.hue || "var(--ember)") + ';--accw:' + (cat.hueSoft || "var(--ember-wash)") + '">' +
      '<div class="p-top"><span class="cat">' + esc(cat.name) + "</span>" +
      '<button class="icon-btn" data-copy-prompt="' + p.slug + '" aria-label="Copy ' + esc(p.title) + '" title="Copy prompt">' + ICON.copy + "</button></div>" +
      "<h3><button data-open=\"" + p.slug + "\">" + esc(p.title) + "</button></h3>" +
      '<p class="blurb">' + esc(p.blurb) + "</p>" +
      '<pre class="snippet" aria-hidden="true">' + esc(snippet) + "</pre>" +
      '<div class="p-meta"><div style="display:flex;align-items:center;gap:9px">' + badges(p.models) +
      '<span class="p-vars">' + vars.length + " vars</span></div>" +
      '<span class="pass" title="Passed ' + esc(p.pass) + ' test runs"><i></i>' + esc(p.pass) + "</span></div>" +
      '<div class="p-card-footer"><button class="card-link" data-open="' + p.slug + '">Preview prompt ' + ICON.arrow + '</button><span class="jump-hint">Tap to open</span>' +
      '<span class="p-vars">' + esc(fmtDate(p.tested)) + "</span></div>" +
      "</article>";
  }

  /* ---------------- Drawer ---------------- */
  var drawer, backdrop, lastFocus;
  function buildDrawer() {
    backdrop = document.createElement("div");
    backdrop.className = "drawer-backdrop";
    backdrop.setAttribute("data-close-drawer", "");
    document.body.appendChild(backdrop);

    drawer = document.createElement("aside");
    drawer.className = "drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "Prompt details");
    drawer.innerHTML =
      '<div class="drawer-head"><span class="cat" id="drawerCat"></span>' +
      '<button class="icon-btn close" data-close-drawer aria-label="Close prompt">' + ICON.close + "</button></div>" +
      '<div class="drawer-body" id="drawerBody"></div>';
    document.body.appendChild(drawer);

    drawer.addEventListener("click", function (e) {
      var close = e.target.closest("[data-close-drawer]");
      if (close) closeDrawer();
    });
    backdrop.addEventListener("click", closeDrawer);
  }

  function builderLink(p) {
    var params = "?task=" + encodeURIComponent(p.task) + "&role=" + encodeURIComponent(p.role) +
      "&model=" + encodeURIComponent((p.models && p.models[0]) || "chatgpt");
    return BASE + "index.html" + params + "#builder";
  }

  function openPrompt(slug, skipUrl) {
    var p = PF.promptBySlug[slug];
    if (!p) return;
    if (!drawer) buildDrawer();
    lastFocus = document.activeElement;
    var cat = PF.catById[p.category] || { name: p.category };
    drawer.style.setProperty("--acc", cat.hue || "var(--ember)");
    $("#drawerCat").textContent = cat.name + " · " + (PF.roleById[p.role] ? PF.roleById[p.role].name : p.role);
    var vars = PF.extractVars(p.template);
    var related = PF.prompts.filter(function (x) { return x.category === p.category && x.slug !== p.slug; }).slice(0, 3);

    $("#drawerBody").innerHTML =
      "<h2>" + esc(p.title) + "</h2>" +
      '<p class="d-blurb">' + esc(p.blurb) + "</p>" +
      '<div class="model-row">' + p.models.map(function (id) {
        var m = PF.byId[id];
        return m ? '<span class="model-pill"><span class="mb" style="background:' + m.color + ';width:16px;height:16px;border-radius:4px;display:grid;place-items:center;font-size:7px;font-weight:700;color:#fff">' + m.badge + "</span>" + esc(m.name) + " " + esc(m.version) + "</span>" : "";
      }).join("") + "</div>" +
      '<div class="d-meta">' +
      "<div><span>Pass rate</span><b>" + esc(p.pass) + "</b></div>" +
      "<div><span>Last tested</span><b>" + esc(fmtDate(p.tested)) + "</b></div>" +
      "<div><span>Variables</span><b>" + vars.length + "</b></div>" +
      "<div><span>Words</span><b>" + PF.wordCount(p.template) + "</b></div>" +
      "</div>" +
      '<div class="d-section"><div class="d-label"><span>The prompt</span><span style="letter-spacing:0;text-transform:none">Replace the [BRACKETS]</span></div>' +
      '<div class="prompt-block"><pre>' + highlights(p.template) + "</pre>" +
      '<div class="pb-actions">' +
      '<button class="btn" data-drawer-copy>' + ICON.copy + " Copy prompt</button>" +
      '<button class="btn ghost" data-drawer-dl>' + ICON.download + " Download .md</button>" +
      '<button class="btn ghost" data-drawer-share>' + ICON.link + " Share</button>" +
      '<span class="pb-hint">' + PF.wordCount(p.template) + " words</span>" +
      "</div></div></div>" +
      (vars.length ? '<div class="d-section"><div class="d-label"><span>Variables to fill</span></div><div class="var-list">' +
        vars.map(function (v) { return '<span class="var-chip"><b>[' + esc(v) + "]</b></span>"; }).join("") + "</div></div>" : "") +
      '<div class="d-section"><div class="d-label"><span>What good output looks like</span></div><div class="example-box">' + esc(p.example) + "</div></div>" +
      '<div class="d-section"><div class="tip-box"><b>Note</b><div>' + esc(p.tip) + "</div></div></div>" +
      '<div class="d-section"><div class="d-label"><span>Take it further</span></div>' +
      '<a class="btn dark block" href="' + builderLink(p) + '">' + ICON.spark + " Rebuild it in the Studio for your context</a>" +
      '<p class="small muted" style="margin-top:8px;font-size:12px">The Studio adds your role, tone, format and guardrails — and adapts the structure to GPT-6.1, Claude, Gemini, Grok or an image model.</p></div>' +
      (related.length ? '<div class="d-section"><div class="d-label"><span>Related prompts</span></div><div class="related-list">' +
        related.map(function (r) {
          return '<button data-related="' + r.slug + '"><span style="display:flex;gap:10px;align-items:center">' + esc(r.title) + '</span><span>' + esc(r.pass) + " · " + esc(PF.catById[r.category] ? PF.catById[r.category].name : "") + "</span></button>";
        }).join("") + "</div></div>" : "") +
      '<p class="small muted" style="margin-top:26px;font-size:11.5px">Tested ' + esc(fmtDate(p.tested)) + " on " + esc(p.models.map(modelName).join(", ")) + ". PromptFoundry is independent — not affiliated with any model provider.</p>";

    drawer.classList.add("open");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";

    var copyBtn = $("[data-drawer-copy]", drawer);
    if (copyBtn) copyBtn.addEventListener("click", function () { promptCopy(p); });
    var dlBtn = $("[data-drawer-dl]", drawer);
    if (dlBtn) dlBtn.addEventListener("click", function () { downloadPrompt(p); });
    var shBtn = $("[data-drawer-share]", drawer);
    if (shBtn) shBtn.addEventListener("click", function () {
      var url = location.href.split("?")[0].split("#")[0] + "?p=" + p.slug;
      copyText(url, "Link copied");
    });
    $$("[data-related]", drawer).forEach(function (b) {
      b.addEventListener("click", function () { openPrompt(b.getAttribute("data-related"), false); });
    });
    var closeBtn = $(".drawer-head .close", drawer);
    if (closeBtn) closeBtn.focus();

    if (!skipUrl) {
      try {
        var url = new URL(location.href);
        url.searchParams.set("p", p.slug);
        history.replaceState(null, "", url);
      } catch (e) {}
    }
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    try {
      var url = new URL(location.href);
      url.searchParams.delete("p");
      history.replaceState(null, "", url);
    } catch (e) {}
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function downloadPrompt(p) {
    var vars = PF.extractVars(p.template);
    var text = "# " + p.title + "\n\n" +
      "Source: " + PF.config.url + "/library.html?p=" + p.slug + "\n" +
      "Last tested: " + p.tested + " · Pass rate: " + p.pass + " · Models: " + p.models.map(modelName).join(", ") + "\n\n" +
      "---\n\n" + p.template + "\n\n---\n\n" +
      "Variables: " + (vars.length ? vars.join(", ") : "none") + "\n\n" +
      "What good output looks like:\n" + p.example + "\n\n" +
      "Note: " + p.tip + "\n";
    var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "pf-" + p.slug + ".md";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast("Downloading <b>" + esc(p.title) + "</b> as Markdown");
  }

  /* ---------------- Shared interactions ---------------- */
  function initNav() {
    var nav = $(".nav");
    var dropWrap = $(".nav-drop");
    var dropBtn = $("[data-drop]");
    var dropPanel = $("#navDropPanel");
    var lastY = window.scrollY;

    // Data-driven category lists (dropdown + mobile menu) from the single source of truth.
    function catLinks(withCount) {
      return PF.categories.map(function (c) {
        var n = PF.prompts.filter(function (p) { return p.category === c.id; }).length;
        var dot = '<i class="ndp-dot" style="background:' + (c.hue || "var(--faint)") + '"></i>';
        return '<a class="ndp-item" href="' + BASE + "library.html?category=" + c.id + '">' + dot + esc(c.name) +
          (withCount ? '<span class="ndp-c">' + n + "</span>" : "") + "</a>";
      }).join("");
    }
    var dropCats = $("[data-drop-cats]");
    if (dropCats) dropCats.innerHTML = catLinks(true);
    var mmCats = $(".mm-cats");
    if (mmCats) mmCats.innerHTML = catLinks(false);

    function dropIsOpen() { return dropBtn && dropBtn.getAttribute("aria-expanded") === "true"; }
    function setDrop(open) {
      if (!dropBtn || !dropWrap) return;
      dropWrap.classList.toggle("open", open);
      dropBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) lastY = window.scrollY;
    }
    if (dropBtn && dropPanel) {
      dropBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        setDrop(!dropIsOpen());
      });
      document.addEventListener("click", function (e) {
        if (dropIsOpen() && !e.target.closest(".nav-drop")) setDrop(false);
      });
      dropPanel.addEventListener("click", function (e) {
        if (e.target.closest("a")) setDrop(false);
      });
    }

    if (nav) {
      var mq = window.matchMedia ? window.matchMedia("(min-width:761px)") : { matches: true };
      var tick = false;
      var onScroll = function () {
        if (tick) return;
        tick = true;
        requestAnimationFrame(function () {
          tick = false;
          var y = window.scrollY;
          nav.classList.toggle("scrolled", y > 8);
          if (mq.matches && !dropIsOpen()) {
            if (y > lastY + 4 && y > 140) {
              nav.classList.add("hide");
              document.body.classList.add("nav-hidden");
            } else if (y < lastY - 4 || y <= 140) {
              nav.classList.remove("hide");
              document.body.classList.remove("nav-hidden");
            }
          } else {
            nav.classList.remove("hide");
            document.body.classList.remove("nav-hidden");
          }
          lastY = y;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      if (mq.addEventListener) mq.addEventListener("change", onScroll);
      else if (mq.addListener) mq.addListener(onScroll);
      onScroll();
    }
    var menuBtn = $("[data-menu]");
    var mobile = $("#mobileMenu");
    if (menuBtn && mobile) {
      menuBtn.addEventListener("click", function () {
        var open = mobile.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        menuBtn.innerHTML = open ? ICON.close : ICON.menu;
      });
    }
    var navSearch = $("#navSearch");
    if (navSearch) {
      var nsForm = navSearch.closest("form");
      if (nsForm) {
        nsForm.addEventListener("submit", function (e) {
          e.preventDefault();
          if ($("#lib-grid")) return; // library page live-filters; URL is kept in sync there
          var q = navSearch.value.trim();
          location.href = BASE + "library.html" + (q ? "?q=" + encodeURIComponent(q) : "");
        });
      }
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (dropIsOpen()) setDrop(false);
        else if (drawer && drawer.classList.contains("open")) closeDrawer();
      }
    });
  }

  function initGlobalClicks() {
    document.addEventListener("click", function (e) {
      var copyBtn = e.target.closest("[data-copy-prompt]");
      if (copyBtn) {
        var slug = copyBtn.getAttribute("data-copy-prompt");
        var p = PF.promptBySlug[slug];
        if (p) { promptCopy(p); return; }
      }
      var openBtn = e.target.closest("[data-open]");
      if (openBtn) {
        e.preventDefault();
        openPrompt(openBtn.getAttribute("data-open"));
        return;
      }
      var searchBtn = e.target.closest("[data-search]");
      if (searchBtn) { openPalette(); }
    });
    if (typeof ResizeObserver === "undefined") return;
  }

  function initReveals() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  }

  function initNewsletter() {
    $$("[data-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = $('input[type="email"]', form);
        var val = (input.value || "").trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
          toast("That email doesn't look right — mind checking it?", "!");
          input.focus();
          return;
        }
        var ok = $(".nl-success", form.parentElement) || $(".nl-success", form);
        form.style.display = "none";
        if (ok) ok.classList.add("show");
        try { localStorage.setItem("pf-subscribed", val); } catch (err) {}
        toast("You're on the list. First dispatch lands Friday.", "✓");
      });
    });
  }

  /* ---------------- Home page ---------------- */
  function initHome() {
    var feat = $("#featured-grid");
    if (feat) {
      var curated = ["cold-email-that-gets-replies", "senior-code-review", "linkedin-post-in-your-voice", "feynman-study-sprint", "midjourney-editorial-poster", "spreadsheet-to-memo"];
      var items = curated.map(function (s) { return PF.promptBySlug[s]; }).filter(Boolean);
      feat.innerHTML = items.map(card).join("");
    }
    var catGrid = $("#cat-grid");
    if (catGrid) {
      catGrid.innerHTML = PF.categories.map(function (c, i) {
        var n = PF.prompts.filter(function (p) { return p.category === c.id; }).length;
        return '<a class="cat-card reveal" href="' + BASE + "library.html?category=" + c.id + '" style="--acc:' + (c.hue || "var(--ember)") + ';--accw:' + (c.hueSoft || "var(--ember-wash)") + '">' +
          '<span class="cat-num">0' + (i + 1) + "</span>" +
          '<span class="cat-count">' + n + " prompts</span>" +
          '<span class="cat-name">' + esc(c.name) + " <span>→</span></span>" +
          '<span class="cat-desc">' + esc(c.desc) + "</span></a>";
      }).join("");
    }
    var roleGrid = $("#roles-grid");
    if (roleGrid) {
      var featuredRoles = ["marketing", "engineering", "sales", "product", "design", "education"];
      roleGrid.innerHTML = featuredRoles.map(function (slug) {
        var r = PF.roleById[slug];
        var n = PF.prompts.filter(function (p) { return p.role === slug; }).length;
        return '<a class="role-card reveal" href="' + BASE + "roles/" + r.slug + '.html">' +
          '<div class="rc-top"><span class="rc-cat">' + esc(r.category) + " role</span><span class=\"rc-arrow\">↗</span></div>" +
          "<h3>" + esc(r.name) + "</h3><p>" + esc(r.blurb) + "</p>" +
          '<div class="rc-foot"><span class="cnt">' + n + " tested " + (n === 1 ? "prompt" : "prompts") + '</span><span>View page →</span></div></a>';
      }).join("");
    }
    $$("[data-stat]").forEach(function (el) {
      var key = el.getAttribute("data-stat");
      var val = "";
      if (key === "prompts") val = PF.prompts.length;
      else if (key === "roles") val = PF.roles.length;
      else if (key === "models") val = PF.models.length;
      else if (key === "runs") {
        val = PF.prompts.reduce(function (sum, p) { var n = parseInt((p.pass.split("/")[1] || "10"), 10); return sum + n; }, 0);
      }
      el.textContent = val;
    });
  }

  /* ---------------- Library ---------------- */
  function initLibrary() {
    var grid = $("#lib-grid");
    if (!grid) return;
    var searchEl = $("#navSearch");
    var filtersEl = $("#lib-filters");
    var emptyEl = $("#lib-empty");
    var params = new URLSearchParams(location.search);

    var state = {
      q: params.get("q") || "",
      category: params.get("category") || "all",
      model: params.get("model") || "all",
      role: params.get("role") || "all"
    };
    if (searchEl) searchEl.value = state.q;

    function filterRow() {
      if (!filtersEl) return;
      var items = [];
      if (state.category !== "all") {
        var c = PF.catById[state.category] || {};
        items.push({ k: "category", label: c.name || state.category, hue: c.hue });
      }
      if (state.model !== "all") {
        var m = PF.byId[state.model] || {};
        items.push({ k: "model", label: m.name || state.model, hue: m.color });
      }
      if (state.role !== "all") {
        var r = PF.roleById[state.role] || {};
        items.push({ k: "role", label: r.name || state.role, hue: null });
      }
      if (!items.length) { filtersEl.hidden = true; filtersEl.innerHTML = ""; return; }
      filtersEl.hidden = false;
      filtersEl.innerHTML = '<span class="lf-label">Filtered by</span>' + items.map(function (f) {
        return '<button class="chip on" type="button" data-clear="' + f.k + '" style="--acc:' + (f.hue || "var(--ink)") + '" aria-label="Clear ' + esc(f.k) + ' filter">' + esc(f.label) + " \u2715</button>";
      }).join("") + '<span class="lf-count"></span>';
    }

    function apply() {
      var q = state.q.trim().toLowerCase();
      var list = PF.prompts.filter(function (p) {
        if (state.category !== "all" && p.category !== state.category) return false;
        if (state.model !== "all" && p.models.indexOf(state.model) === -1) return false;
        if (state.role !== "all" && p.role !== state.role) return false;
        if (q) {
          var hay = [p.title, p.blurb, p.template, p.tip, p.example,
            PF.catById[p.category] ? PF.catById[p.category].name : "",
            PF.roleById[p.role] ? PF.roleById[p.role].name : "",
            (PF.llmTaskById[p.task] ? PF.llmTaskById[p.task].label : ""),
            p.models.map(modelName).join(" ")
          ].join(" ").toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });
      list.sort(function (a, b) { return new Date(b.tested) - new Date(a.tested); });

      grid.innerHTML = list.map(card).join("");
      grid.hidden = list.length === 0;
      if (emptyEl) emptyEl.hidden = list.length !== 0;
      filterRow();
      var count = filtersEl ? filtersEl.querySelector(".lf-count") : null;
      if (count) count.textContent = list.length + (list.length === 1 ? " prompt" : " prompts");
      $$(".reveal", grid).forEach(function (el) { el.classList.add("in"); });

      try {
        var url = new URL(location.href);
        if (state.q) url.searchParams.set("q", state.q); else url.searchParams.delete("q");
        if (state.category !== "all") url.searchParams.set("category", state.category); else url.searchParams.delete("category");
        if (state.model !== "all") url.searchParams.set("model", state.model); else url.searchParams.delete("model");
        if (state.role !== "all") url.searchParams.set("role", state.role); else url.searchParams.delete("role");
        history.replaceState(null, "", url);
      } catch (e) {}
    }

    if (searchEl) searchEl.addEventListener("input", debounce(function () {
      state.q = searchEl.value; apply();
    }, 140));
    if (filtersEl) filtersEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-clear]");
      if (!b) return;
      state[b.getAttribute("data-clear")] = "all";
      apply();
    });

    apply();
    var openSlug = params.get("p");
    if (openSlug && PF.promptBySlug[openSlug]) setTimeout(function () { openPrompt(openSlug, true); }, 60);
  }

  /* ---------------- Role page ---------------- */
  function initRolePage() {
    var holder = $("[data-role-tasklist]");
    if (!holder) return;
    var slug = holder.getAttribute("data-role-tasklist");
    var tasks = PF.llmTasks.filter(function (t) {
      var p = PF.prompts.filter(function (x) { return x.role === slug; });
      return p.some(function (x) { return x.task === t.id; });
    });
    if (!tasks.length) tasks = PF.llmTasks.slice(0, 3);
    holder.innerHTML = tasks.map(function (t) {
      return '<div class="matrix-item"><span>' + esc(t.label) + '</span><a href="' + BASE + "index.html?task=" + t.id + "&role=" + slug + "#builder\">Build it →</a></div>";
    }).join("");
  }

  /* ---------------- init ---------------- */
  function init() {
    initNav();
    initGlobalClicks();
    initHome();
    initLibrary();
    initRolePage();
    initNewsletter();
    initReveals();
    // Deep link: ?p=slug on any page with prompt data
    var params = new URLSearchParams(location.search);
    var slug = params.get("p");
    if (slug && PF.promptBySlug[slug] && !$("#lib-grid")) {
      setTimeout(function () { openPrompt(slug, true); }, 120);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // expose small helpers for builder.js
  window.PFUI = { toast: toast, copyText: copyText, highlights: highlights, icons: ICON, base: BASE };
})();
