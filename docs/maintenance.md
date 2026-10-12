# Maintenance after launch

Kempyre Groups (Kachi) maintains the site on a monthly retainer. This is what the retainer covers and the routine that delivers it. Clinic staff make everyday content changes themselves in the Sanity Studio; Kempyre keeps the site healthy, safe and current.

## What the clinic does itself (no ticket needed)

Hours and holiday closures, the announcement bar, notices, FAQ answers, service descriptions, provider text (not approval), photos with alt text. The Studio structure keeps Site settings (booking link, emergency wording, privacy contact, languages enabled) and provider approval with the Admin role.

## Monthly health check (first working day of the month, ~1 hour)

Run as a scheduled task where possible; the report goes to the clinic the same day.

1. **Up and correct.** Homepage, one service page and the location page load in all enabled languages; "Open now" agrees with the hours in the Studio and on the Google Business Profile; the emergency line and phone are present.
2. **Search.** Google Search Console: coverage errors, hreflang issues, manual actions, new 404s; Business Profile: hours, booking link, photos, any review needing a reply (replies never discuss a patient's care).
3. **Speed and accessibility.** Lighthouse mobile on the homepage and one service page, by hand in Chrome DevTools (performance ≥ 90, accessibility 100); the smoke test against production (`SMOKE_BASE_URL=https://<site> npm run smoke`) for console errors and axe violations.
4. **Links.** The smoke test's link check; the booking link opens where expected; the form delivers a test submission to the clinic inbox with only name, phone and preferred day.
5. **Dependencies.** Dependabot PRs reviewed and merged after CI; `npm audit` high/critical cleared; Next.js and Sanity release notes skimmed for security fixes.
6. **Content hygiene.** Expired notices gone; no record still `review: draft` that the clinic meant to publish; no square brackets on production; any new provider approved before publishing.
7. **Privacy.** Analytics shows page views and Book clicks only; no parameter carries PII; form service retention set to the minimum.
8. **Report** (one page, to the clinic): what was checked, anything fixed, anything needing a decision.

## Holiday hours reminder

Ten days before each Ontario statutory holiday (New Year's Day, Family Day, Good Friday, Victoria Day, Canada Day, Civic Holiday, Labour Day, Thanksgiving, Remembrance Day as the clinic decides, Christmas Day, Boxing Day), send the clinic a one-line reminder to add an hours exception in the Studio for that date and for any early close around it, and to update the Business Profile special hours. Check on the day that the site and the Profile agree.

## Change requests

Anything that needs code (a new page type, a new field, a design change, a new location's first setup) comes to Kempyre, is planned in a PR, reviewed by the project's reviewers and CI, and shown to the clinic on a preview link before merge. Turnaround and scope are per the maintenance agreement.

## When something breaks

Site down or wrong facts showing: Kempyre is told through the project's designated contact; the fix is a revert or a content correction first, a proper fix second; the clinic is told what happened in plain language the same day.
