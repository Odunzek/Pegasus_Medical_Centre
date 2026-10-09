/**
 * Languages and URL shape.
 *
 * English lives at the root (/services), French and Portuguese are prefixed
 * (/fr/services, /pt/services). src/proxy.ts rewrites un-prefixed paths to
 * /en/... internally so every page lives under app/[lang]/.
 */

export const locales = ["en", "fr", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** The BCP 47 tag used in `lang` attributes. */
export const langTag: Record<Locale, string> = {
  en: "en-CA",
  fr: "fr-CA",
  pt: "pt-PT",
};

export const languageName: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  pt: "Português",
};

/** Builds a public URL for a path in a language: localePath("fr", "/services") → "/fr/services". */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Text that belongs to the site shell (header, footer, phone bar), per language. */
export type Dictionary = {
  skipToContent: string;
  home: string;
  mainMenu: string;
  openMenu: string;
  closeMenu: string;
  language: string;
  changeLanguage: string;
  book: string;
  callToBook: string;
  call: string;
  callClinic: string;
  bookOrCall: string;
  nav: { href: string; label: string }[];
  footer: {
    tagline: string;
    clinic: string;
    patients: string;
    languageHeading: string;
    newPatients: string;
    questions: string;
    contact: string;
    privacy: string;
    accessibility: string;
    terms: string;
    rights: string;
  };
  hours: {
    openNow: string;
    openUntil: string;
    closedNow: string;
    opensAt: string;
    opensOn: string;
    walkIn: string;
    closed: string;
    today: string;
    days: string[];
  };
};

const en: Dictionary = {
  skipToContent: "Skip to content",
  home: "Pegasus Medical Centre, home",
  mainMenu: "Main menu",
  openMenu: "Menu",
  closeMenu: "Close menu",
  language: "Language",
  changeLanguage: "Change language",
  book: "Book an appointment",
  callToBook: "Call to book",
  call: "Call",
  callClinic: "Call the clinic",
  bookOrCall: "Book or call",
  nav: [
    { href: "/services", label: "Services" },
    { href: "/locations", label: "Locations" },
    { href: "/doctors", label: "Our doctors" },
    { href: "/about", label: "About" },
    { href: "/resources", label: "Resources" },
    { href: "/contact", label: "Contact" },
  ],
  footer: {
    tagline: "Family medicine and walk-in care for every age, in English, French and Portuguese.",
    clinic: "Clinic",
    patients: "Patients",
    languageHeading: "Language",
    newPatients: "New patients",
    questions: "Questions and answers",
    contact: "Contact us",
    privacy: "Privacy",
    accessibility: "Accessibility",
    terms: "Terms of use",
    rights: "All rights reserved.",
  },
  hours: {
    openNow: "Open now",
    openUntil: "until {time}",
    closedNow: "Closed now",
    opensAt: "opens at {time}",
    opensOn: "opens {day} at {time}",
    walkIn: "Walk-in",
    closed: "Closed",
    today: "Today",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
};

/* French and Portuguese shell text: first drafts, to be checked by a native speaker before launch. */
const fr: Dictionary = {
  skipToContent: "Aller au contenu",
  home: "Pegasus Medical Centre, accueil",
  mainMenu: "Menu principal",
  openMenu: "Menu",
  closeMenu: "Fermer le menu",
  language: "Langue",
  changeLanguage: "Changer de langue",
  book: "Prendre rendez-vous",
  callToBook: "Appeler pour un rendez-vous",
  call: "Appeler",
  callClinic: "Appeler la clinique",
  bookOrCall: "Rendez-vous ou appel",
  nav: [
    { href: "/services", label: "Services" },
    { href: "/locations", label: "Adresses" },
    { href: "/doctors", label: "Nos médecins" },
    { href: "/about", label: "À propos" },
    { href: "/resources", label: "Ressources" },
    { href: "/contact", label: "Contact" },
  ],
  footer: {
    tagline: "Médecine familiale et soins sans rendez-vous pour tous les âges, en anglais, en français et en portugais.",
    clinic: "Clinique",
    patients: "Patients",
    languageHeading: "Langue",
    newPatients: "Nouveaux patients",
    questions: "Questions et réponses",
    contact: "Nous joindre",
    privacy: "Confidentialité",
    accessibility: "Accessibilité",
    terms: "Conditions d'utilisation",
    rights: "Tous droits réservés.",
  },
  hours: {
    openNow: "Ouvert",
    openUntil: "jusqu'à {time}",
    closedNow: "Fermé",
    opensAt: "ouvre à {time}",
    opensOn: "ouvre {day} à {time}",
    walkIn: "Sans rendez-vous",
    closed: "Fermé",
    today: "Aujourd'hui",
    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  },
};

const pt: Dictionary = {
  skipToContent: "Ir para o conteúdo",
  home: "Pegasus Medical Centre, página inicial",
  mainMenu: "Menu principal",
  openMenu: "Menu",
  closeMenu: "Fechar o menu",
  language: "Idioma",
  changeLanguage: "Mudar de idioma",
  book: "Marcar consulta",
  callToBook: "Ligar para marcar",
  call: "Ligar",
  callClinic: "Ligar para a clínica",
  bookOrCall: "Marcar ou ligar",
  nav: [
    { href: "/services", label: "Serviços" },
    { href: "/locations", label: "Onde estamos" },
    { href: "/doctors", label: "Os nossos médicos" },
    { href: "/about", label: "Sobre nós" },
    { href: "/resources", label: "Recursos" },
    { href: "/contact", label: "Contacto" },
  ],
  footer: {
    tagline: "Medicina familiar e atendimento sem marcação para todas as idades, em inglês, francês e português.",
    clinic: "Clínica",
    patients: "Pacientes",
    languageHeading: "Idioma",
    newPatients: "Novos pacientes",
    questions: "Perguntas e respostas",
    contact: "Contacte-nos",
    privacy: "Privacidade",
    accessibility: "Acessibilidade",
    terms: "Termos de utilização",
    rights: "Todos os direitos reservados.",
  },
  hours: {
    openNow: "Aberto",
    openUntil: "até às {time}",
    closedNow: "Fechado",
    opensAt: "abre às {time}",
    opensOn: "abre {day} às {time}",
    walkIn: "Sem marcação",
    closed: "Fechado",
    today: "Hoje",
    days: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"],
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, fr, pt };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Fills {name} slots in a dictionary string. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

/** Picks the right language from a translated field, falling back to English. */
export type Translated = { en: string; fr?: string; pt?: string };

export function t(field: Translated | undefined, locale: Locale): string {
  if (!field) return "";
  return field[locale] || field.en;
}
