"use client";

import { useSyncExternalStore } from "react";
import type { Location } from "@/content/types";
import { describeStatus, openStatus } from "@/lib/hours";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * "Open now, until 6:00 p.m." computed in the browser from the location's hours
 * (Toronto time), refreshed every minute. The server renders `fallback` (the hours
 * line) so static HTML never carries a stale time, and users without JavaScript
 * still see the hours.
 */
export function OpenStatus({
  location,
  dict,
  locale,
  fallback,
  className,
}: {
  location: Pick<Location, "regularHours" | "hoursExceptions">;
  dict: Dictionary;
  locale: Locale;
  fallback?: string;
  className?: string;
}) {
  const minute = useSyncExternalStore(subscribeMinute, currentMinute, () => 0);
  const text = minute === 0 ? "" : describeStatus(openStatus(location, new Date(minute * 60_000)), dict, locale);
  const shown = text || fallback || "";
  if (!shown) return null;
  return (
    <span className={className} role="status" aria-live="polite">
      {shown}
    </span>
  );
}

function currentMinute() {
  return Math.floor(Date.now() / 60_000);
}

function subscribeMinute(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}
