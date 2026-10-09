import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhoneBar } from "@/components/PhoneBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPrimaryLocation, getSiteSettings } from "@/content";
import { bookAction } from "@/lib/booking";
import { getDictionary, isLocale, langTag, localePath, locales, t, type Locale } from "@/lib/i18n";
import { lora, montserrat } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: { default: settings.clinicName, template: `%s · ${settings.seo.titleSuffix}` },
    description: t(settings.seo.description, lang),
    alternates: {
      languages: Object.fromEntries(locales.filter((l) => settings.languagesEnabled[l]).map((l) => [langTag[l], localePath(l, "/")])),
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const [settings, location] = await Promise.all([getSiteSettings(), getPrimaryLocation()]);
  const dict = getDictionary(locale);
  const book = bookAction(settings, dict);
  const phone = { display: location.phone ?? settings.patientPhone, href: location.phoneHref ?? settings.patientPhoneHref };

  return (
    <html lang={langTag[locale]} className={`${lora.variable} ${montserrat.variable}`}>
      <body>
        <a href="#content" className="skip-link">
          {dict.skipToContent}
        </a>
        <SiteHeader locale={locale} dict={dict} languagesEnabled={settings.languagesEnabled} book={book} phone={phone} />
        <main id="content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} settings={settings} location={location} book={book} />
        <PhoneBar dict={dict} book={book} phone={phone} />
      </body>
    </html>
  );
}
