import type { Faq } from "../types";

/** Draft questions. The clinic's own list arrives with questionnaire 7.7. */
export const faqs: Faq[] = [
  {
    id: "faq-walk-in-hours",
    question: { en: "Can I walk in without an appointment?" },
    answer: {
      en: "Yes. Walk-in care is open during all opening hours: Monday to Friday 9:00 a.m. to 6:00 p.m. and Saturday 9:00 a.m. to 2:00 p.m.",
    },
    category: "visiting",
    relatedServices: ["walk-in"],
    relatedLocations: ["york"],
    showOnHomepage: true,
    order: 1,
  },
  {
    id: "faq-what-to-bring",
    question: { en: "What should I bring to my first visit?" },
    answer: {
      en: "Your Ontario health card if you have one, a list of any medicines you take, and anything a previous doctor gave you about your health.",
    },
    category: "visiting",
    showOnHomepage: true,
    order: 2,
  },
  {
    id: "faq-no-ohip",
    question: { en: "What if I do not have OHIP?" },
    answer: {
      en: "You can still be seen. Visits without OHIP are paid privately. [Fee details to be confirmed by the clinic.]",
    },
    category: "fees-coverage",
    showOnHomepage: true,
    order: 3,
  },
  {
    id: "faq-languages",
    question: { en: "Can I be seen in French or Portuguese?" },
    answer: {
      en: "[To be confirmed: which languages each provider speaks, and whether interpreter support is available.]",
    },
    category: "languages",
    showOnHomepage: true,
    order: 4,
  },
  {
    id: "faq-new-patients",
    question: { en: "Are you taking new patients?" },
    answer: { en: "[To be confirmed by the clinic (questionnaire 4.5).]" },
    category: "booking",
    showOnHomepage: true,
    order: 5,
  },
];
