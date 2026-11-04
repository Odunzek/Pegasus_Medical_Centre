# Contributing to the Pegasus Medical Centre website

This page is for anyone working in this repository, with or without an AI assistant. It says where things live, how changes get in, and what is checked. The rules themselves are in `CLAUDE.md`; it is written for an AI assistant to follow, and it applies equally to people.

## Before you start

- Read `README.md`, then `CLAUDE.md` end to end. Then, depending on your task: `docs/content-model-v1.md` (any page or schema work), `docs/voice-and-content-guide.md` (any words a patient reads), `design/README.md` (any visual work).
- Facts about the clinic come only from `docs/client-facts-2026-10-04.md`. Anything not confirmed there is written in square brackets, and records stay `review: "draft"` until the clinic approves them.
- The approved design is on the Kempyre design canvas (link in `design/README.md`) and implemented in `apps/web/src/app/globals.css`.

## Prerequisites

Node 22 (`.nvmrc`), npm 10, Git. The repository's hooks and scripts are Node, so Windows, macOS and Linux all work without extra tools. The smoke test needs Playwright's Chromium (about 150 MB, downloaded once with `npx playwright install chromium`) and a free port 3011.

## Setup

```
git clone https://github.com/Odunzek/Pegasus_Medical_Centre.git
cd Pegasus_Medical_Centre
npm install
npx playwright install chromium
cp apps/web/.env.example apps/web/.env.local      # PowerShell: copy apps\web\.env.example apps\web\.env.local
npm run typecheck                                 # once: generates Next's route types (.next/types) so your editor knows PageProps
npm run dev                                       # http://localhost:3000 → /en, /fr, /pt
```

`.env.example` already sets `SHOW_DRAFTS=true`, and you want that locally: until the clinic approves content, every sample record is a draft, and without it the site is almost empty and the footer links 404. Never commit `.env.local`. Until the clinic's Sanity account exists, pages run on the typed sample data under `apps/web/src/content/sample/`.

## How changes get in

1. Branch from `main`: `feat/service-page`, `fix/hours-table`, `docs/content-model`, `content/faq-answers`.
2. One page template, one fix, or one content batch per branch. Keep pull requests small enough to review in ten minutes.
3. Before opening the PR, run and pass, in this order:
   ```
   npm run lint
   npm run typecheck
   npm run check                      # no hard-coded clinic facts outside sample content, no temporary photos outside it, no "Center"
   SHOW_DRAFTS=true npm run build     # PowerShell: $env:SHOW_DRAFTS="true"; npm run build
   npm run smoke                      # tests the build you just made: every page, three widths, three languages, accessibility scan; ~5–8 min, writes .smoke/
   ```
   A green smoke run ends with `smoke: ok` and `.smoke/report.txt` reads `ok`. Then look at the page yourself at 390 px and 1440 px wide.
4. Open a pull request with the template filled in: what changed, which record types it reads, what happens when a second location is added, screenshots at both widths, anything you had to assume. CI runs the same checks; a red CI is not mergeable.
5. Kempyre reviews and merges (`.github/CODEOWNERS`). `main` is always deployable. Once the Vercel project exists (launch checklist D1) every PR gets a preview link built with `SHOW_DRAFTS=true`, so drafts are visible and marked; production builds run `npm run check:production` first, which refuses any stock photograph.

## What reviewers check

Seven questions, whether the reviewer is a person or one of the agents in `.claude/agents/` (the architecture reviewer also covers the code question):

- **Architecture** (`CLAUDE.md` Architecture rules): content read only through `src/content/index.ts`; no hard-coded clinic facts; fields exist in the content model; nothing breaks when a second Location record appears; every patient-facing string is a translated field; computed values are computed.
- **Code** (`CLAUDE.md` Code rules): nothing hard-coded (facts, strings, colours, sizes, URLs, magic numbers); every file opens with a short purpose comment and every exported function or component has a plain-English comment; comments say why, not what, and are updated with the code.
- **Design** (`design/tokens.json`, `design/README.md`): palette only, Lora for headings and primary actions, Montserrat elsewhere, no rectangular buttons, circle-arrow actions, one primary action per screen, spacing scale, motion with a reduced-motion fallback.
- **Accessibility** (WCAG 2.2 AA): contrast ≥ 4.5:1, targets ≥ 44 px, visible focus, real `<a>`/`<button>`, alt text on every image, headings in order, keyboard order, no horizontal scroll on phones.
- **Content** (`docs/voice-and-content-guide.md`): facts match client-facts or are bracketed; no testimonials, superlatives, guarantees or advice; Centre and Canadian spelling; the voice; French and Portuguese match the English and are marked for native review; emergency line present.
- **SEO** (`CLAUDE.md` SEO rules): metadata through `pageMetadata()`, one h1, canonical and hreflang, structured data from records, sitemap and robots correct, nothing from a listing contradicts the site.
- **Privacy and security**: no patient data stored, logged or sent to analytics; form fields limited to name, phone, preferred day; no secrets in code; env names in `.env.example`; security headers intact; dependencies justified.

## Working with an AI assistant (optional)

If you use Claude Code, Cursor, Copilot or similar, the repo is already set up: `CLAUDE.md` is read at the start of every session (Cursor and Copilot read `apps/web/AGENTS.md`); `.claude/skills/` holds the workflows (`/new-page`, `/content-map`, `/client-brief`, `/launch-checklist`); `.claude/agents/` holds the six read-only reviewers, two writers and the verifier; `.claude/hooks/` lints on edit, blocks `.env` files and gates typecheck. None of this is required: without it, the checks above are the same, done by hand.

## Things that are never done in this repo

- Committing secrets or `.env` files (only `.env.example`).
- Force-pushing to `main` or deploying to production from a laptop; production deploys happen from `main` through Vercel.
- Adding stock or AI-generated photographs for production; publishing a record the clinic has not approved; publishing a provider without their approval record.
- Storing anything a patient typed; sending anything personal to analytics.
- Writing "Center".

Questions go to the Kempyre Groups project contact.
