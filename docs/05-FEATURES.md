# 05 — Features

> **Poctivé:** v0.5 Early Access. Seznam níže odpovídá stavu v kódu k 2026-04-17.
> Rozdíl proti README: tady je víc detailů a méně marketingu.

## Co funguje (v0.5)

### Autentizace
- **Google OAuth** (`apps/web/src/lib/auth.ts:28-31`) — v produkci.
- **GitHub OAuth** (`apps/web/src/lib/auth.ts:32-35`) — v produkci.
- **Dev Credentials provider** (`apps/web/src/lib/auth.ts:10-25`) — jen pro `NODE_ENV=development`.
- Session strategy: database (s Drizzle adapter) v produkci, JWT fallback.
- OAuth account linking: **vypnuto** (bezpečné default).
- Layout guard: `apps/web/src/app/(app)/layout.tsx:14-16` — unauth user redirect na `/login`.

### Subscription management (CRUD)
- **Create** — `/subscriptions/new` → [Quick Add z 35 služeb] nebo [Manual form]. Validace: `createSubscriptionSchema` (Zod).
- **Read** — `/subscriptions` s filtry (all / active / paused / trial / cancelled), summary monthly total.
- **Edit** — `/subscriptions/[id]/edit` s ownership check (nenajde → `notFound()`).
- **Delete** — dropdown menu v SubscriptionCard → server action → revalidation.
- **Pause / Resume** — toggle mezi `active` a `paused` statusem.
- **Fields:** name, amount, currency, billingCycle (monthly/yearly/weekly/quarterly), nextBillingDate, status, categoryId, url, logo, color, notes, notify, trialEndsAt.

### CSV Import
- **Upload** — drag&drop na `/import` → POST `/api/import` (multipart).
- **Limits** — `.csv` koncovka, max 5 MB, session required.
- **Parser auto-detect** — Fio Banka (CZ), Revolut, Wise, Generic fallback.
- **Encoding detect** — UTF-8, UTF-16LE, Windows-1250 (CZ diakritika).
- **Subscription detection** — seskupí tx podle merchant, spočítá intervaly + směrodatnou odchylku, rozpozná weekly/monthly/quarterly/yearly s confidence score.
- **Review & import** — user vybere které subs importovat, detail je v `apps/web/src/app/(app)/import/import-client.tsx`.
- **Import log** — tabulka `imports` tracuje fileName, bankDetected, rowCount, importedCount.

### Dashboard
- 4 KPI cards: Monthly Spend, Active Subscriptions, Next Renewal, Annual Projection.
- Category breakdown — summed monthly amount per category.
- Upcoming Renewals (7 dní dopředu).
- Billing cycle normalizace: yearly/12, quarterly/3, weekly × 4.33.
- Placeholder "Monthly Trend — Chart coming soon" — graf NENÍ implementován.

### Analytics
- Top 10 Subscriptions by monthly cost + progress bar.
- Daily Average ($monthly / 30).
- Billing Cycle Distribution (monthly/yearly/weekly/quarterly counts).

### Calendar
- Měsíční kalendář s dots na dnech kde je renewal.
- Legenda se seznamem renewals v aktuálním měsíci.
- **Pouze aktuální měsíc** — NE navigace na předchozí/další měsíc.

### Settings
- **Profile:** name, currency (default USD), monthlyBudget (volitelný).
- **Notifications:** reminderDays (1-30), reminderTime, weeklyDigest toggle.
- **Danger Zone:** Delete Account — cascade delete všech dat (subscriptions, payments, reminders, imports, push_subscriptions, accounts, sessions).
- **Email změna:** NE (email je z OAuth providera, readonly).

### Landing page
- Hero section s parallax efektem.
- Logo ticker (popular services — čistě dekorativní).
- Stats section, Bento features grid, Pricing CTA ("Free forever").
- Navigace s mouse-follow glow efektem.
- Dark mode only (forced via ThemeProvider).

