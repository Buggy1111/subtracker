/**
 * SubTracker minimal service worker.
 *
 * Goals:
 * - Make the app installable (satisfies PWA criteria for Chrome/Edge "Install" prompt).
 * - Cache the app shell + static assets for instant repeat loads.
 * - Never cache API/auth responses — always use network for subscriptions data.
 *
 * Strategy:
 * - Static assets (/_next/static, fonts, icons, manifest) → cache-first.
 * - Navigations (HTML) → network-first with offline fallback.
 * - API routes (/api/*) and auth (/api/auth/*) → network-only.
 */

const CACHE_VERSION = "subtracker-v1";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/favicon-32.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {
        /* ignore shell prefetch failures during install */
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_VERSION)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith(".woff2")
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never touch API / auth — always go to network
  if (isApiRequest(url)) return;

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Static assets: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((response) => {
              if (response.ok) {
                const clone = response.clone();
                caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
              }
              return response;
            })
            .catch(() => cached || Response.error())
      )
    );
    return;
  }

  // Navigations: network-first, fallback to cached shell
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/"))
        )
    );
  }
});
