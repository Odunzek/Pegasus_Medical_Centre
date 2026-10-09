/**
 * Languages and URL shape.
 *
 * Every language is prefixed: /en/services, /fr/services, /pt/services.
 * src/proxy.ts redirects un-prefixed paths to English. Every page lives under
 * app/[lang]/.
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

/** Builds a public URL for a path in a language: localePath("fr", "/services") → "/fr/services"; localePath("en", "/") → "/en". */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Text that belongs to the site shell (header, footer, phone bar), per language. */
export type Dictionary = {
  skipToContent: string;
  /** "{name}, home" for the logo link */
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
  temporaryPhoto: string;
  draft: string;
  partlyEnglish: string;
  health811: string;
  notFound: { label: string; heading: string; body: string; action: string };
  comingSoon: string;
  footer: {
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
    /** When today's hours are flagged "to be confirmed" */
    tbc: string;
    /** joins open and close: "9:00 a.m. to 6:00 p.m." */
    to: string;
    walkIn: string;
    closed: string;
    today: string;
    days: string[];
  };
  languages: Record<string, string>;
};

/* Labels for Provider.languages (the fixed set in the content model). */
const spokenLanguagesEn: Record<string, string> = {
  en: "English", fr: "French", pt: "Portuguese", es: "Spanish", it: "Italian", ar: "Arabic", zh: "Chinese", hi: "Hindi", ur: "Urdu", tl: "Tagalog", pa: "Punjabi", ta: "Tamil", so: "Somali", other: "Other",
};
const spokenLanguagesFr: Record<string, string> = {
  en: "anglais", fr: "français", pt: "portugais", es: "espagnol", it: "italien", ar: "arabe", zh: "chinois", hi: "hindi", ur: "ourdou", tl: "tagalog", pa: "pendjabi", ta: "tamoul", so: "somali", other: "autre",
};
const spokenLanguagesPt: Record<string, string> = {
  en: "inglês", fr: "francês", pt: "português", es: "espanhol", it: "italiano", ar: "árabe", zh: "chinês", hi: "hindi", ur: "urdu", tl: "tagalo", pa: "punjabi", ta: "tâmil", so: "somali", other: "outra",
};

const en: Dictionary = {
  skipToContent: "Skip to content",
  home: "{name}, home",
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
  temporaryPhoto: "Temporary photo",
  draft: "Draft",
  partlyEnglish: "Some of this page is not yet available in your language and is shown in English.",
  health811: "For health advice when the clinic is closed, call Health811 at 811.",
  notFound: {
    label: "Page not found",
    heading: "We could not find that page.",
    body: "The address may have changed. The homepage has everything: services, hours and how to book. If you need the clinic now, call us.",
    action: "Go to the homepage",
  },
  comingSoon: "This page is being built. Call the clinic if you need something from it now.",
  footer: {
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
    tbc: "Today's hours are to be confirmed; please call before visiting",
    to: "{open} to {close}",
    walkIn: "Walk-in",
    closed: "Closed",
    today: "Today",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  languages: spokenLanguagesEn,
};

/* French (fr-CA) and Portuguese (pt-PT) shell text: Kempyre drafts, NATIVE REVIEW PENDING.
   A language is enabled for the public only after that review (see docs/content-model-v1.md). */
const fr: Dictionary = {
  skipToContent: "Aller au contenu",
  home: "{name}, accueil",
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
  temporaryPhoto: "Photo temporaire",
  draft: "Brouillon",
  partlyEnglish: "Une partie de cette page n'est pas encore offerte dans votre langue et s'affiche en anglais.",
  health811: "Pour des conseils de santé lorsque la clinique est fermée, composez le 811 (Santé811).",
  notFound: {
    label: "Page introuvable",
    heading: "Nous n'avons pas trouvé cette page.",
    body: "L'adresse a peut-être changé. La page d'accueil contient tout : services, heures et prise de rendez-vous. Si vous avez besoin de la clinique maintenant, appelez-nous.",
    action: "Aller à la page d'accueil",
  },
  comingSoon: "Cette page est en construction. Appelez la clinique si vous avez besoin de quelque chose maintenant.",
  footer: {
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
    tbc: "Les heures d'aujourd'hui restent à confirmer; appelez avant de venir",
    to: "{open} à {close}",
    walkIn: "Sans rendez-vous",
    closed: "Fermé",
    today: "Aujourd'hui",
    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  },
  languages: spokenLanguagesFr,
};

const pt: Dictionary = {
  skipToContent: "Ir para o conteúdo",
  home: "{name}, página inicial",
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
  temporaryPhoto: "Fotografia temporária",
  draft: "Rascunho",
  partlyEnglish: "Parte desta página ainda não está disponível na sua língua e é apresentada em inglês.",
  health811: "Para aconselhamento de saúde quando a clínica está fechada, ligue 811 (Health811).",
  notFound: {
    label: "Página não encontrada",
    heading: "Não encontrámos essa página.",
    body: "O endereço pode ter mudado. A página inicial tem tudo: serviços, horário e como marcar. Se precisar da clínica agora, ligue-nos.",
    action: "Ir para a página inicial",
  },
  comingSoon: "Esta página está a ser construída. Ligue para a clínica se precisar de algo agora.",
  footer: {
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
    tbc: "O horário de hoje ainda está por confirmar; ligue antes de vir",
    to: "{open} às {close}",
    walkIn: "Sem marcação",
    closed: "Fechado",
    today: "Hoje",
    days: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"],
  },
  languages: spokenLanguagesPt,
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

/** False when `t()` would fall back to English for this locale. Pages use it to show the "partly in English" note. */
export function isTranslated(field: Translated | undefined, locale: Locale): boolean {
  if (!field || locale === "en") return true;
  return Boolean(field[locale]);
}

/** True if any of the given fields would fall back to English. */
export function anyFallback(fields: (Translated | undefined)[], locale: Locale): boolean {
  return fields.some((f) => !isTranslated(f, locale));
}
