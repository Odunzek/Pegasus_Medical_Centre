> **Direction C (decided 9 October 2026) supersedes parts of this document.** The website is built from the editorial homepage on the design canvas: Lora 500 for headlines and primary actions with Montserrat for everything else; **no rectangular buttons** (primary action = Lora text + 64px soft-green filled circle arrow, secondary = text + 48px outlined circle); pills, circles and arched portraits; one large rounded corner per strip photo; full-bleed hero photo with a bottom-left shade; 64px gutters and 128px sections on desktop (20px / 56px on phones); lists with rules, not card grids; a feather texture at 7% on one band. The rules in `CLAUDE.md` are the current word; the colour, accessibility, content, logo and icon sections below still apply. The implementation lives in `apps/web/src/app/globals.css` and `apps/web/src/components/`.

Pegasus Medical Centre is a family medicine and walk-in clinic. Many of its patients are older, some are unwell or worried, and some prefer French or Portuguese. Every screen is built to be calm, clear and easy to use: large type, strong contrast, plain words and generous space. When a choice is between striking and easy, choose easy.

## Content fundamentals

- **Voice:** warm, plain and reassuring, like a good family doctor explaining something. Speak to the patient as "you" and about the clinic as "we" ("Our family doctors and nurses are here for every age").
- **Short and literal.** One idea per sentence. Say what happens and what to do next. No jargon, no puns, no exclamation marks in body copy.
- **Sentence case everywhere**: headings, buttons, menus ("Book an appointment", not "Book An Appointment"). Spaced capitals only for short labels such as MEDICAL CENTRE in the logo.
- **Canadian spelling:** centre, colour, organise. The name is always **Pegasus Medical Centre**, never "Center".
- **Buttons start with a verb** and say where they lead: "Book an appointment", "Call the clinic", "Get directions".
- **Numbers people use are written in full:** phone numbers as (555) 555-0123, times as 8:00 a.m. to 6:00 p.m., dates as Monday, October 5.
- **Every claim stays true for the clinic.** Ontario rules for health advertising apply: no "best", no guarantees, no invented statistics or testimonials.
- **No emoji** and no decorative symbols.
- **Three languages:** English first; French and Portuguese versions are checked by a native speaker before use. Mark each passage with its language (`lang="fr-CA"`, `lang="pt-PT"`).
- **Placeholders:** until the clinic confirms its details, use (555) 555-0123, name@pegasusmedicalcentre.ca and "Street address, City, Ontario Postal code", and never present them as real.

Real copy to follow:

> Care for the whole family
> Book an appointment, walk in, or call us. Our family doctors and nurses are here for every age.
> How can we help today?
> Everyone is welcome here
> Care close to home

French: *Des soins pour toute la famille, à chaque étape de la vie.* Portuguese: *Cuidados de saúde para toda a família, em cada fase da vida.*

## Accessibility for older patients

These rules come before any other design choice.

- Set running text in `body` (19px; `body-mobile` 18px on phones). Nothing anywhere is smaller than `small` (16px).
- Left-align text. Keep lines within `measure` (720px, about 70 characters).
- Underline every link, in every state.
- Make everything a person taps at least `tap-target` (48px) in both directions; buttons are `button-height` (56px).
- Show a `focus` ring (3px solid, `focus-offset` 2px) on every interactive element; on `surface-inverse` use `focus-on-inverse`.
- Use only the text and background pairs named in the colour tokens' notes (all 4.5:1 or better for text).
- Never let colour alone carry meaning: pair it with a word or an icon, and every icon with a word.
- Prefer showing what is missing over disabling a button.

## Colour

Six colours only: `deep-teal`, `teal`, `soft-green`, `pale-neutral`, `white` and `black`. No tints, no greys, no other hues, no gradients (the only blend in the brand is inside the logo).

- **White pages, Deep Teal words (decided 30 September 2026).** Most of every page is `surface` (white). `text` (Deep Teal) carries headings, body copy, links and the filled button, so type reads solid rather than faint. `soft-green` draws the leaves, hairlines, dividers and card borders. `surface-alt` (Pale Neutral) appears in one panel per page (the Visit us panel on the homepage); `surface-inverse` (Deep Teal) is the footer only.
- **Teal is the response colour.** Links, menu items, outline buttons and card borders turn Teal (`link-hover`) on hover; the filled button turns Teal; the focus ring is Teal. Small marks (the open-now dot, the ring motif) may be Soft Green or Teal.
- Build pages from the role tokens (`surface`, `text`, `action`…), not the brand names, so every pairing is a readable one.
- Text on `surface` and `surface-alt`: `text` (Deep Teal). Text on `surface-inverse`: `text-on-inverse`, with `text-accent-on-inverse` for labels.
- Because body text and links are the same colour, links are always underlined: the underline is what marks them.
- `soft-green` is never text on white or Pale Neutral. `teal` is never text on Deep Teal.
- `border` (Soft Green) is decoration only. Anything a person must see to use the page (form fields, checkboxes) takes `border-strong` at `border-width-control`.

