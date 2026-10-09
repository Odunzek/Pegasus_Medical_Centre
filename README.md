# Pegasus Medical Centre — website

Public website for Pegasus Medical Centre, a family medicine and walk-in clinic in York, Toronto (the rebrand of York Health Choice Centre). Delivered and maintained by Kempyre Groups; DueSpace Studios may contribute under `CONTRIBUTING.md`.

## Stack

- **Website:** Next.js 16 (App Router, Cache Components), hosted on Vercel. English under `/en`, French under `/fr`, Portuguese under `/pt`; `/` redirects to `/en`.
- **Content back office:** Sanity (free plan). Seven record types; see `docs/content-model-v1.md`. A publish rebuilds the site.
- **Booking:** outbound link to the clinic's own booking system, stored as one field in Site settings. No patient data is stored by the website.
- **Enquiries:** a short form (name, phone, preferred day) delivers to the clinic's inbox through a form service; nothing is kept on the website.
- **Analytics:** page views and Book clicks only; no personal or health information is ever sent to analytics.

## Repository layout

```
CLAUDE.md             The rulebook: architecture, design, content, SEO, privacy, agents
CONTRIBUTING.md       How changes get in, for people with or without AI tools
docs/                 Content model, client facts, voice guide, content map, launch checklist, maintenance
  architecture/       "How the website fits together" for the client (open index.html)
design/               Design tokens (v3) and the design system notes
apps/web/             The Next.js site
apps/studio/          Sanity Studio (created once the clinic's account exists)
.claude/              Agents (reviewers, writers, verifier), skills, hooks, settings
.github/              CI, pull request template, code owners, Dependabot
scripts/              check-facts (hard-coded facts and temporary photos) and the smoke test
```

## Working agreements

- `main` is always deployable. Work on branches; every change is a pull request with the template filled in; CI must be green.
- Content is edited in Sanity, never in code. If a receptionist might need to change it, it is a CMS field.
- The content model document changes first, then the types, then the schema, then pages.
- Facts about the clinic come from `docs/client-facts-2026-10-04.md`; unknowns stay in square brackets; records are drafts until the clinic approves them.
- Words follow `docs/voice-and-content-guide.md`. No testimonials, no superlatives, Canadian spelling, "Centre".
- No stock or AI-generated imagery in production; the clinic's own photographs replace the labelled stand-ins before launch.

## Commands

```
npm install          # Node 22 (.nvmrc)
npm run dev          # http://localhost:3000
npm run lint · npm run typecheck · npm run check · npm run build · npm run smoke
```

## Open decisions

See the end of `CLAUDE.md` and `docs/launch-checklist.md`, section A.
