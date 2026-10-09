"use client";

import { useEffect } from "react";
import { Icon } from "@/components/Icon";
import { useHeroBookGone } from "@/components/useHeroBookGone";
import type { Dictionary } from "@/lib/i18n";
import styles from "./PhoneBar.module.css";

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
    <div role="region" aria-label={dict.bookOrCall} className={styles.bar}>
      <a href={book.href} className={styles.book}>
        {book.label}
        <span className={`${styles.circle} ${styles.circleFilled}`} aria-hidden="true">
          <Icon name="arrow" size={22} strokeWidth={3.4} />
        </span>
      </a>
      <a href={phone.href} className={styles.call} aria-label={`${dict.callClinic}: ${phone.display}`}>
        {dict.call}
        <span className={`${styles.circle} ${styles.circleOutlined}`} aria-hidden="true">
          <Icon name="phone" size={22} strokeWidth={3.5} />
        </span>
      </a>
    </div>
  );
}