| Text on background | Contrast | Use |
| --- | --- | --- |
| Deep Teal on white | 12.15 : 1 | All text |
| Deep Teal on Pale Neutral | 10.28 : 1 | All text |
| White on Deep Teal | 12.15 : 1 | All text |
| White on Teal | 4.93 : 1 | All text |
| Teal on white | 4.93 : 1 | Hover and focus states, small marks |
| Soft Green on Deep Teal | 5.64 : 1 | All text |
| Teal on Pale Neutral | 4.17 : 1 | Large text only (24px, or 19px bold) |
| Soft Green on white | 2.15 : 1 | Not for text: decoration only |

## Typography

One family: **Montserrat**, from the files in `fonts/` (fallback Arial, Helvetica).

- **SemiBold 600:** headings and buttons. **Medium 500:** navigation and labels. **Regular 400:** body text. **Bold 700:** short emphasis inside a sentence only.
- Desktop: `heading-1` 56/62, `heading-2` 40/48, `heading-3` 26/34, `intro` 22/34, `body` 19/30. Under 768px switch to the `-mobile` styles (40/46, 32/40, 24/32, 20/31, 18/29).
- `button` and `menu` are 18px on every screen; `label` and `small` are 16px, the floor.
- One `heading-1` per page. Headings never skip a level.
- If text does not fit, shorten it; never make it smaller.

## Layout and spacing

- Centre content in `container-max` (1320px) with `page-gutter` (40px) side padding on desktop and `page-gutter-mobile` (20px) on phones: 100px from the screen edge at 1440px. Use `.pg-wrap` for every band and `.pg-section` for the vertical rhythm.
- Pad sections `space-9` top and bottom on desktop, `space-8` on phones. Separate blocks inside a section by `space-7`.
- Keep section grounds white (`surface`). Separate sections with the `Divider` lens rule, never coloured bands; `surface-alt` for one panel per page and `surface-inverse` for the footer only.
- **One Book button at a time.** The opening carries the big one; the header's (`SiteHeader showBook`) and the phone bar appear only once the opening's button has scrolled away. Inner pages show the header one from the start. Never a Book tile in the help row.
- Cards sit in a grid with `space-5` gutters: three across on desktop, two on tablets, one on phones. Pad cards `space-6` on desktop and `space-5` on phones.
- Design phone-first: every section must read in a single column at 390px wide.

## Shape, borders and depth

- The brand is flat. Separate things with `surface-alt` or a 1px `border`, never with drop shadows or glows.
- Corners: one radius for everything, `radius-sm` (8px): buttons, tiles, cards, panels, fields and photos (chosen after comparing square, 4px and 8px). `radius-round` for circles only: the video ring, provider photos, step numbers.
- No coloured left-border cards, no outlines around text blocks.

## Logo

Use the files in the Logos group exactly as supplied: never redraw, recolour, stretch, rotate, outline or add effects, and never retype the name in another font. Each file already includes its clear space, so it can sit edge to edge with other elements (the small and micro marks are trimmed to the ring).

- **Header on white:** `pegasus-horizontal-full-colour.svg`, at least 250px wide (the file about 290px). On narrow screens use `pegasus-horizontal-compact-full-colour.svg` at 180px or wider.
- **On Deep Teal** (header bands, footer): the `-reversed-colour` files, or the `-white` files.
- **On Pale Neutral or Soft Green:** the `-deep-teal` files. **On Teal and on photos:** the `-white` files only, placed on a calm dark area.
- **Emblem alone:** the full emblem from 80px up; `pegasus-emblem-small-*` from 40 to 79px; `pegasus-emblem-micro-*` from 16 to 39px (browser tabs and tiny icons).
- The Pegasus logo comes first (left or top) on Pegasus pages. Never place the logo inside another shape or on a busy pattern.

## Iconography

The ten website icons (Appointments, Services, Location, Providers, Contact, About, FAQs, Resources, Language, Home) are drawn on one 48 × 48 grid with a 3-unit line and rounded ends and corners.

