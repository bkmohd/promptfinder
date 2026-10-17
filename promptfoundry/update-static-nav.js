"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ROOT = __dirname;
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "assets/data.js"), "utf8"), sandbox, { filename: "data.js" });
const PF = sandbox.window.PF;
const navHtml = require(path.join(ROOT, "content/nav.js"));
const pages = {
  "index.html": "studio",
  "library.html": "library",
  "how-we-test.html": "lab",
  "about.html": "about",
  "privacy.html": "",
  "404.html": ""
};
const re = /<a class="skip-link" href="#main">Skip to content<\/a>[\s\S]*?<header class="nav">[\s\S]*?<\/header>/;
let failed = false;
for (const [file, active] of Object.entries(pages)) {
  const f = path.join(ROOT, file);
  let html = fs.readFileSync(f, "utf8");
  if (!re.test(html)) { console.error("NO MATCH:", file); failed = true; continue; }
  html = html.replace(re, navHtml(PF, active, ""));
  fs.writeFileSync(f, html);
  console.log("updated", file, "(active:", active || "none", ")");
}
process.exit(failed ? 1 : 0);
