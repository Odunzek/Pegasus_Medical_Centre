import type { Provider } from "../types";

/**
 * Placeholder providers. Real names, titles, credentials, languages and portraits
 * arrive with questionnaire section 3; each profile is published only after the
 * provider approves it (approval recorded in the CMS). Everything here is a draft.
 */
export const providers: Provider[] = [
  {
    slug: "provider-1",
    fullName: "[Dr. First Last]",
    title: { en: "Family physician", fr: "Médecin de famille", pt: "Médico de família" },
    credentials: ["MD", "CCFP"],
    focusAreas: { en: "[Focus areas]" },
    languages: ["en", "pt"],
    portrait: {
      src: "/temp-photos/pmc-06-doctor-a.jpg",
      alt: { en: "[Temporary photo] Placeholder portrait of a doctor" },
      width: 1067,
      height: 1600,
      temporary: true,
    },
    ownWords: { en: "[One line in the doctor's own words, optional.]" },
    locations: ["york"],
    services: ["family-medicine", "walk-in", "chronic-disease"],
    acceptingNewPatients: "not-shown",
    status: "draft",
  },
  {
    slug: "provider-2",
    fullName: "[Dr. First Last]",
    title: { en: "Family physician", fr: "Médecin de famille", pt: "Médico de família" },
    credentials: ["MD", "CCFP"],
    focusAreas: { en: "[Focus areas]" },
    languages: ["en", "fr"],
    portrait: {
      src: "/temp-photos/pmc-07-doctor-b.jpg",
      alt: { en: "[Temporary photo] Placeholder portrait of a doctor" },
      width: 1600,
      height: 900,
      temporary: true,
    },
    locations: ["york"],
    services: ["family-medicine", "childrens-health", "preventative-health"],
    acceptingNewPatients: "not-shown",
    status: "draft",
  },
  {
    slug: "provider-3",
    fullName: "[First Last]",
    title: { en: "Nurse practitioner", fr: "Infirmière praticienne", pt: "Enfermeira de prática avançada" },
    credentials: ["NP-PHC"],
    focusAreas: { en: "[Focus areas]" },
    languages: ["en"],
    portrait: {
      src: "/temp-photos/pmc-08-doctor-c.jpg",
      alt: { en: "[Temporary photo] Placeholder portrait of a clinician" },
      width: 1108,
      height: 1600,
      temporary: true,
    },
    locations: ["york"],
    services: ["walk-in", "older-adults", "contraception"],
    acceptingNewPatients: "not-shown",
    status: "draft",
  },
];
