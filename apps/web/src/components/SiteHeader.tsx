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

/** A main-menu link: white, full tap height, with a soft-green bar that grows in on hover, focus and the current page. */
const NAV_LINK =
  "relative inline-flex min-h-tap items-center whitespace-nowrap text-white no-underline " +
  "after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-soft-green after:transition-transform after:duration-220 motion-reduce:after:transition-none " +
  "hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=page]:after:scale-x-100";

/** One language in the header switch. Under 1280px only the current language shows (the menu lists them all). */
const LANG_LINK = "inline-flex min-h-tap min-w-tap items-center justify-center text-white no-underline opacity-75 hover:text-white hover:opacity-100";
const LANG_CURRENT = "opacity-100 underline decoration-soft-green decoration-2 underline-offset-5";

/** The round 44px menu and close buttons. */
const MENU_BUTTON = "inline-flex size-11 items-center justify-center rounded-full border-2 border-white/60 text-white hover:border-soft-green";

/** A link in the full-screen menu: Lora, one per row, with a rule under it. */
const MENU_LINK =
  "flex min-h-16 items-center justify-between gap-4 border-b border-white/20 py-2 font-serif text-menu font-medium text-white no-underline " +
  "hover:text-white hover:underline hover:decoration-thin hover:underline-offset-6 hover:decoration-soft-green";

/** A language in the full-screen menu; the current one is underlined. */
const MENU_LANG =
  "inline-flex min-h-tap items-center font-semibold text-white no-underline opacity-80 " +
  "aria-[current=true]:underline aria-[current=true]:decoration-soft-green aria-[current=true]:decoration-2 aria-[current=true]:underline-offset-5 aria-[current=true]:opacity-100";

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
    <nav aria-label={dict.language} className="flex items-center gap-0.5 text-small/5 font-semibold">
      <Icon name="language" size={20} className="mr-1.5 max-xl:hidden" strokeWidth={3.5} />
      {enabledLocales.map((l, i) => (
        <span key={l} className="contents">
          {i > 0 ? (
            <span aria-hidden="true" className="opacity-50 max-xl:hidden">
              |
            </span>
          ) : null}
          <Link
            href={localePath(l, current)}
            lang={l}
            hrefLang={langTag[l]}
            aria-current={l === locale ? "true" : undefined}
            aria-label={l === locale ? `${languageName[l]} (${dict.language})` : languageName[l]}
            className={`${LANG_LINK} ${l === locale ? LANG_CURRENT : "max-xl:hidden"}`}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );

  return (
    <header className="focus-on-inverse sticky top-0 z-30 bg-surface-inverse text-ink-on-inverse">
      <div className="wrap flex h-header min-w-0 items-center justify-between gap-4">
        <Link href={localePath(locale, "/")} className="block flex-none no-underline" aria-label={homeLabel}>
          <Logo tone="reversed-colour" height={60} priority className="block max-md:hidden" />
          <Logo tone="reversed-colour" compact height={44} priority className="hidden max-md:block" />
        </Link>

        <nav aria-label={dict.mainMenu} className="flex items-center gap-5 text-ui/6 font-medium max-xl:hidden">
          {dict.nav.map((item) => (
            <Link
              key={item.href}
              href={localePath(locale, item.href)}
              aria-current={current === item.href || current.startsWith(`${item.href}/`) ? "page" : undefined}
              className={NAV_LINK}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-4 max-md:gap-1.5">
          {langSwitch}
          <div className="flex min-w-0 justify-end max-xl:hidden" data-testid="header-book">
            {showBook ? (
              <ArrowLink href={book.href} size="small" className="rise max-w-50 text-right">
                {book.label}
              </ArrowLink>
            ) : null}
          </div>
          <button
            type="button"
            className={`${MENU_BUTTON} xl:hidden`}
            aria-label={dict.openMenu}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" {...TEXT_ICON} />
          </button>
        </div>
      </div>

      <dialog ref={dialogRef} className="fixed inset-0 m-0 size-full max-h-none max-w-none bg-surface-inverse text-ink-on-inverse backdrop:bg-deep-teal/50" aria-label={dict.mainMenu} onClose={() => setOpen(false)}>
        <div className="wrap flex min-h-full flex-col">
          <div className="flex h-header items-center justify-between">
            <Link href={localePath(locale, "/")} aria-label={homeLabel} onClick={() => setOpen(false)}>
              <Logo tone="reversed-colour" compact height={44} />
            </Link>
            <button type="button" className={MENU_BUTTON} aria-label={dict.closeMenu} onClick={() => setOpen(false)}>
              <Icon name="close" {...TEXT_ICON} />
            </button>
          </div>
          <nav aria-label={dict.mainMenu}>
            <ul className="pt-4">
              {dict.nav.map((item) => (
                <li key={item.href}>
                  <Link href={localePath(locale, item.href)} onClick={() => setOpen(false)} className={MENU_LINK}>
                    {item.label}
                    <CircleArrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-6 pt-8 pb-10">
            <PrimaryAction href={book.href} tone="light">
              {book.label}
            </PrimaryAction>
            <a href={phone.href} className="inline-flex min-h-tap items-center gap-3 font-semibold text-white underline decoration-soft-green decoration-2 underline-offset-6">
              <Icon name="phone" {...TEXT_ICON} />
              {dict.callClinic}: {phone.display}
            </a>
            <div className="flex flex-wrap gap-5" role="group" aria-label={dict.language}>
              {enabledLocales.map((l) => (
                <Link key={l} href={localePath(l, current)} lang={l} hrefLang={langTag[l]} aria-current={l === locale ? "true" : undefined} className={MENU_LANG}>
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
