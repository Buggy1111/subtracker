"use client";

import { useEffect } from "react";

/**
 * Register the service worker on the client.
 *
 * The SW makes the app installable (Chrome / Edge / iOS home-screen add) and
 * caches static assets for faster repeat loads. We deliberately do NOT cache
 * any dynamic data — API routes always hit the network.
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Only register in production. In dev, HMR + SW caching fight each other.
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* ignore — SW is progressive enhancement */
      });
    };

    // Wait until after load to avoid contending with critical requests
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
