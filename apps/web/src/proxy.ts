/** Request proxy (Next.js 16's middleware): sends un-prefixed paths to the English site. */

import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

/**
 * URL shape: every language is prefixed (/en/services, /fr/services, /pt/services),
 * which is what the App Router's client-side routing and prefetching expect.
 * A path without a prefix is redirected to English: /  →  /en, /services → /en/services.
 * Never by browser language: older patients should land where the link said.
 * (A rewrite-based "English at the root" was tried and dropped: client prefetch
 * cannot see server rewrites, so every English link lost instant navigation.)
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Everything except Next internals, static files in /public and metadata files
  matcher: ["/((?!_next|brand|temp-photos|favicon\\.ico|icon\\.svg|apple-icon\\.png|sitemap\\.xml|robots\\.txt|.*\\..*).*)"],
};
