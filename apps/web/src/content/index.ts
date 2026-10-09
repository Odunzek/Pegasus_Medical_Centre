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

export const showDrafts = process.env.SHOW_DRAFTS === "true";

function reviewed<T extends { review: "draft" | "approved" }>(list: T[]): T[] {
  return showDrafts ? list : list.filter((r) => r.review === "approved");
}

/* ------------------------------------------------------------ Site settings */

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

/** "555 555 0123" → "tel:+15555550123". Derived from the displayed number, never typed by staff. */
export function telHref(displayPhone: string): string {
  const digits = displayPhone.replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `1${digits}` : digits;
  return `tel:+${withCountry}`;
}

/* ------------------------------------------------------------ Locations */

/** Open and opening-soon clinics, in the order staff put them. Closed ones never reach a page. */
export async function getLocations(): Promise<Location[]> {
  return locations.filter((l) => l.status !== "closed");
}

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

export async function getProvider(slug: string): Promise<Provider | undefined> {
  return (await getProviders()).find((p) => p.slug === slug);
}

/* ------------------------------------------------------------ FAQs, Pages, Posts */

export async function getFaqs(category?: Faq["category"]): Promise<Faq[]> {
  const list = reviewed(category ? faqs.filter((f) => f.category === category) : faqs);
  return [...list].sort((a, b) => a.order - b.order);
}

export async function getHomepageFaqs(): Promise<Faq[]> {
  return (await getFaqs()).filter((f) => f.showOnHomepage);
}

export async function getPage(slug: string): Promise<Page | undefined> {
  return reviewed(pages).find((p) => p.slug === slug);
}

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

export async function getLocationsForService(serviceSlug: string): Promise<Location[]> {
  const service = await getService(serviceSlug);
  if (!service) return [];
  return (await getLocations()).filter((l) => l.services.includes(serviceSlug));
}

export async function getServicesForLocation(locationSlug: string): Promise<Service[]> {
  const location = await getLocation(locationSlug);
  if (!location) return [];
  const live = await getServices();
  return location.services.map((slug) => live.find((s) => s.slug === slug)).filter((s): s is Service => Boolean(s));
}

export async function getProvidersForService(serviceSlug: string): Promise<Provider[]> {
  return (await getProviders()).filter((p) => p.services.includes(serviceSlug));
}

export async function getProvidersForLocation(locationSlug: string): Promise<Provider[]> {
  return (await getProviders()).filter((p) => p.locations.includes(locationSlug));
}
