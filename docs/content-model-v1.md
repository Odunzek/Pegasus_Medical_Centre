# Pegasus Medical Centre: CMS content model, v1.1

Status: working model (7 Oct 2026, revised 9 Oct 2026 to match `apps/web/src/content/types.ts`, which mirrors it field for field). Supersedes the content-model section of the architecture review where they differ. Build target: Sanity (free plan), read by the Next.js site.

## Principles

1. **Each fact lives in one place.** Hours live on the Location. Which services a clinic offers lives on the Location. Which clinics a provider works at lives on the Provider. Pages derive everything else by query, so staff never type the same fact twice.
2. **No patient data.** No form submissions, no messages, no uploads from patients are stored in the CMS. Booking is an outbound link. Enquiries go to the clinic's email (1.3 in the questionnaire) through the form service, never into the CMS.
3. **Nothing on the site is hard-coded that a receptionist might need to change.** Hours, holiday closures, phone, notices, wait-time line, the booking link.
4. **Three languages, one source.** Text fields are translatable (EN, FR, PT). English is required; a page shows English for any field not yet translated, with a small "This page is partly in English" note. Nothing blocks launch on translation.
5. **Compliance built in.** Provider profiles carry an approval record (who approved, when). There is no testimonial type (CPSO advertising rules). No field for superlatives or comparisons.
6. **Draft until approved.** Service, FAQ, Page and Post carry a review status (`draft` / `approved`). Production shows only approved records; preview builds (`SHOW_DRAFTS=true`) show drafts with a "Draft" marker. Nothing written by Kempyre reaches patients until the clinic has approved it.
7. **One slug per record, shared by all languages.** `/en/services/walk-in`, `/fr/services/walk-in`, `/pt/services/walk-in`. Simpler for staff, for links and for the language switch; translated slugs can come later if ever needed.

## Record types (7)

### 1. Site settings (single record, admin only)
| Field | Type | Notes |
|---|---|---|
| Clinic name, legal name | text | "Pegasus Medical Centre" |
| Former name | text | "York Health Choice Centre". Shown on the About page and as `alternateName` in structured data during the rebrand; blank once the old name is forgotten. |
| Patient phone | phone | 416 656 7272 (main), typed as displayed; the site derives the `tel:` link. Per-location phone overrides below. |
| Enquiry email | email | Awaiting 1.3. Never the owner's personal address. |
| Booking URL | url | Global; the Book button everywhere points here. Changeable without a developer (per DueSpace blueprint). Blank = Book button shows "Call to book". |
| Emergency wording | text ×3 langs | Default: "If you are experiencing a medical emergency, call 911 or go to the nearest emergency department." (7.1) |
| Show Health811 line | boolean | 7.3 |
| Privacy contact | name, role, phone, email | PHIPA (7.4). Shown on Privacy page. |
| Languages enabled | EN / FR / PT toggles | Lets us launch EN+PT before FR is ready. |
| Announcement bar | text, link, on/off, start/end dates | e.g. "Flu shots available from …" or "Closed Monday for Thanksgiving". |
| Footer text, social links | text ×3, list of label + url | Footer tagline; social links are optional |
| Homepage | hero headline ×3, hero intro ×3, hero image + alt, services heading ×3, welcome heading ×3, welcome text ×3 | The homepage's own words. Everything else on the homepage is derived from the other records. |
| Default SEO | title suffix, description ×3, share image | Description must not repeat the phone or address (those come from Location). |

