/* =============================================================
   PromptFoundry — voice input
   Speaks into the builder & library via the Web Speech API.
   Fully client-side: audio never leaves the browser.
   ============================================================= */
(function () {
  "use strict";
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var btns = Array.prototype.slice.call(document.querySelectorAll(".mic-btn"));
  if (!btns.length) return;

  if (!SR) {
    // Browser without speech recognition — hide the affordance, keep the page intact.
    btns.forEach(function (b) {
      b.style.display = "none";
      var hint = b.closest(".voice-label") ? b.closest(".voice-label").nextElementSibling : null;
      if (hint && hint.classList && hint.classList.contains("voice-hint")) hint.style.display = "none";
    });
    return;
  }

  function toast(msg, icon) {
    if (window.PFUI && window.PFUI.toast) { window.PFUI.toast(msg, icon); return; }
    var wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      wrap.setAttribute("role", "status");
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<span class="tic">' + (icon || "✓") + '</span><span>' + msg + "</span>";
    wrap.appendChild(el);
    setTimeout(function () {
      el.classList.add("out");
      setTimeout(function () { el.remove(); }, 320);
    }, 3200);
  }

  var active = null;

  btns.forEach(function (btn) {
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var target = document.getElementById(btn.getAttribute("data-voice-target"));
      if (!target) return;

      // Toggle off if this mic is already listening.
      if (active && active.btn === btn) {
        try { active.rec.stop(); } catch (err) {}
        return;
      }
      // Stop any other listening mic first.
      if (active) { try { active.rec.stop(); } catch (err) {} }

      var rec = new SR();
      var navLang = navigator.language || "en-US";
      rec.lang = navLang.length >= 5 ? navLang : "en-US";
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      var startText = (target.value || "").trim();
      var state = { rec: rec, btn: btn };

      rec.onresult = function (ev) {
        var t = "";
        for (var i = 0; i < ev.results.length; i++) t += ev.results[i][0].transcript;
        t = t.replace(/^\s+|\s+$/g, "");
        target.value = startText ? startText + " " + t : t;
        target.dispatchEvent(new Event("input", { bubbles: true }));
      };

      rec.onend = function () {
        btn.classList.remove("on");
        btn.setAttribute("aria-pressed", "false");
        if (active === state) active = null;
      };

      rec.onerror = function (ev) {
        btn.classList.remove("on");
        if (active === state) active = null;
        if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
          toast("Microphone is blocked — allow mic access in your browser to dictate.", "⚠");
        } else if (ev.error === "no-speech") {
          toast("Didn't catch anything — tap the mic and try again.", "⚠");
        } else if (ev.error !== "aborted") {
          toast("Voice input stopped (" + ev.error + ").", "⚠");
        }
      };

      active = state;
      btn.classList.add("on");
      btn.setAttribute("aria-pressed", "true");
      try {
        rec.start();
        toast("Listening — speak your prompt…", "◉");
      } catch (err) {
        btn.classList.remove("on");
        if (active === state) active = null;
      }
    });
  });
})();
