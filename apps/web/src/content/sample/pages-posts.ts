import type { Page, Post } from "../types";

/** General information pages. Section content is a draft until the clinic supplies it. */
export const pages: Page[] = [
  {
    slug: "about",
    title: { en: "About the clinic", fr: "À propos de la clinique", pt: "Sobre a clínica" },
    review: "draft",
    sections: [
      {
        type: "richText",
        body: {
          en: "[Draft] Pegasus Medical Centre is a family medicine and walk-in clinic in York, Toronto. We see patients of every age, in English, French and Portuguese.",
        },
      },
    ],
  },
  {
    slug: "new-patients",
    title: { en: "New patients", fr: "Nouveaux patients", pt: "Novos pacientes" },
    review: "draft",
    sections: [
      {
        type: "steps",
        heading: { en: "Your first visit" },
        steps: [
          { en: "Walk in during opening hours, or call to book." },
          { en: "Register at the front desk with your health card, if you have one." },
          { en: "See a doctor or nurse. Bring a list of any medicines you take." },
        ],
      },
    ],
  },
  {
    slug: "fees-and-coverage",
    title: { en: "Fees and coverage", fr: "Frais et couverture", pt: "Preços e cobertura" },
    review: "draft",
    sections: [
      {
        type: "richText",
        body: { en: "[Awaiting questionnaire section 5: OHIP coverage, private insurance, fee list and payment.]" },
      },
    ],
  },
  {
    slug: "privacy",
    title: { en: "Privacy", fr: "Confidentialité", pt: "Privacidade" },
    review: "draft",
    sections: [
      {
        type: "richText",
        body: { en: "[Awaiting the clinic's privacy statement and PHIPA privacy contact (questionnaire 7.4 / 7.5).]" },
      },
    ],
  },
  {
    slug: "accessibility",
    title: { en: "Accessibility", fr: "Accessibilité", pt: "Acessibilidade" },
    review: "draft",
    sections: [
      {
        type: "richText",
        body: {
          en: "[Draft] This website is built to WCAG 2.2 AA. If anything is hard to use, call the clinic and we will help.",
        },
      },
    ],
  },
  {
    slug: "terms",
    title: { en: "Terms of use", fr: "Conditions d'utilisation", pt: "Termos de utilização" },
    review: "draft",
    sections: [{ type: "richText", body: { en: "[Terms of use to be supplied.]" } }],
  },
];

/** Notices and articles. Expired notices disappear automatically. */
export const posts: Post[] = [
  {
    slug: "sample-notice",
    type: "notice",
    review: "draft",
    title: { en: "[Sample notice: holiday hours]" },
    summary: { en: "[Example of a short notice. Replace or delete before launch.]" },
    date: "2026-10-09",
    expires: "2026-10-10",
    pinned: false,
  },
];
