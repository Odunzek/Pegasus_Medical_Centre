# Pegasus Medical Centre: CMS content model, v1

Status: draft for discussion (7 Oct 2026). Supersedes the content-model section of the architecture review where they differ. Build target: Sanity (free plan), read by the Next.js site.

## Principles

1. **Each fact lives in one place.** Hours live on the Location. Which services a clinic offers lives on the Location. Which clinics a provider works at lives on the Provider. Pages derive everything else by query, so staff never type the same fact twice.
2. **No patient data.** No form submissions, no messages, no uploads from patients are stored in the CMS. Booking is an outbound link. Enquiries go to the clinic's email (1.3 in the questionnaire) through the form service, never into the CMS.
3. **Nothing on the site is hard-coded that a receptionist might need to change.** Hours, holiday closures, phone, notices, wait-time line, the booking link.
4. **Three languages, one source.** Text fields are translatable (EN, FR, PT). English is required; a page shows English for any field not yet translated, with a small "This page is partly in English" note. Nothing blocks launch on translation.
5. **Compliance built in.** Provider profiles carry an approval record (who approved, when). There is no testimonial type (CPSO advertising rules). No field for superlatives or comparisons.

## Record types (7)

### 1. Site settings (single record, admin only)
| Field | Type | Notes |
|---|---|---|
| Clinic name, legal name | text | "Pegasus Medical Centre" |
| Patient phone | phone | 416 656 7272 (main). Per-location phone overrides below. |
| Enquiry email | email | Awaiting 1.3. Never the owner's personal address. |
| Booking URL | url | Global; the Book button everywhere points here. Changeable without a developer (per DueSpace blueprint). Blank = Book button shows "Call to book". |
| Emergency wording | text ×3 langs | Default: "If you are experiencing a medical emergency, call 911 or go to the nearest emergency department." (7.1) |
| Show Health811 line | boolean | 7.3 |
| Privacy contact | name, role, phone, email | PHIPA (7.4). Shown on Privacy page. |
| Languages enabled | EN / FR / PT toggles | Lets us launch EN+PT before FR is ready. |
| Announcement bar | text, link, on/off, start/end dates | e.g. "Flu shots available from …" or "Closed Monday for Thanksgiving". |
| Footer text, social links | text, urls | |
| Default SEO | title suffix, description, share image | |

### 2. Location
| Field | Type | Notes |
|---|---|---|
| Name, slug | text | "York clinic" (public name TBC with client) |
| Status | open / opening soon / closed | "Opening soon" allows a Mississauga page later without showing hours. |
| Address | street, unit, city, province, postal | 605 Rogers Road, Unit D5, York, Toronto ON M6M 1B9 |
| Map point | lat/lng | For map embed and directions link |
| Phone, email | phone, email | Optional overrides of site settings |
| Regular hours | 7 rows: day, open, close, closed?, walk-in open, walk-in close | Mon–Fri 9:00–18:00, Sat 9:00–14:00, Sun TBC. Walk-in defaults to same as open. |
| Hours exceptions | list: date, closed? / open, close, note | Statutory holidays, early closes. Drives "Open until…" and the holiday notice. |
| Wait-time line | text, on/off | "About 25 minutes" style line. Only shown if the client approves publishing (4.4). |
| Parking | type (free on-site / paid / street / lot / none) + note | 4.7 |
| Accessibility | checklist: step-free, automatic door, elevator, accessible washroom, accessible parking + note | 4.8 |
| Transit note | text | "Bus 161 stops outside" |
| Services offered here | references → Service | **Single source of truth** for service-by-location. |
| Providers here | derived from Provider.locations | Not edited here. |
| Photos | exterior, reception, interior gallery, each with alt text | From the photo shoot. |
| Intro paragraph | text ×3 | Optional, one paragraph |
| SEO | title, description | Local SEO per clinic |

### 3. Service
| Field | Type | Notes |
|---|---|---|
| Name, slug | text ×3 | Public name per 2.1 "preferred public name" |
| Status | live / planned / hidden | "Planned" shows in the quiet "coming later" line only. |
| Group | family medicine / walk-in / children / chronic / older adults / preventative / contraception / allied health / specialist | For the Services index and tabs ("For you and your family" / "For older adults"). |
| One-line summary | text ×3 | Used in lists; 120 characters max |
| Who it is for | text ×3 | |
| What to expect / what to bring / how long | text ×3 | Specific, uneven content per the design research |
| How to access | walk-in / appointment / both / referral needed | 2.3 |
| Coverage note | OHIP covered / private pay / depends + note | From section 5; shown only if 5.6 = yes |
| Body | rich text ×3 | Headings, lists, links; no embeds |
| Related FAQs | references → FAQ | |
| Related providers | derived from Provider.services | |
| Where you can get this | derived from Location.services | The "Where you can get this" block on the Service page. |
| Image + alt | image | |
| SEO | title, description | |

No per-location overrides in v1. If one clinic runs a service on different days, that goes in the Location's intro or hours exceptions. Revisit only if a real case appears.

### 4. Provider
| Field | Type | Notes |
|---|---|---|
| Full name, slug | text | As it should appear |
| Title | text ×3 | "Family physician", "Nurse practitioner" |
| Credentials | list | MD, CCFP, …; regulatory college. Factual only. |
| Focus areas | text ×3 | |
| Languages spoken | list from fixed set | Drives the language filter and "Speaks …" lines |
| Portrait + alt | image | Arched crop handled by the site, not the editor |
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

### 6. Page (general information)
Used for: About, New patients, Fees & coverage, Privacy, Accessibility statement, Terms, 404 text.
| Field | Type | Notes |
|---|---|---|
| Title, slug | text ×3 | |
| Hero image + alt | image | Optional |
| Sections | list of blocks: rich text, image, two-column text, steps list, FAQ group, call-to-action band | A small fixed set, so pages stay on-brand. |
| SEO | title, description | |

### 7. Post
| Field | Type | Notes |
|---|---|---|
| Type | notice / article | Notices are short and expire; articles are longer. |
| Title, slug, summary, body | text ×3 | |
| Date, expiry date | dates | Expired notices disappear automatically |
| Pinned | boolean | |
| Image + alt, link | image, url | |
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

"Open now / open until 6:00 p.m." is computed on the site from regular hours + exceptions, in Toronto time, never typed by staff.

## People and permissions (2 roles)

- **Editor** (clinic manager, front desk): edit Location hours and exceptions, announcement bar, Posts, FAQs, Provider text (not approval), Service text. Can publish those.
- **Admin** (owner, Kempyre): everything above plus Site settings (booking URL, emergency wording, privacy contact), Provider approval, creating or removing Locations and Services, user accounts.

## Translation workflow

- Field-level translations on every text field (EN, FR, PT), edited side by side.
- A language is shown to the public only if enabled in Site settings. Plan: launch EN and PT, enable FR when the essentials pages are translated.
- Fallback to English per field, with a visible note on the page. No machine translation in v1.

## Still needed from the client before this is final

Booking method and link (4.1–4.2); enquiry email (1.3); services live at launch and public names (2.1–2.2); provider details (3); parking and accessibility (4.7–4.8); whether coverage and fees are published (5.6, 5.9); privacy contact (7.4); common questions (7.7).

## Changes from the architecture review

- Removed the per-location override list on Service.
- Added hours exceptions, announcement bar, wait-time line, accessibility checklist, provider approval record, Post expiry.
- Made Location.services and Provider.locations the single owners of their relationships.
- Added "Planned" and "Opening soon" statuses so future services and the Mississauga clinic can exist in the CMS without being public.
