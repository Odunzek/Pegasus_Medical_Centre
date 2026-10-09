/**
 * The one place pages read content from.
 *
 * Today this returns the typed sample data in ./sample. When the clinic's Sanity
 * project exists, these functions are rewritten to query it; the page templates
 * do not change. Keep page code reading through here, never from ./sample directly.
 */

import { siteSettings } from "./sample/site-settings";
import { locations } from "./sample/locations";
import { services } from "./sample/services";
import { providers } from "./sample/providers";
import { faqs } from "./sample/faqs";
import { pages, posts } from "./sample/pages-posts";
import type { Faq, Location, Page, Post, Provider, Service, SiteSettings } from "./types";

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}

export async function getLocations(): Promise<Location[]> {
  return locations.filter((l) => l.status !== "closed");
}

export async function getLocation(slug: string): Promise<Location | undefined> {
  return locations.find((l) => l.slug === slug);
}

/** The clinic shown on the homepage and in the footer: the first open location. */
export async function getPrimaryLocation(): Promise<Location> {
  return locations.find((l) => l.status === "open") ?? locations[0];
}

export async function getServices(status: Service["status"] | "all" = "live"): Promise<Service[]> {
  return status === "all" ? services.filter((s) => s.status !== "hidden") : services.filter((s) => s.status === status);
}

export async function getService(slug: string): Promise<Service | undefined> {
  return services.find((s) => s.slug === slug && s.status !== "hidden");
}

/** Published providers only; drafts never reach a page. */
export async function getProviders(): Promise<Provider[]> {
  return providers.filter((p) => p.status === "published");
}

/** Drafts included, for previews and the build-time placeholder sections. */
export async function getProvidersIncludingDrafts(): Promise<Provider[]> {
  return providers;
}

export async function getProvider(slug: string): Promise<Provider | undefined> {
  return providers.find((p) => p.slug === slug && p.status === "published");
}

export async function getFaqs(category?: Faq["category"]): Promise<Faq[]> {
  const list = category ? faqs.filter((f) => f.category === category) : faqs;
  return [...list].sort((a, b) => a.order - b.order);
}

export async function getHomepageFaqs(): Promise<Faq[]> {
  return (await getFaqs()).filter((f) => f.showOnHomepage);
}

export async function getPage(slug: string): Promise<Page | undefined> {
  return pages.find((p) => p.slug === slug);
}

/** Current posts: notices past their expiry date are dropped. */
export async function getPosts(today = new Date().toISOString().slice(0, 10)): Promise<Post[]> {
  return posts
    .filter((p) => !p.expires || p.expires >= today)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date));
}

/* Derived relationships (single source of truth lives on Location and Provider) */

export async function getLocationsForService(serviceSlug: string): Promise<Location[]> {
  return (await getLocations()).filter((l) => l.services.includes(serviceSlug));
}

export async function getProvidersForService(serviceSlug: string): Promise<Provider[]> {
  return (await getProviders()).filter((p) => p.services.includes(serviceSlug));
}

export async function getProvidersForLocation(locationSlug: string): Promise<Provider[]> {
  return (await getProviders()).filter((p) => p.locations.includes(locationSlug));
}
