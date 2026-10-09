---
name: new-page
description: Build or revise a page template for the Pegasus website (Services index, Service, Location, Provider, Resources, Page). Use whenever asked to create, design or implement a page or section of the site.
---
# Build a page for the Pegasus website

Argument: the page or template name, e.g. `/new-page Service page`.

1. **Read the contract first.**
   - The record type(s) this page reads, in `docs/content-model-v1.md` ("How the pages are fed" table). The page may only show fields that exist there. If it needs a field that does not exist, stop and propose the model change first.
   - `docs/client-facts-2026-10-04.md` for any real fact. Anything else is a placeholder in square brackets.
   - `CLAUDE.md` architecture rules and design rules. Reuse existing components under `apps/web/src/components/` before writing new ones.
   - Ask: what happens to this page when a second Location record appears? If the answer is "it breaks" or "it needs code", change the plan.
2. **Plan in writing** (five to ten lines): sections top to bottom, which record fields feed each, the one primary action, phone layout differences, what you will verify. Wait for approval if the page is new; proceed if it is a revision.
3. **Build** in `apps/web/src/app/[lang]/<route>/page.tsx` (every page takes `params.lang`; English is served at the root, French and Portuguese under `/fr` and `/pt`, see `apps/web/src/proxy.ts`). Read content only through `apps/web/src/content/index.ts` (today: typed sample data in `src/content/sample/`, later Sanity), use `t(field, locale)` for translated text, the shell components in `src/components/` (`PrimaryAction`, `ArrowLink`, `CircleArrow`, `Reveal`, `OpenStatus`, `Icon`, `Logo`), and the CSS variables from `src/app/globals.css`. One `PrimaryAction` per screen; mark the hero's with `heroBook` so the header and phone bar take over after it scrolls away.
   - Desktop 1440 and phone 390 from the same markup; no separate mobile page.
   - Lora for h1–h3 and primary actions; Montserrat elsewhere; no rectangular buttons; circle-arrow pattern for actions; one primary action per screen.
   - Every image has alt text; every interactive element is a real `<a>` or `<button>` with a visible focus state; targets ≥ 44px; contrast ≥ 4.5:1.
   - Headings in order (h1 once), landmarks (`header`, `main`, `nav`, `footer`), `lang` on the html element.
4. **Verify before saying done.** Run `npm run lint`, `npm run typecheck`, `npm run build`. Open the page at 390px and 1440px and look at it (Playwright screenshot or the browser). List what you checked and what you could not.
5. **Review.** Ask the `architecture-reviewer`, `design-reviewer` and `a11y-reviewer` subagents to review the diff. Fix real findings; ignore style preferences. A page is not done while the architecture reviewer reports a hard-coded fact, a bypassed read path, or a single-location assumption.
6. **Record.** If a decision was made that others need, add it to `docs/` in the same change. Commit on a branch and open a pull request with a short description and screenshots.
