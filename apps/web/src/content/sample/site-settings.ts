import type { SiteSettings } from "../types";

/**
 * Sample Site settings. Facts come from docs/client-facts-2026-10-04.md.
 * Anything the clinic has not confirmed is blank or in square brackets.
 * The phone and address are NOT repeated here in prose: pages derive them from Location.
 */
export const siteSettings: SiteSettings = {
  clinicName: "Pegasus Medical Centre",
  legalName: "Pegasus Medical Centre",
  formerName: "York Health Choice Centre",
  patientPhone: "416 656 7272",
  enquiryEmail: undefined, // awaiting questionnaire 1.3
  bookingUrl: undefined, // awaiting 4.2; blank means Book actions read "Call to book"
  emergencyWording: {
    en: "If you are experiencing a medical emergency, call 911 or go to the nearest emergency department.",
    fr: "En cas d'urgence médicale, composez le 911 ou rendez-vous au service d'urgence le plus proche.",
    pt: "Em caso de emergência médica, ligue para o 911 ou dirija-se ao serviço de urgência mais próximo.",
  },
  showHealth811: false, // awaiting 7.3
  privacyContact: undefined, // awaiting 7.4
  languagesEnabled: { en: true, fr: true, pt: true }, // all on for preview builds; see content model "Translation workflow"
  announcement: {
    text: { en: "[Draft announcement bar. Example: Flu shots are available from October.]" },
    on: false,
  },
  footerText: {
    en: "Family medicine and walk-in care for every age, in English, French and Portuguese.",
    fr: "Médecine familiale et soins sans rendez-vous pour tous les âges, en anglais, en français et en portugais.",
    pt: "Medicina familiar e atendimento sem marcação para todas as idades, em inglês, francês e português.",
  },
  social: [],
  homepage: {
    heroHeadline: {
      en: "[Draft] Care that takes its time.",
      fr: "[Brouillon] Des soins qui prennent le temps.",
      pt: "[Rascunho] Cuidados com tempo para si.",
    },
    heroIntro: {
      en: "[Draft] Family medicine and walk-in care for every age, in English, French and Portuguese.",
      fr: "[Brouillon] Médecine familiale et soins sans rendez-vous pour tous les âges, en anglais, en français et en portugais.",
      pt: "[Rascunho] Medicina familiar e atendimento sem marcação para todas as idades, em inglês, francês e português.",
    },
    heroImage: {
      src: "/temp-photos/pmc-01-hero-doctor-older-patient.jpg",
      alt: { en: "A doctor talking with an older patient" },
      width: 1920,
      height: 1080,
      temporary: true,
    },
    servicesHeading: { en: "[Draft] How can we help today?", fr: "[Brouillon] Comment pouvons-nous vous aider aujourd'hui ?", pt: "[Rascunho] Como podemos ajudar hoje?" },
    welcomeHeading: { en: "[Draft] Everyone is welcome here", fr: "[Brouillon] Tout le monde est le bienvenu", pt: "[Rascunho] Todos são bem-vindos" },
    welcomeText: {
      en: "[Draft] Walk in during opening hours, book an appointment, or call us. Our family doctors and nurses are here for every age.",
      fr: "[Brouillon] Passez pendant les heures d'ouverture, prenez rendez-vous ou appelez-nous. Nos médecins de famille et notre personnel infirmier sont là pour tous les âges.",
      pt: "[Rascunho] Venha durante o horário de abertura, marque uma consulta ou ligue-nos. Os nossos médicos de família e enfermeiros estão aqui para todas as idades.",
    },
  },
  seo: {
    titleSuffix: "Pegasus Medical Centre",
    description: {
      en: "Family medicine and walk-in care in York, Toronto. Book an appointment, walk in during opening hours, or call the clinic.",
      fr: "Médecine familiale et soins sans rendez-vous à York, Toronto. Prenez rendez-vous, passez pendant les heures d'ouverture ou appelez la clinique.",
      pt: "Medicina familiar e atendimento sem marcação em York, Toronto. Marque consulta, venha durante o horário de abertura ou ligue para a clínica.",
    },
  },
};
