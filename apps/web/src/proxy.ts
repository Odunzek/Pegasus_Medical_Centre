import { NextResponse, type NextRequest } from "next/server";

/**
 * URL shape: English at the root, French and Portuguese prefixed.
 *   /            → app/[lang]/page.tsx with lang = "en" (rewrite, address unchanged)
 *   /services    → /en/services internally
 *   /fr/services → served as is
 *   /en/services → redirected to /services, so each page has one address
 * Never redirects by browser language: older patients should land where the link said.
 */

const prefixed = ["fr", "pt"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/en" ? "/" : pathname.slice(3);
    return NextResponse.redirect(url, 308);
  }

  if (prefixed.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next internals, static files in /public and the favicon
  matcher: ["/((?!_next|brand|temp-photos|favicon\\.ico|icon\\.svg|apple-icon\\.png|.*\\..*).*)"],
};
