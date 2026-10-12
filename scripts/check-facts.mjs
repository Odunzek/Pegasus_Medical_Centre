#!/usr/bin/env node
/**
 * Build gate over apps/web/src (sample content excepted where noted). Fails when:
 *  1. a clinic fact is hard-coded outside src/content/sample: the phone number, the street,
 *     the postal code or the unit (facts live in records; see CLAUDE.md "Architecture rules");
 *  2. a temporary photo (public/temp-photos) is referenced outside src/content/sample;
 *  3. the word "Center" appears anywhere in src (the brand is Centre), except where the
 *     former name is deliberately carried (formerName / alternateName).
 * With CHECK_PRODUCTION=1 (the production build command, `npm run check:production`) it also
 * fails on any `temporary: true` image, so stock stand-ins can never reach the live site.
 * Docs are not scanned; the content-reviewer agent and CONTRIBUTING cover those.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = join(root, "apps/web/src");
const production = process.env.CHECK_PRODUCTION === "1" || process.argv.includes("--production");

const facts = [
  { name: "phone number", re: /416[\s.-]?656[\s.-]?7272|\+?1?4166567272/ },
  { name: "street address", re: /605\s+Rogers/i },
  { name: "postal code", re: /M6M\s?1B9/i },
  { name: "unit", re: /Unit\s+D5/i },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, out);
    } else if (/\.(ts|tsx|js|jsx|mjs|css|json|md)$/.test(name)) out.push(p);
  }
  return out;
}

const problems = [];
for (const file of walk(src)) {
  const rel = relative(root, file);
  const isSample = rel.includes("src/content/sample/");
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    const where = `${rel}:${i + 1}`;
    if (!isSample) {
      for (const f of facts) if (f.re.test(line)) problems.push(`${where}: hard-coded ${f.name} (facts come from records): ${line.trim().slice(0, 100)}`);
      if (/temp-photos\//.test(line)) problems.push(`${where}: temporary photo referenced outside sample content`);
    }
    if (/\bCenter\b/.test(line) && !/formerName|alternateName|Center\)/.test(line)) problems.push(`${where}: "Center" (the brand is Centre): ${line.trim().slice(0, 100)}`);
    if (production && /temporary:\s*true/.test(line)) problems.push(`${where}: temporary photograph in a production build`);
  });
}

if (problems.length) {
  console.error(`check-facts: ${problems.length} problem(s)\n` + problems.map((p) => "  " + p).join("\n"));
  process.exit(1);
}
console.log(`check-facts: ok (${production ? "production mode" : "development mode"})`);
