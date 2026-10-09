# Pegasus Medical Centre website — working notes for Claude

Read this first. It tells you what the project is, where things live, the rules every change must keep, which agents check what, and what you must never do. Humans follow the same rules through CONTRIBUTING.md.

## What this is

Public website for Pegasus Medical Centre, a family medicine and walk-in clinic at 605 Rogers Road, Unit D5, York, Toronto. It is the **rebrand of an existing clinic, York Health Choice Centre**, at the same address and phone (existing Google listing with reviews; see `docs/client-facts-2026-10-04.md`). Audience includes many older patients, on phones. Three languages: English, French, Portuguese. Delivered and maintained by Kempyre Groups (Kachi); DueSpace Studios may contribute under CONTRIBUTING.md. Client: Dr. Usman Khurshid.

## Where things live

- `apps/web` — Next.js site (App Router, TypeScript, `src/` dir, no Tailwind). **Next.js here is newer than your training data**: the rules below are imported from the app and point at version-matched docs in `apps/web/node_modules/next/dist/docs/`. Use the `next-dev-loop` skill when running or debugging the dev server.

@apps/web/AGENTS.md
  - `src/app/[lang]/` — every page; `params.lang` is `en`, `fr` or `pt`. Every language is prefixed (`/en/services`, `/fr/services`, `/pt/services`); `src/proxy.ts` redirects un-prefixed paths to English (a root-English rewrite was tried and dropped because client prefetching cannot see server rewrites). Never add a page outside `[lang]`. `src/app/sitemap.ts` and `robots.ts` are the only files beside it.
  - `src/content/index.ts` — the only place pages read content from (today typed sample data in `src/content/sample/`, later Sanity). `src/content/types.ts` mirrors the content model field for field. `showDrafts` (env `SHOW_DRAFTS=true`) is the preview gate.
  - `src/components/` — the shell: `SiteHeader` (Book handover), `SiteFooter` (all locations), `PhoneBar`, `AnnouncementBar`, `Notices` (partly-English note, Draft mark, Temporary photo badge), `ComingSoon`, `actions` (`PrimaryAction`, `ArrowLink`, `CircleArrow`), `Reveal`, `OpenStatus`, `Icon`, `Logo`.
  - `src/lib/` — `i18n.ts` (locales, shell dictionary, `localePath`, `t`, `isTranslated`), `hours.ts` (open-now in Toronto time, hours wording), `booking.ts` (Book → booking URL or "Call to book"), `seo.ts` (`pageMetadata`, JSON-LD).
  - `src/app/globals.css` — the CSS variables; `src/app/fonts.ts` — Lora and Montserrat, self-hosted from `src/fonts/`.
  - `public/brand/` — logo files from the brand package v1.4 (clear space cropped); `public/temp-photos/` — labelled stand-ins, refused by the production check.
- `apps/studio` — Sanity Studio (content back office). Created with `npm create sanity@latest` once the clinic's account exists (`apps/studio/README.md`).
- `docs/content-model-v1.md` — the content model (v1.1). The Sanity schema must match it; change the document first, then `types.ts`, then the schema, then pages.
- `docs/client-facts-2026-10-04.md` — confirmed facts about the clinic and the rebrand. The only source for real-world facts. Anything not in it is a placeholder in square brackets.
- `docs/voice-and-content-guide.md` — how the site speaks in all three languages and what it may never say. Every word a patient reads follows it.
- `docs/content-map.md` — the page-by-page content and search plan (built with the `content-map` skill).
- `docs/launch-checklist.md`, `docs/maintenance.md` — launch and the monthly retainer. `docs/architecture/index.html` — the client-facing diagram.
- `design/tokens.json`, `design/README.md` — the design system (v3, direction C). They agree with `globals.css`; if not, the CSS is wrong.
- `.claude/agents/` — the reviewers and producers listed below. `.claude/skills/` — `new-page`, `content-map`, `client-brief`, `launch-checklist`, `next-dev-loop`, plus installed reference skills (seo-audit, schema, site-architecture, ai-seo, copywriting, vercel-react-best-practices, vercel-composition-patterns, web-design-guidelines, verification-before-completion, systematic-debugging). `.claude/hooks/` — lint on edit, env guard, typecheck on stop (Node, no jq).

## Architecture rules (non-negotiable)

The site is a set of **templates fed by a headless CMS**. Read `docs/content-model-v1.md` and `docs/architecture/index.html` before changing structure.

