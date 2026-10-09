# Client facts from the discovery questionnaire (4 Oct 2026)

Source: Client Information & SEO Discovery Questionnaire, completed by the clinic owner on 2026-10-04 (partial; most checkboxes not ticked, answers typed as text). Keep this file current as answers arrive; the website and CMS content are built from it.

## Confirmed (safe to publish)

- **Clinic address:** 605 Rogers Road, Unit D5, York, Toronto, Ontario M6M 1B9
- **Patient phone:** 416 656 7272
- **Hours:** Monday to Friday 9:00 a.m. – 6:00 p.m., walk-in open during these hours. Saturday 9:00 a.m. – 2:00 p.m., walk-in also. Sunday: TBC. Statutory holidays: TBC.
- **Locations at launch:** one ("for now").
- **Future locations:** Toronto and Mississauga under discussion. Not for publication.
- **Area served:** Toronto.
- **Services:** launch focus is family medicine and walk-in care. Areas of care named in discovery: chronic disease management, age-related health, children's health care, lifestyle and preventative health, contraception and related ongoing care, acute illness / general walk-in. Planned: physiotherapy, cardiology, internal medicine, dietetics.
- **Before booking (2.3):** "Open gates to all."
- **Patients without OHIP (5.2):** private pay.
- **Private-pay services (5.8):** list to be completed.

## Not answered yet

| Ref | Item | Blocks |
|---|---|---|
| 1.3 | Email address for patient enquiries | Contact page, enquiry form routing |
| 1.5 | Evening / weekend hours (checkbox) | Hours wording |
| 2.1 / 2.2 | Which services are live at launch; public names | Services list and Service pages |
| 3.1 – 3.5 | Provider profiles: names, titles, qualifications, languages, headshots, bios, approvals | Our doctors, provider profiles, homepage team section |
| 4.1 – 4.3 | Walk-in vs appointments; how patients book (online link?); phone/video | What the Book button does; booking URL in the CMS |
| 4.4 | Typical waiting times (publishable?) | Wait-time line |
| 4.5 | Accepting new patients for an ongoing family doctor? | New-patient wording |
| 4.6 | How follow-up care is arranged | "Continuity" copy |
| 4.7 / 4.8 | Parking; physical accessibility | Location page |
| 4.9 | Interpreter support; other languages | Language wording |
| 5.1, 5.3 – 5.7, 5.9 – 5.11 | OHIP coverage, private insurance, direct billing, IFHP, whether to publish coverage, fee list, payment timing, policies | Fees & coverage page, FAQs |
| 6.1 – 6.4 | Google Business Profile, reviews, competitors, existing assets | Local SEO setup |
| 7.1 – 7.7 | Emergency wording, Health811, privacy contact (PHIPA), privacy statement, clinic policies, common questions | Strip/footer wording, Privacy page, FAQs |
| 8.1 / 8.2 | Update contacts; changes expected in 12 months | Maintenance arrangement |

## The rebrand and existing listings (found 9 Oct 2026, to confirm with the client)

Pegasus Medical Centre is the new name of the clinic that operates today as **York Health Choice Centre (walk-in clinic and family practice)** at the same address and phone.

- **Google Business Profile** exists under the old name: 3.8 stars, 16 reviews, listed as unclaimed. For the rebrand it is claimed and **renamed**, never recreated, so reviews and map position carry over. Needs the client to confirm ownership or to grant access.
- **Hours on the listings** (Google, ClinicFinder, checked September 2026): Monday to Friday 9:00 a.m. to 5:00 p.m., Saturday 9:00 a.m. to 1:00 p.m., Sunday closed. The questionnaire says 9:00 to 6:00 and 9:00 to 2:00. **One of these is wrong**; the site, the Profile and every directory must agree.
- A **Cortico** patient-engagement page exists for the clinic, marked "pending setup" (https://york-health-choice-centre.cortico.ca/). This may be the booking system the Book action should point to (questionnaire 4.2).
- Other directories carrying the old name: ClinicFinder.ca, Waze, the Government of Canada yellow-fever vaccination centre list (if the clinic is on it). Each is updated at launch (`docs/launch-checklist.md`, section E).
- **Domain**: DueSpace's blueprint named `pegasusmedicalcenter.ca` (Center) as canonical. The brand is Centre. The canonical domain and the redirect list are an open decision (launch checklist A1). Whether the old clinic had a website or domain is unknown (A2).
- Whether the site says "formerly York Health Choice Centre" publicly is the client's call (A8).

## Consequences for the build

- Homepage and Location show **one clinic** (York, Toronto) with the real address, phone and hours.
- Multi-location structure stays in the CMS; nothing about expansion is published.
- Provider content stays as placeholders until Section 3 is returned and each profile is approved.
- Never publish a personal email address; patient enquiries need the clinic inbox from 1.3.
- Structured data carries `alternateName: York Health Choice Centre` while the rebrand is recent (Site settings → Former name), so search engines connect the two.
- Photographs: all current images are stock stand-ins flagged `temporary`; the shot list and consent rule are in `docs/launch-checklist.md`, section C.
