/** Our doctors (index). Placeholder until the doctors chunk; metadata is already built through pageMetadata(). */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { getSiteSettings } from "@/content";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const path = "/doctors";

export async function generateMetadata({ params }: PageProps<"/[lang]/doctors">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const settings = await getSiteSettings();
  const title = getDictionary(lang).nav.find((n) => n.href === path)?.label ?? "";
  return pageMetadata({ locale: lang, path, title, description: t(settings.seo.description, lang), settings });
}

export default async function Page({ params }: PageProps<"/[lang]/doctors">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const title = getDictionary(lang).nav.find((n) => n.href === path)?.label ?? "";
  return <ComingSoon locale={lang} title={title} />;
}
