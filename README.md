# Pegasus Medical Centre — website

The public website for **Pegasus Medical Centre**, a family medicine and walk-in clinic at 605 Rogers Road in York, Toronto. The clinic is changing its name from York Health Choice Centre; this site is part of that. Patients will use it to find the clinic, see the hours, learn what services it offers, and book or call. Many of them are older and most will be on a phone, so the site is deliberately calm, large and simple, and it works in English, French and Portuguese.

Built and maintained by **Kempyre Groups**. Other people may contribute; everything you need is in this repository.

## What it is made of

```
  Clinic staff                         Patients
      │  type hours, services,             │  read pages, book, call
      │  doctors, notices                  │
      ▼                                    ▼
┌─────────────┐   publish   ┌──────────────────────┐   hosted on   ┌──────────┐
│   Sanity    │ ──────────▶ │   Next.js website    │ ────────────▶ │  Vercel  │
│ (content    │             │ (this repo, apps/web)│               │          │
│  back       │             │ reads content,       │               └──────────┘
│  office)    │             │ renders pages,       │
└─────────────┘             │ computes "open now"  │
                            └──────────────────────┘
                                   │            │
                     Book button ──┘            └── enquiry form
                     (link to the clinic's          (name, phone, preferred day
                      own booking system)            → the clinic's inbox)
```

- **Website:** Next.js 16 (App Router with Cache Components: pages are built as static HTML, so environment variables are baked in at build time), TypeScript, CSS Modules. No Tailwind. Lives in `apps/web`. The Sanity client packages are installed ahead of the Sanity stage and are not used yet.
- **Content:** Sanity. Not created yet; until then the site runs on typed sample data in `apps/web/src/content/sample/`. The seven kinds of content (Site settings, Location, Service, Provider, FAQ, Page, Post) are described in `docs/content-model-v1.md`.
- **Hosting:** Vercel. Every pull request gets a preview link.
- **No patient data anywhere.** Booking is a link out to the clinic's own system; the enquiry form sends three fields to the clinic's inbox; analytics counts page views and Book clicks only.

## Ten-minute start

You need Node 22 and Git. Then:

```bash
git clone https://github.com/Odunzek/Pegasus_Medical_Centre.git
cd Pegasus_Medical_Centre
npm install
npx playwright install chromium                 # once; only the smoke test needs it (~150 MB)
cp apps/web/.env.example apps/web/.env.local    # PowerShell: copy apps\web\.env.example apps\web\.env.local
npm run typecheck                               # once; generates Next's route types so your editor knows PageProps
npm run dev
```

Open http://localhost:3000. It redirects to `/en`; `/fr` and `/pt` are the other languages. The copied `.env.local` sets `SHOW_DRAFTS=true`, which you want: until the clinic approves content every record is a draft, and without that flag the site is almost empty.

Before you push anything, run the same checks CI runs, in this order (the smoke test examines the build you just made):

```bash
npm run lint                      # code style
npm run typecheck                 # TypeScript (generates Next's route types first)
npm run check                     # no clinic facts hard-coded, no stock photos outside sample data, no "Center"
SHOW_DRAFTS=true npm run build    # the production build with drafts visible (PowerShell: $env:SHOW_DRAFTS="true"; npm run build)
npm run smoke                     # every page, three languages, three widths, accessibility scan; 5–8 min; green = "smoke: ok"
```

**Your first task**, if you are building a page: read `CONTRIBUTING.md`, then the worked example below, then run `git switch -c feat/<page-name>` and start from `apps/web/src/app/[lang]/services/[slug]/page.tsx`, which shows the whole pattern in forty lines.

## Where things are

