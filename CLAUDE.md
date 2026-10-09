# Pegasus Medical Centre website — working notes for Claude

Read this first. It tells you what the project is, where things live, how we work, and what you must never do.

## What this is

Public website for Pegasus Medical Centre, a family medicine and walk-in clinic at 605 Rogers Road, Unit D5, York, Toronto. Audience includes many older patients. Three languages: English, French, Portuguese. Delivered by Kempyre Groups, built with DueSpace Studios, maintained by Kempyre Groups (Kachi).

## Where things live

- `apps/web` — Next.js site (App Router, TypeScript, `src/` dir, no Tailwind). **Next.js here is newer than your training data**: the rules below are imported from the app and point at version-matched docs in `apps/web/node_modules/next/dist/docs/`. Use the `next-dev-loop` skill when running or debugging the dev server.

@apps/web/AGENTS.md
  - `src/app/[lang]/` — every page; `params.lang` is `en`, `fr` or `pt`. English is served at the root (`/services`), French and Portuguese prefixed (`/fr/services`); `src/proxy.ts` does the rewrite. Never add a page outside `[lang]`.
  - `src/content/index.ts` — the only place pages read content from (today typed sample data in `src/content/sample/`, later Sanity). `src/content/types.ts` mirrors the content model.
  - `src/components/` — the shell: `SiteHeader` (Book handover), `SiteFooter`, `PhoneBar`, `actions` (`PrimaryAction`, `ArrowLink`, `CircleArrow`), `Reveal`, `OpenStatus`, `Icon`, `Logo`.
  - `src/lib/` — `i18n.ts` (locales, shell dictionary, `localePath`, `t`), `hours.ts` (open-now in Toronto time), `booking.ts` (Book → booking URL or "Call to book").
  - `src/app/globals.css` — the CSS variables (colours, type, space, radii); `src/app/fonts.ts` — Lora and Montserrat, self-hosted from `src/fonts/`.
  - `public/brand/` — logo files from the brand package v1.4 (clear space cropped); `public/temp-photos/` — labelled stand-ins, never for production.
- `apps/studio` — Sanity Studio (content back office). Created with `npm create sanity@latest` once the owner has signed in.
- `docs/content-model-v1.md` — the content model. The Sanity schema must match it; change the document first, then the schema.
- `docs/client-facts-2026-10-04.md` — confirmed facts about the clinic (address, phone, hours, services). The only source for real-world facts. Anything not in it is a placeholder and is shown in square brackets.
- `docs/architecture/index.html` — how the system fits together, for the client.
- `design/tokens.json`, `design/README.md` — the design system (colours, type scale, spacing, radius, components).
- `.claude/skills/` — installed skills: seo-audit, schema, site-architecture, ai-seo, copywriting, vercel-react-best-practices, vercel-composition-patterns, web-design-guidelines, verification-before-completion, systematic-debugging, plus the project's own `new-page` and `next-dev-loop`. Use them when the task matches their description.

## Architecture rules (non-negotiable)

The site is a set of **templates fed by a headless CMS**. Read `docs/content-model-v1.md` and `docs/architecture/index.html` before changing structure.

- **Three parts, cleanly separated:** Sanity (content back office, edited by clinic staff), the Next.js site (reads published content, renders pages, computes things like "open now"), Vercel (hosting). Booking is an outbound link from Site settings; enquiries go through a form service to the clinic inbox. No patient data touches any of the three.
- **Seven record types, no more:** Site settings · Location · Service · Provider · FAQ · Page · Post. A page may only show fields that exist in the model. Need a new field? Change `docs/content-model-v1.md` first, then `src/content/types.ts`, then the schema, then the page.
- **Built for many locations from day one, even though one opens first.** Never write "the clinic" as if there is only one in code or copy structure; `Location` is a list. `/locations/[slug]` and `/services/[slug]` are templates. The homepage, footer and phone bar take the primary open location today and must handle two or more without code changes (a Locations switcher or list, not a rewrite). `Location.status` ("opening soon") lets a second clinic have a page before it has hours.
- **Single sources of truth:** `Location.services` says which services a clinic offers; `Provider.locations` and `Provider.services` say where a provider works and what they do. Everything else (a service's "where you can get this", a location's team) is **derived** through `src/content/index.ts`, never duplicated in another record.
- **One read path.** Pages import content only from `src/content/index.ts`. Never from `src/content/sample/` directly, never a hard-coded address, phone, hour, service name or provider name in a page. When Sanity arrives, only `index.ts` changes.
- **Every text field a patient reads is translated** (`Translated` = `{ en, fr?, pt? }`, rendered with `t(field, locale)`); English is the fallback. Shell strings live in `src/lib/i18n.ts`. Every page lives under `app/[lang]/`.
- **Computed, not typed:** open/closed status, "opens Monday at 9:00 a.m.", expired notices, "where you can get this" lists, provider counts. Staff enter facts; the site does the arithmetic.
- **Nothing a receptionist might change is in code:** hours, holidays, booking link, announcement, service names, provider details, FAQs. If you are tempted to hard-code it, it belongs in a record.

