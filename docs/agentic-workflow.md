# Pegasus Medical Centre website: the agentic build

How this project is built with Claude, what is in place, why, and where it stands. Written for a Claude session (Claude Code, Cowork or chat) that is picking the project up, and for a person who wants to understand the setup. Everything here is in the repository `Odunzek/Pegasus_Medical_Centre`; this document is the map.

## 1. The project in one paragraph

A public website for Pegasus Medical Centre, a family medicine and walk-in clinic at 605 Rogers Road, Unit D5, York, Toronto, which is the rebrand of York Health Choice Centre (same address and phone, an existing Google listing with 16 reviews). Three languages (English, French, Portuguese), many older patients on phones. Headless CMS (Sanity) + Next.js 16 + Vercel. Delivered and maintained by Kempyre Groups (Kachi); the client is Dr. Usman Khurshid. A subcontractor (DueSpace) may contribute and must be able to follow every rule without AI tools.

## 2. Principles behind the setup

These came from research into what works in agentic coding (October 2026) and from this project's own needs:

1. **Write the truth down once, then point everyone at it.** `CLAUDE.md` is the rulebook; the docs it links are the sources. No rule lives only in a conversation.
2. **One builder, many narrow reviewers.** The main session builds. Read-only agents each answer one question about a diff. No orchestrator agent, no swarm.
3. **Verification over frameworks.** Lint, typecheck, a fact gate, the build and a browser smoke test run on every change; a reviewer's opinion never replaces evidence.
4. **Nothing hard-coded, everything explained.** Facts, strings, colours, sizes, URLs and numbers live in records, dictionaries, CSS variables, constants or environment variables. Every file and every export carries a plain-English comment saying what it is for and why, so a person who did not write it can read it.
5. **Facts are not words.** The clinic's facts live in records; copy never repeats them. Anything unconfirmed is in square brackets and every record is a draft until the clinic approves it.
6. **Built for the whole life of the site**, not the next page: multi-location from day one, a launch checklist, a maintenance routine, and a client-brief format, all before the second page exists.

## 3. The rulebook and its sources

| File | What it holds | Who reads it |
| --- | --- | --- |
| `CLAUDE.md` | Where things live; architecture, design, content, SEO, privacy and client-communication rules; the agent roster; open decisions. Imports `apps/web/AGENTS.md` (Next.js 16 notes). | Every session and agent, automatically. Cursor/Copilot read `AGENTS.md`. |
| `CONTRIBUTING.md` | The same rules for people: setup, branch and PR process, what reviewers check, never-do list. | Humans, DueSpace. |
| `docs/content-model-v1.md` (v1.1) | The seven record types and their fields; principles (one fact in one place, draft until approved, one slug per record). `apps/web/src/content/types.ts` mirrors it field for field. | architecture-reviewer, anyone touching data or schema. |
| `docs/client-facts-2026-10-04.md` | The only source of real-world facts; what the questionnaire answered and what it did not; the rebrand and listings. | content-reviewer, copywriter, everyone. |
| `docs/voice-and-content-guide.md` | Voice, CPSO/PHIPA limits, formats, fr-CA and pt-PT rules, glossary, page purposes, approval checklist. | copywriter, translator, content-reviewer. |
| `design/tokens.json` (v3), `design/README.md` | The design system for direction C. They agree with `apps/web/src/app/globals.css`; if not, the CSS is wrong. | design-reviewer. |
| `docs/launch-checklist.md`, `docs/maintenance.md` | Pre-launch items with an evidence column; the monthly retainer routine and holiday-hours reminder. | launch-checklist skill, Kachi. |
| `docs/content-map.md` | Page-by-page content and search plan (to be built with the `content-map` skill). | copywriter, seo-reviewer. |
| `docs/architecture/index.html` | Client-facing diagram of how the system fits together. | The client. |

## 4. The agents

All in `.claude/agents/`. Reviewers have Read, Grep and Glob only; they report, never edit. They run in parallel on a page's diff.

