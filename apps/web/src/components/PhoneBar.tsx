"use client";

/** The Book + Call bar pinned to the bottom of phone screens. */

import { useEffect } from "react";
import { Icon, TEXT_ICON } from "@/components/Icon";
import { useHeroBookGone } from "@/components/useHeroBookGone";
import type { Dictionary } from "@/lib/i18n";

/**
 * The bar: hidden from 768px up; on phones a fixed grid at the bottom that slides up once.
 * The bottom padding grows on phones with a home indicator (safe-area inset) so nothing sits under it.
 */
const BAR =
  "focus-on-inverse fixed inset-x-0 bottom-0 z-25 hidden h-phone-bar grid-cols-[1.5fr_1fr] items-center gap-3 px-5 pt-3 pb-[max(--spacing(3),env(safe-area-inset-bottom))] " +
  "bg-surface-inverse text-ink-on-inverse animate-slide-up motion-reduce:animate-none max-md:grid";

/** The 48px circle beside each action. */
const CIRCLE = "inline-flex size-circle-secondary flex-none items-center justify-center rounded-full";

/**
 * Book + Call bar pinned to the bottom on phones. It appears once the hero's Book
 * has scrolled away (at once on pages without one), so a phone screen never shows
 * two Book actions.
 */
export function PhoneBar({
  dict,
  book,
  phone,
}: {
  dict: Dictionary;
  book: { href: string; label: string };
  phone: { display: string; href: string };
}) {
  const show = useHeroBookGone();

  useEffect(() => {
    document.body.classList.toggle("has-phone-bar", show);
    return () => document.body.classList.remove("has-phone-bar");
  }, [show]);

  if (!show) return null;

  return (
    <div role="region" aria-label={dict.bookOrCall} className={BAR}>
      <a href={book.href} className="flex min-h-14 items-center justify-between gap-3 font-serif text-bar font-medium text-white no-underline hover:text-white">
        {book.label}
        <span className={`${CIRCLE} bg-soft-green text-deep-teal`} aria-hidden="true">
          <Icon name="arrow" size={22} strokeWidth={3.4} />
        </span>
      </a>
      <a href={phone.href} className="flex min-h-14 items-center justify-end gap-2.5 border-l border-white/25 pl-3 text-small/5.5 font-semibold text-white no-underline hover:text-white" aria-label={`${dict.callClinic}: ${phone.display}`}>
        {dict.call}
        <span className={`${CIRCLE} border-2 border-soft-green text-white`} aria-hidden="true">
          <Icon name="phone" {...TEXT_ICON} />
        </span>
      </a>
    </div>
  );
}
