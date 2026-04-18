import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Edge middleware for lightweight rate-limiting on auth endpoints.
 *
 * OAuth providers have their own rate limits, but bots can still hammer our
 * sign-in route and generate needless OAuth redirects / DB load. A simple
 * per-IP cap smooths that out. Legitimate users rarely hit >30 req/min on
 * auth routes.
 */
function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function middleware(req: NextRequest) {
  const ip = getIp(req);

  const rl = rateLimit({
    key: `auth:ip:${ip}`,
    max: 30,
    windowMs: 60 * 1000,
  });

  if (!rl.allowed) {
    const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return new NextResponse(
      JSON.stringify({ error: "Too many requests" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": "30",
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(rl.resetAt),
        },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  // Limit only auth entry points — /login for human forms, /api/auth/* for OAuth
  matcher: ["/login", "/api/auth/:path*"],
  // Use Node runtime so we share the in-memory rate-limit bucket with
  // /api/import. Edge runtime has separate isolates per region and would
  // double-count across regions.
  runtime: "nodejs",
};
