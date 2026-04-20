import { test, expect } from "@playwright/test";

/**
 * Responsive regression guard.
 *
 * The landing page uses decorative `::before` pseudo-elements with fixed
 * pixel widths (~900–1000px) for radial glows. Any section that forgets
 * `overflow: hidden` leaks those glows past the viewport on phones, giving
 * users a horizontally-scrollable page. Grid items containing `<pre>`
 * blocks with `white-space: pre` have the same failure mode via
 * `min-width: auto`. This spec catches either regression before ship.
 */

const viewports = [
  { name: "galaxy-fold", width: 344, height: 882 },
  { name: "iphone-se", width: 375, height: 667 },
  { name: "iphone-14", width: 390, height: 844 },
  { name: "pixel-7", width: 412, height: 915 },
  { name: "ipad-mini", width: 768, height: 1024 },
  { name: "ipad-pro", width: 1024, height: 1366 },
] as const;

const publicPaths = ["/", "/login", "/auth-error"] as const;

for (const vp of viewports) {
  test.describe(`${vp.name} (${vp.width}×${vp.height})`, () => {
    for (const path of publicPaths) {
      test(`${path} has no horizontal overflow`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(path, { waitUntil: "networkidle" });

        const dims = await page.evaluate(() => ({
          docScroll: document.documentElement.scrollWidth,
          bodyScroll: document.body.scrollWidth,
          client: document.documentElement.clientWidth,
        }));

        // 1px tolerance for sub-pixel rounding on hi-DPI simulation.
        expect(
          dims.docScroll,
          `html scrollWidth (${dims.docScroll}) exceeds viewport (${dims.client})`,
        ).toBeLessThanOrEqual(dims.client + 1);
        expect(
          dims.bodyScroll,
          `body scrollWidth (${dims.bodyScroll}) exceeds viewport (${dims.client})`,
        ).toBeLessThanOrEqual(dims.client + 1);
      });
    }
  });
}

test.describe("mobile nav (iphone-se)", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("desktop nav links are hidden, GitHub CTA stays reachable", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // At ≤1024px the inline nav link pill is hidden; we still want a GitHub
    // CTA somewhere on the landing page so mobile users can star/fork.
    await expect(page.locator(".lv3-nav-links")).toBeHidden();
    const gh = page.locator('a[href*="github.com/Buggy1111/subtracker"]').first();
    await expect(gh).toBeVisible();
  });

  test("hamburger opens drawer with section links and closes after tap", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const btn = page.getByRole("button", { name: /open menu/i });
    await expect(btn).toBeVisible();

    // Drawer starts closed
    const drawer = page.locator("#lv3-nav-drawer");
    await expect(drawer).toHaveAttribute("aria-hidden", "true");

    await btn.click();
    await expect(drawer).toHaveAttribute("aria-hidden", "false");
    await expect(drawer.locator("a", { hasText: /stats/i })).toBeVisible();
    await expect(drawer.locator("a", { hasText: /features/i })).toBeVisible();

    // Tapping a section link scrolls + closes the drawer
    await drawer.locator("a", { hasText: /features/i }).click();
    await expect(drawer).toHaveAttribute("aria-hidden", "true");
    // URL hash reflects navigation target
    await expect(page).toHaveURL(/#features$/);
  });

  test("brand logo scroll-to-top when already on /", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Scroll well down the page first
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(200);
    const beforeY = await page.evaluate(() => window.scrollY);
    expect(beforeY).toBeGreaterThan(500);

    await page.locator("a.lv3-logo").click();
    // Smooth scroll → poll briefly until we're at / near the top
    await page.waitForFunction(() => window.scrollY < 20, null, { timeout: 2000 });
    const afterY = await page.evaluate(() => window.scrollY);
    expect(afterY).toBeLessThan(20);
  });
});

test.describe("tablet nav (ipad-mini)", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("hamburger is visible on tablet portrait and drawer works", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator(".lv3-nav-links")).toBeHidden();
    const btn = page.getByRole("button", { name: /open menu/i });
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page.locator("#lv3-nav-drawer")).toHaveAttribute("aria-hidden", "false");
  });
});

test.describe("tablet layout (ipad-mini)", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("landing page renders hero + pricing/compare without overflow", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const compareSection = page.locator("#compare");
    if ((await compareSection.count()) > 0) {
      await compareSection.scrollIntoViewIfNeeded();
      await expect(compareSection).toBeVisible();
    }
  });
});
