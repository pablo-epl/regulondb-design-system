#!/usr/bin/env node
/**
 * build-tokens.mjs
 * -----------------------------------------------------------------------------
 * Reads spec/tokens.json (single source of truth) and emits the canonical
 * tokens.css. Writes to:
 *   - spec/assets/tokens.css
 *   - lib/src/styles/tokens.css
 *
 * Output is deterministic and stable — diff-friendly across runs. The script
 * has no dependencies; runs on any Node ≥ 18.
 *
 * Usage:
 *   node scripts/build-tokens.mjs            # write
 *   node scripts/build-tokens.mjs --check    # exit 1 if files are stale
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const TOKENS_JSON  = resolve(root, "spec/tokens.json");
const SPEC_OUT     = resolve(root, "spec/assets/tokens.css");
const LIB_OUT      = resolve(root, "lib/src/styles/tokens.css");

const json = JSON.parse(readFileSync(TOKENS_JSON, "utf8"));

// ---------- Reference resolution: "{color.blue.2}" → "#32617D" ---------------
const ref = /^\{([^}]+)\}$/;
const get = (path) => path.split(".").reduce((o, k) => o?.[k], json);
function resolve$value(v) {
  if (typeof v !== "string") return v;
  const m = v.match(ref);
  if (!m) return v;
  const target = get(m[1]);
  if (!target || target.$value === undefined)
    throw new Error(`Unresolved token reference: ${m[1]}`);
  return resolve$value(target.$value);
}

// ---------- Helpers ----------------------------------------------------------
const lines = [];
const out = (s = "") => lines.push(s);
const section = (title) => {
  out("");
  out(`  /* ${"-".repeat(76)} */`);
  out(`  /* ${title.padEnd(74)} */`);
  out(`  /* ${"-".repeat(76)} */`);
};
const decl = (name, value) => out(`  --${name}: ${value};`);

// ---------- Header -----------------------------------------------------------
out("/* =============================================================================");
out(`   RegulonDB MG — tokens.css  v${json.$version}`);
out("   GENERATED FILE — do not edit by hand.");
out("   SOURCE: spec/tokens.json   →   scripts/build-tokens.mjs");
out("   ============================================================================= */");
out("");
out(":root {");

// ---------- Brand palette (literal hexes) ------------------------------------
section("Brand palette (hex from the official RegulonDB PDF)");
for (const k of ["1", "2", "3", "4", "5"]) decl(`blue-${k}`, json.color.blue[k].$value);
for (const k of ["1", "2", "3", "4", "5"]) decl(`grey-${k}`, json.color.grey[k].$value);
decl("white", json.color.white.$value);
decl("black", json.color.black.$value);
decl("accent",       json.color.accent.$value);
decl("accent-light", json.color.accentLight.$value);
decl("postit",       json.color.postit.$value);
decl("error",        json.color.error.$value);

// ---------- Object-type accents ----------------------------------------------
section("Object-type accents (consistent dot/icon color in lists)");
for (const [k, v] of Object.entries(json.color.object))
  decl(`obj-${k}`, v.$value);

// ---------- Evidence palette --------------------------------------------------
section("Evidence palette (categories — never color alone)");
for (const cat of ["curated", "predicted", "ht", "weak"]) {
  decl(`evidence-${cat}`,    resolve$value(json.color.evidence[cat].$value));
  decl(`evidence-${cat}-bg`, json.color.evidence[`${cat}Bg`].$value);
  decl(`evidence-${cat}-fg`, json.color.evidence[`${cat}Fg`].$value);
}

// ---------- Semantic surfaces -------------------------------------------------
section("Semantic surfaces");
for (const [k, v] of Object.entries(json.surface))
  decl(`surface-${k.replace(/([A-Z])/g, "-$1").toLowerCase()}`, resolve$value(v.$value));

// ---------- Semantic text -----------------------------------------------------
section("Semantic text");
for (const [k, v] of Object.entries(json.text))
  decl(`text-${k.replace(/([A-Z])/g, "-$1").toLowerCase()}`, resolve$value(v.$value));

// ---------- Semantic borders --------------------------------------------------
section("Semantic borders");
for (const [k, v] of Object.entries(json.border))
  decl(`border-${k}`, resolve$value(v.$value));

// ---------- Typography --------------------------------------------------------
section("Typography");
decl("font-sans",     json.typography.fontFamily.sans.$value);
decl("font-citation", json.typography.fontFamily.citation.$value);
decl("font-mono",     json.typography.fontFamily.mono.$value);

const fsKeyMap = { h1: "h1", h2: "h2", h3: "h3", h4: "h4", bodyLg: "body-lg", body: "body", mono: "mono", monoSm: "mono-sm" };
for (const [jk, ck] of Object.entries(fsKeyMap)) decl(`fs-${ck}`, json.typography.fontSize[jk].$value);
for (const [jk, ck] of Object.entries(fsKeyMap)) decl(`lh-${ck}`, json.typography.lineHeight[jk].$value);

// ---------- Spacing -----------------------------------------------------------
section("Spacing (4 / 8 base scale)");
for (const [k, v] of Object.entries(json.spacing)) decl(`sp-${k}`, v.$value);

// ---------- Radii -------------------------------------------------------------
section("Radii");
for (const [k, v] of Object.entries(json.radius)) decl(`radius-${k}`, v.$value);

// ---------- Shadows -----------------------------------------------------------
section("Shadows (blue-tinted, never grey)");
for (const [k, v] of Object.entries(json.shadow)) decl(`shadow-${k}`, v.$value);

// ---------- Motion ------------------------------------------------------------
section("Motion");
decl("ease-standard", json.motion.easeStandard.$value);
decl("dur-micro",     json.motion.durMicro.$value);
decl("dur-standard",  json.motion.durStandard.$value);
decl("dur-page",      json.motion.durPage.$value);

// ---------- Layout ------------------------------------------------------------
section("Layout");
decl("container-max",      json.layout.containerMax.$value);
decl("container-wide",     json.layout.containerWide.$value);
decl("sidebar-width",      json.layout.sidebarWidth.$value);
decl("right-panel-width",  json.layout.rightPanelWidth.$value);
decl("header-height",      json.layout.headerHeight.$value);
decl("subheader-height",   json.layout.subheaderHeight.$value);

// ---------- Focus ring --------------------------------------------------------
section("Focus ring");
decl("focus-ring", "0 0 0 2px var(--surface-canvas), 0 0 0 4px var(--blue-3)");

out("}");

// ---------- Dark mode ---------------------------------------------------------
const darkBlock = (selector) => {
  out("");
  out(`${selector} {`);
  const dm = json.darkMode;
  decl("surface-canvas",  dm.surfaceCanvas.$value);
  decl("surface-raised",  dm.surfaceRaised.$value);
  decl("surface-sunken",  dm.surfaceSunken.$value);
  decl("surface-section", dm.surfaceSection.$value);
  decl("surface-note",    dm.surfaceNote.$value);
  decl("surface-header",  dm.surfaceHeader.$value);
  decl("text-primary",    dm.textPrimary.$value);
  decl("text-secondary",  dm.textSecondary.$value);
  decl("text-tertiary",   dm.textTertiary.$value);
  decl("text-link",       dm.textLink.$value);
  decl("text-link-hover", dm.textLinkHover.$value);
  decl("text-title",      dm.textTitle.$value);
  decl("border-default",  dm.borderDefault.$value);
  decl("border-subtle",   dm.borderSubtle.$value);
  decl("border-strong",   dm.borderStrong.$value);
  decl("evidence-curated-bg",   dm.evidenceCuratedBg.$value);
  decl("evidence-curated-fg",   dm.evidenceCuratedFg.$value);
  decl("evidence-predicted-bg", dm.evidencePredictedBg.$value);
  decl("evidence-predicted-fg", dm.evidencePredictedFg.$value);
  decl("evidence-ht-bg",        dm.evidenceHtBg.$value);
  decl("evidence-ht-fg",        dm.evidenceHtFg.$value);
  decl("evidence-weak-bg",      dm.evidenceWeakBg.$value);
  decl("evidence-weak-fg",      dm.evidenceWeakFg.$value);
  decl("shadow-xs",             dm.shadowXs.$value);
  decl("shadow-sm",             dm.shadowSm.$value);
  decl("shadow-md",             dm.shadowMd.$value);
  decl("focus-ring",            "0 0 0 2px var(--surface-canvas), 0 0 0 4px var(--blue-4)");
  out("}");
};

out("");
out("/* =============================================================================");
out("   Dark mode — semantic remap. Brand hue identity preserved (not inverted).");
out("   ============================================================================= */");
darkBlock(`[data-theme="dark"]`);
out("");
out(`@media (prefers-color-scheme: dark) {`);
darkBlock(`  :root:not([data-theme="light"])`);
out("}");

// ---------- Reduced motion ----------------------------------------------------
out("");
out("/* =============================================================================");
out("   Reduced motion — globally disable transitions/animations");
out("   ============================================================================= */");
out("@media (prefers-reduced-motion: reduce) {");
out("  *, *::before, *::after {");
out("    animation-duration: 0.01ms !important;");
out("    animation-iteration-count: 1 !important;");
out("    transition-duration: 0.01ms !important;");
out("    scroll-behavior: auto !important;");
out("  }");
out("}");

const css = lines.join("\n") + "\n";

// ---------- Write or check ---------------------------------------------------
const isCheck = process.argv.includes("--check");

const targets = [
  { path: SPEC_OUT, label: "spec/assets/tokens.css" },
  { path: LIB_OUT,  label: "lib/src/styles/tokens.css" },
];

let stale = false;
for (const t of targets) {
  let existing = "";
  try { existing = readFileSync(t.path, "utf8"); } catch { /* missing */ }
  if (existing !== css) {
    stale = true;
    if (isCheck) {
      console.error(`✗ stale: ${t.label}`);
    } else {
      writeFileSync(t.path, css);
      console.log(`✓ wrote: ${t.label}`);
    }
  } else {
    console.log(`= unchanged: ${t.label}`);
  }
}

if (isCheck && stale) {
  console.error("\nRun `node scripts/build-tokens.mjs` to update.");
  process.exit(1);
}
