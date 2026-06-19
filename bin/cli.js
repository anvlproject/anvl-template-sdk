#!/usr/bin/env node
/**
 * anvl-template — CLI for ANVL Template SDK
 * Commands:
 *   anvl-template validate <dir>   Validate a template directory
 *   anvl-template preview <dir>    Start local preview server
 *   anvl-template init <name>      Scaffold a new template
 */

const path = require("path");
const fs   = require("fs");

const cmd  = process.argv[2];
const arg  = process.argv[3];

// ── VALIDATE ─────────────────────────────────────────────────────────────────
if (cmd === "validate") {
  const dir = path.resolve(arg || ".");
  console.log(`\nValidating template at: ${dir}\n`);

  const { validateTemplate } = require("../dist/validator");
  const result = validateTemplate(dir);

  if (result.errors.length > 0) {
    console.error("  ERRORS:");
    result.errors.forEach((e) => console.error(`    ✖ ${e}`));
  }
  if (result.warnings.length > 0) {
    console.warn("\n  WARNINGS:");
    result.warnings.forEach((w) => console.warn(`    ⚠ ${w}`));
  }
  if (result.valid) {
    console.log("  ✔ Template is valid and ready for submission!\n");
    process.exit(0);
  } else {
    console.error(`\n  ✖ Template has ${result.errors.length} error(s). Fix them before submitting.\n`);
    process.exit(1);
  }
}

// ── PREVIEW ───────────────────────────────────────────────────────────────────
else if (cmd === "preview") {
  const dir  = path.resolve(arg || ".");
  const port = parseInt(process.argv[4] || "4000", 10);
  const { startPreviewServer } = require("../dist/preview-server");
  startPreviewServer(dir, port);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
else if (cmd === "init") {
  const name = arg || "my-template";
  const id   = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const dir  = path.resolve(id);

  if (fs.existsSync(dir)) {
    console.error(`Directory already exists: ${dir}`);
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });

  // manifest.json
  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify({
    id,
    name,
    description: "A custom ANVL coin site template",
    author: "Your Name",
    version: "1.0.0",
    preview: "preview.png",
    primaryColor: "#F5A623",
    bgColor: "#0F0F1A",
    tags: ["custom"]
  }, null, 2));

  // style.css
  fs.writeFileSync(path.join(dir, "style.css"), [
    ":root {",
    "  /* ANVL injects user colors into these variables at render time */",
    "  --anvl-primary: #F5A623;",
    "  --anvl-bg:      #0F0F1A;",
    "  --anvl-text:    #E0E0F0;",
    "  --anvl-muted:   #888899;",
    "  --anvl-border:  #2A2A3E;",
    "}",
    "",
    "* { box-sizing: border-box; margin: 0; padding: 0; }",
    "body { background: var(--anvl-bg); color: var(--anvl-text); font-family: sans-serif; }",
    ".hero { padding: 80px 24px; text-align: center; }",
    ".hero h1 { font-size: clamp(2rem, 6vw, 4rem); color: var(--anvl-primary); }",
    ".hero p { color: var(--anvl-muted); margin-top: 16px; font-size: 1.1rem; }",
  ].join("\n"));

  // template.js
  fs.writeFileSync(path.join(dir, "template.js"), [
    "// ANVL injects window.ANVL_DATA before this script runs.",
    "(function () {",
    "  var data = window.ANVL_DATA || {};",
    "",
    "  document.getElementById('coin-name').textContent    = data.name    || 'COIN';",
    "  document.getElementById('coin-ticker').textContent  = '$' + (data.ticker || 'COIN');",
    "  document.getElementById('coin-tagline').textContent = data.tagline  || '';",
    "  document.getElementById('coin-lore').textContent    = data.lore     || '';",
    "})();",
  ].join("\n"));

  // index.html
  fs.writeFileSync(path.join(dir, "index.html"), [
    "<!DOCTYPE html>",
    "<html lang=\"en\">",
    "<head>",
    "  <meta charset=\"UTF-8\">",
    "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
    "  <title><!-- ANVL_DATA.name --></title>",
    "  <link rel=\"stylesheet\" href=\"style.css\">",
    "</head>",
    "<body>",
    "  <section class=\"hero\">",
    "    <h1 id=\"coin-name\">Loading...</h1>",
    "    <h2 id=\"coin-ticker\"></h2>",
    "    <p id=\"coin-tagline\"></p>",
    "    <p id=\"coin-lore\" style=\"max-width:600px;margin:24px auto;\"></p>",
    "  </section>",
    "  <!-- ANVL_DATA injected here by preview server / ANVL platform -->",
    "  <script src=\"template.js\"></script>",
    "</body>",
    "</html>",
  ].join("\n"));

  // placeholder preview.png (1x1 transparent PNG)
  const PNG1x1 = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
  fs.writeFileSync(path.join(dir, "preview.png"), PNG1x1);

  console.log(`\n  ✔ Template scaffolded at: ${dir}`);
  console.log(`\n  Next steps:`);
  console.log(`    cd ${id}`);
  console.log(`    npx anvl-template preview .     # live preview`);
  console.log(`    npx anvl-template validate .    # check before submit\n`);
}

// ── HELP ──────────────────────────────────────────────────────────────────────
else {
  console.log(`
  anvl-template — ANVL Template SDK CLI

  Commands:
    init <name>        Scaffold a new template
    preview <dir>      Start local preview server (default port 4000)
    validate <dir>     Validate template before submission

  Examples:
    npx anvl-template init my-cool-theme
    npx anvl-template preview ./my-cool-theme
    npx anvl-template validate ./my-cool-theme
`);
}