- Always pair an icon with its word; an icon is never the only way something is explained.
- Smallest size `icon-sm` (24px), also the size inside buttons and links; `icon-md` (32px) beside menu items and contact details; `icon-lg` (48px) on service cards.
- Each icon comes in three inks because an `<img>` cannot be recoloured: `-teal` on `surface` (matching the Teal text), `-deep-teal` on `surface-alt`, `-white` on `surface-inverse`.
- The four pillar icons (People, Wellbeing, Care, Progress) are proposed and not yet approved: do not use them on the site until the clinic approves them.
- No emoji, no icon fonts, no other icon sets.

## Supporting graphics

Four shapes taken from the emblem. Use one per layout, in brand colours only.

- **Brand arc:** the ring on its own, cropped large on Deep Teal bands and covers. Never with the full logo on top of it.
- **Leaf accent:** the top feather, small beside a heading or as a list marker (the LeafList component).
- **Divider rule:** a slim lens between sections (the Divider component). Never thicker than drawn.
- **Feather-line pattern:** backgrounds only, with no text over its busiest part.

## Imagery

- Use real photos of the clinic, its rooms and its team, with everyone's consent. Until they exist, use a plain `surface-alt` block, never stock photos of models posing as doctors.
- Photos are calm and natural: real light, real people, no heavy filters.
- Round photo corners with `radius-md`; provider portraits may be circles (`radius-round`).
- Put text on a solid band beside or below a photo, not over a busy part of it.

## Components

- **Button:** the only way to trigger an action. `primary` (Deep Teal fill, `arrow` for Book) for the one main action in a section, `secondary` (outline) beside it; `inverse` and `inverse-secondary` on Deep Teal. The second action in the opening is a plain underlined call link, not a second box.
- **ArrowLink:** the "see all" link with the nudging arrow, after sections and inside cards.
- **TextLink:** underlined links inside and after text.
- **SectionHeading:** leaf eyebrow, heading-2, lead and the section link; the top of every section.
- **HelpTile, ServiceCard, DoctorCard:** the three card types; all lift 4px and turn their border Teal on hover.
- **Accordion:** questions and answers (native details/summary).
- **SiteHeader, PhoneBar, SiteFooter:** the frame of every page.
- **IconLabel:** a website icon with its word, for menus, contact details and service lists.
- **LeafList:** short lists with the leaf accent as the marker.
- **Divider:** the lens rule between sections.

Forms and the Locations map card are added when the Contact and Locations pages are designed; build them from these tokens and rules.

## Motion

- On load, the opening fades and rises into place (600ms, staggered 80 to 900ms). The headline's second line rotates through three phrases every 3.5 seconds. The brand ring behind the clinic video turns once per 90 seconds and stops when the video is paused.
- The clinic video loops silently; clicking or tapping it pauses it, with a Pause / Play hint on hover and while paused.
- Hover: tiles and cards lift 4px and their border turns Teal; arrows nudge 4px; menu items draw a Soft Green underline.
- Everything honours `prefers-reduced-motion`: no fade, rotation or lift, and the first headline phrase stays put.

## States

- **Hover:** primary buttons fill with `action-hover`; secondary buttons and links darken to `text-strong`, links with a thicker underline.
- **Focus:** the `focus` ring (or `focus-on-inverse`) on every interactive element, never removed.
- **Pressed:** as hover. **Visited links:** unchanged.
- **Motion:** see Motion above. Nothing autoplays with sound; nothing moves on its own after the first second except the slow ring and the silent video.

## Using the system in a page

For the website, or a design canvas:

1. Load Montserrat from the files in `fonts/` with one `@font-face` per weight (Regular 400, Medium 500, SemiBold 600, Bold 700, and their italics), family name "Montserrat".
2. Link `components/bundle.css`. It defines every token as a CSS variable named as in `tokens.json` (`var(--teal)`, `var(--surface)`, `var(--text)`, `var(--space-5)`, `var(--font-sans)`) and styles the components.
3. Load React 18, then `components/bundle.js`. The components are on `window.Pegasus`: `Button`, `ArrowLink`, `TextLink`, `IconLabel`, `LeafList`, `Divider`, `SectionHeading`, `HelpTile`, `ServiceCard`, `DoctorCard`, `Accordion`, `SiteHeader`, `PhoneBar` and `SiteFooter`. Their props are in `components/index.d.ts`.
4. Use the logos, icons and graphics as the supplied files (`<img>`), never redrawn.
