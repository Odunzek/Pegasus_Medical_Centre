# Pegasus Medical Centre: website design system (v3, direction C)

This is the design the website is built from, decided 9 October 2026 after the homepage options review. It replaces the v2 system (Montserrat-only, 8px radius, filled buttons). The values here are the ones implemented in `apps/web/src/app/globals.css` and listed in `tokens.json`; `CLAUDE.md` carries the short non-negotiable form. If this document and the CSS ever disagree, fix the CSS.

The reference layouts are on the Kempyre design canvas (`OptionC` desktop 1440 and `PhoneC` 390): https://claude.ai/artifact/RgLRqq7BfdzKa8sVDrfz9g

## Who it is for

Pegasus Medical Centre is a family medicine and walk-in clinic. Many patients are older, some are unwell or worried, and some prefer French or Portuguese. Every screen is calm, clear and easy: large type, strong contrast, plain words, generous space, real photographs. When a choice is between striking and easy, choose easy.

## The look in one paragraph

Editorial, not template. A full-width photograph with one serif headline and one clear action. Content in uneven, considered layouts rather than equal card grids: lists with hairlines, a floating card, arched portraits, photographs with one large rounded corner. Deep Teal bands for the header, the team and the footer; white everywhere else; one cream panel per page at most. No rectangular buttons anywhere.

## Colour

Five colours on the website: Deep Teal `#003D3A`, Teal `#2E7D6B`, Soft Green `#8FBC8F`, Pale Neutral `#E6EEE9`, white. Black exists only in the print and one-colour logo files.

- Deep Teal is the ink: all text and headings on white, and the ground of the dark bands.
- Teal is the response: links and row titles turn Teal on hover; the focus ring on white and Pale Neutral is Teal.
- Soft Green is the accent: circle-arrow fills, hairlines and rules, uppercase labels on Deep Teal, the focus ring on Deep Teal. Never text on white (2.15:1).
- Pale Neutral is the one cream band a page may have.
- The only gradient on the site is the photo shade in the hero (Deep Teal, bottom and left). The only drop shadow is under the floating quick-action card.
- The feather-line pattern from the brand package may sit at 7% opacity on one band per page, never under text at its busiest.

| Text on background | Contrast | Use |
| --- | --- | --- |
| Deep Teal on white | 12.15:1 | all text |
| Deep Teal on Pale Neutral | 10.28:1 | all text |
| White on Deep Teal | 12.15:1 | all text |
| Soft Green on Deep Teal | 5.64:1 | labels, small print on dark bands |
| Teal on white | 4.93:1 | hover text; focus ring (non-text, needs 3:1) |
| Soft Green on white | 2.15:1 | decoration only |

## Type

Two families. **Lora** (500, with 400, 600 and italic available) for h1–h3, the primary actions and the occasional pull quote. **Montserrat** (400–700, from the brand package) for everything else. Both are self-hosted from `apps/web/src/fonts`; no third-party font requests.

| Role | Desktop | Phone |
| --- | --- | --- |
| h1 | 64/70 Lora 500 | 40/46 |
| h2 | 44/52 Lora 500 | 32/40 |
| h3 | 30/38 Lora 500 | 24/32 |
| Primary action | 30/36 Lora 500 | 24/29 |
| Body | 19/30 Montserrat 400 | 17/27 |
| Menu | 17/24 Montserrat 500 | same |
| Label | 16/20 Montserrat 600, uppercase, 0.08em | same |
| Small | 16/24 Montserrat 400 | same |

Nothing a patient reads is smaller than 16px. Headings are sentence case, never skip a level, one h1 per page. If text does not fit, shorten it; never shrink it.

## Actions

There are no rectangular buttons.

- **Primary action:** Lora text beside a 64px Soft Green filled circle with a 26px arrow. Hover: the text underlines in Soft Green, the circle scales 1.06 and turns white on photos and dark bands or Deep Teal on white. One primary action per screen.
- **Secondary action:** Montserrat 600 text beside a 48px circle outlined 2px Soft Green. Hover: the circle fills Soft Green and the arrow nudges right.
- **Row links** (a service row, a question, a quick-action tile) are whole-row links that end in an outlined circle; the circle responds to hover anywhere on the row.
- **The one-Book rule.** The hero's Book is the only Book on the opening screen (`data-hero-book`). The header's Book link and the phone's Book/Call bar appear only once it has scrolled out of view. Inner pages show them from the start.
- "Book an appointment" becomes "Call to book" (dialling the clinic) while the booking link in Site settings is blank.

## Shape

Pills and circles. The quick-action card has 28px corners. Strip photographs have one large rounded corner (160px desktop, 80px phone), always the same corner within a row. Provider portraits are arched: `border-radius: 999px 999px 24px 24px`. Circles: `9999px`. No other radii.

## Layout and space

- Gutters 64px on desktop, 20px on phone. Container 1440px. Running text within 720px.
- Sections 128px top and bottom on desktop, 56px on phone.
- Header 88px (64px on phone), Deep Teal, sticky. Under 1280px the nav folds into a full-screen menu. Under 768px the Book/Call bar (80px) is pinned to the bottom.
- Reference widths: 1440 and 390. Phone first: every section must read in one column at 390px; photographs and the team become horizontal swipe rows rather than stacking.
- No equal-height card grids. Lists are separated by Soft Green hairlines.

## Motion

Sections rise 24px and fade in once as they enter the viewport. The hero's headline, intro and actions rise in sequence (100/220/340ms). Circle arrows respond in 200ms; photographs zoom 1.035 over 600ms on hover. Everything above is off under `prefers-reduced-motion: reduce`.

## Accessibility (WCAG 2.2 AA, AODA)

- Text contrast ≥ 4.5:1 using only the pairs in the colour table. Focus ring 3px solid, 3px offset: Teal on light grounds, Soft Green on Deep Teal.
- Every tap target at least 44×44px; 48px is the standard size.
- Every interactive element is a real `<a>` or `<button>` with a visible focus state; the phone menu is a native `<dialog>` so focus stays inside and Esc closes it.
- In-text links are always underlined. Menu, footer and row links are not underlined at rest and underline on hover; their shape and position make them obvious.
- Nothing is explained by hover or colour alone; every icon has a word beside it.
- Headings in order, landmarks (`header`, `nav`, `main`, `footer`), a skip link, `lang` on the `html` element in each language.

## Logo, icons and graphics

- Logo files are the brand package v1.4 SVGs (spelling CENTRE) in `apps/web/public/brand/`, with the print clear space cropped for the web. Use the `Logo` component; never redraw, recolour or retype. White on Deep Teal and photos; full colour on white; the compact cut on phones.
- Website icons are drawn inline as SVG in `Icon.tsx` on the brand's 48-unit grid with a 3-unit round-capped line, so they take the text colour wherever they sit (decided 9 October 2026 in place of the supplied three-ink PNG/SVG files, which cannot be recoloured). Always paired with a word.
- Supporting graphics from the brand package: the feather-line pattern (see Colour). The brand arc, leaf accent and divider rule are available but unused in direction C.

## Photography

Real photographs of the clinic, its rooms and its own team, with consent, in natural light. Until they exist the site uses labelled stock stand-ins from `apps/web/public/temp-photos/`, each marked `temporary: true` in the content and badged "Temporary photo" on the page; the production build fails if one is still referenced outside sample content. The shot list is in `docs/launch-checklist.md`.

## Voice

Words follow `docs/voice-and-content-guide.md`.
