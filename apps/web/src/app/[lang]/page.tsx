/** The homepage (/en, /fr, /pt). Foundation version: shell wired to content; the editorial Homepage C layout replaces it next. */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink, CircleArrow, PrimaryAction } from "@/components/actions";
import { Icon } from "@/components/Icon";
import { DraftMark, PartlyEnglishNote, TemporaryPhotoBadge } from "@/components/Notices";
import { OpenStatus } from "@/components/OpenStatus";
import { Reveal } from "@/components/Reveal";
import { getPrimaryLocation, getServices, getSiteSettings, locationPhone, showDrafts, telHref } from "@/content";
import { bookAction } from "@/lib/booking";
import { hoursSummary } from "@/lib/hours";
import { anyFallback, getDictionary, isLocale, localePath, t } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

/**
 * Foundation homepage: the shell (header handover, phone bar, actions, type,
 * open-now line) wired to content. Every word comes from Site settings → Homepage
 * or from records; nothing is hard-coded. The full editorial homepage (design
 * canvas, Homepage C) replaces the layout in the next chunk.
 */

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const settings = await getSiteSettings();
  return pageMetadata({
    locale: lang,
    path: "/",
    title: settings.clinicName,
    description: t(settings.seo.description, lang),
    settings,
    image: settings.homepage.heroImage?.src,
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang;
  const dict = getDictionary(locale);
  const [settings, location, services] = await Promise.all([getSiteSettings(), getPrimaryLocation(), getServices()]);
  const home = settings.homepage;
  const book = bookAction(settings, dict);
  const phoneDisplay = locationPhone(location, settings);
  const hero = home.heroImage;
  const fellBack = anyFallback([home.heroHeadline, home.heroIntro, home.servicesHeading, home.welcomeHeading, home.welcomeText], locale);

  return (
    <>
      <PartlyEnglishNote dict={dict} show={fellBack} />

      <section className={styles.hero} aria-labelledby="hero-heading">
        {hero ? <Image src={hero.src} alt="" fill priority sizes="100vw" className={styles.heroPhoto} /> : null}
        <div className={styles.heroShade} aria-hidden="true" />
        {hero?.temporary ? <TemporaryPhotoBadge dict={dict} /> : null}
        <div className={`wrap ${styles.heroInner}`}>
          <h1 id="hero-heading" className="rise">
            {t(home.heroHeadline, locale)}
          </h1>
          <p className="rise rise-1" style={{ fontSize: 20, lineHeight: "32px", maxWidth: 560 }}>
            {t(home.heroIntro, locale)}
          </p>
          <div className={`${styles.heroRow} rise rise-2`}>
            <PrimaryAction href={book.href} tone="light" heroBook>
              {book.label}
            </PrimaryAction>
            <a href={telHref(phoneDisplay)} className={styles.tel}>
              <Icon name="phone" size={22} strokeWidth={3.5} />
              {phoneDisplay}
            </a>
            <OpenStatus location={location} dict={dict} locale={locale} fallback={hoursSummary(location, dict, locale)} className={styles.status} />
          </div>
        </div>
      </section>

      <Reveal as="section" className="wrap section">
        <div className={styles.intro}>
          <div className={styles.introText}>
            <span className="label">{dict.nav.find((n) => n.href === "/services")?.label}</span>
            <h2>{t(home.servicesHeading, locale)}</h2>
            <p>{t(home.welcomeText, locale)}</p>
            <ArrowLink href={localePath(locale, "/services")}>{dict.nav.find((n) => n.href === "/services")?.label}</ArrowLink>
          </div>
          <ul className={styles.list}>
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={localePath(locale, `/services/${s.slug}`)}>
                  {t(s.name, locale)}
                  {showDrafts && s.review === "draft" ? <DraftMark dict={dict} /> : null}
                </Link>
                <CircleArrow />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal as="section" className="on-alt feather">
        <div className="wrap section-tight" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span className="label">{t(location.name, locale)}</span>
          <h2>{t(home.welcomeHeading, locale)}</h2>
          <p>
            {[location.address.street, location.address.unit].filter(Boolean).join(", ")}, {location.address.neighbourhood ?? location.address.city} · {phoneDisplay}
          </p>
          <PrimaryAction href={localePath(locale, `/locations/${location.slug}`)} tone="ink" icon="location">
            {dict.nav.find((n) => n.href === "/locations")?.label}
          </PrimaryAction>
        </div>
      </Reveal>
    </>
  );
}
