/**
 * Search plumbing shared by every page: canonical and hreflang per path, and the
 * structured data (JSON-LD) built from Site settings and Location records.
 * Rules: docs/content-model-v1.md, CLAUDE.md "SEO rules".
 */

import type { Metadata } from "next";
import type { Location, SiteSettings } from "@/content/types";
import { e164, locationPhone } from "@/content";
import { WEEKDAY_NAMES } from "@/lib/hours";
import { langTag, localePath, locales, t, type Locale } from "@/lib/i18n";

/** Absolute site origin from NEXT_PUBLIC_SITE_URL, without a trailing slash. Undefined locally. */
export function siteOrigin(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return undefined;
  return raw.replace(/\/+$/, "");
}

/**
 * Metadata for one page in one language: title, description, canonical and the
 * hreflang set for the same path in every enabled language, plus x-default (English).
 * `path` is the language-less path ("/services/walk-in").
 */
export function pageMetadata(args: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  settings: SiteSettings;
  image?: string;
}): Metadata {
  const { locale, path, title, description, settings, image } = args;
  const origin = siteOrigin();
  const enabled = locales.filter((l) => settings.languagesEnabled[l]);
  const languages: Record<string, string> = {};
  for (const l of enabled) languages[langTag[l]] = localePath(l, path);
  languages["x-default"] = localePath("en", path);

  return {
    title,
    description,
    metadataBase: origin ? new URL(origin) : undefined,
    alternates: { canonical: localePath(locale, path), languages },
    openGraph: {
      title,
      description,
      locale: langTag[locale].replace("-", "_"),
      siteName: settings.clinicName,
      type: "website",
      images: image ? [{ url: image }] : settings.seo.shareImage ? [{ url: settings.seo.shareImage.src }] : undefined,
    },
  };
}

/** schema.org MedicalClinic for one location, with opening hours, address and the former name during the rebrand. */
export function clinicJsonLd(location: Location, settings: SiteSettings, locale: Locale) {
  const origin = siteOrigin() ?? "";
  const a = location.address;
  const hours = location.regularHours
    .filter((d) => !d.closed && d.open && d.close && !d.tbc)
    .map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: WEEKDAY_NAMES[d.day],
      opens: d.open,
      closes: d.close,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${origin}${localePath("en", `/locations/${location.slug}`)}#clinic`,
    name: settings.clinicName,
    ...(settings.formerName ? { alternateName: settings.formerName } : {}),
    url: `${origin}${localePath(locale, "/")}`,
    telephone: e164(locationPhone(location, settings)),
    address: {
      "@type": "PostalAddress",
      streetAddress: [a.street, a.unit].filter(Boolean).join(", "),
      addressLocality: a.city,
      addressRegion: a.province,
      postalCode: a.postal,
      addressCountry: "CA",
    },
    ...(location.mapPoint ? { geo: { "@type": "GeoCoordinates", latitude: location.mapPoint.lat, longitude: location.mapPoint.lng } } : {}),
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    medicalSpecialty: ["PrimaryCare"],
    availableLanguage: locales.filter((l) => settings.languagesEnabled[l]).map((l) => langTag[l]),
    inLanguage: langTag[locale],
    description: t(settings.seo.description, locale),
  };
}

/** The script tag content for a page. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
