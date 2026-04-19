import { defineConfig, devices } from "@playwright/test";

// E2E tests run against production by default (set E2E_BASE_URL to point
// somewhere else — local dev server, preview deploy, etc.). We only exercise
// public flows here because OAuth sign-in can't be scripted safely.
const BASE_URL = process.env.E2E_BASE_URL ?? "https://subtracker-web-six.vercel.app";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 900 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
