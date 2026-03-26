# SubTracker — Implementation Plan

## Phase 1: Foundation (Week 1-2)

### Week 1: Project Setup & Core

#### Day 1-2: Scaffold
- [ ] Init Turborepo monorepo
- [ ] Create Next.js 15 app with App Router
- [ ] Setup TypeScript strict mode
- [ ] Install & configure Tailwind CSS v4
- [ ] Install & configure shadcn/ui
- [ ] Setup Drizzle ORM + Neon connection
- [ ] Create database schema + run migrations
- [ ] Seed default categories
- [ ] Setup environment variables (.env.example)

#### Day 3-4: Authentication
- [ ] Install Auth.js v5
- [ ] Configure Drizzle adapter
- [ ] Google OAuth provider
- [ ] GitHub OAuth provider
- [ ] Email magic link provider
- [ ] Protected layout for (app) routes
- [ ] User settings page (currency, locale, timezone)
- [ ] Auth middleware

#### Day 5-7: Subscription CRUD
- [ ] Create subscription form (React Hook Form + Zod)
  - Name, amount, currency, billing cycle
  - Category selector
  - Next billing date picker
  - URL, notes fields
- [ ] Edit subscription form
- [ ] Delete (cancel) subscription
- [ ] Pause/resume toggle
- [ ] Trial status with trial end date
- [ ] Server Actions for all mutations
- [ ] Optimistic updates

### Week 2: Dashboard & Quick-Add

#### Day 8-9: Dashboard
- [ ] Install Tremor v3
- [ ] Hero metric card (total monthly spend)
- [ ] KPI cards (active count, next renewal, most expensive, budget %)
- [ ] Donut chart — spending by category
- [ ] Area chart — monthly trend (last 6 months)
- [ ] Upcoming renewals section (next 7 days)
- [ ] Recently added section
- [ ] Empty state design

#### Day 10-11: Quick-Add Onboarding
- [ ] Popular services grid (30+ services with logos)
- [ ] Service data file (name, default price, category, logo, color)
- [ ] Simple Icons integration for brand logos
- [ ] Fallback logo component (initial in colored circle)
- [ ] Tap to select → pre-filled form
- [ ] Custom entry option

#### Day 12-14: Subscription List
- [ ] Card view with service logos
- [ ] Table view (toggle)
- [ ] Filter panel (category, status, cycle, price range)
- [ ] Sort options (price, date, name)
- [ ] Search by name
- [ ] Responsive layout (cards on mobile, table option on desktop)

---

## Phase 2: Import & Notifications (Week 3-4)

### Week 3: CSV Import

#### Day 15-17: Parser Engine
- [ ] Create `packages/parsers` package
- [ ] Core types (ParsedTransaction, BankParser, etc.)
- [ ] Papa Parse integration
- [ ] Encoding detection (UTF-8, Windows-1250)
- [ ] Number format detection (EU vs US)
- [ ] Date format detection
- [ ] Generic CSV parser (fallback)

#### Day 18-19: Bank-Specific Parsers
- [ ] Fio Banka parser
- [ ] Revolut parser
- [ ] Wise parser
- [ ] Generic heuristic parser
- [ ] Parser auto-detection (header matching)
- [ ] Unit tests for each parser

#### Day 20-21: Subscription Detection
- [ ] Group transactions by merchant name
- [ ] Interval analysis algorithm
- [ ] Amount consistency check
- [ ] Billing cycle estimation
- [ ] Confidence scoring
- [ ] Match against existing subscriptions
- [ ] Merchant name cleanup

### Week 4: Import UI & Notifications

#### Day 22-23: Import UI
- [ ] File upload component (drag & drop + file picker)
- [ ] Bank detection step with preview
- [ ] Detected subscriptions review step
- [ ] Confirm & import step
- [ ] Import history log page
- [ ] Success/error states

#### Day 24-25: Notifications
- [ ] Resend integration (email sending)
- [ ] React Email templates:
  - Renewal reminder
  - Weekly digest
  - Welcome email
- [ ] Vercel Cron job (`/api/cron/check-renewals`)
- [ ] Reminder scheduling logic
- [ ] Per-subscription notification toggle
- [ ] User notification preferences (days before, time, digest)

#### Day 26-28: Web Push
- [ ] Service worker setup
- [ ] Push subscription management
- [ ] `web-push` server integration
- [ ] Push notification UI (enable/disable)
- [ ] Test notifications

---

## Phase 3: Polish & Landing (Week 5-6)

### Week 5: UI Polish

#### Day 29-30: Dark Mode
- [ ] CSS custom properties for all colors
- [ ] `prefers-color-scheme` detection
- [ ] Manual toggle (light/dark/system)
- [ ] Store preference in localStorage + DB
- [ ] Test all components in both modes
- [ ] Chart adjustments for dark mode

