---
name: launch-checklist
description: Walk the pre-launch checklist in docs/launch-checklist.md for the Pegasus website (domain, redirects, Vercel, environment, analytics privacy audit, Google Business Profile rename, Search Console, sitemap, photos, 404s, three-language sweep) and record evidence for each item. Use when preparing a launch or a major release; also for the post-launch day-one checks.
---
# Launch checklist

The list lives in `docs/launch-checklist.md`; this skill is how it is run.

1. Read `docs/launch-checklist.md`, `docs/client-facts-2026-10-04.md` (for the facts that must match the listings) and `apps/web/next.config.ts`.
2. Work through every item in order. For each: do it or confirm it, and write the evidence (a URL, a command output line, a screenshot path, a date and who confirmed) into the checklist's Evidence column in the same change. Never tick an item without evidence.
3. Items that need the client (Business Profile ownership, DNS at the registrar, approving copy) are listed with exactly what to ask; stop at them and report, do not improvise.
4. Items that need credentials (Vercel, Google) are done by Kachi in his own browser; the skill prepares the exact values and checks the result afterwards from the outside (DNS lookups, curl of headers and redirects, the live sitemap, robots, the rendered JSON-LD).
5. Run `qa-verifier` against the production URL at the end, plus the manual checks the list names (phone call to the clinic number from the site, booking link lands where expected, enquiry form delivers to the clinic inbox with only name/phone/day).
6. Finish with the day-one list: Search Console submission, Business Profile hours and link, first analytics page-view check with no PII, and the date the first monthly health check is due (`docs/maintenance.md`).
