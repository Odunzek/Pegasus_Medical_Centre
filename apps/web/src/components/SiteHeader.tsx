"use client";

/** The sticky site header: logo, main nav, language switch, the Book link that appears after the hero's Book, and the full-screen menu on narrow screens. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLink, CircleArrow, PrimaryAction } from "@/components/actions";
import { Icon, TEXT_ICON } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { useHeroBookGone } from "@/components/useHeroBookGone";
import { fill, langTag, languageName, localePath, locales, type Dictionary, type Locale } from "@/lib/i18n";
import styles from "./SiteHeader.module.css";

/** What the header needs from the layout: language, shell strings, which languages are on, the Book action and the phone. */
export type SiteHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  clinicName: string;
  languagesEnabled: Record<Locale, boolean>;
  book: { href: string; label: string; external: boolean };
  phone: { display: string; href: string };
};

/**
 * Deep Teal sticky header. On desktop: logo, main nav, language switch and, once
 * the hero's Book has scrolled away, a Book link. Under 1280px the nav folds into
 * a full-screen menu (a native <dialog>, so focus stays inside and Esc closes it).
 */
export function SiteHeader({ locale, dict, clinicName, languagesEnabled, book, phone }: SiteHeaderProps) {
  const homeLabel = fill(dict.home, { name: clinicName });
  const pathname = usePathname();
  const showBook = useHeroBookGone();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  // Paths without the language prefix, so "current page" works in every language
  const current = stripLocale(pathname);
  const enabledLocales = locales.filter((l) => languagesEnabled[l]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const langSwitch = (
    <nav aria-label={dict.language} className={styles.langs}>
      <Icon name="language" size={20} className={styles.langIcon} strokeWidth={3.5} />
      {enabledLocales.map((l, i) => (
        <span key={l} style={{ display: "contents" }}>
          {i > 0 ? (
            <span aria-hidden="true" className={styles.sep}>
              |
            </span>
          ) : null}
          <Link
            href={localePath(l, current)}
            lang={l}
            hrefLang={langTag[l]}
            aria-current={l === locale ? "true" : undefined}
            aria-label={l === locale ? `${languageName[l]} (${dict.language})` : languageName[l]}
            className={`${styles.lang} ${l === locale ? styles.langOn : ""}`}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.bar}`}>
        <Link href={localePath(locale, "/")} className={styles.home} aria-label={homeLabel}>
          <Logo tone="white" height={60} priority className={styles.logoWide} />
          <Logo tone="white" compact height={44} priority className={styles.logoNarrow} />
        </Link>

        <nav aria-label={dict.mainMenu} className={styles.nav}>
          {dict.nav.map((item) => (
            <Link
              key={item.href}
              href={localePath(locale, item.href)}
              aria-current={current === item.href || current.startsWith(`${item.href}/`) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          {langSwitch}
          <div className={styles.bookSlot} data-testid="header-book">
            {showBook ? (
              <ArrowLink href={book.href} className={`${styles.bookLink} rise`}>
                {book.label}
              </ArrowLink>
            ) : null}
          </div>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={dict.openMenu}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" {...TEXT_ICON} />
          </button>
        </div>
      </div>

      <dialog ref={dialogRef} className={styles.dialog} aria-label={dict.mainMenu} onClose={() => setOpen(false)}>
        <div className={`wrap ${styles.dialogInner}`}>
          <div className={styles.dialogTop}>
            <Link href={localePath(locale, "/")} aria-label={homeLabel} onClick={() => setOpen(false)}>
              <Logo tone="white" compact height={44} />
            </Link>
            <button type="button" className={styles.menuButton} style={{ display: "inline-flex" }} aria-label={dict.closeMenu} onClick={() => setOpen(false)}>
              <Icon name="close" {...TEXT_ICON} />
            </button>
          </div>
          <nav aria-label={dict.mainMenu}>
            <ul className={styles.menuList}>
              {dict.nav.map((item) => (
                <li key={item.href}>
                  <Link href={localePath(locale, item.href)} onClick={() => setOpen(false)}>
                    {item.label}
                    <CircleArrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.menuFoot}>
            <PrimaryAction href={book.href} tone="light">
              {book.label}
            </PrimaryAction>
            <a href={phone.href} className={styles.menuCall}>
              <Icon name="phone" {...TEXT_ICON} />
              {dict.callClinic}: {phone.display}
            </a>
            <div className={styles.menuLangs} role="group" aria-label={dict.language}>
              {enabledLocales.map((l) => (
                <Link key={l} href={localePath(l, current)} lang={l} hrefLang={langTag[l]} aria-current={l === locale ? "true" : undefined}>
                  {languageName[l]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </dialog>
    </header>
  );
}

/** The language-less path: /fr/services → /services. */
function stripLocale(pathname: string): string {
  for (const l of locales) {
    const prefix = `/${l}`;
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname || "/";
}
