// PostToolUse hook: lint the file that was just edited (JS/TS only). Never blocks.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch {}
const file = input?.tool_input?.file_path ?? "";
if (!/\.(ts|tsx|js|jsx|mjs)$/.test(file)) process.exit(0);
const root = spawnSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).stdout.trim();
// ESLint 9 finds its config from the working directory, and the config lives in apps/web
const webDir = resolve(root || process.cwd(), "apps/web");
const absolute = isAbsolute(file) ? file : resolve(root || process.cwd(), file);
const r = spawnSync("npx", ["--no-install", "eslint", "--no-warn-ignored", absolute], { cwd: webDir, encoding: "utf8", shell: process.platform === "win32" });
const out = (r.stdout || "") + (r.stderr || "");
if (out.trim()) console.log(out.split("\n").slice(-20).join("\n"));
process.exit(0);
