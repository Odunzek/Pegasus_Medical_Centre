import type { NextConfig } from "next";

/**
 * Security headers on every response. The CSP is deliberately strict; when the
 * booking vendor, analytics (GA4/GTM) or a map embed are added, extend the
 * relevant directive here in the same pull request and note it in
 * docs/launch-checklist.md. Referrer-Policy keeps page URLs off third-party logs.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /**
   * Redirects from the old clinic's addresses and the "Center" domains are added
   * here once the canonical domain is decided (docs/client-facts, open decisions).
   * Shape: { source: "/old-path", destination: "/new-path", permanent: true }.
   * Cross-domain redirects (pegasusmedicalcenter.ca → pegasusmedicalcentre.ca)
   * are configured in Vercel's domain settings, not here.
   */
  async redirects() {
    return [];
  },
};

export default nextConfig;
