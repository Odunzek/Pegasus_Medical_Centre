"use client";

import { useSyncExternalStore } from "react";
import type { SiteSettings } from "@/content/types";
import { clinicClock } from "@/lib/hours";
import { t, type Locale } from "@/lib/i18n";
import styles from "./AnnouncementBar.module.css";

/**
 * The announcement bar from Site settings ("Flu shots from October", "Closed Monday").
 * Shown only while `on` and inside the start/end dates, judged on the Toronto date
 * in the browser so static pages never carry a stale decision.
 */
export function AnnouncementBar({ announcement, locale }: { announcement: SiteSettings["announcement"]; locale: Locale }) {
  const today = useSyncExternalStore(subscribeDay, torontoToday, () => "");

  if (!announcement?.on || !today) return null;
  if (announcement.start && today < announcement.start) return null;
  if (announcement.end && today > announcement.end) return null;

  const text = t(announcement.text, locale);
  return (
    <div className={styles.bar} role="region" aria-label="Announcement">
      <p className="wrap">{announcement.href ? <a href={announcement.href}>{text}</a> : text}</p>
    </div>
  );
}

function torontoToday() {
  return clinicClock(new Date()).date;
}

function subscribeDay(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}
