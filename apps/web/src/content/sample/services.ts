import type { Service } from "../types";

/**
 * Services named in discovery (docs/client-facts-2026-10-04.md). Which are live at
 * launch, and their public names, are still to be confirmed (questionnaire 2.1 / 2.2),
 * so the copy below is a draft and the "planned" four show only in the quiet line.
 */
export const services: Service[] = [
  {
    slug: "family-medicine",
    name: { en: "Family medicine", fr: "Médecine familiale", pt: "Medicina familiar" },
    status: "live",
    group: "family-medicine",
    summary: { en: "Ongoing care from a family doctor who knows you and your history." },
    whoFor: { en: "Anyone who wants a regular doctor for themselves or their family." },
    whatToExpect: {
      en: "A first visit of about [30] minutes to go through your history. Bring your health card and a list of any medicines you take.",
    },
    access: "appointment",
    coverage: { kind: "depends" },
    body: {
      en: "[Draft] Our family doctors look after you over time: check-ups, prescriptions, referrals and the questions that come up between visits.",
    },
    image: {
      src: "/temp-photos/pmc-01-hero-doctor-older-patient.jpg",
      alt: { en: "[Temporary photo] Doctor talking with an older patient" },
      width: 1920,
      height: 1080,
      temporary: true,
    },
  },
  {
    slug: "walk-in",
    name: { en: "Walk-in clinic", fr: "Clinique sans rendez-vous", pt: "Atendimento sem marcação" },
    status: "live",
    group: "walk-in",
    summary: { en: "Same-day care for colds, infections, minor injuries and anything that cannot wait." },
    whoFor: { en: "Anyone, with or without a family doctor here." },
    whatToExpect: {
      en: "Come in during opening hours and register at the desk. [Typical wait: to be confirmed by the clinic.]",
    },
    access: "walk-in",
    coverage: { kind: "depends" },
    image: {
      src: "/temp-photos/pmc-04-registration-desk.jpg",
      alt: { en: "[Temporary photo] Patient registering at the front desk" },
      width: 1600,
      height: 1068,
      temporary: true,
    },
  },
  {
    slug: "childrens-health",
    name: { en: "Children's health", fr: "Santé des enfants", pt: "Saúde infantil" },
    status: "live",
    group: "children",
    summary: { en: "Check-ups, immunisations and care when your child is unwell." },
    access: "both",
    image: {
      src: "/temp-photos/pmc-09-family-visit.jpg",
      alt: { en: "[Temporary photo] A parent and child at a clinic visit" },
      width: 1600,
      height: 900,
      temporary: true,
    },
  },
  {
    slug: "chronic-disease",
    name: { en: "Chronic disease management", fr: "Suivi des maladies chroniques", pt: "Gestão de doenças crónicas" },
    status: "live",
    group: "chronic",
    summary: { en: "Regular follow-up for diabetes, blood pressure, asthma and other long-term conditions." },
    access: "appointment",
    image: {
      src: "/temp-photos/pmc-10-blood-pressure.jpg",
      alt: { en: "[Temporary photo] Blood pressure check" },
      width: 1600,
      height: 900,
      temporary: true,
    },
  },
  {
    slug: "older-adults",
    name: { en: "Care for older adults", fr: "Soins aux aînés", pt: "Cuidados para pessoas idosas" },
    status: "live",
    group: "older-adults",
    summary: { en: "Age-related health, medication reviews and support to stay well at home." },
    access: "appointment",
  },
  {
    slug: "preventative-health",
    name: { en: "Lifestyle and preventative health", fr: "Prévention et mode de vie", pt: "Prevenção e estilo de vida" },
    status: "live",
    group: "preventative",
    summary: { en: "Screening, vaccinations and advice to prevent problems before they start." },
    access: "appointment",
  },
  {
    slug: "contraception",
    name: { en: "Contraception and related care", fr: "Contraception et soins connexes", pt: "Contraceção e cuidados relacionados" },
    status: "live",
    group: "contraception",
    summary: { en: "Advice, prescriptions and ongoing care, in confidence." },
    access: "appointment",
  },
  /* Planned, per discovery; shown only in the "coming later" line */
  {
    slug: "physiotherapy",
    name: { en: "Physiotherapy", fr: "Physiothérapie", pt: "Fisioterapia" },
    status: "planned",
    group: "allied-health",
    summary: { en: "Planned." },
    access: "appointment",
  },
  {
    slug: "cardiology",
    name: { en: "Cardiology", fr: "Cardiologie", pt: "Cardiologia" },
    status: "planned",
    group: "specialist",
    summary: { en: "Planned." },
    access: "referral",
  },
  {
    slug: "internal-medicine",
    name: { en: "Internal medicine", fr: "Médecine interne", pt: "Medicina interna" },
    status: "planned",
    group: "specialist",
    summary: { en: "Planned." },
    access: "referral",
  },
  {
    slug: "dietetics",
    name: { en: "Dietetics", fr: "Diététique", pt: "Dietética" },
    status: "planned",
    group: "allied-health",
    summary: { en: "Planned." },
    access: "appointment",
  },
];