#### Day 31-32: Responsive Polish
- [ ] Mobile bottom navigation
- [ ] Desktop sidebar navigation
- [ ] Bento grid dashboard on desktop
- [ ] Swipe actions on mobile cards
- [ ] Touch-friendly tap targets
- [ ] Test on real devices

#### Day 33-35: Multi-Currency
- [ ] Currency selector (ISO 4217 list)
- [ ] Exchange rate fetching (frankfurter.app API)
- [ ] Daily rate caching
- [ ] Dashboard total conversion
- [ ] Per-subscription currency display
- [ ] Currency formatting (locale-aware)

### Week 6: Landing Page & Docker

#### Day 36-38: Landing Page
- [ ] Hero section with dashboard screenshot
- [ ] Problem statement with statistics
- [ ] Feature grid with icons
- [ ] Interactive dashboard preview (GIF/video)
- [ ] Open source section
- [ ] Pricing cards (Free/Pro/Family)
- [ ] FAQ section
- [ ] Final CTA
- [ ] SEO meta tags, OG image
- [ ] Analytics (Plausible or Umami)

#### Day 39-40: Docker
- [ ] Dockerfile (multi-stage build, standalone output)
- [ ] docker-compose.yml (app + postgres)
- [ ] .env.example with all variables
- [ ] SMTP fallback configuration
- [ ] Health check endpoint
- [ ] Docker README section

#### Day 41-42: Final Polish
- [ ] Accessibility audit (contrast, keyboard nav, screen reader)
- [ ] Performance audit (Lighthouse 90+)
- [ ] Error handling & error pages (404, 500)
- [ ] Loading states & skeletons
- [ ] Demo mode (pre-filled data for landing page)
- [ ] CONTRIBUTING.md
- [ ] README.md with screenshots

---

## Phase 4: Launch (Week 7-8)

### Week 7: Pre-Launch

#### Day 43-44: Testing
- [ ] End-to-end testing (critical flows)
- [ ] CSV import testing with real bank exports
- [ ] Mobile testing on real devices
- [ ] Dark mode visual testing
- [ ] Auth flow testing (all providers)
- [ ] Email delivery testing

#### Day 45-46: Launch Prep
- [ ] GitHub repo public
- [ ] Social preview image (1280x640)
- [ ] Issue templates
- [ ] GitHub Actions CI (lint, type-check, build)
- [ ] Vercel production deployment
- [ ] Custom domain setup
- [ ] Draft Reddit posts
- [ ] Draft Dev.to article
- [ ] Draft HN "Show HN" post

### Week 8: Launch

#### Day 47: Launch Day (Tuesday/Wednesday)
- [ ] Post to r/selfhosted (17-19 CET)
- [ ] Monitor & respond to comments
- [ ] Post to r/SideProject (2 hours later)
- [ ] Post to r/opensource (4 hours later)
- [ ] Publish Dev.to article
- [ ] Tweet/X announcement

#### Day 48-49: Post-Launch
- [ ] Respond to ALL Reddit comments
- [ ] Fix reported bugs ASAP
- [ ] Review & merge first PRs
- [ ] Post to r/personalfinance, r/Frugal

#### Day 50-56: Week 2
- [ ] Hacker News "Show HN"
- [ ] Product Hunt launch (Thursday)
- [ ] r/webdev "Showoff Saturday"
- [ ] Submit to awesome-selfhosted (if 100+ stars)
- [ ] Collect feedback for v1.1

---

## Phase 5: Post-Launch Iteration (Week 9+)

### Based on User Feedback
- [ ] Most requested features first
- [ ] Spending insights (F13)
- [ ] Spending Score (F17)
- [ ] Cancellation guides (F14)
- [ ] Free trial tracker (F20)
- [ ] OFX import (F15)
- [ ] Annual report (F16)
- [ ] Additional bank parsers (community PRs)
- [ ] i18n (Czech, German, Spanish based on demand)

---

## Development Commands

```bash
# Development
npm run dev          # Start all apps in dev mode
npm run build        # Build all apps
npm run lint         # Lint all packages
npm run type-check   # TypeScript check

# Database
npm run db:generate  # Generate migration from schema
npm run db:migrate   # Apply migrations
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed demo data

# Packages
npm run parsers:test # Test CSV parsers
npm run email:dev    # Preview email templates

# Docker
docker compose up -d       # Start self-hosted
docker compose down        # Stop
docker compose logs -f app # View logs
```

## Environment Variables

```bash
# .env.example

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/subtracker

# Auth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Email (Resend — hosted version)
RESEND_API_KEY=

# Email (SMTP — self-hosted fallback)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@subtracker.app

# Web Push (VAPID keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=mailto:admin@subtracker.app

# Currency Exchange
EXCHANGE_RATE_API=https://api.frankfurter.app

# Vercel Cron Secret
CRON_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
