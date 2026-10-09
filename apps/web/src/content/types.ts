/**
 * Content types for the seven record types in docs/content-model-v1.md.
 * The Sanity schema (apps/studio) must match these; change the document first.
 *
 * Text that staff translate is a `Translated` object; `en` is required.
 */

import type { Translated } from "@/lib/i18n";

export type { Translated };

export type ImageRef = {
  src: string;
  alt: Translated;
  width: number;
  height: number;
  /** True for the labelled stand-in photos used until the clinic's own exist. */
  temporary?: boolean;
};

/* 1. Site settings (single record) */
export type SiteSettings = {
  clinicName: string;
  legalName: string;
  patientPhone: string; // as displayed: "416 656 7272"
  patientPhoneHref: string; // tel: link: "+14166567272"
  enquiryEmail?: string; // awaiting 1.3; never a personal address
  /** Global booking link. Blank = Book buttons read "Call to book" and dial the clinic. */
  bookingUrl?: string;
  emergencyWording: Translated;
  showHealth811: boolean;
  privacyContact?: { name: string; role: string; phone?: string; email?: string };
  languagesEnabled: { en: boolean; fr: boolean; pt: boolean };
  announcement?: {
    text: Translated;
    href?: string;
    on: boolean;
    start?: string; // ISO date
    end?: string; // ISO date
  };
  footerText?: Translated;
  social?: { label: string; href: string }[];
  seo: { titleSuffix: string; description: Translated; shareImage?: ImageRef };
};

/* 2. Location */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, as in JavaScript Date

export type DayHours = {
  day: Weekday;
  closed: boolean;
  open?: string; // "09:00", 24-hour, Toronto time
  close?: string; // "18:00"
  walkInOpen?: string; // defaults to open
  walkInClose?: string; // defaults to close
  /** Not yet confirmed by the clinic (shown in square brackets). */
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
  address: { street: string; unit?: string; city: string; province: string; postal: string };
  mapPoint?: { lat: number; lng: number };
  phone?: string;
  phoneHref?: string;
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

/* 3. Service */
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
  group: ServiceGroup;
  summary: Translated; // 120 characters max
  whoFor?: Translated;
  whatToExpect?: Translated;
  access: "walk-in" | "appointment" | "both" | "referral";
  coverage?: { kind: "ohip" | "private" | "depends"; note?: Translated };
  body?: Translated; // rich text as HTML or portable text later; plain paragraphs for now
  relatedFaqs?: string[]; // FAQ ids
  image?: ImageRef;
  seo?: { title?: Translated; description?: Translated };
};

/* 4. Provider */
export type Provider = {
  slug: string;
  fullName: string;
  title: Translated;
  credentials: string[];
  focusAreas: Translated;
  languages: Locale3[];
  portrait?: ImageRef;
  ownWords?: Translated;
  biography?: Translated;
  locations: string[]; // Location slugs: single source of truth
  services: string[]; // Service slugs
  acceptingNewPatients: "yes" | "no" | "waitlist" | "not-shown";
  status: "published" | "draft";
  approval?: { by: string; date: string };
  seo?: { title?: Translated; description?: Translated };
};

export type Locale3 = "en" | "fr" | "pt" | "other";

/* 5. FAQ */
export type Faq = {
  id: string;
  question: Translated;
  answer: Translated;
  category: "visiting" | "booking" | "fees-coverage" | "services" | "languages" | "policies";
  relatedServices?: string[];
  relatedLocations?: string[];
  showOnHomepage: boolean;
  order: number;
};

/* 6. Page (general information) */
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
  hero?: ImageRef;
  sections: PageSection[];
  seo?: { title?: Translated; description?: Translated };
};

/* 7. Post */
export type Post = {
  slug: string;
  type: "notice" | "article";
  title: Translated;
  summary: Translated;
  body?: Translated;
  date: string; // ISO date
  expires?: string; // ISO date; expired notices disappear
  pinned: boolean;
  image?: ImageRef;
  href?: string;
  relatedServices?: string[];
};
