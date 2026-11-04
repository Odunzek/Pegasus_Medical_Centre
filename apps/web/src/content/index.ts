/**
 * The one place pages read content from.
 *
 * Today this returns the typed sample data in ./sample. When the clinic's Sanity
 * project exists, these functions are rewritten to query it; the page templates
 * do not change. Keep page code reading through here, never from ./sample directly.
 *
 * Review gate: records marked review: "draft" are returned only when SHOW_DRAFTS=true
 * (preview builds). Production never shows a draft. Provider has its own gate:
 * status "published" plus an approval record.
 */

import { siteSettings } from "./sample/site-settings";
import { locations } from "./sample/locations";
import { services } from "./sample/services";
import { providers } from "./sample/providers";
import { faqs } from "./sample/faqs";
import { pages, posts } from "./sample/pages-posts";
import type { Faq, Location, Page, Post, Provider, Service, SiteSettings } from "./types";

/**
 * True on preview builds (SHOW_DRAFTS=true): draft records are shown with a Draft mark.
 * Read once at BUILD time; pages are static, so changing the variable at runtime does nothing.
 * Never true in production. Providers are the exception: a provider is shown only when
 * published AND approved, even on previews, because a profile is a person's public record.
 */
export const showDrafts = process.env.SHOW_DRAFTS === "true";

function reviewed<T extends { review: "draft" | "approved" }>(list: T[]): T[] {
  return showDrafts ? list : list.filter((r) => r.review === "approved");
}

/* ------------------------------------------------------------ Site settings */

/** The single Site settings record: clinic name, phone, booking link, languages, the homepage's words. */
export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

/**
 * "555 555 0123" → "+15555550123": the international (E.164) form of a displayed Canadian
 * number. Used for tel: links and structured data so the two never disagree.
 */
export function e164(displayPhone: string): string {
  const digits = displayPhone.replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `1${digits}` : digits; // 10 digits = Canadian number without the +1
  return `+${withCountry}`;
}

/** "555 555 0123" → "tel:+15555550123". Derived from the displayed number, never typed by staff. */
export function telHref(displayPhone: string): string {
  return `tel:${e164(displayPhone)}`;
}

/**
 * One address, written the same way everywhere.
 * "short": street and unit with the neighbourhood ("12 Example Street, Unit 3, York"), for prose.
 * "full": street, unit, city, province and postal code, for the footer and structured data.
 */
export function formatAddress(location: Location, style: "short" | "full"): string {
  const a = location.address;
  const streetAndUnit = [a.street, a.unit].filter(Boolean).join(", ");
  if (style === "short") return `${streetAndUnit}, ${a.neighbourhood ?? a.city}`;
  return `${streetAndUnit}, ${a.city} ${a.province} ${a.postal}`;
}

/* ------------------------------------------------------------ Locations */

/**
 * The clinics the public may see: open AND opening-soon, in the order staff put them.
 * Closed ones never reach a page. For clinics with hours a patient can act on, use getOpenLocations().
 */
export async function getLocations(): Promise<Location[]> {
  return locations.filter((l) => l.status !== "closed");
}

/** One clinic by its slug, or undefined if it does not exist or is closed. */
export async function getLocation(slug: string): Promise<Location | undefined> {
  return (await getLocations()).find((l) => l.slug === slug);
}

/** Open clinics only: the ones with hours a patient can act on. */
export async function getOpenLocations(): Promise<Location[]> {
  return locations.filter((l) => l.status === "open");
}

/** The clinic the homepage hero, the phone bar and "open now" speak for: the first open location. */
export async function getPrimaryLocation(): Promise<Location> {
  const open = await getOpenLocations();
  if (open.length === 0) throw new Error("Content error: no open Location record. At least one clinic must have status 'open'.");
  return open[0];
}

/** The phone a page should show for a location: its own override or the site's. */
export function locationPhone(location: Location, settings: SiteSettings): string {
  return location.phone ?? settings.patientPhone;
}

/* ------------------------------------------------------------ Services */

/** Live services (approved, or drafts on preview builds). */
export async function getServices(): Promise<Service[]> {
  return reviewed(services.filter((s) => s.status === "live"));
}

/** Planned services, for the quiet "coming later" line only. They have no page. */
export async function getPlannedServices(): Promise<Service[]> {
  return reviewed(services.filter((s) => s.status === "planned"));
}

/** A live service by slug; planned and hidden services have no page. */
export async function getService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

/* ------------------------------------------------------------ Providers */

/** Published AND approved providers only; drafts never reach a page, even on preview builds. */
export async function getProviders(): Promise<Provider[]> {
  return providers.filter((p) => p.status === "published" && Boolean(p.approval));
}

/** One published and approved provider by slug, or undefined. */
export async function getProvider(slug: string): Promise<Provider | undefined> {
  return (await getProviders()).find((p) => p.slug === slug);
}

/* ------------------------------------------------------------ FAQs, Pages, Posts */

/** Questions and answers, optionally one category, in their set order. */
export async function getFaqs(category?: Faq["category"]): Promise<Faq[]> {
  const list = reviewed(category ? faqs.filter((f) => f.category === category) : faqs);
  return [...list].sort((a, b) => a.order - b.order);
}

/** The questions flagged for the homepage block, in their set order. */
export async function getHomepageFaqs(): Promise<Faq[]> {
  return (await getFaqs()).filter((f) => f.showOnHomepage);
}

/** One general information page (About, Privacy...) by slug, or undefined. */
export async function getPage(slug: string): Promise<Page | undefined> {
  return reviewed(pages).find((p) => p.slug === slug);
}

/** Every general information page, for the sitemap and static params. */
export async function getPages(): Promise<Page[]> {
  return reviewed(pages);
}

/**
 * Current posts. `today` is the clinic's local date ("2026-10-09"), from
 * clinicClock() in lib/hours.ts, passed in by the caller so cached pages never
 * read the clock themselves. Expired notices are dropped.
 */
export async function getPosts(today: string): Promise<Post[]> {
  return reviewed(posts)
    .filter((p) => !p.expires || p.expires >= today)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date));
}

/* ------------------------------------------------------------ Derived relationships */
/* Location.services, Provider.locations and Provider.services are the single sources of truth. */

/** The clinics that offer a service ("Where you can get this"), from Location.services. */
export async function getLocationsForService(serviceSlug: string): Promise<Location[]> {
  const service = await getService(serviceSlug);
  if (!service) return [];
  return (await getLocations()).filter((l) => l.services.includes(serviceSlug));
}

/** The live services a clinic offers, in the order the clinic listed them (Location.services is the source of truth). */
export async function getServicesForLocation(locationSlug: string): Promise<Service[]> {
  const location = await getLocation(locationSlug);
  if (!location) return [];
  const live = await getServices();
  return location.services.map((slug) => live.find((s) => s.slug === slug)).filter((s): s is Service => Boolean(s));
}

/** The published providers who offer a service (from Provider.services). */
export async function getProvidersForService(serviceSlug: string): Promise<Provider[]> {
  return (await getProviders()).filter((p) => p.services.includes(serviceSlug));
}

/** The published providers who work at a clinic (from Provider.locations). */
export async function getProvidersForLocation(locationSlug: string): Promise<Provider[]> {
  return (await getProviders()).filter((p) => p.locations.includes(locationSlug));
}
