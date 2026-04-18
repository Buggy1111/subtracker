import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * - Next.js inline styles require 'unsafe-inline' on style-src.
 * - React 19 + Next 16 runtime injects inline <script> for hydration and
 *   server-action routing. Using a strict nonce-based CSP is the eventual
 *   goal, but it requires wiring through middleware. For v0.5 we ship a
 *   relatively tight policy that still blocks external resources.
 * - OAuth sign-in redirects to accounts.google.com / github.com — those
 *   are frame-ancestors safe (we set X-Frame-Options DENY separately).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel.app",
  "form-action 'self' https://accounts.google.com https://github.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Clickjacking protection (redundant with frame-ancestors but defence in depth)
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Privacy-conscious referrer policy
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful browser features we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // HSTS — force HTTPS for 2 years (only applies over HTTPS in production)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Content Security Policy (Report-Only in first week; switch to enforcing after)
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@subtracker/db", "@subtracker/parsers"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