- **Three parts, cleanly separated:** Sanity (content back office, edited by clinic staff), the Next.js site (reads published content, renders pages, computes things like "open now"), Vercel (hosting). Booking is an outbound link from Site settings, opened in the same tab. Enquiries go through the form service (`FORM_ENDPOINT`) to the clinic inbox. A Sanity publish triggers a rebuild (deploy hook / revalidate route with `SANITY_REVALIDATE_SECRET`). No patient data touches any of the three.
- **Seven record types, no more:** Site settings · Location · Service · Provider · FAQ · Page · Post. A page may only show fields that exist in the model.
- **Built for many locations from day one, even though one opens first.** `Location` is a list. `/locations/[slug]` and `/services/[slug]` are templates. The homepage hero and phone bar speak for `getPrimaryLocation()` (the first open clinic); the footer lists every open or opening-soon clinic; nothing may assume `[0]` or "the clinic". `Location.status` lets a second clinic have a page before it has hours.
- **Single sources of truth:** `Location.services` says which services a clinic offers; `Provider.locations` and `Provider.services` say where a provider works and what they do. Everything else is **derived** through `src/content/index.ts`, never duplicated in another record or typed into copy (no hours in an FAQ answer).
- **One read path.** Pages import content only from `src/content/index.ts`. Never from `src/content/sample/` directly; never a hard-coded address, phone, hour, service name or provider name in a page, a dictionary string or metadata. `npm run check` fails the build on one.
- **Draft until approved.** Service, FAQ, Page and Post carry `review`; production shows only `approved`. Providers need `status: "published"` and an `approval`. `SHOW_DRAFTS=true` on preview deployments shows drafts with a Draft mark.
- **Every text field a patient reads is translated** (`Translated` = `{ en, fr?, pt? }`, rendered with `t(field, locale)`); English is the fallback and a page that fell back shows the partly-English note. Shell strings live in `src/lib/i18n.ts`. A language is public only when enabled in Site settings. One slug per record, shared by all languages; `localePath(locale, path)` builds every internal link.
- **Computed, not typed:** open/closed status, "opens Monday at 9:00 a.m.", hours wording, expired notices (Toronto date), "where you can get this", the `tel:` link. Staff enter facts; the site does the arithmetic.
- **Nothing a receptionist might change is in code:** hours, holidays, booking link, announcement, service names, provider details, FAQs, the homepage's words (Site settings → Homepage).

## Design rules (non-negotiable)

- Colours: Deep Teal `#003D3A` (text, dark bands), Teal `#2E7D6B` (hover; focus ring on light grounds), Soft Green `#8FBC8F` (accents, circle fills, rules; focus ring on Deep Teal), Pale Neutral `#E6EEE9` (one cream band per page), white. No gold, no tints, no gradients except the hero photo shade, no glass, no drop shadows except the quick-action card. The feather texture (`.feather`) at 7% on at most one band per page.
- Type: Lora 500 for h1–h3 and primary actions; Montserrat for everything else. Body 19px desktop, 17px phone; nothing a patient reads under 16px. Max two typefaces.
- Actions: there are no rectangular buttons. Primary = Lora text + 64px soft-green filled circle with an arrow. Secondary = Montserrat text + 48px outlined circle. One primary action per screen; the header shows Book only after the hero's Book (`heroBook`) scrolls away; phones get the pinned Book + Call bar.
- Shapes: pills and circles; arched portraits (`999px 999px 24px 24px`); one large rounded corner per strip photo; full-bleed hero photo with shade bottom-left only; 28px on the quick-action card.
- Layout: 64px gutters on desktop, 20px on phone; sections 128px / 56px; no equal-height card grids; lists with rules, not cards; swipe rows on phones for photos and the team.
- Motion: sections rise once on scroll, circle arrows respond on hover, photos zoom 1.035. Everything off under `prefers-reduced-motion`.
- Accessibility: WCAG 2.2 AA. Text contrast ≥ 4.5:1 from the pairs in `design/README.md`; tap targets ≥ 44px (48 standard); visible focus (3px, Teal on light, Soft Green on dark); real `<a>`/`<button>`; alt text on every image; forms with labels and plain-language errors; in-text links underlined, menu and row links underline on hover; no hover-only information.

## Content rules

- Facts come only from `docs/client-facts-2026-10-04.md`. Unknowns stay in square brackets. Records are `review: "draft"` until the clinic approves them.
- Words follow `docs/voice-and-content-guide.md`: warm, plain, one idea per sentence, Canadian spelling, "Centre", times as "9:00 a.m. to 6:00 p.m.", sentence case, actions start with a verb, none of the banned phrases.
- No patient testimonials or reviews anywhere (CPSO advertising rules). No superlatives, comparisons, guarantees, invented statistics or medical advice. Provider profiles are factual and published only after approval.
- No stock or AI-generated photographs in production. Stand-ins are flagged `temporary` and badged; the production check refuses them.
- Emergency line wherever the clinic's details appear. Privacy contact on the Privacy page (PHIPA).
- French is fr-CA, Portuguese is pt-PT; Kempyre drafts are "native review pending" until a native speaker signs off; a language is enabled only after that.

## SEO rules

