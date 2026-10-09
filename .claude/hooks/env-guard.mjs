// PreToolUse hook: the agent never reads or edits environment files. .env.example is documentation and is allowed.
import { readFileSync } from "node:fs";

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch {}
const file = String(input?.tool_input?.file_path ?? "").replace(/\\/g, "/");
const name = file.split("/").pop() ?? "";
if (name.startsWith(".env") && name !== ".env.example") {
  console.error("Blocked: environment files are never read or edited by the agent. Document variable names in .env.example instead.");
  process.exit(2);
}
process.exit(0);
