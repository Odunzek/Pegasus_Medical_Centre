# Contributing to the Pegasus Medical Centre website

This page is for anyone working in this repository, with or without an AI assistant. It says where things live, how changes get in, and what is checked.

## Before you start

- Read `README.md` (what this is), then `CLAUDE.md` (the project rules: design, content, privacy, workflow). `CLAUDE.md` is a plain-text rulebook; it is written so an AI assistant can follow it, and it applies equally to people.
- Facts about the clinic (address, phone, hours, services) come only from `docs/client-facts-2026-10-04.md`. Anything not confirmed there is shown in square brackets on the site.
- The content model is `docs/content-model-v1.md`. The Sanity schema must match it. If a page needs a field that does not exist, change the document first and say so in the pull request.
- The approved design is on the Kempyre design canvas (link provided separately) and summarised in `design/README.md` and `design/tokens.json`.

## Setup

```
git clone https://github.com/Odunzek/Pegasus_Medical_Centre.git
cd Pegasus_Medical_Centre
npm install            # Node 22 (see .nvmrc)
npm run dev            # http://localhost:3000
```

Copy `apps/web/.env.example` to `apps/web/.env.local` and fill in values when you have them. Never commit `.env.local`. The Sanity Studio (`apps/studio`) is created with the command in `apps/studio/README.md` once the clinic's Sanity account exists; until then pages run on typed sample data under `apps/web/src/content/sample/`.

## How changes get in

1. Branch from `main`: `feat/service-page`, `fix/hours-table`, `docs/content-model`.
2. One page template or one fix per branch. Keep pull requests small enough to review in ten minutes.
3. Before opening the PR, run and pass:
   ```
   npm run lint
   npm run typecheck
   npm run build
   ```
   and look at the page at 390 px and 1440 px wide.
4. Open a pull request with: what changed, which record types it reads, screenshots at both widths, and anything you had to assume. CI runs the same three checks; a red CI is not mergeable.
5. Kempyre reviews and merges. `main` is always deployable.

## What reviewers check

- Architecture rules in `CLAUDE.md`: content read only through `src/content/index.ts`, no hard-coded clinic facts, fields that exist in the content model, nothing that breaks when a second location is added, translated fields for patient-facing text.
- Design rules in `CLAUDE.md`: palette only, Lora for headings and primary actions, Montserrat elsewhere, no rectangular buttons, circle-arrow actions, one primary action per screen, spacing scale, motion with a reduced-motion fallback.
- Accessibility (WCAG 2.2 AA): contrast ≥ 4.5:1, targets ≥ 44 px, visible focus, real `<a>`/`<button>` elements, alt text on every image, headings in order, keyboard order, no horizontal scroll on phones.
- Content: facts match `docs/client-facts-2026-10-04.md`; placeholders in brackets; no testimonials or reviews; nothing about providers that is not factual and approved.
- Privacy: no patient data stored anywhere; forms send only name, phone and preferred day; nothing personal in analytics, URLs or logs; no secrets in code.

## Working with an AI assistant (optional)

If you use Claude Code, Cursor, Copilot or similar, the repo is already set up for it: `CLAUDE.md` is read at the start of every session (Cursor and Copilot read `apps/web/AGENTS.md`); `.claude/skills/` holds the project's skills (`/new-page` runs the page-building workflow); `.claude/agents/` holds three read-only reviewers (architecture, design, accessibility); `.claude/settings.json` adds a lint-on-edit hook, a typecheck gate and deny rules for destructive commands. None of this is required: without it, the pull-request checks above are the same.

If you do not use an assistant, you can ignore `.claude/` and `skills-lock.json` entirely.

## Things that are never done in this repo

- Committing secrets or `.env` files.
- Force-pushing to `main` or deploying to production from a laptop; production deploys happen from `main` through Vercel.
- Adding stock or AI-generated photographs for production; the clinic's own photographs replace the labelled temporary ones.
- Storing anything a patient typed.

Questions go to the Kempyre Groups project contact.