- Local first: one neighbourhood clinic. The ranking assets are the Google Business Profile (renamed from York Health Choice Centre, never recreated, reviews kept), identical name/address/phone/hours everywhere, and pages that answer real patient questions. Keyword work stays modest; see `docs/content-map.md`.
- Every page builds its metadata through `pageMetadata()` in `src/lib/seo.ts`: title (≤ 60 characters, says what and where), description (70–160, no phone or address), canonical, hreflang for the enabled languages plus x-default, Open Graph. One h1 per page.
- Structured data from records only: MedicalClinic per open location in the layout (with `alternateName` while Site settings has a former name), Physician on provider pages, FAQPage only for approved FAQs. Never typed by hand.
- `sitemap.ts` lists every public page in every enabled language; `robots.ts` disallows previews (`SHOW_DRAFTS` or `VERCEL_ENV=preview`). Planned services and drafts never appear in either.
- Domain: the brand is Centre. The canonical domain, the "Center" domains and any old clinic URLs are an open decision (`docs/launch-checklist.md` A1–A2); cross-domain redirects live in Vercel, path redirects in `next.config.ts`.

## Data and privacy rules

- The website stores no patient data. The CMS stores no patient data. The enquiry form sends name, phone and preferred day only, to the clinic inbox through the form service; never health details, never uploads.
- Analytics: GA4 through GTM, page views and Book clicks only (`data-track="book"` on Book actions), IP anonymised, no user ids, nothing from forms, URLs or logs. Script hosts are added to the CSP in `next.config.ts` in the same PR, with a note in the launch checklist.
- Security headers (CSP, HSTS, frame-ancestors, Referrer-Policy, Permissions-Policy) are set in `next.config.ts` and never loosened without a reason recorded in the diff.
- Never commit secrets. Environment variables go in `.env.local` (ignored); their names are documented in `apps/web/.env.example`. The agent never reads `.env*` except `.env.example` (hook).

## Working with the client

- Dr. Khurshid is a visual learner on a phone. Anything shown to him goes through the `client-brief` skill: PDF to Desktop › Pegasus, "stock photos / draft words" notices up front, have-versus-need tables, a checklist he can answer by reply.
- Never present a draft as final; never a personal email address in any deliverable; the contact line is "through the project's designated Kempyre contact".
- Decisions that cannot be undone or that affect the clinic (publishing content, the booking link, domain, anything with patient data) are asked, not assumed. Everything else: decide, note the assumption in the PR, carry on.

## Agents and skills: who checks what

Reviewers are read-only and run on every page PR, in parallel, each answering one question:

| Agent | Question |
| --- | --- |
| `architecture-reviewer` | Does it survive a second location and a CMS swap? One read path, no hard-coded facts, fields in the model, translated text. |
| `design-reviewer` | Does it match the canvas, `tokens.json` and the design rules? |
| `a11y-reviewer` | Can an older patient on a phone use it? WCAG 2.2 AA. |
| `content-reviewer` | Is every sentence true (or bracketed), allowed (CPSO/PHIPA), spelled Centre, in the voice, matched across languages? |
| `seo-reviewer` | Title, description, H1, canonical, hreflang, structured data, sitemap, listing consistency. |
| `privacy-security-reviewer` | What leaves the browser and to whom? Analytics, forms, env, headers, dependencies. |

Producers write drafts, never publish: `copywriter` (English copy from the content map and client facts), `translator` (fr-CA and pt-PT from the glossary, marked native review pending). `qa-verifier` runs lint, typecheck, `check`, build and the smoke test and reports evidence for the PR.

Skills: `new-page` (the page workflow, which calls all of the above), `content-map`, `client-brief`, `launch-checklist`, `next-dev-loop`.

## How we work

- Branch per task; open a pull request to `main` using the template; `main` is always deployable. Commit messages say what changed and why.
- Before building a page, read the matching record type, the voice guide, and the homepage reference on the design canvas. Plan first: say what files you will touch and why, and what happens to the page when a second Location appears.
- Verify before saying done: `npm run lint`, `npm run typecheck`, `npm run check`, `npm run build`, `npm run smoke`; look at the page at 390px and 1440px.
- Keep `docs/` in step with the code. If a decision changes, update the document in the same pull request.

## Commands

```
npm install                 # all workspaces (Node 22, see .nvmrc)
npm run dev                 # Next.js at http://localhost:3000
npm run lint
npm run typecheck           # next typegen + tsc
npm run check               # hard-coded facts, temporary photos, Centre spelling
npm run build
npm run smoke               # Playwright + axe against the built app (writes .smoke/)
npm run studio              # Sanity Studio, once apps/studio exists
```

## Open decisions (keep current)

Canonical domain and redirects (A1–A2) · booking system and link (4.2) · enquiry inbox and form service (1.3, A5) · analytics confirmation (A6) · hours mismatch, Sunday and holidays (A7) · whether the former name is shown (A8) · services live at launch (2.1–2.2) · provider profiles (3.x) · parking and accessibility (4.7–4.8) · fees and coverage publication (5.6) · privacy contact (7.4) · launch languages and native reviewers (A3). Tracked in `docs/client-facts-2026-10-04.md` and `docs/launch-checklist.md`.
