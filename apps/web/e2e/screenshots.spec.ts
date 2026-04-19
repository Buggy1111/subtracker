// One-off screenshot generator. Not a test — run with:
//   npx playwright test e2e/screenshots.script.ts --reporter=list
// It drives public pages only, so no OAuth session is required.

import { test, expect } from "@playwright/test";
import path from "path";

const OUT = path.resolve(__dirname, "../../../docs");

test.describe("Marketing screenshots", () => {
  test("landing hero", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    // Let fonts + animations settle
    await page.waitForLoadState("networkidle").catch(() => undefined);
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: path.join(OUT, "screenshot-landing.png"),
      fullPage: false,
    });
    expect(true).toBe(true);
  });

  test("import page tabs (bank CSV + JSON/Wallos)", async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    // We're not authenticated, so /import redirects to /login.
    // Instead, visit /login and show the clean OAuth screen — it's the
    // first page real visitors see and makes a clean second screenshot.
    await page.goto("/login");
    await page.waitForLoadState("networkidle").catch(() => undefined);
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(OUT, "screenshot-login.png"),
      fullPage: false,
    });
    expect(true).toBe(true);
  });
});
