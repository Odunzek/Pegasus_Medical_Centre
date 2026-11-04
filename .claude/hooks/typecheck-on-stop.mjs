// Stop hook: if anything under apps/web/src changed, the typecheck must pass before the agent may finish.
import { spawnSync } from "node:child_process";

const root = spawnSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).stdout.trim();
if (!root) process.exit(0);
const opts = { cwd: root, encoding: "utf8", shell: process.platform === "win32" };
const changed = spawnSync("git", ["status", "--porcelain", "--", "apps/web/src"], opts).stdout.trim();
if (!changed) process.exit(0);
const r = spawnSync("npm", ["run", "-s", "typecheck"], opts);
if (r.status !== 0) {
  const out = ((r.stdout || "") + (r.stderr || "")).split("\n").filter(Boolean).slice(-15).join("\n");
  console.error("Typecheck failed. Fix before finishing:\n" + out);
  process.exit(2);
}
process.exit(0);
