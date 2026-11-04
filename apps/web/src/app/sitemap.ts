/** sitemap.xml: every public page in every enabled language, with hreflang alternates. Drafts, planned services and disabled languages are never listed. */

import type { MetadataRoute } from "next";
import { getLocations, getPages, getProviders, getServices, getSiteSettings } from "@/content";
import { langTag, localePath, locales } from "@/lib/i18n";
import { siteOrigin } from "@/lib/seo";

/** How often each page is expected to change, and its relative importance, as hints to crawlers. */
const HOMEPAGE = { changeFrequency: "weekly" as const, priority: 1 };
const OTHER_PAGE = { changeFrequency: "monthly" as const, priority: 0.7 };

/**
 * Every public page in every enabled language, with hreflang alternates.
 * Provider pages are listed only for published providers; there are none yet, and the
 * /doctors/[slug] route is added with the first one (Cache Components refuses an empty route).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin() ?? "http://localhost:3000";
  const [settings, services, locations, providers, pages] = await Promise.all([getSiteSettings(), getServices(), getLocations(), getProviders(), getPages()]);
  const enabled = locales.filter((l) => settings.languagesEnabled[l]);

  const paths = [
    "/",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/locations",
    ...locations.map((l) => `/locations/${l.slug}`),
    "/doctors",
    ...providers.map((p) => `/doctors/${p.slug}`),
    "/resources",
    "/contact",
    ...pages.map((p) => `/${p.slug}`),
  ];

  return paths.flatMap((path) =>
    enabled.map((locale) => ({
      url: `${origin}${localePath(locale, path)}`,
      ...(path === "/" ? HOMEPAGE : OTHER_PAGE),
      alternates: { languages: Object.fromEntries(enabled.map((l) => [langTag[l], `${origin}${localePath(l, path)}`])) },
    })),
  );
}
