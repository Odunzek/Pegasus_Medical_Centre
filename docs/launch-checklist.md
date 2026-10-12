# Launch checklist

Run with the `launch-checklist` skill. Nothing is ticked without evidence in the right-hand column. Items marked **Client** need Dr. Khurshid; items marked **Kachi** need his own sign-in.

## A. Decisions that must be made before launch

| # | Item | Owner | Evidence |
| --- | --- | --- | --- |
| A1 | Canonical domain. The brand is "Centre"; DueSpace's blueprint named `pegasusmedicalcenter.ca`. Decide the primary domain (recommended: `pegasusmedicalcentre.ca`), confirm it is registered to the clinic, and list every other domain the clinic owns (`.com`, `pegasusmedicalclinic.*`, "center" spellings) to redirect. | Client + Kachi | |
| A2 | Old web addresses: did York Health Choice Centre have a website or domain? If yes, list its URLs for redirects. | Client | |
| A3 | Launch languages: English at launch; French and Portuguese enabled only after native-speaker review of the shell and essentials pages (Site settings → Languages enabled). Name the reviewers. | Kachi + Client | |
| A4 | Booking: online link (Cortico or other) or phone only. The link goes in Site settings, nowhere else. | Client | |
| A5 | Enquiry inbox (clinic address, never personal) and the form service. Decision: Formspree free tier (name, phone, preferred day only; no file uploads; spam filter on) unless the client has a preference; endpoint in `FORM_ENDPOINT`. | Client + Kachi | |
| A6 | Analytics: GA4 through GTM, page views and Book clicks only, IP anonymised, no user-id, no form data, no cookie banner needed under PIPEDA/PHIPA for this event set (confirm with the privacy-security reviewer). Measurement id in `NEXT_PUBLIC_GA4_ID`; script host added to the CSP. | Kachi | |
| A7 | Hours: resolve the mismatch (questionnaire 9–6 / 9–2 vs listings 9–5 / 9–1); Sunday and statutory holidays. | Client | |
| A8 | Whether the site mentions the former name publicly ("formerly York Health Choice Centre") on About and in structured data. | Client | |

## B. Content

| # | Item | Owner | Evidence |
| --- | --- | --- | --- |
| B1 | Every record on production is `review: approved` with the approver and date recorded; `SHOW_DRAFTS` is unset on the production environment. | Kachi | |
| B2 | No square brackets remain on any production page in any enabled language (`npm run check` and a text sweep of the built pages). | Kachi | |
| B3 | Provider profiles: each published with an approval record; credentials as granted; no superlatives. | Client + Kachi | |
| B4 | Emergency line present wherever clinic details appear; privacy contact on the Privacy page; Health811 line decided. | Kachi | |
| B5 | French and Portuguese native review complete for every enabled language, reviewers named, "native review pending" markers removed. | Reviewers | |
| B6 | Site settings → Languages enabled set for production per A3 (sample data has all three on for previews). | Kachi | |

## C. Photographs

| # | Item | Owner | Evidence |
| --- | --- | --- | --- |
| C1 | Photo shoot done per the shot list below; consent forms signed by everyone pictured; no patients in frame. | Client + Kachi | |
| C2 | Every `ImageRef` with `temporary: true` replaced; `npm run check` passes with no temporary photo referenced; `public/temp-photos/` deleted. | Kachi | |

Shot list: a doctor with a patient (staff stand-in), unposed, landscape, space on the left (hero); reception desk with a staff member, portrait; a consulting room; the waiting area (staff only); the entrance from Rogers Road and the unit door, showing step-free access if any; each provider head-and-shoulders on the same plain background; the front-desk team together (optional); details: the sign, the logo in the clinic, a blood-pressure cuff, a height chart (optional).

## D. Technical

| # | Item | Owner | Evidence |
| --- | --- | --- | --- |
| D1 | Vercel project linked to the GitHub repo; production from `main`; preview deployments for PRs with `SHOW_DRAFTS=true`; production build command `npm run check:production && npm run build`; production env has `NEXT_PUBLIC_SITE_URL` = canonical origin, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `FORM_ENDPOINT`, `NEXT_PUBLIC_GA4_ID`, `SANITY_REVALIDATE_SECRET` (the last three are not read by any code until their chunks land). | Kachi | |
| D2 | Domain added in Vercel; DNS at the registrar; HTTPS issued; every secondary domain redirects (308) to the canonical origin, path preserved. `curl -I` each. | Kachi | |
| D3 | Old URLs (A2) redirect to the matching new pages in `next.config.ts` `redirects()`. | Kachi | |
| D4 | Security headers live (`curl -I`): CSP (extended for GTM/GA4, the booking vendor, map embed), HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy. | Kachi | |
| D5 | `robots.txt` allows crawling on production and disallows on previews; `sitemap.xml` lists every page in every enabled language with hreflang; unknown URLs return 404 (check the HTTP status on Vercel, not only the `noindex` meta). | Kachi | |
| D6 | Structured data validated (Google Rich Results test): MedicalClinic with the right name, phone, address, hours, `alternateName` if A8 is yes. | Kachi | |
| D7 | Sanity (not wired yet; the Sanity chunk): schema matches `docs/content-model-v1.md`; two roles set up; Studio structure hides Site settings from Editors; publish webhook → Vercel deploy hook or a revalidate route with `SANITY_REVALIDATE_SECRET`; a test publish rebuilds the site within two minutes. | Kachi | |
| D8 | Form: a test submission from the live site arrives in the clinic inbox with name, phone and preferred day only; spam protection on; the thank-you page says what happens next. | Kachi + Client | |
| D9 | Analytics: a page view and a Book click appear in GA4 with no PII in any parameter; Search Console verified; sitemap submitted. | Kachi | |
| D10 | `qa-verifier` run against the production URL: lint/typecheck/build/check/smoke green; axe zero serious/critical; Lighthouse mobile ≥ 90 performance and 100 accessibility on the homepage and one service page, run by hand in Chrome DevTools (no script for it). | Kachi | |
| D11 | Phone call from the site's number reaches the clinic; booking link lands where expected on a phone; every language switch keeps the same page. | Kachi | |

## E. The rebrand and listings

| # | Item | Owner | Evidence |
| --- | --- | --- | --- |
| E1 | Google Business Profile: claim the existing York Health Choice Centre listing (16 reviews) and **rename** it to Pegasus Medical Centre; never create a second listing. Update hours (A7), website, booking link, categories (Walk-in clinic, Family practice physician), photos from C1, languages. | Client + Kachi | |
| E2 | Other listings carrying the old name (ClinicFinder, Cortico page, Health Connect Ontario, Yellow Pages, Apple Maps, Bing Places): name, address, phone and hours identical to the site. | Kachi | |
| E3 | The clinic's own mentions: signage, phone greeting, printed forms, email signatures, social accounts; a short "we have a new name" notice (Post, type notice) if A8 is yes. | Client | |

## F. Day one and after

| # | Item | Owner | Evidence |
| --- | --- | --- | --- |
| F1 | Search Console: no coverage errors after 48 hours; hreflang report clean. | Kachi | |
| F2 | First monthly health check scheduled (`docs/maintenance.md`); holiday-hours reminder set for the next Ontario statutory holiday. | Kachi | |
| F3 | Handover note to the clinic: how to change hours, holidays, the announcement bar, the booking link; who to call. | Kachi | |
