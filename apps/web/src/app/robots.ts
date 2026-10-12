/** robots.txt: previews (SHOW_DRAFTS or VERCEL_ENV=preview) are kept out of search; production is open and points at the sitemap. */

import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";

/**
 * Crawling is allowed only on production. A build counts as production when it has a public
 * origin (NEXT_PUBLIC_SITE_URL), is not showing drafts (SHOW_DRAFTS) and is not a Vercel
 * preview (VERCEL_ENV). Any one of those failing keeps the whole site out of search.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  const isProduction = Boolean(origin) && process.env.SHOW_DRAFTS !== "true" && process.env.VERCEL_ENV !== "preview";
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${origin}/sitemap.xml` };
}
