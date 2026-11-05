/** The site footer: every open or opening-soon clinic's address and phone, the emergency line, link columns and the language list. Facts come from Site settings and Location records; the four general pages it links (new patients, privacy, accessibility, terms) are fixed slugs by convention (content model, Page). */

import Link from "next/link";
import { Icon, TEXT_ICON } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { Year } from "@/components/Year";
import { formatAddress, locationPhone, telHref } from "@/content";
import type { Location, SiteSettings } from "@/content/types";
import { langTag, languageName, localePath, locales, t, type Dictionary, type Locale } from "@/lib/i18n";

/** A link in a footer column: white, full tap height, underlined on hover. */
const FOOTER_LINK =
  "inline-flex min-h-tap items-center text-ui/6.5 text-white no-underline hover:text-white hover:underline hover:decoration-thin hover:underline-offset-5 hover:decoration-soft-green";

/** Brand column a little wider than the three link columns; two columns on tablets (brand across the top), one on phones. */
const FOOTER_COLUMNS = "grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-8";

/** A heading over a column of footer links. */
const COLUMN = "flex flex-col gap-3.5";

/** Deep Teal footer: every open or opening-soon clinic's address and phone, the emergency line, links in each language. */
export function SiteFooter({
  locale,
  dict,
  settings,
  locations,
  book,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
  locations: Location[];
  book: { href: string; label: string };
}) {
  const col = (title: string, links: { href: string; label: string }[]) => (
    <div className={COLUMN}>
      <span className="label">{title}</span>
      <div className="flex flex-col">
        {links.map((l) => (
          <Link key={l.href} href={l.href.startsWith("tel:") || l.href.startsWith("http") ? l.href : localePath(locale, l.href)} className={FOOTER_LINK}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <footer className="on-inverse">
      <div className="wrap flex flex-col gap-16 pt-22 pb-10 max-md:gap-10 max-md:pt-14 max-md:pb-8">
        <div className={FOOTER_COLUMNS}>
          <div className="flex flex-col gap-6 max-lg:col-span-full">
            <Logo tone="reversed-colour" height={70} />
            <p className="max-w-95 font-serif text-row/8.5 font-medium max-md:text-lead/7.5">{t(settings.footerText, locale)}</p>
            {locations.map((location) => {
              const phone = locationPhone(location, settings);
              return (
                <address key={location.slug} className="flex flex-col gap-1.5 text-ui/6.75 not-italic">
                  {locations.length > 1 ? <span className="font-semibold">{t(location.name, locale)}</span> : null}
                  <span className="flex items-start gap-3 [&_svg]:mt-0.75 [&_svg]:flex-none">
                    <Icon name="location" {...TEXT_ICON} />
                    {formatAddress(location, "full")}
                  </span>
                  <a href={telHref(phone)} className="inline-flex min-h-tap items-center gap-3 font-semibold text-white underline decoration-soft-green decoration-2 underline-offset-6">
                    <Icon name="phone" {...TEXT_ICON} />
                    {phone}
                  </a>
                </address>
              );
            })}
            <p className="text-small text-soft-green">{t(settings.emergencyWording, locale)}</p>
            {settings.showHealth811 ? <p className="text-small text-soft-green">{dict.health811}</p> : null}
            {settings.social && settings.social.length > 0 ? (
              <div className="flex flex-col">
                {settings.social.map((s) => (
                  <a key={s.href} href={s.href} rel="noopener" className={FOOTER_LINK}>
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Which nav items and which general pages the footer links is a dictionary decision, not a code one */}
          {col(dict.footer.clinic, dict.nav.filter((n) => dict.footerNav.includes(n.href)))}
          {col(dict.footer.patients, [
            dict.footerPages[0],
            { href: book.href, label: book.label },
            { href: "/resources", label: dict.footer.questions },
            { href: "/contact", label: dict.footer.contact },
          ])}
          <div className={COLUMN}>
            <span className="label">{dict.footer.languageHeading}</span>
            <div className="flex flex-col">
              {locales
                .filter((l) => settings.languagesEnabled[l])
                .map((l) => (
                  <Link key={l} href={localePath(l, "/")} lang={l} hrefLang={langTag[l]} className={FOOTER_LINK}>
                    {languageName[l]}
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-white/25 pt-6 text-small">
          <p>
            © <Year /> {settings.legalName}. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap gap-7">
            {dict.footerPages.slice(1).map((p) => (
              <Link key={p.href} href={localePath(locale, p.href)} className="inline-flex min-h-tap items-center text-white no-underline hover:underline hover:decoration-soft-green">
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
