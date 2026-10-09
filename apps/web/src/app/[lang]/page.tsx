import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLink, CircleArrow, PrimaryAction } from "@/components/actions";
import { Icon } from "@/components/Icon";
import { OpenStatus } from "@/components/OpenStatus";
import { Reveal } from "@/components/Reveal";
import { getPrimaryLocation, getServices, getSiteSettings } from "@/content";
import { bookAction } from "@/lib/booking";
import { formatTime } from "@/lib/hours";
import { getDictionary, isLocale, localePath, t } from "@/lib/i18n";
import styles from "./page.module.css";

/**
 * Foundation homepage: the shell (header handover, phone bar, actions, type,
 * open-now line) wired to sample content. The full editorial homepage
 * (design canvas, Homepage C) replaces this in the next chunk.
 */

const copy = {
  en: {
    headline: "Care that takes its time.",
    sub: "Family medicine and walk-in care in York, Toronto, in English, French and Portuguese.",
    servicesHeading: "How can we help today?",
    servicesLabel: "Services",
    all: "All services",
    aboutLabel: "The clinic",
    aboutHeading: "Everyone is welcome here",
    aboutBody:
      "Walk in during opening hours, book an appointment, or call us. Our family doctors and nurses are here for every age.",
    find: "Find us in York",
  },
  fr: {
    headline: "Des soins qui prennent le temps.",
    sub: "Médecine familiale et soins sans rendez-vous à York, Toronto, en anglais, en français et en portugais.",
    servicesHeading: "Comment pouvons-nous vous aider aujourd'hui ?",
    servicesLabel: "Services",
    all: "Tous les services",
    aboutLabel: "La clinique",
    aboutHeading: "Tout le monde est le bienvenu",
    aboutBody:
      "Passez pendant les heures d'ouverture, prenez rendez-vous ou appelez-nous. Nos médecins de famille et notre personnel infirmier sont là pour tous les âges.",
    find: "Nous trouver à York",
  },
  pt: {
    headline: "Cuidados com tempo para si.",
    sub: "Medicina familiar e atendimento sem marcação em York, Toronto, em inglês, francês e português.",
    servicesHeading: "Como podemos ajudar hoje?",
    servicesLabel: "Serviços",
    all: "Todos os serviços",
    aboutLabel: "A clínica",
    aboutHeading: "Todos são bem-vindos",
    aboutBody:
      "Venha durante o horário de abertura, marque uma consulta ou ligue-nos. Os nossos médicos de família e enfermeiros estão aqui para todas as idades.",
    find: "Como chegar a York",
  },
};

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang;
  const dict = getDictionary(locale);
  const c = copy[locale];
  const [settings, location, services] = await Promise.all([getSiteSettings(), getPrimaryLocation(), getServices("live")]);
  const book = bookAction(settings, dict);
  const phone = { display: location.phone ?? settings.patientPhone, href: location.phoneHref ?? settings.patientPhoneHref };
  const hero = services[0]?.image;
  const weekday = location.regularHours.find((d) => d.day === 1);
  const hoursFallback =
    weekday && !weekday.closed && weekday.open && weekday.close
      ? `${formatTime(weekday.open, locale)} – ${formatTime(weekday.close, locale)}`
      : "";

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-heading">
        {hero ? (
          <Image src={hero.src} alt="" fill priority sizes="100vw" className={styles.heroPhoto} />
        ) : null}
        <div className={styles.heroShade} aria-hidden="true" />
        {hero?.temporary ? <span className={styles.temp}>Temporary photo</span> : null}
        <div className={`wrap ${styles.heroInner}`}>
          <h1 id="hero-heading" className="rise">
            {c.headline}
          </h1>
          <p className="rise rise-1" style={{ fontSize: 20, lineHeight: "32px", maxWidth: 560 }}>
            {c.sub}
          </p>
          <div className={`${styles.heroRow} rise rise-2`}>
            <PrimaryAction href={book.href} tone="light" heroBook>
              {book.label}
            </PrimaryAction>
            <a href={`tel:${phone.href}`} className={styles.tel}>
              <Icon name="phone" size={22} strokeWidth={3.5} />
              {phone.display}
            </a>
            <OpenStatus location={location} dict={dict} locale={locale} fallback={hoursFallback} className={styles.status} />
          </div>
        </div>
      </section>

      <Reveal as="section" className="wrap section">
        <div className={styles.intro}>
          <div className={styles.introText}>
            <span className="label">{c.servicesLabel}</span>
            <h2>{c.servicesHeading}</h2>
            <p>{c.aboutBody}</p>
            <ArrowLink href={localePath(locale, "/services")}>{c.all}</ArrowLink>
          </div>
          <ul className={styles.list}>
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={localePath(locale, `/services/${s.slug}`)}>{t(s.name, locale)}</Link>
                <CircleArrow />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal as="section" className="on-alt">
        <div className="wrap section-tight" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span className="label">{c.aboutLabel}</span>
          <h2>{c.aboutHeading}</h2>
          <p>
            {location.address.street}
            {location.address.unit ? `, ${location.address.unit}` : ""}, {location.address.city} · {phone.display}
          </p>
          <PrimaryAction href={localePath(locale, "/locations")} tone="ink" icon="location">
            {c.find}
          </PrimaryAction>
        </div>
      </Reveal>
    </>
  );
}
