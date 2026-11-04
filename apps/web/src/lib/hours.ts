/**
 * "Open now, until 6:00 p.m." is computed here from a Location's regular hours and
 * exceptions, always in Toronto time, never typed by staff. Pure functions; the
 * OpenStatus component calls them in the browser so static pages stay static.
 */

import type { DayHours, HoursException, Location, Weekday } from "@/content/types";
import type { Dictionary, Locale } from "@/lib/i18n";
import { fill } from "@/lib/i18n";

/** Every clinic is in Toronto; hours are always judged in this zone, whatever the visitor's clock says. */
export const CLINIC_TIME_ZONE = "America/Toronto";

/** English weekday names in Date order (0 = Sunday). schema.org and Intl both use English here; patient-facing names come from the dictionary. */
export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const SHORT_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** A moment in the clinic's local time: the date, the weekday (0 = Sunday) and minutes since midnight. */
export type LocalClock = { date: string; day: Weekday; minutes: number };

/** The clinic's local date, weekday and minutes-since-midnight for an instant. */
export function clinicClock(now: Date, timeZone = CLINIC_TIME_ZONE): LocalClock {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = SHORT_WEEKDAYS.indexOf(get("weekday")) as Weekday;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    day,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/** "18:30" → 1110 (minutes since midnight), so times can be compared as numbers. */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** "18:00" → "6:00 p.m." (en), "18 h 00" (fr), "18:00" (pt). */
export function formatTime(hhmm: string, locale: Locale): string {
  const [h, m] = hhmm.split(":").map(Number);
  const mm = String(m || 0).padStart(2, "0");
  // Canadian French writes "9 h" on the hour and "9 h 30" otherwise (voice guide, section 6)
  if (locale === "fr") return mm === "00" ? `${h} h` : `${h} h ${mm}`;
  if (locale === "pt") return `${String(h).padStart(2, "0")}:${mm}`;
  const suffix = h < 12 ? "a.m." : "p.m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm} ${suffix}`;
}

/** The hours that apply on one date, after exceptions are considered. */
export type DaySchedule = { closed: boolean; open?: string; close?: string; note?: HoursException["note"]; tbc?: boolean };

/** The effective hours for a calendar date: an exception if there is one, else the regular day. */
export function scheduleFor(location: Pick<Location, "regularHours" | "hoursExceptions">, date: string, day: Weekday): DaySchedule {
  // An exception is entered for a specific date, so it is never "to be confirmed"
  const exception = location.hoursExceptions.find((e) => e.date === date);
  if (exception) {
    return { closed: exception.closed, open: exception.open, close: exception.close, note: exception.note };
  }
  const regular: DayHours | undefined = location.regularHours.find((d) => d.day === day);
  if (!regular || regular.closed) return { closed: true, tbc: regular?.tbc };
  return { closed: false, open: regular.open, close: regular.close, tbc: regular.tbc };
}

/** Whether the clinic is open at a moment, and when that changes. */
export type OpenStatus =
  | { state: "open"; closesAt: string }
  | { state: "closed"; opensAt: string; opensDay: Weekday; opensToday: boolean }
  /** Today's hours are flagged "to be confirmed": say so rather than guess. */
  | { state: "tbc" }
  | { state: "unknown" };

/** "2026-10-09" + 1 → "2026-10-10". Noon UTC is used so a daylight-saving change can never shift the date. */
function addDays(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Open or closed at `now`, and when that changes. Looks up to a week ahead for the next opening. */
export function openStatus(location: Pick<Location, "regularHours" | "hoursExceptions">, now: Date): OpenStatus {
  const clock = clinicClock(now);
  const today = scheduleFor(location, clock.date, clock.day);

  if (today.tbc) return { state: "tbc" };

  if (!today.closed && today.open && today.close) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (clock.minutes >= open && clock.minutes < close) {
      return { state: "open", closesAt: today.close };
    }
    if (clock.minutes < open) {
      return { state: "closed", opensAt: today.open, opensDay: clock.day, opensToday: true };
    }
  }

  for (let i = 1; i <= 7; i++) {
    const date = addDays(clock.date, i);
    const day = ((clock.day + i) % 7) as Weekday;
    const s = scheduleFor(location, date, day);
    if (s.tbc) continue;
    if (!s.closed && s.open) {
      return { state: "closed", opensAt: s.open, opensDay: day, opensToday: false };
    }
  }
  return { state: "unknown" };
}

/** A short sentence for the status: "Open now, until 6:00 p.m." / "Closed now, opens Monday at 9:00 a.m." */
export function describeStatus(status: OpenStatus, dict: Dictionary, locale: Locale): string {
  if (status.state === "open") {
    return `${dict.hours.openNow}, ${fill(dict.hours.openUntil, { time: formatTime(status.closesAt, locale) })}`;
  }
  if (status.state === "closed") {
    const time = formatTime(status.opensAt, locale);
    const when = status.opensToday
      ? fill(dict.hours.opensAt, { time })
      : fill(dict.hours.opensOn, { day: dict.hours.days[status.opensDay], time });
    return `${dict.hours.closedNow}, ${when}`;
  }
  if (status.state === "tbc") return dict.hours.tbc;
  return "";
}

/** "9:00 a.m. to 6:00 p.m." in the locale's wording. */
export function formatRange(open: string, close: string, dict: Dictionary, locale: Locale): string {
  return fill(dict.hours.to, { open: formatTime(open, locale), close: formatTime(close, locale) });
}

/**
 * A one-line summary of the regular week for static fallbacks and metadata:
 * "Monday to Friday 9:00 a.m. to 6:00 p.m., Saturday 9:00 a.m. to 2:00 p.m." Groups
 * consecutive days with identical hours. Days flagged tbc are bracketed.
 */
export function hoursSummary(location: Pick<Location, "regularHours">, dict: Dictionary, locale: Locale): string {
  const order: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
  const groups: { from: Weekday; to: Weekday; text: string }[] = [];
  for (const day of order) {
    const d = location.regularHours.find((r) => r.day === day);
    if (!d || d.closed || !d.open || !d.close) continue;
    let text = formatRange(d.open, d.close, dict, locale);
    if (d.tbc) text = `[${text}]`;
    const last = groups[groups.length - 1];
    if (last && last.text === text && order.indexOf(last.to) === order.indexOf(day) - 1) last.to = day;
    else groups.push({ from: day, to: day, text });
  }
  return groups
    .map((g) => `${g.from === g.to ? dict.hours.days[g.from] : fill(dict.hours.dayRange, { from: dict.hours.days[g.from], to: dict.hours.days[g.to] })} ${g.text}`)
    .join(", ");
}

/** Rows for an hours table: Monday first, each day's open–close or "Closed". */
export function hoursRows(location: Pick<Location, "regularHours">, dict: Dictionary, locale: Locale) {
  const order: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
  return order.map((day) => {
    const d = location.regularHours.find((r) => r.day === day);
    const label = dict.hours.days[day];
    if (!d || d.closed) {
      const text = dict.hours.closed;
      return { day, label, text: d?.tbc ? `[${text}]` : text, tbc: Boolean(d?.tbc) };
    }
    // The content model requires open and close on any row that is not closed; guard anyway
    if (!d.open || !d.close) return { day, label, text: `[${dict.hours.closed}]`, tbc: true };
    const text = formatRange(d.open, d.close, dict, locale);
    return { day, label, text: d.tbc ? `[${text}]` : text, tbc: Boolean(d.tbc) };
  });
}
