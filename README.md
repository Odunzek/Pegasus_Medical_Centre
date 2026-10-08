# Pegasus Medical Centre — website

Public website for Pegasus Medical Centre, a family medicine and walk-in clinic in York, Toronto. Delivered by Kempyre Groups; built by DueSpace Studios; maintained by Kempyre Groups.

## Stack

- **Website:** Next.js (static pages, rebuilt on publish), hosted on Vercel. Languages: English, French, Portuguese.
- **Content back office:** Sanity (free plan). Seven record types; see `docs/content-model-v1.md`.
- **Booking:** outbound link to the clinic's own booking system, stored as one field in Site settings. No patient data is stored by the website.
- **Enquiries:** form delivers to the clinic's email inbox through a form service; nothing is kept on the website.
- **Analytics:** page views and Book clicks only; no personal or health information is ever sent to analytics.

## Repository layout

```
docs/                 Project record: content model, client facts, architecture
  architecture/       "How the website fits together" (open index.html in a browser)
design/               Design tokens (colours, type, spacing) and system notes
apps/                 (to be created by DueSpace)
  web/                Next.js site
  studio/             Sanity Studio
```

## Design

- Colours: Deep Teal `#003D3A`, Teal `#2E7D6B`, Soft Green `#8FBC8F`, Pale Neutral `#E6EEE9`, white, black. No gold, no gradients.
- Type: Lora (headlines) and Montserrat (everything else). Body text 18–19px; the audience includes older patients.
- Accessibility target: WCAG 2.2 AA (contrast 4.5:1, 24px targets, visible focus, reduced-motion respected).
- Tokens and component notes are in `design/`.

## Working agreements

- `main` is always deployable. Work on branches; open a pull request for anything that changes the site.
- Content is edited in Sanity, never in code. If a receptionist might need to change it, it is a CMS field.
- Keep the content model in `docs/content-model-v1.md` in step with the Sanity schema; change the document first.
- Facts about the clinic (address, hours, services) come from `docs/client-facts-2026-10-04.md`; update that file when the client confirms something new.
- No stock or AI-generated imagery in production; photographs come from the clinic's own shoot.

## Open decisions (as of 8 Oct 2026)

Booking system and link · enquiry email address · services live at launch · provider profiles · parking and accessibility · whether fees and coverage are published · privacy contact. See `docs/client-facts-2026-10-04.md`.
