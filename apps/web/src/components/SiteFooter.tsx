/** The site footer: every open or opening-soon clinic's address and phone, the emergency line, link columns and the language list. Facts come from Site settings and Location records; the four general pages it links (new patients, privacy, accessibility, terms) are fixed slugs by convention (content model, Page). */

import Link from "next/link";
import { Icon, TEXT_ICON } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { Year } from "@/components/Year";
import { formatAddress, locationPhone, telHref } from "@/content";
import type { Location, SiteSettings } from "@/content/types";
import { langTag, languageName, localePath, locales, t, type Dictionary, type Locale } from "@/lib/i18n";
import styles from "./SiteFooter.module.css";

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
    <div className={styles.col}>
      <span className="label">{title}</span>
      <div className={styles.links}>
        {links.map((l) => (
          <Link key={l.href} href={l.href.startsWith("tel:") || l.href.startsWith("http") ? l.href : localePath(locale, l.href)}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <footer className={`${styles.footer} on-inverse`}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo tone="white" height={70} />
            <p className={styles.tagline}>{t(settings.footerText, locale)}</p>
            {locations.map((location) => {
              const phone = locationPhone(location, settings);
              return (
                <address key={location.slug} className={styles.details} style={{ fontStyle: "normal" }}>
                  {locations.length > 1 ? <span className={styles.locName}>{t(location.name, locale)}</span> : null}
                  <span className={styles.address}>
                    <Icon name="location" {...TEXT_ICON} />
                    {formatAddress(location, "full")}
                  </span>
                  <a href={telHref(phone)} className={styles.tel}>
                    <Icon name="phone" {...TEXT_ICON} />
                    {phone}
                  </a>
                </address>
              );
            })}
            <p className={styles.emergency}>{t(settings.emergencyWording, locale)}</p>
            {settings.showHealth811 ? <p className={styles.emergency}>{dict.health811}</p> : null}
            {settings.social && settings.social.length > 0 ? (
              <div className={styles.links}>
                {settings.social.map((s) => (
                  <a key={s.href} href={s.href} rel="noopener">
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
          <div className={styles.col}>
            <span className="label">{dict.footer.languageHeading}</span>
            <div className={styles.links}>
              {locales
                .filter((l) => settings.languagesEnabled[l])
                .map((l) => (
                  <Link key={l} href={localePath(l, "/")} lang={l} hrefLang={langTag[l]}>
                    {languageName[l]}
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className={styles.legal}>
          <p>
            © <Year /> {settings.legalName}. {dict.footer.rights}
          </p>
          <div className={styles.legalLinks}>
            {dict.footerPages.slice(1).map((p) => (
              <Link key={p.href} href={localePath(locale, p.href)}>
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
