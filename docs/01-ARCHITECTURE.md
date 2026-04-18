# 01 — Architecture

> Snapshot k 2026-04-17. Verze: v0.5 Early Access, Next.js 16.2.1.

## High-level

SubTracker je **Turborepo monorepo** s jednou Next.js aplikací (App Router + Server Actions) a třemi sdílenými balíčky. Většina byznysové logiky sedí na serveru — klient hlavně renderuje a spouští server actions.

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser (React 19)                       │
│   landing / login / (app) dashboard, subscriptions, settings…    │
└──────────────────────────────┬───────────────────────────────────┘
                               │  form POST / fetch / Server Action
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Next.js 16 (apps/web)                        │
│   - App Router, RSC, Server Actions                              │
│   - /api/auth/[...nextauth]  → Auth.js v5 (GitHub/Google OAuth)  │
│   - /api/import              → CSV upload + parse                │
│   - /api/health              → liveness                          │
└──────┬──────────────────┬────────────────────┬──────────────────┘
       │                  │                    │
       ▼                  ▼                    ▼
 @subtracker/db    @subtracker/parsers    @subtracker/email
 (Drizzle+Zod)     (Fio/Revolut/Wise/      (Resend, NOT YET
                    generic + detector)    zapojeno)
       │
       ▼
 Neon Postgres (serverless) / self-host Postgres (Docker)
```

## Monorepo struktura

```
subtracker/
├── apps/
│   └── web/                      # Next.js 16 app (App Router)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (marketing)/page.tsx      # /  landing
│       │   │   ├── (app)/layout.tsx          # protected shell (auth redirect)
│       │   │   ├── (app)/dashboard/…         # KPIs, upcoming renewals
│       │   │   ├── (app)/subscriptions/…     # CRUD (list, new, [id]/edit)
│       │   │   ├── (app)/import/…            # CSV upload wizard
│       │   │   ├── (app)/settings/…          # profile, delete account
│       │   │   ├── (app)/analytics, calendar
│       │   │   ├── login/page.tsx            # OAuth buttons
│       │   │   ├── api/auth/[...nextauth]
│       │   │   ├── api/import
│       │   │   ├── api/health
│       │   │   ├── actions/                  # server actions (subscriptions, dashboard, settings, import)
│       │   │   ├── error.tsx, global-error.tsx, not-found.tsx
│       │   │   └── layout.tsx                # RootLayout + ThemeProvider (forced dark)
│       │   ├── lib/
│       │   │   ├── auth.ts                   # NextAuth config (single source of truth)
│       │   │   └── db.ts                     # Neon HTTP client (proxy fallback)
│       │   ├── components/                   # shadcn/ui + domain components
│       │   └── __tests__/                    # vitest: auth, subscription actions
│       ├── .env.example / .env.local / .env.vercel.local
│       ├── next.config.ts                    # output: "standalone"
│       └── AGENTS.md                         # "This is NOT the Next.js you know"
├── packages/
│   ├── db/                       # @subtracker/db
│   │   ├── src/schema.ts         # Drizzle tables (users/accounts/sessions/subs/…)
│   │   ├── src/validators.ts     # Zod schemas (single source of truth)
│   │   ├── src/client.ts         # createDb(url) factory
│   │   ├── src/seed.ts, seed-data.ts  # 12 default categories + 35 popular services
│   │   └── drizzle/              # generated migrations
│   ├── parsers/                  # @subtracker/parsers
│   │   └── src/
│   │       ├── banks/{fio,revolut,wise,generic}.ts
│   │       ├── detect.ts                       # vybere parser dle headers
│   │       ├── subscription-detector.ts        # grouping + interval analysis
│   │       ├── utils.ts                        # parseAmount, parseDate, cleanMerchantName, detectEncoding
│   │       └── types.ts
│   └── email/                    # @subtracker/email  (Resend)   — NOT YET WIRED UP
├── Dockerfile                    # multi-stage (deps → builder → runner)
├── docker-compose.yml            # app + postgres:16-alpine
├── turbo.json                    # build, test, lint, type-check
└── .github/workflows/ci.yml      # build + test on push/PR
```

## Data flow (typické CRUD)

1. Uživatel kliká v React Client Component (např. `SubscriptionCard`).
2. Volá se Server Action (`@/app/actions/subscriptions.ts`).
3. Action:
   a) `await auth()` → Auth.js session
   b) Zod validace vstupu (`@subtracker/db/validators`)
   c) Drizzle query s `AND(eq(id, X), eq(userId, session.user.id))` — **ownership je enforced na každém queary**
   d) `revalidatePath('/subscriptions'); revalidatePath('/dashboard')`
4. RSC se re-renderuje, klient dostane novou UI.

Server Actions v Next.js 16 jsou by-default CSRF-chráněné (framework ověřuje původ requestu). `/api/import/route.ts` je klasický API route a validuje session manuálně.

## Auth model

Konfigurace v `apps/web/src/lib/auth.ts` — **single source of truth**.

- **Dev** (`NODE_ENV=development`) — `Credentials` provider (fixed dev-user-1), JWT session, bez adapteru.
- **Prod** — Google + GitHub OAuth, `DrizzleAdapter` → database session (`sessions` tabulka).
- Session strategy se přepíná dle `hasAdapter` — JWT jako fallback pokud DB není dostupná.
- `trustHost: true` (nutné pro Vercel).
- Secret: `AUTH_SECRET` (FAIL FAST — `docker-compose.yml` odmítne start bez něj).

## Trust boundaries

| Boundary | Validace | Poznámka |
|----------|----------|----------|
| Browser → Server Action | Zod schema + `auth()` + ownership check (eq userId) | CSRF automaticky |
| Browser → `/api/import` | MIME (přípona `.csv`), size ≤ 5 MB, manual session check | Žádný rate limit |
| OAuth callback → Auth.js | Framework (state, PKCE pro Google) | `allowDangerousEmailAccountLinking` vypnuto |
| Seed script → DB | Trusted (dev only) | Runtime NE — jen build time |

## Co architektura **nemá** (záměrně v v0.5)

- Žádný background job runner (cron pro reminder emaily)
- Žádný rate limiter / IP throttling
- Žádný WAF / Cloudflare před Vercelem
- Žádný logging sink (Sentry, Axiom) — `console.error` jen v `error.tsx`
- Žádný audit log (kdo co kdy smazal)
- Žádný CSP / security headers v `next.config.ts` (jedou default Vercel)

Tyto chybějící vrstvy jsou záměrně mimo v0.5 scope. Self-hoster je může doplnit v reverse proxy (nginx, Caddy, Cloudflare Tunnel).
