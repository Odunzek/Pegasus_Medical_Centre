import type { MetadataRoute } from "next";
import { getLocations, getPages, getProviders, getServices, getSiteSettings } from "@/content";
import { langTag, localePath, locales } from "@/lib/i18n";
import { siteOrigin } from "@/lib/seo";

/** Every public page in every enabled language, with hreflang alternates. */
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
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(enabled.map((l) => [langTag[l], `${origin}${localePath(l, path)}`])) },
    })),
  );
}
