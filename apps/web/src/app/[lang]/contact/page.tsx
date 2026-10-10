/** Contact page. Placeholder until the contact chunk (phone, address, hours, the name/phone/preferred-day form). */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { getSiteSettings } from "@/content";
import { getDictionary, isLocale, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

const path = "/contact";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const settings = await getSiteSettings();
  const title = getDictionary(lang).nav.find((n) => n.href === path)?.label ?? "";
  return pageMetadata({ locale: lang, path, title, description: t(settings.seo.description, lang), settings });
}

export default async function Page({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const title = getDictionary(lang).nav.find((n) => n.href === path)?.label ?? "";
  return <ComingSoon locale={lang} title={title} />;
}
