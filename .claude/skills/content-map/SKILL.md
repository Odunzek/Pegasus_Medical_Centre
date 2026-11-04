---
name: content-map
description: Build or update docs/content-map.md, the page-by-page plan for the Pegasus website's words and search presence (purpose, patient question, search intent, title, description, H1, sections with their record sources, status, owner). Use before writing copy for any page, when the sitemap changes, or when the client answers questionnaire items.
---
# Content and search map

Argument: optional page name to update, e.g. `/content-map Service page`. No argument: build or refresh the whole map.

The map is `docs/content-map.md`. One table row per page (templates count once, with a note on how instances vary), plus a listings section (Google Business Profile, directories) and a translation-status section.

1. **Read first.** `docs/client-facts-2026-10-04.md` (what is known), `docs/content-model-v1.md` ("How the pages are fed"), `docs/voice-and-content-guide.md` (section 7 has the page purposes), `CLAUDE.md` ("SEO rules"), `apps/web/src/lib/i18n.ts` (route names), and the existing map if there is one. Use the `site-architecture` and `seo-audit` skills for method, not for invention.
2. **For each page record:** URL in each language (`/x`, `/fr/x`, `/pt/x`); purpose in one line; the patient's question; the one search intent it should answer (local, plain: "walk-in clinic York Toronto", "family doctor Rogers Road"); title (≤ 60 characters, says what and where); description (70–160 characters, no phone or address, those come from structured data); H1; sections top to bottom with the record and field each reads; facts still in brackets and the questionnaire item that unblocks each; status (planned / drafted / approved / translated fr / translated pt / native-reviewed); owner.
3. **Keyword work stays modest.** One primary intent per page, two or three supporting phrases, no volumes guessed. The ranking battle for one neighbourhood clinic is the Business Profile, consistent name/address/phone/hours, and pages that answer real questions.
4. **Listings section:** the Google Business Profile (renamed from York Health Choice Centre, not recreated; reviews kept), the hours that must match the site, categories, the booking link, photos; other directories that carry the old name (ClinicFinder, Cortico page, Health Connect Ontario, Yellow Pages) and what to update on each.
5. **Translation section:** per page, which fields exist in fr and pt, and whether native review is done. A language is enabled only when its essentials pages are reviewed.
6. **Keep it true.** The map is the plan the client approves before copy is written. When a fact arrives, update the map and `client-facts` in the same change. Commit on a branch and open a PR; the `seo-reviewer` and `content-reviewer` read the map in review.
