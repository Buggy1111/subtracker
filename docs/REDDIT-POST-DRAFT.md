# Reddit launch post — r/selfhosted

## Title options (pick one)

1. `[Release] SubTracker v0.5 — open-source subscription tracker with bank CSV import (Next.js + Postgres + Docker)`
2. `I built SubTracker — an AGPL subscription tracker that parses your bank statements (and imports Wallos exports)`
3. `SubTracker v0.5 — self-hostable subscription tracker with CSV bank import and Wallos migration path`

**Recommended:** #2 — the hook ("parses your bank statements") is the differentiator and the Wallos bit signals we know the landscape.

---

## Post body

Hey r/selfhosted 👋

I've been tracking my subscriptions in a spreadsheet for years and finally got fed up with it, so I built **SubTracker** — an open-source, self-hostable subscription tracker.

**Live demo:** https://subtracker-web-six.vercel.app
**Repo:** https://github.com/Buggy1111/subtracker
**License:** AGPL-3.0

### What makes it different

Most subscription trackers want you to add everything by hand. SubTracker reads your **bank statement CSV** (Fio, Revolut, Wise, generic), detects recurring payments statistically, and suggests a list. You accept the ones you want and skip the rest. ~30 seconds instead of 20 minutes of data entry.

### Feature highlights (v0.5 — what works today)

- **Bank CSV import** with auto-detection (Fio Banka, Revolut, Wise, generic)
- **Wallos migration** — drop your Wallos JSON export and it imports directly, including numeric cycle codes and multi-currency
- **JSON export/import** — your data, portable between instances
- **Monthly trend chart** + category breakdown + billing cycle distribution
- **Monthly budget** with under/near/over states (colour-coded progress bar)
- **Auto-categorization** — 150+ services (Netflix → Streaming, Cursor → Productivity, Strava → Fitness, etc.) matched by regex, no AI, no cloud calls
- **Cancellation tracker** — per-subscription cancel URL + 1-5 difficulty rating. Click "Cancel →" on any card, it opens the exact page to cancel.
- **10 currencies** (USD/EUR/GBP/CZK/PLN/CHF/AUD/CAD/JPY/SEK)
- **PWA installable** (service worker, app shell, offline landing)
- **Share URL prefill** — `/subscriptions/new?name=Spotify&amount=9.99&currency=EUR` pre-fills the form
- **Google + GitHub OAuth**, CSP + HSTS + rate limit, no telemetry

### Stack

Next.js 16 + React 19 + TypeScript strict · Tailwind v4 · Postgres via Drizzle · Auth.js v5 · Turborepo monorepo.

Works on **Vercel + Neon** or **Docker Compose with Postgres** — both paths documented.

### Tests

159 unit tests (Vitest) + 20 E2E (Playwright) running in CI.

### Not yet in v0.5 (I'm being honest)

- Email renewal reminders (Resend integration planned)
- Browser push notifications
- 2FA / TOTP
- i18n (English only right now)
- Mobile bottom nav polish

Roadmap is in the README.

### Why another one?

Wallos exists and is great (7.7k stars, well-earned). I tried it and bounced off the PHP stack when I wanted to hack on it. SubTracker is aimed at folks who prefer the TypeScript side of the fence, want the CSV import flow, or are migrating from Wallos and want the same feature set in a different runtime. Direct import support is built in.

### Try it without installing anything

The live demo on Vercel connects to a free Neon Postgres. Log in with Google or GitHub. There are sample files in `docs/` you can drop into the import page:

- `docs/demo-import.csv` — 46-row bank statement
- `docs/demo-wallos-export.json` — Wallos export shape
- `docs/demo-subtracker-backup.json` — native backup format

### Feedback

This is v0.5 — rough edges exist. If you try it and something's weird, open an issue and I'll fix it fast. Particularly interested in:

- Bank CSVs that don't parse right (drop me the first 3 rows, I'll add a parser)
- UI papercuts on mobile
- Features you'd actually use

Built by a factory operator learning to ship software with AI. Feedback and PRs very welcome.

---

## Posting checklist

- [ ] Verify live demo is up (curl /api/health)
- [ ] Double-check GitHub README renders fine on mobile
- [ ] Confirm OAuth works from a fresh browser / incognito
- [ ] Post during US prime time for r/selfhosted (~15:00 UTC weekday, ~19:00 UTC weekend)
- [ ] Be online for first 2 hours to answer comments
- [ ] Respond to every comment in the first 24 hours, even the critical ones