| Path | What it is |
| --- | --- |
| `README.md` | This file: the overview. |
| `CONTRIBUTING.md` | How to make a change and get it merged. **Read before your first PR.** |
| `CLAUDE.md` | The rulebook: architecture, code, design, content, SEO and privacy rules. Written so an AI assistant can follow it; it applies to people exactly the same. |
| `apps/web/src/app/[lang]/` | The pages. Every page lives under the language segment (`/en/...`, `/fr/...`, `/pt/...`). |
| `apps/web/src/content/` | How pages get content: `index.ts` is the only door (sample data now, Sanity later); `types.ts` defines the seven kinds of content. |
| `apps/web/src/proxy.ts` | What other frameworks call middleware: sends `/services` to `/en/services`. |
| `apps/web/src/components/` | The shell and shared pieces: header, footer, phone bar, actions, icons, notices. |
| `apps/web/src/lib/` | Small libraries: languages (`i18n.ts`), opening hours (`hours.ts`), the Book action (`booking.ts`), search metadata (`seo.ts`). |
| `apps/web/src/app/globals.css` | The design values as CSS variables (colours, type, spacing, radii). |
| `design/` | The design system in words (`README.md`) and numbers (`tokens.json`); `design/reference/` has pictures of the target homepage on desktop and phone, and the client preview PDF, for anyone without access to the design canvas. |
| `docs/` | Everything decided: the content model, the clinic's confirmed facts, the voice guide, the launch checklist, the maintenance routine, and how the project is built with AI (`agentic-workflow.md`). |
| `scripts/` | `check-facts.mjs` (`npm run check`; `npm run check:production` also refuses stock photos) and `smoke.mjs` (`npm run smoke`; writes `.smoke/`, which is regenerated each run and not committed). |
| `.claude/` | AI tooling: agents that review changes, skills (repeatable workflows), hooks. Optional; ignore it if you do not use an AI assistant. |
| `.github/` | CI, the pull request template, code owners, Dependabot. |

## The rules in one minute

Each of these has a longer form in `CLAUDE.md`.

