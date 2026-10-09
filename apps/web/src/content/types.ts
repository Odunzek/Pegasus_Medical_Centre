/**
 * Content types for the seven record types in docs/content-model-v1.md (v1.1).
 * This file mirrors that document field for field. Change the document first,
 * then this file, then the Sanity schema (apps/studio), then pages.
 *
 * Text a patient reads is a `Translated` object; `en` is required and is the
 * fallback for the other languages.
 */

import type { Translated } from "@/lib/i18n";

export type { Translated };

/** Every record that staff write passes through review before production shows it. */
export type Review = "draft" | "approved";

export type ImageRef = {
  src: string;
  alt: Translated;
  width: number;
  height: number;
  /** Stock stand-in used while the clinic's own photographs do not exist. Production refuses these. */
  temporary?: boolean;
};

/* ------------------------------------------------------------ 1. Site settings (single record) */

export type SiteSettings = {
  clinicName: string;
  legalName: string;
  /** Shown on About and as alternateName in structured data during the rebrand. Blank once no longer needed. */
  formerName?: string;
  /** As displayed, e.g. "555 555 0123". The tel: link is derived by telHref(). */
  patientPhone: string;
  enquiryEmail?: string; // awaiting questionnaire 1.3; never a personal address
  /** Global booking link. Blank = Book actions read "Call to book" and dial the clinic. */
  bookingUrl?: string;
  emergencyWording: Translated;
  showHealth811: boolean;
  privacyContact?: { name: string; role: string; phone?: string; email?: string };
  languagesEnabled: { en: boolean; fr: boolean; pt: boolean };
  announcement?: {
    text: Translated;
    href?: string;
    on: boolean;
    start?: string; // ISO date, Toronto
    end?: string; // ISO date, Toronto
  };
  footerText: Translated;
  social?: { label: string; href: string }[];
  homepage: {
    heroHeadline: Translated;
    heroIntro: Translated;
    heroImage?: ImageRef;
    servicesHeading: Translated;
    welcomeHeading: Translated;
    welcomeText: Translated;
  };
  seo: { titleSuffix: string; description: Translated; shareImage?: ImageRef };
};

/* ------------------------------------------------------------ 2. Location */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, as in JavaScript Date

export type DayHours = {
  day: Weekday;
  closed: boolean;
  open?: string; // "09:00", 24-hour, Toronto time
  close?: string; // "18:00"
  walkInOpen?: string; // defaults to open
  walkInClose?: string; // defaults to close
  /** Not yet confirmed by the clinic: rendered in square brackets; "Open now" does not guess on this day. */
  tbc?: boolean;
};

export type HoursException = {
  date: string; // ISO date "2026-12-25"
  closed: boolean;
  open?: string;
  close?: string;
  note?: Translated;
};

export type Location = {
  slug: string;
  name: Translated;
  status: "open" | "opening-soon" | "closed";
  address: {
    street: string;
    unit?: string;
    /** "York": the neighbourhood copy refers to. Structured data uses city. */
    neighbourhood?: string;
    city: string;
    province: string; // "ON"
    postal: string;
  };
  mapPoint?: { lat: number; lng: number };
  phone?: string; // override of Site settings, as displayed
  email?: string;
  regularHours: DayHours[];
  hoursExceptions: HoursException[];
  waitTime?: { text: Translated; on: boolean };
  parking?: { type: "free-on-site" | "paid" | "street" | "lot" | "none"; note?: Translated };
  accessibility?: {
    stepFree?: boolean;
    automaticDoor?: boolean;
    elevator?: boolean;
    accessibleWashroom?: boolean;
    accessibleParking?: boolean;
    note?: Translated;
  };
  transitNote?: Translated;
  services: string[]; // Service slugs: the single source of truth for service-by-location
  photos?: { exterior?: ImageRef; reception?: ImageRef; gallery?: ImageRef[] };
  intro?: Translated;
  seo?: { title?: Translated; description?: Translated };
};

/* ------------------------------------------------------------ 3. Service */

export type ServiceGroup =
  | "family-medicine"
  | "walk-in"
  | "children"
  | "chronic"
  | "older-adults"
  | "preventative"
  | "contraception"
  | "allied-health"
  | "specialist";

export type Service = {
  slug: string;
  name: Translated;
  status: "live" | "planned" | "hidden";
  review: Review;
  group: ServiceGroup;
  summary: Translated; // 120 characters max
  whoFor?: Translated;
  whatToExpect?: Translated;
  whatToBring?: Translated;
  howLong?: Translated;
  access: "walk-in" | "appointment" | "both" | "referral";
  coverage?: { kind: "ohip" | "private" | "depends"; note?: Translated };
  body?: Translated; // rich text later; plain paragraphs for now
  relatedFaqs?: string[]; // FAQ ids
  image?: ImageRef;
  seo?: { title?: Translated; description?: Translated };
};

/* ------------------------------------------------------------ 4. Provider */

/** The fixed set of spoken languages; labels live in src/lib/i18n.ts. */
export type SpokenLanguage = "en" | "fr" | "pt" | "es" | "it" | "ar" | "zh" | "hi" | "ur" | "tl" | "pa" | "ta" | "so" | "other";

export type Provider = {
  slug: string;
  fullName: string;
  title: Translated;
  credentials: string[];
  focusAreas: Translated;
  languages: SpokenLanguage[];
  portrait?: ImageRef;
  ownWords?: Translated;
  biography?: Translated;
  locations: string[]; // Location slugs: single source of truth
  services: string[]; // Service slugs
  acceptingNewPatients: "yes" | "no" | "waitlist" | "not-shown";
  status: "published" | "draft";
  /** Required before status can be "published". */
  approval?: { by: string; date: string };
  seo?: { title?: Translated; description?: Translated };
};

/* ------------------------------------------------------------ 5. FAQ */

export type Faq = {
  id: string;
  question: Translated;
  answer: Translated;
  category: "visiting" | "booking" | "fees-coverage" | "services" | "languages" | "policies";
  relatedServices?: string[];
  relatedLocations?: string[];
  showOnHomepage: boolean;
  order: number;
  review: Review;
};

/* ------------------------------------------------------------ 6. Page (general information) */

export type PageSection =
  | { type: "richText"; body: Translated }
  | { type: "image"; image: ImageRef; caption?: Translated }
  | { type: "twoColumn"; left: Translated; right: Translated }
  | { type: "steps"; heading?: Translated; steps: Translated[] }
  | { type: "faqGroup"; heading?: Translated; faqs: string[] }
  | { type: "cta"; heading: Translated; text?: Translated; action: "book" | "call" | "contact" };

export type Page = {
  slug: string;
  title: Translated;
  review: Review;
  hero?: ImageRef;
  sections: PageSection[];
  seo?: { title?: Translated; description?: Translated };
};

/* ------------------------------------------------------------ 7. Post */

export type Post = {
  slug: string;
  type: "notice" | "article";
  review: Review;
  title: Translated;
  summary: Translated;
  body?: Translated;
  date: string; // ISO date
  expires?: string; // ISO date; expired notices disappear (judged on the Toronto date)
  pinned: boolean;
  image?: ImageRef;
  href?: string;
  relatedServices?: string[];
};
