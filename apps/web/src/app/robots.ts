/** robots.txt: previews (SHOW_DRAFTS or VERCEL_ENV=preview) are kept out of search; production is open and points at the sitemap. */

import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";

/** Preview deployments (no NEXT_PUBLIC_SITE_URL, or SHOW_DRAFTS) are kept out of search; production is open. */
export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  const isProduction = Boolean(origin) && process.env.SHOW_DRAFTS !== "true" && process.env.VERCEL_ENV !== "preview";
  if (!isProduction) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${origin}/sitemap.xml` };
}
