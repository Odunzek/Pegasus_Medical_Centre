/** One clinic's page (/locations/[slug]). Placeholder body until the location chunk; metadata and static params come from Location records. */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { getLocation, getLocations, getSiteSettings } from "@/content";
import { isLocale, locales, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/** Pre-builds this route for every language and every record it has. */
export async function generateStaticParams() {
  const list = await getLocations();
  return locales.flatMap((lang) => list.map((l) => ({ lang, slug: l.slug })));
}

/** Title, description, canonical and hreflang for this page, built through pageMetadata() so every page is consistent. */
export async function generateMetadata({ params }: PageProps<"/[lang]/locations/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const [settings, location] = await Promise.all([getSiteSettings(), getLocation(slug)]);
  if (!location) return {};
  return pageMetadata({
    locale: lang,
    path: `/locations/${slug}`,
    title: t(location.seo?.title, lang) || t(location.name, lang),
    description: t(location.seo?.description, lang) || t(settings.seo.description, lang),
    settings,
    image: location.photos?.exterior?.src,
  });
}

/** One clinic's page. Placeholder body until the location chunk. */
export default async function LocationPage({ params }: PageProps<"/[lang]/locations/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const location = await getLocation(slug);
  if (!location) notFound();
  return <ComingSoon locale={lang} title={t(location.name, lang)} />;
}