### Error handling
- `error.tsx` — route-level boundary, "Try again" button.
- `global-error.tsx` — app-level crash fallback (inline styles, žádné dependencies).
- `not-found.tsx` — 404 page s linkem domů / na dashboard.

### Self-hosting
- `Dockerfile` — multi-stage, non-root user (nodejs:1001), healthcheck na `/api/health`.
- `docker-compose.yml` — app + Postgres 16, fail-fast na chybějící `AUTH_SECRET`.
- AGPL-3.0 licence.

## Co NEFUNGUJE / není implementováno

| Feature | Stav | Poznámka |
|---------|------|---------|
| **Email renewal reminders** | Not started | `packages/email/` existuje (Resend), ale není zapojený do cron/reminder tabulky |
| **Weekly email digest** | Not started | Stejně jako výše |
| **Multi-currency conversion** | Not started | Currency se ukládá jako string per-subscription, ale dashboard sčítá hrubě (bez FX) |
| **Web push notifications** | Not started | Schema `pushSubscriptions` existuje, ale žádný service worker ani VAPID code |
| **Mobile bottom navigation** | Not started | Responsive je OK, ale sidebar se jen sbalí — nemá bottom tab bar |
| **Search / advanced filters** | Not started | List má jen status filtr |
| **Native charts** | Not started | Tremor / recharts integrace chybí |
| **Magic-link email login** | Not started | Jen OAuth |
| **i18n** | Not started | Vše English. Ironicky autor je Čech, ale v0.5 je EN-only pro launch |
| **Calendar navigace** | Missing | Jen aktuální měsíc |
| **Monthly trend chart** | Placeholder | "Chart coming soon" |
| **Subscription detail page** | Missing | Jen `/subscriptions` (list) + `/subscriptions/[id]/edit`. Žádná read-only detail view. |
| **Category CRUD UI** | Missing | Kategorie jsou přes seed; user je nemůže editovat z UI |
| **Payment history UI** | Missing | Tabulka `payments` je ve schema, UI ne |
| **Cancellation tracker / difficulty score** | Partial | Schema má `cancellationUrl` a `cancellationDifficulty`, UI ne |
| **Audit log** | Missing | Žádná tabulka ani UI |
| **Export data** | Missing | GDPR-friendly "download all my data" zip / JSON |
| **CSV export** | Missing | Jen import, ne export |

## Známé bugy / limity (z auditu)

1. **`categories` query** v `apps/web/src/app/actions/subscriptions.ts:63-81` filtruje `eq(categories.userId, userId)` — **nevrací globální kategorie** (userId = null)! Seed je naplní s `userId: null`, ale dropdown v `SubscriptionForm` pro uživatele bude prázdný. Komentář v kódu říká "Global categories (userId = null) OR user's own", ale query říká jen own.
2. **Calendar pouze aktuální měsíc** — není navigace dopředu/dozadu.
3. **Empty state v dashboardu** — když user nemá žádné subscriptions, category breakdown je prázdný (OK), ale monthly trend placeholder bude vidět pořád.
4. **Currency rendering** — `SubscriptionCard` zobrazuje `$` jen pro USD, jinak string + amount. Jiné měny ($ → €, Kč) nejsou formátované.
5. **Delete account error handling** — pokud `deleteAccount()` selže, UI se to neřekne, jen zkusí signOut.
6. **Quick Add category mapping** — `NewSubscriptionClient` používá `categoryMap` ze seznamu usera. Pokud user nemá kategorie (kvůli bugu #1), Quick Add vytvoří subscription bez kategorie.

Viz `docs/04-SECURITY.md` pro security-specific issues.

## Na co se nespoléhat (v0.5 != v1.0)

- Žádný backup UI — pokud to smažeš, je to pryč (ale Neon má PITR)
- Žádná email komunikace — renewal alert je jen na dashboardu
- Žádné mobile push
- Dashboardy chart jsou stat prázdné boxy s textem

Pro v1.0 plán viz [10-ROADMAP.md](10-ROADMAP.md).
