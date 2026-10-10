/** The root layout for every language: fonts, metadata defaults, skip link, header, announcement bar, footer, phone bar and the clinic's structured data. Guards unknown or disabled languages. */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { PhoneBar } from "@/components/PhoneBar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocations, getPrimaryLocation, getSiteSettings, locationPhone, telHref } from "@/content";
import { bookAction } from "@/lib/booking";
import { getDictionary, isLocale, langTag, locales, t, type Locale } from "@/lib/i18n";
import { clinicJsonLd, jsonLdScript, pageMetadata } from "@/lib/seo";
import { lora, montserrat } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Site-wide defaults; each page overrides title/description/canonical through pageMetadata(). */
export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const settings = await getSiteSettings();
  const base = pageMetadata({ locale: lang, path: "/", title: settings.clinicName, description: t(settings.seo.description, lang), settings });
  return { ...base, title: { default: settings.clinicName, template: `%s · ${settings.seo.titleSuffix}` } };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  const [settings, locations, primary] = await Promise.all([getSiteSettings(), getLocations(), getPrimaryLocation()]);
  // A language is public only when enabled in Site settings (after native review)
  if (!settings.languagesEnabled[locale]) notFound();

  const dict = getDictionary(locale);
  const book = bookAction(settings, dict);
  const phoneDisplay = locationPhone(primary, settings);
  const phone = { display: phoneDisplay, href: telHref(phoneDisplay) };

  return (
    <html lang={langTag[locale]} className={`${lora.variable} ${montserrat.variable}`}>
      <body>
        <a href="#content" className="skip-link">
          {dict.skipToContent}
        </a>
        <SiteHeader locale={locale} dict={dict} clinicName={settings.clinicName} languagesEnabled={settings.languagesEnabled} book={book} phone={phone} />
        <AnnouncementBar announcement={settings.announcement} locale={locale} />
        <main id="content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} settings={settings} locations={locations} book={book} />
        <PhoneBar dict={dict} book={book} phone={phone} />
        {locations
          .filter((l) => l.status === "open")
          .map((l) => (
            <script key={l.slug} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(clinicJsonLd(l, settings, locale)) }} />
          ))}
      </body>
    </html>
  );
}
