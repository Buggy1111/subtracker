# SubTracker — Tech Stack

## Stack Overview

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | **Next.js** | 15.x | App Router, RSC, Server Actions |
| Language | **TypeScript** | 5.x | Type safety, DX |
| UI Components | **shadcn/ui** | latest | Beautiful, customizable, copy-paste |
| Styling | **Tailwind CSS** | v4 | Utility-first, dark mode support |
| Charts | **Tremor v3** | latest | Dashboard-ready, wraps Recharts |
| Database | **Neon Postgres** | - | Serverless, free tier, edge-compatible |
| ORM | **Drizzle ORM** | latest | Type-safe, fast cold starts, SQL-like |
| Auth | **Auth.js v5** | 5.x | Free, open-source, self-host friendly |
| Email | **Resend** + React Email | - | 3K emails/month free, JSX templates |
| CSV Parsing | **Papa Parse** | latest | Browser + server, auto-detect delimiter |
| Validation | **Zod** | latest | Shared schemas (server + client) |
| Forms | **React Hook Form** | latest | Performance, Zod integration |
| URL State | **nuqs** | latest | Type-safe search params |
| Monorepo | **Turborepo** | latest | Apps + packages structure |
| Notifications | **Web Push API** | native | Free, no vendor lock |
| Cron | **Vercel Cron** | - | Free (1/day hobby, unlimited Pro) |
| Hosting | **Vercel** + **Docker** | - | Dual distribution |
| License | **AGPL-3.0** | - | Protective open-source |

## Project Structure

```
subtracker/
├── apps/
│   └── web/                          # Next.js app (dashboard + marketing)
│       ├── app/
│       │   ├── (marketing)/          # Public pages (landing, pricing, blog)
│       │   │   ├── page.tsx          # Landing page
│       │   │   ├── pricing/
│       │   │   │   └── page.tsx
│       │   │   └── layout.tsx
│       │   ├── (app)/                # Dashboard (behind auth)
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx
│       │   │   ├── subscriptions/
│       │   │   │   ├── page.tsx      # List all subscriptions
│       │   │   │   ├── new/
│       │   │   │   │   └── page.tsx  # Add new subscription
│       │   │   │   └── [id]/
│       │   │   │       └── page.tsx  # Edit subscription
│       │   │   ├── import/
│       │   │   │   └── page.tsx      # CSV/OFX import
│       │   │   ├── analytics/
│       │   │   │   └── page.tsx      # Detailed charts & insights
│       │   │   ├── calendar/
│       │   │   │   └── page.tsx      # Renewal calendar view
│       │   │   ├── settings/
│       │   │   │   └── page.tsx      # User settings, notifications
│       │   │   └── layout.tsx        # App shell (sidebar, auth check)
│       │   ├── api/
│       │   │   ├── auth/[...nextauth]/
│       │   │   │   └── route.ts
│       │   │   ├── cron/
│       │   │   │   └── check-renewals/
│       │   │   │       └── route.ts
│       │   │   └── webhooks/
│       │   │       └── stripe/
│       │   │           └── route.ts
│       │   └── layout.tsx            # Root layout
│       ├── components/
│       │   ├── ui/                   # shadcn/ui components
│       │   ├── dashboard/            # Dashboard-specific components
│       │   ├── subscriptions/        # Subscription-specific components
│       │   └── marketing/            # Landing page components
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── package.json
├── packages/
│   ├── db/                           # Database schema & client
│   │   ├── src/
│   │   │   ├── schema.ts            # Drizzle schema
│   │   │   ├── client.ts            # DB connection
│   │   │   ├── migrations/          # SQL migrations
│   │   │   └── seed.ts              # Demo data
│   │   └── package.json
│   ├── parsers/                      # Bank CSV/OFX parsers
│   │   ├── src/
│   │   │   ├── types.ts             # ParsedTransaction interface
│   │   │   ├── detect.ts            # Auto-detect bank format
│   │   │   ├── banks/               # Bank-specific parsers
│   │   │   │   ├── generic.ts
│   │   │   │   ├── fio.ts
│   │   │   │   ├── csas.ts
│   │   │   │   ├── revolut.ts
│   │   │   │   └── wise.ts
│   │   │   └── subscription-detector.ts  # Detect recurring charges
│   │   └── package.json
│   ├── email/                        # Email templates
│   │   ├── src/
│   │   │   ├── templates/
│   │   │   │   ├── renewal-reminder.tsx
│   │   │   │   ├── weekly-digest.tsx
│   │   │   │   ├── welcome.tsx
│   │   │   │   └── annual-report.tsx
│   │   │   └── send.ts
│   │   └── package.json
│   └── ui/                           # Shared UI (if needed beyond shadcn)
│       └── package.json
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release.yml
│   └── ISSUE_TEMPLATE/
├── turbo.json
├── package.json
├── LICENSE                           # AGPL-3.0
└── README.md
```

## Database (Neon Postgres)

### Why Neon
- **Serverless** — scales to zero, no idle costs
- **Free tier** — 0.5 GB storage, 190 compute hours/month
- **Branching** — preview deployments get their own DB
- **Edge-compatible** — `@neondatabase/serverless` driver
- **True Postgres** — no vendor lock-in, migrate anywhere

### First Paid Tier
- $19/month — 10 GB, 300 compute hours
- Needed when you exceed free tier (roughly 500+ active users)

## Auth (Auth.js v5)

### Providers (MVP)
1. **Google** — most users have it
2. **GitHub** — dev audience
3. **Email magic link** — universal fallback

### Why Not Clerk/Supabase Auth
- Auth.js is free forever — critical for open-source
- Self-hosters don't need third-party auth service
- `@auth/drizzle-adapter` connects directly to our DB

## Charts (Tremor v3)

### Components We'll Use
- `<AreaChart>` — monthly spending trends
- `<DonutChart>` — category breakdown
- `<BarChart>` — category comparison
- `<Card>` + `<Metric>` + `<BadgeDelta>` — KPI cards
- `<ProgressBar>` — budget tracking
- `<SparkChart>` — inline mini-charts

### Why Not Raw Recharts
- Tremor wraps Recharts with pre-styled dashboard components
- Tailwind CSS native — matches shadcn/ui
- Less code for the same result
- Can drop to raw Recharts when needed

## Email (Resend)

### Free Tier
- 3,000 emails/month — enough for hundreds of users
- 1 custom domain

### Self-Hosted Fallback
- SMTP configuration in env vars
- Users plug in their own email server
- `nodemailer` as fallback transport

## Deployment

### Vercel (Hosted SaaS)
```
Hobby (free):  Development, personal use
Pro ($20/mo):  Commercial use, unlimited cron, analytics
```

### Docker (Self-Hosted)
```yaml
# docker compose up — one command setup
services:
  app:
    image: subtracker/subtracker:latest
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://...
      NEXTAUTH_SECRET: ...
  db:
    image: postgres:16-alpine
```

### Next.js Standalone Output
```ts
// next.config.ts
const nextConfig = {
  output: 'standalone',
};
```
