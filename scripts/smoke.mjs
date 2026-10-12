#!/usr/bin/env node
/**
 * Smoke test against a built app: starts `next start`, visits every route in the
 * sitemap at 390/1024/1440, runs axe (zero serious/critical), checks for console
 * errors, horizontal scroll, broken shell links, the Book handover, and writes
 * screenshots to .smoke/. Usage: npm run smoke  (after npm run build)
 * Needs: npx playwright install chromium
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

/** Port for the temporary `next start`; chosen away from 3000 so a running dev server is not disturbed. */
const PORT = 3011;
/** Set SMOKE_BASE_URL to test an already-running site (a Vercel preview, say) instead of starting one. */
const base = process.env.SMOKE_BASE_URL || `http://localhost:${PORT}`;
/** The three reference widths: phone (390), tablet (1024), desktop (1440). */
const WIDTHS = [390, 1024, 1440];
/** How far to scroll to be sure the hero's Book has left the screen. */
const PAST_HERO_PX = 1200;
/** Time for the reveal transition (700ms) to finish before axe measures contrast. */
const REVEAL_SETTLE_MS = 800;
const out = fileURLToPath(new URL("../.smoke/", import.meta.url));
mkdirSync(out, { recursive: true });

/** Starts the built app and waits until it answers, instead of sleeping a fixed time. */
async function startServer() {
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: fileURLToPath(new URL("../apps/web", import.meta.url)),
    // The build already baked SHOW_DRAFTS and the origin in; these only matter for runtime routes (robots).
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: base, SHOW_DRAFTS: "true" },
    stdio: "ignore",
    shell: process.platform === "win32",
  });
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${base}/robots.txt`);
      if (r.ok) return server;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  server.kill();
  throw new Error(`smoke: the site did not start on port ${PORT} within 30 s. Did you run the build first?`);
}

let server;
if (!process.env.SMOKE_BASE_URL) server = await startServer();

const failures = [];
const note = (s) => failures.push(s);

async function routesFromSitemap() {
  const res = await fetch(`${base}/sitemap.xml`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  return [...new Set(locs)];
}

const browser = await chromium.launch();
try {
  const routes = await routesFromSitemap();
  if (routes.length === 0) note("sitemap lists no routes");

  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, isMobile: width < 768, hasTouch: width < 768 });
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => m.type() === "error" && !/favicon/.test(m.text()) && errors.push(m.text()));
      let res = null;
      try {
        res = await page.goto(base + route, { waitUntil: "load", timeout: 30000 });
        await page.waitForTimeout(500);
      } catch (e) {
        note(`${route} @${width}: navigation failed: ${String(e).split("\n")[0]}`);
        await page.close();
        continue;
      }
      if (!res || res.status() >= 400) note(`${route} @${width}: HTTP ${res?.status()}`);
      await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-in")));
      await page.waitForTimeout(REVEAL_SETTLE_MS);
      const hScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      if (hScroll) note(`${route} @${width}: horizontal scroll`);
      const h1s = await page.locator("h1").count();
      if (h1s !== 1) note(`${route} @${width}: ${h1s} h1 elements`);
      const brackets = await page.evaluate(() => document.body.innerText.includes("["));
      if (process.env.CHECK_PRODUCTION === "1" && brackets) note(`${route}: square-bracket placeholder on a production page`);
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      const serious = axe.violations.filter((v) => ["serious", "critical"].includes(v.impact));
      for (const v of serious) note(`${route} @${width}: axe ${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes[0]?.target?.join(" ")}`);
      if (errors.length) note(`${route} @${width}: console errors: ${errors.slice(0, 3).join(" | ")}`);
      const safe = route.replace(/[^a-z0-9]+/gi, "_") || "home";
      await page.screenshot({ path: `${out}${safe}-${width}.png`, fullPage: true });
      await page.close();
    }
    await context.close();
  }

  // Shell links resolve, and the Book handover works, on the homepage
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForTimeout(800);
  const hrefs = await page.evaluate(() => [...document.querySelectorAll("header a[href], footer a[href]")].map((a) => a.getAttribute("href")).filter((h) => h && h.startsWith("/")));
  for (const href of [...new Set(hrefs)]) {
    const r = await fetch(base + href);
    const body = await r.text();
    if (r.status >= 400 || /name="robots" content="noindex"/.test(body)) note(`shell link ${href} does not resolve`);
  }
  const bookSel = "[data-testid='header-book'] a";
  const bookAtTop = await page.locator(bookSel).count();
  await page.evaluate((y) => window.scrollTo(0, y), PAST_HERO_PX);
  await page.waitForTimeout(600);
  const bookAfter = await page.locator(bookSel).count();
  if (bookAtTop !== 0 || bookAfter !== 1) note(`Book handover: header Book count at top=${bookAtTop}, after scroll=${bookAfter} (expected 0 then 1)`);
  await page.close();
} finally {
  await browser.close();
  server?.kill();
}

writeFileSync(`${out}report.txt`, failures.join("\n") || "ok");
if (failures.length) {
  console.error(`smoke: ${failures.length} failure(s)\n` + failures.map((f) => "  " + f).join("\n"));
  process.exit(1);
}
console.log("smoke: ok (screenshots in .smoke/)");
