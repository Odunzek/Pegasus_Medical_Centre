import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { Year } from "@/components/Year";
import type { Location, SiteSettings } from "@/content/types";
import { languageName, localePath, locales, t, type Dictionary, type Locale } from "@/lib/i18n";
import styles from "./SiteFooter.module.css";

export function SiteFooter({
  locale,
  dict,
  settings,
  location,
  book,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
  location: Location;
  book: { href: string; label: string };
}) {
  const a = location.address;
  const addressLine = `${a.street}${a.unit ? `, ${a.unit}` : ""}, ${a.city} ${a.province === "Ontario" ? "ON" : a.province} ${a.postal}`;
  const phone = location.phone ?? settings.patientPhone;
  const phoneHref = location.phoneHref ?? settings.patientPhoneHref;

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
            <p className={styles.tagline}>{dict.footer.tagline}</p>
            <address className={styles.details} style={{ fontStyle: "normal" }}>
              <span className={styles.address}>
                <Icon name="location" size={22} strokeWidth={3.5} />
                {addressLine}
              </span>
              <a href={`tel:${phoneHref}`} className={styles.tel}>
                <Icon name="phone" size={22} strokeWidth={3.5} />
                {phone}
              </a>
            </address>
            <p className={styles.emergency}>{t(settings.emergencyWording, locale)}</p>
          </div>

          {col(dict.footer.clinic, [
            ...dict.nav.filter((n) => ["/services", "/locations", "/doctors", "/about"].includes(n.href)),
          ])}
          {col(dict.footer.patients, [
            { href: "/new-patients", label: dict.footer.newPatients },
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
                  <Link key={l} href={localePath(l, "/")} lang={l} hrefLang={l}>
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
            <Link href={localePath(locale, "/privacy")}>{dict.footer.privacy}</Link>
            <Link href={localePath(locale, "/accessibility")}>{dict.footer.accessibility}</Link>
            <Link href={localePath(locale, "/terms")}>{dict.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