### 2. Location
| Field | Type | Notes |
|---|---|---|
| Name, slug | text ×3, slug | Public name TBC with client (shown as "[York clinic]" until confirmed) |
| Status | open / opening soon / closed | "Opening soon" allows a Mississauga page later without showing hours. |
| Address | street, unit, neighbourhood, city, province, postal | 605 Rogers Road, Unit D5; neighbourhood York; city Toronto; ON M6M 1B9. Neighbourhood is separate so structured data gets `addressLocality: Toronto` and copy can say "in York". |
| Map point | lat/lng | For map embed and directions link |
| Phone, email | phone, email | Optional overrides of site settings |
| Regular hours | 7 rows: day, open, close, closed?, walk-in open, walk-in close, to be confirmed? | Mon–Fri 9:00–18:00, Sat 9:00–14:00, Sun TBC. Walk-in defaults to same as open. A row flagged "to be confirmed" renders in square brackets and makes "Open now" say hours are to be confirmed on that day rather than guessing. |
| Hours exceptions | list: date, closed? / open, close, note | Statutory holidays, early closes. Drives "Open until…" and the holiday notice. |
| Wait-time line | text, on/off | "About 25 minutes" style line. Only shown if the client approves publishing (4.4). |
| Parking | type (free on-site / paid / street / lot / none) + note | 4.7 |
| Accessibility | checklist: step-free, automatic door, elevator, accessible washroom, accessible parking + note | 4.8 |
| Transit note | text | "Bus 161 stops outside" |
| Services offered here | references → Service | **Single source of truth** for service-by-location. |
| Providers here | derived from Provider.locations | Not edited here. |
| Photos | exterior, reception, interior gallery, each with alt text ×3 and a "temporary" flag | From the photo shoot. The temporary flag marks stock stand-ins; the production build refuses them. |
| Intro paragraph | text ×3 | Optional, one paragraph |
| SEO | title, description | Local SEO per clinic |

### 3. Service
| Field | Type | Notes |
|---|---|---|
| Name, slug | text ×3, slug | Public name per 2.1 "preferred public name" |
| Status | live / planned / hidden | "Planned" shows in the quiet "coming later" line only and has no page. |
| Review | draft / approved | See principle 6. |
| Group | family medicine / walk-in / children / chronic / older adults / preventative / contraception / allied health / specialist | For the Services index and tabs ("For you and your family" / "For older adults"). |
| One-line summary | text ×3 | Used in lists; 120 characters max |
| Who it is for | text ×3 | |
| What to expect; what to bring; how long | text ×3 each | Three fields. Specific, uneven content per the design research |
| How to access | walk-in / appointment / both / referral needed | 2.3 |
| Coverage note | OHIP covered / private pay / depends + note | From section 5; shown only if 5.6 = yes |
| Body | rich text ×3 | Headings, lists, links; no embeds |
| Related FAQs | references → FAQ | |
| Related providers | derived from Provider.services | |
| Where you can get this | derived from Location.services | The "Where you can get this" block on the Service page. |
| Image + alt | image, alt ×3, temporary flag | |
| SEO | title, description | |

No per-location overrides in v1. If one clinic runs a service on different days, that goes in the Location's intro or hours exceptions. Revisit only if a real case appears.

### 4. Provider
| Field | Type | Notes |
|---|---|---|
| Full name, slug | text, slug | As it should appear |
| Title | text ×3 | "Family physician", "Nurse practitioner" |
| Credentials | list | MD, CCFP, …; regulatory college. Factual only. |
| Focus areas | text ×3 | |
| Languages spoken | list from fixed set: en, fr, pt, es, it, ar, zh, hi, ur, tl, pa, ta, so, other | Drives the language filter and "Speaks …" lines; labels for each code live in the site's dictionary |
| Portrait + alt | image, alt ×3, temporary flag | Arched crop handled by the site, not the editor |
| One line in their own voice | text ×3 | The quote on the homepage; optional |
| Biography | rich text ×3 | Optional (3.4) |
| Locations | references → Location | **Single source of truth** |
| Services | references → Service | |
| Accepting new patients | yes / no / waitlist / not shown | 4.5 |
| Status | published / draft | |
| Approval | approved by (name), date | Internal field, required before publish |
| SEO | title, description | |

### 5. FAQ
| Field | Type | Notes |
|---|---|---|
| Question, answer | text ×3 / rich text ×3 | From 7.7 and front desk |
| Category | visiting / booking / fees & coverage / services / languages / policies | For the Resources page |
| Related services, locations | references | Lets a Service page show its own FAQs |
| Show on homepage | boolean | The twelve-question block |
| Order | number | |
| Review | draft / approved | See principle 6. |

