import type { SiteSettings } from "../types";

/**
 * Sample Site settings. Facts come from docs/client-facts-2026-10-04.md.
 * Anything the clinic has not confirmed is left blank or in square brackets.
 */
export const siteSettings: SiteSettings = {
  clinicName: "Pegasus Medical Centre",
  legalName: "Pegasus Medical Centre",
  patientPhone: "416 656 7272",
  patientPhoneHref: "+14166567272",
  enquiryEmail: undefined, // awaiting questionnaire 1.3
  bookingUrl: undefined, // awaiting 4.2; blank means Book buttons read "Call to book"
  emergencyWording: {
    en: "If you are experiencing a medical emergency, call 911 or go to the nearest emergency department.",
    fr: "En cas d'urgence médicale, composez le 911 ou rendez-vous au service d'urgence le plus proche.",
    pt: "Em caso de emergência médica, ligue para o 911 ou dirija-se ao serviço de urgência mais próximo.",
  },
  showHealth811: false, // awaiting 7.3
  privacyContact: undefined, // awaiting 7.4
  languagesEnabled: { en: true, fr: true, pt: true },
  announcement: {
    text: { en: "[Announcement bar: for example, flu shots available from October.]" },
    on: false,
  },
  seo: {
    titleSuffix: "Pegasus Medical Centre",
    description: {
      en: "Family medicine and walk-in care in York, Toronto. Book an appointment, walk in, or call 416 656 7272.",
      fr: "Médecine familiale et soins sans rendez-vous à York, Toronto. Prenez rendez-vous, passez à la clinique ou appelez le 416 656 7272.",
      pt: "Medicina familiar e atendimento sem marcação em York, Toronto. Marque consulta, venha sem marcação ou ligue para o 416 656 7272.",
    },
  },
};
