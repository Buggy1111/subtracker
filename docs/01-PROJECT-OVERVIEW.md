# SubTracker — Project Overview

## Elevator Pitch

**Know exactly where your money goes every month.**

Open-source subscription tracker. Import bank statements, get renewal alerts, cut waste. Self-hostable, privacy-first, beautiful.

## Problem

- Average person spends **$219/month** on subscriptions but thinks it's $86
- **$127/year** wasted on forgotten subscriptions
- 74% of people say it's easy to forget about charges
- Existing solutions are either US-only (bank API), ugly, or abandoned
- Irony: most subscription trackers require a subscription

## Solution

Free, open-source subscription tracker that:
- Works globally (not tied to US bank APIs)
- Looks beautiful (dark mode, modern design)
- Imports bank CSV/OFX (privacy-first, no bank login)
- Self-hostable via Docker
- Hosted version on Vercel with free tier

## Target Audience

1. **Primary:** Privacy-conscious individuals who want to track spending
2. **Secondary:** r/selfhosted community (650K+ weekly visitors)
3. **Tertiary:** Frugal/personal finance community (r/personalfinance 19M, r/Frugal 2.8M)

## Competitive Advantage

| Us | Wallos (leader, 7.6K stars) | Rocket Money (commercial) |
|----|----------------------------|---------------------------|
| Next.js + modern React | PHP + jQuery | Proprietary |
| Beautiful UI (dark mode) | Functional but dated | Beautiful but $6-12/mo |
| CSV import + manual | Manual only | Bank API (US only) |
| Vercel hosted + Docker | Docker only | Cloud only |
| Free forever (open core) | Free (self-hosted) | Paid subscription |
| Multi-currency | Limited | USD focused |
| Spending predictions | No | Yes |

## Key Metrics (Success Criteria)

### Phase 1 (Launch)
- 500+ GitHub stars in first month
- 100+ Docker pulls
- Front page on r/selfhosted

### Phase 2 (Growth)
- 2,000+ GitHub stars
- 50+ paying users
- Product Hunt launch

### Phase 3 (Sustainability)
- 5,000+ GitHub stars
- 200+ paying users ($800+/month revenue)
- Community contributors

## Project Name Options

| Name | Domain Available | Verdict |
|------|-----------------|---------|
| **SubTracker** | subtracker.app | Working name |
| **SubWatch** | subwatch.app | Alternative |
| **Leakr** | leakr.app | Catchy, "money leaks" |
| **BurnRate** | burnrate.app | Dev-friendly |
| **DrainCheck** | draincheck.app | Descriptive |

> Final name TBD — check domain availability before deciding.

## Timeline

| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Setup & Core | Week 1-2 | Project scaffold, auth, DB schema, basic CRUD |
| Dashboard & UI | Week 3-4 | Dashboard, charts, subscription management |
| Import & Notifications | Week 5-6 | CSV parser, bank format support, email reminders |
| Polish & Landing | Week 7-8 | Landing page, dark mode, responsive, Docker |
| Launch | Week 9-10 | Reddit, Dev.to, HN, Product Hunt |