### 6. Page (general information)
Used for: About, New patients, Fees & coverage, Privacy, Accessibility statement, Terms. (The 404 page's words live in the site dictionary, not here.)
| Field | Type | Notes |
|---|---|---|
| Title, slug | text ×3, slug | |
| Review | draft / approved | See principle 6. |
| Hero image + alt | image, alt ×3, temporary flag | Optional |
| Sections | list of blocks: rich text, image, two-column text, steps list, FAQ group, call-to-action band | A small fixed set, so pages stay on-brand. |
| SEO | title, description | |

### 7. Post
| Field | Type | Notes |
|---|---|---|
| Type | notice / article | Notices are short and expire; articles are longer. |
| Review | draft / approved | See principle 6. |
| Title, slug, summary, body | text ×3 | |
| Date, expiry date | dates | Expired notices disappear automatically |
| Pinned | boolean | |
| Image + alt, link | image + alt ×3 + temporary flag, url | |
| Related services | references | |

## How the pages are fed

| Page | Reads |
|---|---|
| Homepage | Site settings, Location (hours, "open until"), Services where status = live, Providers (published, up to 3), FAQs with "show on homepage", pinned Posts |
| Services index | Services grouped by Group; planned ones in the quiet line |
| Service page | Service + derived locations + derived providers + related FAQs |
| Locations index / Location page | Location + its services + derived providers + exceptions |
| Our doctors / Provider page | Providers (published and approved) + locations + services |
| Resources / FAQs | FAQs by category, Posts |
| About, New patients, Fees, Privacy… | Page |
| Contact | Site settings + Locations; the form posts to the form service, not the CMS |

"Open now, until 6:00 p.m." is computed on the site from regular hours + exceptions, in Toronto time, never typed by staff. Post expiry is also judged against the Toronto date.

## People and permissions (2 roles)

- **Editor** (clinic manager, front desk): edit Location hours and exceptions, announcement bar, Posts, FAQs, Provider text (not approval), Service text. Can publish those.
- **Admin** (owner, Kempyre): everything above plus Site settings (booking URL, emergency wording, privacy contact), Provider approval, creating or removing Locations and Services, user accounts.

How this is enforced: Sanity's free plan has two roles (Administrator, Editor) and no per-field permissions. Site settings and Provider approval are kept out of the Editor's way through the Studio's structure (they are not listed in the Editor's menu) and by convention, not by a hard permission. If the clinic later needs it enforced, the Growth plan adds custom roles; the model does not change.

## Translation workflow

- Field-level translations on every text field (EN, FR, PT), edited side by side.
- All three languages are built from the start. A language is shown to the public only if enabled in Site settings; a disabled language's addresses return "not found". Enabling FR or PT requires a native-speaker review of the shell text and the essentials pages first (the Kempyre drafts are marked "native review pending"). Launch plan: EN at launch; PT and FR enabled as each review completes.
- Fallback to English per field, with a visible "This page is partly in English" note at the top of any page where a field fell back. No machine translation in v1.

## Still needed from the client before this is final

Booking method and link (4.1–4.2); enquiry email (1.3); services live at launch and public names (2.1–2.2); provider details (3); parking and accessibility (4.7–4.8); whether coverage and fees are published (5.6, 5.9); privacy contact (7.4); common questions (7.7).

## Changes in v1.1 (9 Oct 2026)

- Added: review status on Service, FAQ, Page, Post; Site settings former name and Homepage fields; Location neighbourhood and "to be confirmed" on hours rows; temporary flag on every image; fixed set of spoken languages; three separate "what to expect / bring / how long" fields; one slug per record; the fallback-note rule; the role-enforcement note; the language-enabling rule.
- Removed: "404 text" from Page (dictionary instead); `tel:` links as a field (derived from the displayed phone).

## Changes from the architecture review

- Removed the per-location override list on Service.
- Added hours exceptions, announcement bar, wait-time line, accessibility checklist, provider approval record, Post expiry.
- Made Location.services and Provider.locations the single owners of their relationships.
- Added "Planned" and "Opening soon" statuses so future services and the Mississauga clinic can exist in the CMS without being public.
