# SubTracker — Competitive Analysis

## Market Overview

- **$219/month** average subscription spending per person (actual)
- **$86/month** what people THINK they spend (2.5x underestimate)
- **$127/year** wasted on forgotten subscriptions
- Only **10%** of consumers use any subscription tracking tool
- **84%** of fintech apps are abandoned within a year
- Subscription economy growing at **15-20% annually**

## Direct Competitors

### Tier 1: Major Commercial Players

#### Rocket Money (formerly Truebill)
- **Price:** $6-12/month (custom pricing)
- **Users:** Millions (acquired by Rocket Companies for $1.275B)
- **Strengths:** Auto-detection via bank API, bill negotiation, cancellation service
- **Weaknesses:** US-only, requires bank login (Plaid), expensive for what it does, privacy concerns
- **Lesson:** The "cancellation" and "negotiation" features drove growth — people want ACTION not just tracking

#### Copilot Money
- **Price:** $95/year
- **Platform:** iOS only
- **Strengths:** Best-in-class design, smooth animations, holistic finance view
- **Weaknesses:** Apple-only, expensive, US-focused
- **Lesson:** Design quality matters — people pay premium for beautiful UX

#### Monarch Money
- **Price:** $99.99/year
- **Strengths:** Household finance, Sankey diagram, collaborative budgeting
- **Weaknesses:** Expensive, US/Canada only
- **Lesson:** Family/household features are a differentiator

#### PocketGuard
- **Price:** Free tier + $7.99/month premium
- **Strengths:** "In My Pocket" calculation, bill tracking
- **Weaknesses:** Ads in free tier, limited subscription-specific features
- **Lesson:** Free tier with ads = bad UX, free tier with limits = better

### Tier 2: Open Source / Self-Hosted

#### Wallos ⭐ (Primary Competitor)
- **Stars:** 7,596
- **Stack:** PHP, SQLite, Docker
- **Features:** Manual entry, categories, currency conversion, notifications, payment history
- **Strengths:** Self-hosted leader, active development, good community
- **Weaknesses:**
  - PHP stack (not appealing to modern web devs)
  - No bank import (manual only)
  - UI is functional but not beautiful
  - No hosted version
  - Limited mobile experience
- **Our advantage:** Modern stack (Next.js), bank CSV import, hosted + self-hosted, better design

#### Subs
- **Stars:** ~500
- **Stack:** Next.js, ultra-lightweight
- **Strengths:** Same tech stack idea, minimal
- **Weaknesses:** Too minimal, limited features, inactive
- **Our advantage:** Full-featured, active development, community

#### SubTrackr
- **Stars:** ~400
- **Stack:** Go, HTMX
- **Features:** Has AI/MCP integration (unique)
- **Weaknesses:** Small community, Go backend (harder for web devs to contribute)
- **Our advantage:** Web-native stack, larger feature set, CSV import

### Tier 3: Budgeting Apps with Subscription Features

| App | Price | Subscription Tracking | Notes |
|-----|-------|----------------------|-------|
| YNAB | $99/year | Basic (manual categories) | Budgeting-first, not subscription-focused |
| Actual Budget | Free (self-hosted) | Minimal | Great budgeting, weak subscription tracking |
| Firefly III | Free (self-hosted) | Rules-based | Complex, not user-friendly |
| Lunch Money | $10/month | Decent | Good UX but paid, no self-host |

### Tier 4: Dead/Dying

| App | Status | What Happened |
|-----|--------|---------------|
| **Mint** | Shutdown Jan 2024 | 20M+ users left without a tool → huge opportunity |
| **Trim** | Gated behind OneMain | Was a Rocket Money competitor, now hidden behind lending app |
| **Prism** | Pivoted | Was bill pay + tracking, pivoted away |
| **Bobby** | Unmaintained | Popular iOS app, hasn't been updated |

## Our Differentiation Matrix

| Feature | SubTracker | Wallos | Rocket Money | YNAB |
|---------|-----------|--------|-------------|------|
| **Open source** | ✅ AGPL | ✅ GPL | ❌ | ❌ |
| **Self-hosted** | ✅ Docker | ✅ Docker | ❌ | ❌ |
| **Hosted cloud** | ✅ Free tier | ❌ | ✅ Paid | ✅ Paid |
| **Bank CSV import** | ✅ | ❌ | ❌ (API only) | ✅ |
| **Bank API** | ❌ (by design) | ❌ | ✅ (Plaid) | ✅ (Plaid) |
| **Auto-detection** | ✅ (from CSV) | ❌ | ✅ | ❌ |
| **Dark mode** | ✅ | ❌ | ✅ | ❌ |
| **Modern UI** | ✅ Next.js | ⚠️ PHP | ✅ | ⚠️ |
| **Multi-currency** | ✅ | ✅ | ❌ | ✅ |
| **Spending insights** | ✅ | ❌ | ✅ | ✅ |
| **Renewal reminders** | ✅ | ✅ | ✅ | ❌ |
| **Mobile-friendly** | ✅ | ⚠️ | ✅ Native | ✅ Native |
| **Family sharing** | ✅ (v1.2) | ❌ | ❌ | ✅ |
| **Privacy-first** | ✅ | ✅ | ❌ | ⚠️ |
| **Free forever option** | ✅ | ✅ (self) | ❌ | ❌ |
| **Price** | $0-8/mo | $0 | $6-12/mo | $99/yr |
| **Global** | ✅ | ✅ | ❌ (US) | ✅ |
| **Modern stack** | Next.js/TS | PHP | ? | Rails |

## Key Insights

### Why We Win
1. **No bank login required** — CSV import is the privacy-respecting middle ground
2. **Wallos is PHP** — modern web devs want to contribute to Next.js/TypeScript projects
3. **Hosted + self-hosted** — Wallos has no hosted option, Rocket Money has no self-hosted
4. **Design-first** — no open-source sub tracker looks beautiful
5. **Mint is dead** — 20M+ users need somewhere to go
6. **Global** — most tools are US-focused, we work everywhere

### What We Learn From Each Competitor
- **Rocket Money:** Cancellation features drive growth → add cancellation guides
- **Copilot:** Design quality justifies premium pricing → invest heavily in UI
- **Monarch:** Family features differentiate → plan family tier
- **Wallos:** Self-hosted community is loyal and engaged → Docker from day one
- **YNAB:** Subscription model for a tracking app is hated → never charge for basic tracking
