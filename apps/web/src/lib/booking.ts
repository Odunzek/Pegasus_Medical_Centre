import { telHref } from "@/content";
import type { SiteSettings } from "@/content/types";
import type { Dictionary } from "@/lib/i18n";

/**
 * Where the Book action goes. The booking link lives in Site settings and is
 * changed by the clinic, never in code. While it is blank, Book becomes
 * "Call to book" and dials the clinic, so the site never shows a dead button.
 * Booking opens in the same tab (older patients lose track of tabs); the
 * booking vendor's page has its own way back.
 */
export function bookAction(settings: Pick<SiteSettings, "bookingUrl" | "patientPhone">, dict: Dictionary) {
  if (settings.bookingUrl) {
    return { href: settings.bookingUrl, label: dict.book, external: true };
  }
  return { href: telHref(settings.patientPhone), label: dict.callToBook, external: false };
}
