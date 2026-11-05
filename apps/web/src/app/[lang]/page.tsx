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

/**
 * Foundation homepage: the shell (header handover, phone bar, actions, type,
 * open-now line) wired to content. Every word comes from Site settings → Homepage
 * or from records; nothing is hard-coded. The full editorial homepage (design
 * canvas, Homepage C) replaces the layout in the next chunk.
 */

/**
 * The hero's height: three-quarters of the screen (a little more on phones) so the next
 * section peeks in, between a floor and a ceiling so very short or tall screens still work.
 */
const HERO_HEIGHT = "h-[76vh] min-h-160 max-h-205 max-md:h-[80vh] max-md:min-h-140";

/** Fills the hero with the photo; the 60% 40% focus point keeps the subject's face in frame as the photo crops. */
const HERO_PHOTO_CROP = "object-cover object-[60%_40%]";

/** The hero headline wraps at about fourteen characters so it sits in two or three balanced lines over the photo. */
const HERO_HEADLINE_WIDTH = "max-w-[14ch]";

/** Services intro beside the list: the words a little wider than the list on desktop, stacked on phones. */
const INTRO_COLUMNS = "grid grid-cols-[1.1fr_1fr] items-start gap-16 max-md:grid-cols-1 max-md:gap-10";

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

      <section className={`focus-on-inverse relative flex items-end overflow-hidden text-white ${HERO_HEIGHT}`} aria-labelledby="hero-heading">
        {hero ? <Image src={hero.src} alt="" fill priority sizes="100vw" className={HERO_PHOTO_CROP} /> : null}
        <div className="absolute inset-0 bg-(image:--shade-hero)" aria-hidden="true" />
        {hero?.temporary ? <TemporaryPhotoBadge dict={dict} /> : null}
        <div className="wrap relative z-1 flex flex-col gap-8 pb-32 max-md:gap-6 max-md:pb-14">
          <h1 id="hero-heading" className={`rise ${HERO_HEADLINE_WIDTH}`}>
            {t(home.heroHeadline, locale)}
          </h1>
          <p className="rise rise-1 max-w-140 text-lead">
            {t(home.heroIntro, locale)}
          </p>
          <div className="rise rise-2 flex flex-wrap items-center gap-x-12 gap-y-6">
            <PrimaryAction href={book.href} tone="light" heroBook>
              {book.label}
            </PrimaryAction>
            <a href={telHref(phoneDisplay)} className="inline-flex min-h-tap items-center gap-3 text-action/(--text-body--line-height) font-semibold text-white underline decoration-soft-green decoration-2 underline-offset-6 hover:text-white">
              <Icon name="phone" {...TEXT_ICON} />
              {phoneDisplay}
            </a>
            <OpenStatus location={location} dict={dict} locale={locale} fallback={hoursSummary(location, dict, locale)} className="inline-flex items-center gap-2.5 text-ui/(--text-body--line-height) font-medium before:size-2.5 before:rounded-full before:bg-soft-green" />
          </div>
        </div>
      </section>

      <Reveal as="section" className="wrap section">
        <div className={INTRO_COLUMNS}>
          <div className="flex flex-col gap-6">
            <span className="label">{dict.nav.find((n) => n.href === "/services")?.label}</span>
            <h2>{t(home.servicesHeading, locale)}</h2>
            <p>{t(home.welcomeText, locale)}</p>
            <ArrowLink href={localePath(locale, "/services")}>{dict.nav.find((n) => n.href === "/services")?.label}</ArrowLink>
          </div>
          <ul className="border-t border-border">
            {services.slice(0, HOMEPAGE_SERVICE_COUNT).map((s) => (
              <li key={s.slug} className="flex items-center justify-between gap-6 border-b border-border py-5">
                <Link href={localePath(locale, `/services/${s.slug}`)} className="text-row font-medium no-underline">
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
