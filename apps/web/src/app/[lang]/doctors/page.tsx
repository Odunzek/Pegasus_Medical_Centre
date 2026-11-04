/** Our doctors (index). Placeholder until the doctors chunk; metadata is already built through pageMetadata(). */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { getPrimaryLocation, getSiteSettings } from "@/content";
import { fill, getDictionary, isLocale, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const path = "/doctors";

/** Title, description, canonical and hreflang for this page, built through pageMetadata() so every page is consistent. */
export async function generateMetadata({ params }: PageProps<"/[lang]/doctors">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const [settings, clinic] = await Promise.all([getSiteSettings(), getPrimaryLocation()]);
  // "What and where": the neighbourhood of the primary clinic, so the tab reads "Services in York"
  const place = clinic.address.neighbourhood ?? clinic.address.city;
  const title = fill(getDictionary(lang).pageTitles[path], { place });
  return pageMetadata({ locale: lang, path, title, description: t(settings.seo.description, lang), settings });
}

/** The page body. Placeholder until this page's template is built; see docs/agentic-workflow.md for the order. */
export default async function Page({ params }: PageProps<"/[lang]/doctors">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const title = getDictionary(lang).nav.find((n) => n.href === path)?.label ?? "";
  return <ComingSoon locale={lang} title={title} />;
}