| Agent | The one question it answers |
| --- | --- |
| `architecture-reviewer` | Does it survive a second location and a CMS swap? One read path (`src/content/index.ts`), no hard-coded facts, fields exist in the model, translated text, computed values computed. |
| `design-reviewer` | Does it match the canvas, `tokens.json` and the design rules? Palette, Lora/Montserrat roles, no rectangular buttons, one primary action, spacing, motion fallback. |
| `a11y-reviewer` | Can an older patient on a phone use it? WCAG 2.2 AA: contrast, 44px targets, focus, real elements, alt text, heading and keyboard order. |
| `content-reviewer` | Is every sentence true (or bracketed), allowed (no testimonials, superlatives, guarantees, advice), spelled Centre, in the voice, matched across languages, with the emergency line present? |
| `seo-reviewer` | Title, description, one H1, canonical, hreflang, structured data from records, sitemap and robots, listing consistency, no "Center". |
| `privacy-security-reviewer` | What leaves the browser and to whom? Form fields, analytics events, logs, env names, headers, dependencies, draft exposure. |
| `copywriter` (writes) | Drafts English copy from the content map and client facts, in the voice, brackets for every unknown, marked draft. |
| `translator` (writes) | fr-CA and pt-PT from the glossary, same facts and brackets, marked "native review pending". |
| `qa-verifier` (runs) | lint, typecheck, `npm run check`, build, `npm run smoke`; reports evidence for the PR. |

## 5. The skills (procedures)

In `.claude/skills/`:

- **`new-page`**: the page workflow. Read the record type, the client facts, the voice guide and the rules → plan (including "what happens when a second Location appears?") → build under `app/[lang]/` reading only through `src/content/index.ts` → verify → six reviewers → `qa-verifier` → record decisions in `docs/` → branch and PR.
- **`content-map`**: builds `docs/content-map.md`: per page, URL in each language, purpose, patient question, one search intent, title, description, H1, sections with their record sources, brackets outstanding, status, owner; plus listings and translation status.
- **`client-brief`**: the review PDF for Dr. Khurshid in the house format (stock-photo and draft notices up front, pictures, how the site behaves, have-versus-need tables, reply-by-sentence checklist).
- **`launch-checklist`**: walks `docs/launch-checklist.md` and records evidence for each item.
- **`next-dev-loop`**: checking a change in the running app.
- Reference skills installed from skills.sh: seo-audit, schema, site-architecture, ai-seo, copywriting, vercel-react-best-practices, vercel-composition-patterns, web-design-guidelines, verification-before-completion, systematic-debugging.

## 6. The gates (things that run without being asked)

- **Hooks** (`.claude/hooks/`, Node, no extra tools): lint the file just edited; block any read or edit of `.env*` except `.env.example`; refuse to finish a turn while `apps/web/src` changed and the typecheck fails.
- **`npm run check`** (`scripts/check-facts.mjs`): fails on a hard-coded phone, address, postal code or unit outside sample content; a temporary photo referenced outside sample content; the word "Center". With `CHECK_PRODUCTION=1`, fails on any temporary photo at all.
- **`npm run smoke`** (`scripts/smoke.mjs`): starts the built app, visits every route in the sitemap at 390, 1024 and 1440 in every enabled language, runs axe (zero serious or critical), checks console errors, horizontal scroll, one h1, shell links resolving, the Book handover; writes screenshots to `.smoke/`.
- **CI** (`.github/workflows/ci.yml`): lint → typecheck → check → `npm audit` → build → smoke, with screenshots uploaded. PR template, CODEOWNERS (Kempyre merges), Dependabot.
- **Permissions** (`.claude/settings.json`): force-push, `rm -rf`, production deploys and `.env` reads denied.

## 7. How a change moves

