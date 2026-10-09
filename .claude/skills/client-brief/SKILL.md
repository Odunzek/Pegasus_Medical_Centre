---
name: client-brief
description: Produce a review document for Dr. Khurshid (a PDF to Desktop/Pegasus) in the Kempyre house format: what this shows, pictures from the canvas or the working build, how the site behaves, what we have versus what we still need, a reply-by-sentence checklist, next steps. Use whenever something is to be shown to the client.
---
# Client brief (preview PDF)

Argument: what the brief is about, e.g. `/client-brief Services page`.

Dr. Khurshid is a visual learner who reads on his phone and forwards things. Every brief follows the same shape so he always knows where to look. The generator for the last one is the reference: `scratchpad/pdf2/build.py` pattern (HTML → Playwright → A4 PDF, Lora headings, Montserrat text, brand colours).

1. **Gather before laying out.** Render what is being shown: canvas boards through `render/shim.py`, or the working build through `scripts/smoke.mjs` screenshots at 1440 and 390. Slice tall renders at section boundaries, never mid-text. Read `docs/client-facts-2026-10-04.md` for the have/need tables.
2. **Pages, in this order.**
   - Cover: title, "Design preview for review" or the equivalent, prepared for / by, version and date, one-line status ("Nothing here is final or published").
   - Page 2, "Before you look": two dark notice boxes. *The photographs are not Pegasus* (stock stand-ins, replaced before launch, consented clinic photos). *The words are placeholders* (drafts, names in brackets are fictional, nothing decided, reviewed with him before use). Then "what we would like from you at this stage" (reactions, not wording) and "what is already true" (only client-facts).
   - The pictures, one screen per page, each with a one-line caption that repeats "stock photo / draft words" where relevant. Desktop first, then phone screens four to a page, then any working-build screens.
   - "How the site behaves": the one-Book rule, open-now, three languages, what staff edit, no patient data, built for older patients. Reuse the standing text.
   - "What we have / what we still need": per page, from client-facts, with questionnaire item numbers.
   - Photography shot list when photos are relevant.
   - "Decisions that unlock the content": a checklist he can answer by reply, ● for blockers, ○ for later; open with what he has already given so nothing is asked twice.
   - "Next": numbered, short, with the content and search plan before copy.
   - Footer on every page: "All photographs are temporary stock images; all words are draft", page x of y.
3. **Rules.** Never the Kempyre email address or any personal email; the contact line is "through the project's designated Kempyre contact". Spelling Centre. No testimonials, no superlatives. Cross-references by page number checked after the final render (print the page list and read it back).
4. **Deliver.** Save to Desktop › Pegasus with a versioned name (`Pegasus_<Subject>_v1.0.pdf`), send the file in the conversation, and record what was decided on the client's behalf in the message. Add any new facts he returns to `client-facts` and the content map.
