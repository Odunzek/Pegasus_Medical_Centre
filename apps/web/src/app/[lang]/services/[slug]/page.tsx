/** One service's page (/services/[slug]). Placeholder body until the services chunk; metadata and static params come from live Service records. */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { getService, getServices, getSiteSettings } from "@/content";
import { isLocale, locales, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/** Pre-builds this route for every language and every record it has. */
export async function generateStaticParams() {
  const services = await getServices();
  return locales.flatMap((lang) => services.map((s) => ({ lang, slug: s.slug })));
}

/** Title, description, canonical and hreflang for this page, built through pageMetadata() so every page is consistent. */
export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const [settings, service] = await Promise.all([getSiteSettings(), getService(slug)]);
  if (!service) return {};
  return pageMetadata({
    locale: lang,
    path: `/services/${slug}`,
    title: t(service.seo?.title, lang) || t(service.name, lang),
    description: t(service.seo?.description, lang) || t(service.summary, lang),
    settings,
    image: service.image?.src,
  });
}

/** One service's page. Placeholder body until the services chunk; 404 for planned or hidden services. */
export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const service = await getService(slug);
  if (!service) notFound();
  return <ComingSoon locale={lang} title={t(service.name, lang)} />;
}