1. A branch per task (`feat/…`, `fix/…`, `docs/…`, `content/…`).
2. For a page: `/new-page <name>`. For words: `copywriter` then `translator` then `content-reviewer`. For a client review: `/client-brief`. For launch: `/launch-checklist`.
3. `qa-verifier` evidence goes into the PR template; CI repeats it; Vercel builds a preview with `SHOW_DRAFTS=true` so the client can see drafts marked "Draft".
4. Kempyre reviews and merges; `main` deploys to production, where drafts and temporary photos are refused.

Sessions that cannot push (this is true of some cloud sessions) hand the commit over as a `git format-patch` file applied with `git am` on Kachi's machine; the push is his.

## 8. Key decisions, with reasons

- **Headless CMS + templates.** Staff change facts in Sanity; the site computes everything else (open now, hours wording, expired notices, derived lists, `tel:` links). Nothing a receptionist might change is in code.
- **Multi-location from day one.** `Location` is a list; `Location.services` and `Provider.locations` are the single sources of truth; the footer lists every clinic; the homepage speaks for the first open one.
- **URLs are `/en/…`, `/fr/…`, `/pt/…`; `/` redirects to `/en`.** A root-English rewrite was tried and dropped: the App Router's client prefetch cannot see server rewrites, so every English link lost instant navigation and threw 404s.
- **Direction C design**: editorial, Lora + Montserrat, no rectangular buttons (Lora text + filled circle; text + outlined circle), one Book on screen at a time (header Book and phone bar appear after the hero's Book scrolls away), arched portraits, one rounded corner per photo, feather texture at 7%.
- **Draft until approved.** `review: draft | approved` on Service, FAQ, Page and Post; providers need `published` plus an approval record. Production shows only approved.
- **English first; FR and PT enabled only after native-speaker review** (Site settings → Languages enabled). Kempyre's translations are marked "native review pending".
- **Booking** is an outbound link from Site settings, same tab; blank means "Call to book". **Enquiry form** sends name, phone and preferred day only (Formspree proposed). **Analytics**: GA4 via GTM, page views and Book clicks only.
- **Rebrand**: the Google Business Profile is renamed, never recreated; `alternateName: York Health Choice Centre` in structured data; whether the old name appears on the site is the client's call.
- **Stock photos** are stand-ins flagged `temporary`, badged on previews, refused in production.

## 9. Where the build stands (10 October 2026)

Done, on branch `feat/foundation` (three commits; PR to open):
- Design tokens, fonts, logo files (brand package v1.4, "Centre"), the shell (header with Book handover, footer for all locations, phone bar, announcement bar, notices), actions, open-now, content layer with sample data, SEO plumbing (metadata, hreflang, JSON-LD, sitemap, robots), security headers, stub routes so nothing 404s, a general-page template, the foundation homepage.
- All docs, agents, skills, hooks, gates and CI above. Lint, typecheck, check, build and smoke all pass.
- A homepage design preview PDF (v1.0) delivered to the client.

Next, in order (one branch and PR each, `/new-page`):
1. Content map (`/content-map`), then the client's answers to the blockers (services live, providers, booking, hours mismatch, enquiry inbox).
2. Homepage proper (the editorial Homepage C from the canvas).
3. Services index and Service page. 4. Location page. 5. Our doctors and profile (needs one published provider for the dynamic route). 6. Resources and general pages. 7. Contact and the form. 8. French and Portuguese pass with native review. 9. Sanity: schema from the model, `index.ts` rewritten to query it, publish webhook. 10. Launch checklist; then the monthly routine.

## 10. Starting a session on this project

Open the repository and say what you want done; `CLAUDE.md` loads by itself. Useful first lines:

- "Run `/new-page Services index`."
- "Run `/content-map`."
- "Build a client brief for the services page" (uses `/client-brief`).
- "Review the current diff with all six reviewers and `qa-verifier`."

Rules a new session must not relearn the hard way: facts only from `docs/client-facts-2026-10-04.md`; never a personal email in a deliverable; "Centre"; no testimonials; nothing shown to the client without the stock-photo and draft notices; ask before anything the client cannot undo.
