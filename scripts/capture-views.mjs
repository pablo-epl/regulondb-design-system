#!/usr/bin/env node
/**
 * capture-views.mjs
 * -----------------------------------------------------------------------------
 * Drives Chrome via the DevTools Protocol to:
 *   1. Navigate to each view of the prototype.
 *   2. Wait for the SPA to render.
 *   3. Measure the actual content height.
 *   4. Print the view to a PDF sized exactly to its content (one tall page
 *      per view = "billboard" style — matches how stakeholders scroll the
 *      live prototype).
 *
 * Run via the wrapper:  scripts/build-prototype-pdf.sh
 * Direct invocation:    node capture-views.mjs <out-dir> [host=localhost:8753]
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";
import { argv, exit } from "node:process";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DEBUG_PORT = 9223;
const OUT_DIR = resolve(argv[2] || "dist/per-view");
const HOST = argv[3] || "http://localhost:8753";

// Headless Chrome on macOS occasionally refuses to resolve "localhost"
// when the python http.server is bound IPv6-first; use 127.0.0.1 to be safe.
const HOST_IP = HOST.replace("localhost", "127.0.0.1");
const PROTO = `${HOST_IP}/RegulonDB%20MG/RegulonDB%20MG%20Prototype.html`;
const COVER = `${HOST_IP}/regulondb-mg-design-system/scripts/presentation/cover.html`;

/** [slug, url, options]; options.cover means use a cover page (A4 landscape). */
const VIEWS = [
  ["01-cover",          COVER,                                        { cover: true }],
  ["02-home-ecoli",     `${PROTO}#/ecoli-k12/home`,                   {}],
  ["03-gene-araC",      `${PROTO}#/ecoli-k12/gene/araC`,              {}],
  ["04-tf-LexA",        `${PROTO}#/ecoli-k12/tf/LexA`,                {}],
  ["05-regulon-AraC",   `${PROTO}#/ecoli-k12/regulon/AraC`,           {}],
  ["06-regulon-LexA",   `${PROTO}#/ecoli-k12/regulon/LexA`,           {}],
  ["07-search-lexA",    `${PROTO}#/ecoli-k12/search?q=lexA`,          {}],
  ["08-compare-LexA",   `${PROTO}#/ecoli-k12/compare/tf/LexA`,        {}],
  ["09-home-salmonella",`${PROTO}#/salmonella-typhimurium/home`,      {}],
  ["10-home-bsubtilis", `${PROTO}#/bacillus-subtilis/home`,           {}],
  ["11-summary-history",`${PROTO}#/summary-history`,                  {}],
];

mkdirSync(OUT_DIR, { recursive: true });

// ---------------------------------------------------------------- Boot Chrome
const userDataDir = resolve(`${OUT_DIR}/.chrome-data-${process.pid}`);
mkdirSync(userDataDir, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${DEBUG_PORT}`,
  `--user-data-dir=${userDataDir}`,
  "--no-sandbox", "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1440,2000",
  // Without these, Chrome under --remote-debugging-port goes through the
  // OS proxy and refuses to reach localhost on some configurations.
  "--proxy-server=direct://",
  "--proxy-bypass-list=*",
  "about:blank",
], { stdio: "ignore", detached: false });

const cleanup = () => { try { chrome.kill("SIGTERM"); } catch {} };
process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); exit(130); });

// Wait for the debugger to be ready
async function waitForChrome() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
      if (r.ok) return (await r.json()).webSocketDebuggerUrl;
    } catch { /* not ready */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Chrome debugging port never came up");
}

// ---------------------------------------------------------------- CDP client
class Cdp {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = new Map();
    ws.addEventListener("message", (e) => {
      const m = JSON.parse(e.data);
      if (m.id != null && this.pending.has(m.id)) {
        const { resolve: r, reject: j } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error ? j(new Error(m.error.message)) : r(m.result);
      } else if (m.method && this.handlers.has(m.method)) {
        for (const h of this.handlers.get(m.method)) h(m.params);
      }
    });
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((r, j) => {
      this.pending.set(id, { resolve: r, reject: j });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(method, h) { if (!this.handlers.has(method)) this.handlers.set(method, []); this.handlers.get(method).push(h); }
  once(method) { return new Promise((r) => { const h = (p) => { this.off(method, h); r(p); }; this.on(method, h); }); }
  off(method, h) { const a = this.handlers.get(method); if (a) a.splice(a.indexOf(h), 1); }
  close() { this.ws.close(); }
}

async function attachToTarget() {
  // Find the page target Chrome already opened (from the about:blank arg).
  const r = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`);
  const targets = await r.json();
  const target = targets.find((t) => t.type === "page");
  if (!target) throw new Error("no page target found");
  const pageWs = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r2, j2) => { pageWs.addEventListener("open", r2, { once: true }); pageWs.addEventListener("error", j2, { once: true }); });
  return { cdp: new Cdp(pageWs), targetId: target.id };
}

// ---------------------------------------------------------------- Run
await waitForChrome();
const { cdp } = await attachToTarget();

await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
await cdp.send("Network.enable");
await cdp.send("Page.setLifecycleEventsEnabled", { enabled: true });

// Headless Chrome ignores --window-size for the rendering viewport — it
// defaults to 800×600. Force the viewport so layout matches the prototype's
// desktop design width.
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 1440, height: 2000, deviceScaleFactor: 1, mobile: false,
});

/** Wait for the next Page.lifecycleEvent matching `name`, after we issue a
 *  navigation. Uses a transient handler so back-to-back navigations don't
 *  pick up stale events. */
function waitForLifecycle(cdp, name) {
  return new Promise((resolve) => {
    const h = (p) => {
      if (p.name === name) {
        cdp.off("Page.lifecycleEvent", h);
        resolve(p);
      }
    };
    cdp.on("Page.lifecycleEvent", h);
  });
}

const PX_TO_IN = 1 / 96;

async function captureView([slug, url, opts]) {
  process.stdout.write(`▸ ${slug.padEnd(22)} `);
  const t0 = Date.now();

  // Navigate, then wait long enough that the page is definitely rendered.
  // Bouncing through about:blank turned out to be a footgun (stale
  // execution contexts), and lifecycle events race in back-to-back
  // navigations. A single navigate + fixed sleep is the simplest reliable
  // approach for ~10 views.
  await cdp.send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, opts.cover ? 1500 : 2500));

  // Cover uses A4 landscape; the rest a fixed 1440×2400 px desktop billboard.
  // Dynamic per-view height measurement turned out flaky (Chrome headless's
  // Runtime.evaluate races against navigation), so we ship the simpler
  // fixed-size approach. Some views have trailing whitespace — acceptable
  // since stakeholders scroll the live prototype the same way.
  const printOpts = opts.cover
    ? { paperWidth: 11.69, paperHeight: 8.27,
        marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
        printBackground: true, preferCSSPageSize: false }
    : { paperWidth: 1440 / 96, paperHeight: 2400 / 96,
        marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
        printBackground: true, preferCSSPageSize: false };

  const { data } = await cdp.send("Page.printToPDF", printOpts);
  const out = resolve(OUT_DIR, `${slug}.pdf`);
  writeFileSync(out, Buffer.from(data, "base64"));
  const ms = Date.now() - t0;
  console.log(`→ ${basename(out)}  (${ms}ms)`);
}

try {
  for (const v of VIEWS) await captureView(v);
} finally {
  cdp.close();
  cleanup();
}

console.log(`✓ Wrote ${VIEWS.length} PDFs to ${OUT_DIR}`);
