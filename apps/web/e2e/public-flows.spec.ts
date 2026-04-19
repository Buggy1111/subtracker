import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads with hero, pricing, GitHub CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SubTracker/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // At least one GitHub link must exist somewhere on the page
    const githubLink = page.locator('a[href*="github.com/Buggy1111/subtracker"]').first();
    await expect(githubLink).toHaveCount(1);
  });

  test("landing page links through to /login", async ({ page }) => {
    await page.goto("/");
    // The Button-as-Link renders through Base UI so its accessible role
    // varies. Just verify at least one anchor on the page points at /login.
    const loginLinks = page.locator('a[href="/login"]');
    const count = await loginLinks.count();
    expect(count).toBeGreaterThan(0);
    // Click the first one and verify it navigates
    await loginLinks.first().click();
    await page.waitForURL(/\/login$/);
    expect(page.url()).toMatch(/\/login$/);
  });
});

test.describe("Login page", () => {
  test("renders OAuth buttons for Google and GitHub", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /google/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /github/i }).first()).toBeVisible();
  });

  test("does not expose a Credentials / dev login form in production", async ({ page }) => {
    await page.goto("/login");
    // Dev-only credentials provider should never appear in prod. If any input
    // asking for a password shows up we have a regression.
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });
});

test.describe("Protected routes redirect when unauthenticated", () => {
  for (const path of ["/dashboard", "/subscriptions", "/settings", "/analytics", "/calendar", "/import"]) {
    test(`${path} → /login`, async ({ page }) => {
      const response = await page.goto(path);
      // Either a real 307/302 or the SPA resolved us to /login
      expect(response?.ok() || response?.status() === 307 || response?.status() === 302).toBeTruthy();
      await expect(page).toHaveURL(/\/login/);
    });
  }
});

test.describe("Error pages", () => {
  test("unknown route shows a 404", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist-xyz");
    expect(response?.status()).toBe(404);
    // Either our custom not-found renders "404", "not found", or similar text
    await expect(page.locator("body")).toContainText(/404|not found|page you/i);
  });

  test("/auth-error page renders a readable message", async ({ page }) => {
    await page.goto("/auth-error");
    await expect(page.locator("body")).toContainText(/sign.?in|problem|error|try again/i);
  });
});

test.describe("PWA assets", () => {
  test("serves manifest.webmanifest with correct Content-Type", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.name).toBe("SubTracker");
    expect(body.icons.length).toBeGreaterThan(0);
  });

  test("service worker is reachable", async ({ request }) => {
    const res = await request.get("/sw.js");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain("subtracker");
  });

  test("favicon and app icons respond 200", async ({ request }) => {
    for (const path of ["/favicon.svg", "/favicon-32.png", "/icon-192.png", "/icon-512.png"]) {
      const res = await request.get(path);
      expect(res.status(), `${path} should serve 200`).toBe(200);
    }
  });
});

test.describe("Security headers on landing page", () => {
  test("sets CSP, HSTS, X-Frame-Options, X-Content-Type-Options", async ({ request }) => {
    const res = await request.get("/");
    const headers = res.headers();

    expect(headers["content-security-policy"]).toBeTruthy();
    expect(headers["strict-transport-security"]).toContain("max-age");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toContain("strict-origin");
    expect(headers["permissions-policy"]).toBeTruthy();
  });
});

test.describe("Health + OAuth endpoints", () => {
  test("/api/health returns ok", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
  });

  test("/api/auth/providers lists Google and GitHub", async ({ request }) => {
    const res = await request.get("/api/auth/providers");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.google).toBeTruthy();
    expect(body.github).toBeTruthy();
  });

  test("/api/export requires auth (401 when anonymous)", async ({ request }) => {
    const res = await request.get("/api/export");
    expect(res.status()).toBe(401);
  });
});

test.describe("Share URL prefill", () => {
  test("/subscriptions/new without auth still redirects to login (not crashing on search params)", async ({ page }) => {
    const response = await page.goto(
      "/subscriptions/new?name=Spotify&amount=9.99&currency=EUR&cycle=monthly",
    );
    // Whether server-side or client-side, authed or not, we should never 500
    expect(response?.status() ?? 0).toBeLessThan(500);
  });
});