1. **Facts come from one place.** The clinic's address, phone, hours, services and doctors are *content records*, never typed into code or copy. Anything not yet confirmed by the clinic is written in square brackets, like `[Typical wait: to be confirmed]`, and every record is a draft until the clinic approves it.
2. **Nothing is hard-coded.** Colours and sizes are CSS variables; text a patient reads is a translated field or a dictionary string; URLs and keys are environment variables.
3. **Built for more than one clinic**, even though one opens first. Never assume "the clinic".
4. **The design has no rectangular buttons.** Actions are text with a circle arrow. Headlines are Lora, everything else Montserrat, five brand colours, nothing a patient reads under 16px.
5. **Accessible for older patients**: WCAG 2.2 AA, 44px tap targets, visible focus, real links and buttons.
6. **Words follow the voice guide**: warm and plain, Canadian spelling, "Centre" never "Center", no testimonials, no "best", no promises (Ontario's rules for medical advertising).
7. **No patient data.** Not in the site, not in the CMS, not in analytics, not in logs.
8. **Every file explains itself.** A short comment at the top, a plain-English comment on every exported function, comments that say *why*.

## Where the build stands

| Done | Not yet |
| --- | --- |
| Design system, fonts, logo, colours | The real homepage layout (the editorial design on the canvas) |
| The shell: header, footer, phone bar, announcement bar, languages | Services, Location, Doctors, Resources, Contact page templates |
| Content types and sample data; the one read path | Sanity itself (waits for the clinic's account) |
| Search plumbing: metadata, hreflang, structured data, sitemap, robots | Real copy (waits for the clinic's answers) and native-reviewed French and Portuguese |
| Security headers, accessibility scan, CI, fact gate | The clinic's own photographs (current ones are labelled stock stand-ins) |
| Launch checklist and maintenance routine, written | Launch |

The remaining work is split into stages (called "chunks" in code comments), one branch and pull request each:

1. Content map (`docs/content-map.md`) and the clinic's answers to the open questions
2. Homepage proper (the editorial design in `design/reference/`)
3. Services index and Service page (`/services`, `/services/[slug]`)
4. Find us / Location page (`/locations`, `/locations/[slug]`)
5. Our doctors and provider profiles (`/doctors`, `/doctors/[slug]`; needs one approved provider)
6. Resources and the general pages (`/resources`, `/about`, `/new-patients`, ...)
7. Contact page and the enquiry form
8. French and Portuguese pass with native-speaker review
9. Sanity: schema, `content/index.ts` querying it, publish webhook
10. Launch (`docs/launch-checklist.md`), then the monthly routine (`docs/maintenance.md`)

## A worked example: how a page is built

Every page follows the same shape. Take `apps/web/src/app/[lang]/services/[slug]/page.tsx`:

1. **It lives under `[lang]`**, so it receives `params.lang` and renders one language. The first lines check `isLocale(lang)` and call `notFound()` otherwise.
2. **It reads content only through `@/content`**: `getService(slug)` for the record, `getSiteSettings()` for the clinic. Never from `content/sample/` and never a typed-in fact.
3. **`generateStaticParams`** lists every language × every record, so the page is built as static HTML at deploy time.
4. **`generateMetadata`** calls `pageMetadata({ locale, path, title, description, settings })`, which gives the page its title, description, canonical URL and the hreflang set. The title says *what and where*.
5. **Translated text is rendered with `t(field, lang)`**; if any field falls back to English, the page shows `<PartlyEnglishNote>`. On preview builds, draft records get `<DraftMark>`.
6. **It uses the shared pieces**: `PrimaryAction` for the one main action on the screen (`heroBook` on the hero's Book so the header and phone bar take over after it scrolls away), `ArrowLink` for secondary actions, `CircleArrow` on whole-row links, `Reveal` for the rise-in, `OpenStatus` for "Open now", `Icon` with `TEXT_ICON` beside text, the CSS variables from `globals.css`.
7. **Styles go in a CSS Module** beside the page; no inline styles, no magic numbers.
8. **It is done when**: lint, typecheck, check, build and smoke pass; it was looked at on a phone and a laptop; the seven reviewer questions in `CONTRIBUTING.md` have been answered (by a person or the agents); the PR template is filled in, including "what happens when a second clinic is added".

The simplest full template today is `apps/web/src/app/[lang]/[page]/page.tsx` (general pages); the homepage `apps/web/src/app/[lang]/page.tsx` shows the hero and the one-Book rule.

## How do I…

| …do this | …look here |
| --- | --- |
| Build a new page | `CONTRIBUTING.md`, then `apps/web/src/app/[lang]/[page]/page.tsx` as the simplest example and `apps/web/src/app/[lang]/page.tsx` as a fuller one |
| Add a field to a kind of content | Change `docs/content-model-v1.md` first, then `apps/web/src/content/types.ts`, then the sample data, then pages |
| Add a word patients will read | A translated field on a record, or a string in `apps/web/src/lib/i18n.ts` with its French and Portuguese |
| Change a colour, size or spacing | `apps/web/src/app/globals.css` (and `design/tokens.json`, which must agree) |
| Know what the clinic has confirmed | `docs/client-facts-2026-10-04.md` |
| Write copy | `docs/voice-and-content-guide.md` |
| See what reviewers will check | `CONTRIBUTING.md`, "What reviewers check" |
| Understand a decision | `docs/agentic-workflow.md`, section 8 |

## Glossary

- **Record / content record:** one item of content in the CMS: a Location, a Service, a Provider, an FAQ, a Page, a Post, or the single Site settings record.
- **Site settings:** the one global record: clinic name, phone, booking link, emergency wording, which languages are on, the homepage's words.
- **Draft / approved:** every record's review status. Production shows only approved records; preview builds show drafts with a "Draft" mark. Providers are the exception: a profile appears only when published *and* approved, even on previews.
- **`SHOW_DRAFTS`:** the environment variable that turns drafts on (previews and local development).
- **Translated field:** `{ en, fr?, pt? }`. English is required and is the fallback; a page that fell back shows a small "partly in English" note.
- **Direction C:** the chosen homepage design (editorial, full-width photo, serif headline, no buttons). Pictures in `design/reference/`.
- **The one read path:** pages get content only through `apps/web/src/content/index.ts`, so swapping sample data for Sanity changes one file.
- **Shell:** the parts of every page that are not the page: header, announcement bar, footer, phone Book/Call bar.
- **Chunk:** one of the ten stages listed under "Where the build stands", each a branch and a pull request. Code comments say "the services chunk" and mean stage 3.
- **Temporary photo:** a stock image used while the clinic's own photographs do not exist. Flagged in the content, badged on previews, refused in production.

## Open decisions

The things the clinic still has to decide (domain, booking link, services at launch, provider names, hours, enquiry inbox) are listed at the end of `CLAUDE.md` and in `docs/launch-checklist.md`, section A.