## Design rules (non-negotiable)

- Colours: Deep Teal `#003D3A` (text, dark bands), Teal `#2E7D6B` (links, hover), Soft Green `#8FBC8F` (accents, fills, circle arrows), Pale Neutral `#E6EEE9` (cream bands), white. No gold, no gradients except the photo shade in the hero, no glass effects, no drop shadows except the quick-action card.
- Type: Lora 500 for headlines (h1–h3, primary actions); Montserrat for everything else. Body text 18–19px desktop, 17px phone. Max two typefaces.
- Actions: there are no rectangular buttons. Primary action = Lora text + 64px soft-green filled circle with an arrow. Secondary = Montserrat text + 48px outlined circle. One primary action visible per screen; the header shows Book only after the hero's Book scrolls away. Phone: Book + Call bar pinned to the bottom.
- Shapes: pills and circles; arched portraits (`border-radius: 999px 999px 24px 24px`); one large rounded corner per strip photo; full-bleed hero photo with shade bottom-left only.
- Layout: 64px gutters on desktop, 20px on phone; sections 128px vertical on desktop, 56px on phone; no equal-height card grids; lists with rules, not cards.
- Motion: sections rise once on scroll (IntersectionObserver), circle arrows fill on hover, photos zoom 1.035 on hover. Everything off under `prefers-reduced-motion`.
- Accessibility: WCAG 2.2 AA. Contrast ≥ 4.5:1 for text, targets ≥ 44px, visible focus (`3px solid` soft green), real `<a>`/`<button>` elements, descriptive alt text on every image, forms with labels and plain-language errors. No hover-only information.

## Content rules

- Facts come only from `docs/client-facts-2026-10-04.md`. Unknowns stay in square brackets.
- No patient testimonials or reviews anywhere (CPSO advertising rules). No superlatives about doctors, no comparisons with other clinics.
- Provider profiles are factual (name, title, credentials, languages, focus) and are published only after the provider's approval, recorded in the CMS.
- No stock or AI-generated photographs in production. Current photos are temporary stand-ins and are labelled as such.
- Spelling: "Centre", Canadian English. Times as "9:00 a.m. to 6:00 p.m.".
- Emergency line everywhere the clinic's details appear: "If you are experiencing a medical emergency, call 911 or go to the nearest emergency department."

## Data and privacy rules

- The website stores no patient data. The CMS stores no patient data. Booking is an outbound link read from Site settings. Enquiries go to the clinic's email through a form service, with name, phone and preferred day only; never health details.
- Analytics (GA4/GTM per the DueSpace blueprint) records page views and Book clicks only. Never put names, emails, phone numbers, form contents or anything health-related into analytics, URLs or logs.
- Never commit secrets. Environment variables go in `.env.local` (ignored); document their names in `.env.example`.

## How we work

- Branch per task; open a pull request to `main`; `main` is always deployable. Commit messages say what changed and why.
- Before building a page, read the matching record type in `docs/content-model-v1.md` and the homepage reference on the design canvas. Pages are templates fed by the CMS; never hard-code a fact a receptionist might need to change.
- Plan first for anything beyond a small fix: say what files you will touch and why, then do it.
- Verify before saying done: run `npm run lint`, `npm run typecheck`, `npm run build`, and look at the page at 390px and 1440px. For accessibility, check contrast and keyboard order.
- Keep `docs/` in step with the code. If a decision changes, update the document in the same pull request.
- Ask when a decision cannot be undone or affects the client (publishing content, changing the booking link, anything with patient data). Everything else: decide, note the assumption, carry on.

## Commands

```
npm install                 # all workspaces
npm run dev                 # Next.js at http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm run studio              # Sanity Studio once apps/studio exists
```

## Open decisions (keep current)

Booking system and link · enquiry email · services live at launch · provider profiles · parking and accessibility · fees and coverage publication · privacy contact. Tracked in `docs/client-facts-2026-10-04.md`.
