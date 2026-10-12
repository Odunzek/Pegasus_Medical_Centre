/** The homepage (/en, /fr, /pt). Foundation version: shell wired to content; the editorial Homepage C layout replaces it next. */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink, CircleArrow, PrimaryAction } from "@/components/actions";
import { Icon, TEXT_ICON } from "@/components/Icon";
import { DraftMark, PartlyEnglishNote, TemporaryPhotoBadge } from "@/components/Notices";
import { OpenStatus } from "@/components/OpenStatus";
import { Reveal } from "@/components/Reveal";
import { formatAddress, getPrimaryLocation, getServices, getSiteSettings, locationPhone, showDrafts, telHref } from "@/content";
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

/** How many services the homepage lists before "All services". Six fits the two-column layout without scrolling on a laptop. */
const HOMEPAGE_SERVICE_COUNT = 6;

/** Homepage metadata. The title is the clinic name alone (`absolute`), not "name · name" through the layout's template. */
export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const settings = await getSiteSettings();
  const base = pageMetadata({
    locale: lang,
    path: "/",
    title: settings.clinicName,
    description: t(settings.seo.description, lang),
    settings,
    image: settings.homepage.heroImage?.src,
  });
  return { ...base, title: { absolute: settings.clinicName } };
}

/** The homepage for one language. Reads Site settings → Homepage for its words, the primary clinic for hours and phone, and the live services. */
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
          <p className="rise rise-1 intro-text">
            {t(home.heroIntro, locale)}
          </p>
          <div className={`${styles.heroRow} rise rise-2`}>
            <PrimaryAction href={book.href} tone="light" heroBook>
              {book.label}
            </PrimaryAction>
            <a href={telHref(phoneDisplay)} className={styles.tel}>
              <Icon name="phone" {...TEXT_ICON} />
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
            {services.slice(0, HOMEPAGE_SERVICE_COUNT).map((s) => (
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
        <div className="wrap section-tight stack">
          <span className="label">{t(location.name, locale)}</span>
          <h2>{t(home.welcomeHeading, locale)}</h2>
          <p>
            {formatAddress(location, "short")} · {phoneDisplay}
          </p>
          <PrimaryAction href={localePath(locale, `/locations/${location.slug}`)} tone="ink" icon="location">
            {dict.nav.find((n) => n.href === "/locations")?.label}
          </PrimaryAction>
        </div>
      </Reveal>
    </>
  );
}
