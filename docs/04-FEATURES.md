# SubTracker — Features Specification

## Feature Tiers

### MVP (v1.0) — Weeks 1-8

#### F01: Authentication
- Google OAuth login
- GitHub OAuth login
- Email magic link
- Session management (Auth.js)
- User profile settings (currency, locale, timezone)

#### F02: Subscription CRUD
- Add subscription manually
  - Name, amount, currency, billing cycle
  - Category (from predefined + custom)
  - Next billing date
  - URL, notes
- Edit subscription
- Delete subscription (soft delete → cancelled status)
- Pause/resume subscription
- Mark as trial (with trial end date)

#### F03: Quick-Add Onboarding
- Grid of 30+ popular services with logos
  - Netflix, Spotify, Disney+, YouTube Premium, HBO Max
  - Adobe CC, Microsoft 365, Google One, iCloud+
  - ChatGPT, Claude, GitHub Copilot
  - Dropbox, 1Password, NordVPN
  - Gym memberships, insurance (generic)
- Tap to select → pre-fill name, logo, default price, category
- User confirms/adjusts price and date
- "Add custom" button for unlisted services

#### F04: Dashboard
- **Hero metric:** Total monthly spend (large, bold number)
- **Quick-glance cards (4x):**
  - Active subscriptions count
  - Next renewal (name + days + amount)
  - Most expensive subscription
  - Monthly budget remaining (if budget set)
- **Spending by category:** Donut chart
- **Monthly trend:** Area chart (last 6-12 months)
- **Upcoming renewals:** List of next 7 days
- **Recently added:** Last 5 subscriptions

#### F05: Subscription List View
- Card view (default) with service logo, name, price, cycle, next date
- Table view (toggle) for power users — sortable columns
- Filter by: category, status, billing cycle, price range
- Sort by: price, next billing date, name, date added
- Search by name
- Bulk actions: pause, cancel, change category

#### F06: CSV Bank Import
- Upload CSV file
- Auto-detect bank format (Fio, ČSOB, Revolut, Wise, generic)
- Auto-detect encoding (UTF-8, Windows-1250)
- Preview parsed transactions
- Auto-detect recurring charges (same merchant + similar amount + regular interval)
- User confirms which to import
- Map to existing subscriptions or create new
- Import history log

#### F07: Notifications & Reminders
- Email reminder X days before renewal (configurable: 1, 3, 7, 14, 30)
- Weekly email digest: upcoming renewals + total spend
- In-app notification badges
- Web Push notifications (opt-in)
- Per-subscription notification toggle

#### F08: Dark Mode
- System preference detection
- Manual toggle (light/dark/system)
- Stored in localStorage + user preference
- Full theme support across all components

#### F09: Responsive Design
- Mobile-first layout
- Bottom navigation on mobile
- Sidebar navigation on desktop
- Bento grid dashboard on desktop
- Swipe actions on mobile subscription cards

#### F10: Landing Page
- Hero with screenshot/demo
- Problem statement with statistics
- Feature grid
- Dashboard preview (GIF/video)
- Open source section (GitHub stars badge)
- Pricing cards (Free/Pro/Family)
- FAQ
- Final CTA

#### F11: Docker Self-Hosting
- `docker-compose.yml` — one command setup
- Environment variables for all configuration
- SMTP fallback for email (no Resend dependency)
- Postgres included in compose
- Health check endpoint
- Documentation for setup

#### F12: Multi-Currency
- User sets primary currency
- Per-subscription currency override
- Dashboard totals converted to primary currency
- Exchange rates from free API (frankfurter.app or similar)
- Cached daily

---

### v1.1 — Post-Launch Enhancements

#### F13: Spending Insights
- "You spend X% of income on subscriptions" (if income set)
- "Your most expensive category is Y"
- "You've been paying for Z for N months — total: $X"
- Subscription overlap detection ("You have 3 streaming services")
- "What if" calculator — "If you cancel X, you save Y/year"
- Annual projection — "At this rate, you'll spend $X this year"

#### F14: Cancellation Guides
- Crowdsourced difficulty rating (1-5 stars)
- Direct cancellation URL where possible
- Step-by-step guides for common services
- "Dark pattern" warnings

#### F15: OFX/QFX Import
- Support Open Financial Exchange format
- Broader bank compatibility
- Transaction categorization from OFX metadata

#### F16: Annual Report
- PDF/email report summarizing the year
- Total spent, by category, trends
- Biggest increases, new subscriptions, cancelled ones
- Shareable (anonymized option)

#### F17: Spending Score
- 0-100 score based on:
  - Subscription-to-income ratio
  - Unused subscription detection
  - Overlap detection
  - Annual vs monthly optimization
- Monthly trend (improving/declining)
- Comparison: "Better than X% of users" (anonymous aggregate)

---

### v1.2 — Growth Features

#### F18: Family/Shared Accounts
- Invite family members
- Shared subscriptions (who pays, who uses)
- Split cost tracking
- Individual + household dashboards

#### F19: Price Change Detection
- Track historical prices per subscription
- Alert when a service changes its pricing
- "Grandfathered rate" indicator
- "Your plan increased by X% this year"

#### F20: Free Trial Tracker
- Dedicated trial section
- Countdown to trial expiration
- Auto-remind before trial converts to paid
- "Cancel before" date prominently displayed

#### F21: Browser Extension (future)
- Detect when user signs up for a service
- Auto-suggest adding to SubTracker
- Quick-add from any page

#### F22: API & Webhooks
- REST API for programmatic access
- Webhooks for events (new subscription, renewal, cancellation)
- n8n/Zapier integration potential

---

## Feature Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| F04 Dashboard | High | Medium | P0 |
| F02 Subscription CRUD | High | Low | P0 |
| F01 Authentication | High | Low | P0 |
| F08 Dark Mode | High | Low | P0 |
| F09 Responsive | High | Medium | P0 |
| F03 Quick-Add | High | Medium | P0 |
| F05 List/Filter | Medium | Medium | P0 |
| F10 Landing Page | High | Medium | P0 |
| F11 Docker | High | Low | P0 |
| F07 Notifications | High | Medium | P1 |
| F06 CSV Import | High | High | P1 |
| F12 Multi-Currency | Medium | Medium | P1 |
| F13 Insights | High | Medium | P2 |
| F17 Spending Score | Medium | Medium | P2 |
| F14 Cancel Guides | Medium | Low | P2 |
| F20 Free Trial | Medium | Low | P2 |
| F16 Annual Report | Medium | Medium | P3 |
| F18 Family | Medium | High | P3 |
| F19 Price Detection | Medium | Medium | P3 |
| F15 OFX Import | Low | Medium | P3 |
| F22 API/Webhooks | Low | Medium | P3 |
| F21 Browser Ext | Low | High | P4 |

## Popular Services Database (Quick-Add)

Pre-loaded service data for onboarding:

```typescript
const popularServices = [
  // Streaming
  { name: 'Netflix', category: 'streaming', defaultPrice: 15.49, cycle: 'monthly', logo: 'netflix', color: '#E50914' },
  { name: 'Disney+', category: 'streaming', defaultPrice: 13.99, cycle: 'monthly', logo: 'disney-plus', color: '#113CCF' },
  { name: 'HBO Max', category: 'streaming', defaultPrice: 15.99, cycle: 'monthly', logo: 'hbo', color: '#B535F6' },
  { name: 'Hulu', category: 'streaming', defaultPrice: 7.99, cycle: 'monthly', logo: 'hulu', color: '#1CE783' },
  { name: 'Amazon Prime', category: 'streaming', defaultPrice: 14.99, cycle: 'monthly', logo: 'amazon', color: '#FF9900' },
  { name: 'Apple TV+', category: 'streaming', defaultPrice: 9.99, cycle: 'monthly', logo: 'apple', color: '#000000' },
  { name: 'YouTube Premium', category: 'streaming', defaultPrice: 13.99, cycle: 'monthly', logo: 'youtube', color: '#FF0000' },
  { name: 'Crunchyroll', category: 'streaming', defaultPrice: 7.99, cycle: 'monthly', logo: 'crunchyroll', color: '#F47521' },

  // Music
  { name: 'Spotify', category: 'music', defaultPrice: 10.99, cycle: 'monthly', logo: 'spotify', color: '#1DB954' },
  { name: 'Apple Music', category: 'music', defaultPrice: 10.99, cycle: 'monthly', logo: 'apple', color: '#FC3C44' },
  { name: 'Tidal', category: 'music', defaultPrice: 10.99, cycle: 'monthly', logo: 'tidal', color: '#000000' },

  // Productivity
  { name: 'Microsoft 365', category: 'productivity', defaultPrice: 6.99, cycle: 'monthly', logo: 'microsoft', color: '#0078D4' },
  { name: 'Google One', category: 'cloud', defaultPrice: 2.99, cycle: 'monthly', logo: 'google', color: '#4285F4' },
  { name: 'iCloud+', category: 'cloud', defaultPrice: 2.99, cycle: 'monthly', logo: 'apple', color: '#3693F3' },
  { name: 'Notion', category: 'productivity', defaultPrice: 8.00, cycle: 'monthly', logo: 'notion', color: '#000000' },
  { name: 'Todoist', category: 'productivity', defaultPrice: 4.00, cycle: 'monthly', logo: 'todoist', color: '#E44332' },

  // AI Tools
  { name: 'ChatGPT Plus', category: 'productivity', defaultPrice: 20.00, cycle: 'monthly', logo: 'openai', color: '#10A37F' },
  { name: 'Claude Pro', category: 'productivity', defaultPrice: 20.00, cycle: 'monthly', logo: 'anthropic', color: '#D97706' },
  { name: 'GitHub Copilot', category: 'productivity', defaultPrice: 10.00, cycle: 'monthly', logo: 'github', color: '#000000' },
  { name: 'Midjourney', category: 'productivity', defaultPrice: 10.00, cycle: 'monthly', logo: 'midjourney', color: '#000000' },

  // Security & VPN
  { name: '1Password', category: 'utilities', defaultPrice: 2.99, cycle: 'monthly', logo: '1password', color: '#0572EC' },
  { name: 'NordVPN', category: 'utilities', defaultPrice: 12.99, cycle: 'monthly', logo: 'nordvpn', color: '#4687FF' },
  { name: 'ExpressVPN', category: 'utilities', defaultPrice: 12.95, cycle: 'monthly', logo: 'expressvpn', color: '#DA3940' },
  { name: 'Bitwarden', category: 'utilities', defaultPrice: 0.83, cycle: 'monthly', logo: 'bitwarden', color: '#175DDC' },

  // Creative
  { name: 'Adobe Creative Cloud', category: 'productivity', defaultPrice: 54.99, cycle: 'monthly', logo: 'adobe', color: '#FF0000' },
  { name: 'Figma', category: 'productivity', defaultPrice: 12.00, cycle: 'monthly', logo: 'figma', color: '#F24E1E' },
  { name: 'Canva Pro', category: 'productivity', defaultPrice: 12.99, cycle: 'monthly', logo: 'canva', color: '#00C4CC' },

  // Gaming
  { name: 'Xbox Game Pass', category: 'gaming', defaultPrice: 16.99, cycle: 'monthly', logo: 'xbox', color: '#107C10' },
  { name: 'PlayStation Plus', category: 'gaming', defaultPrice: 9.99, cycle: 'monthly', logo: 'playstation', color: '#003791' },
  { name: 'Nintendo Switch Online', category: 'gaming', defaultPrice: 3.99, cycle: 'monthly', logo: 'nintendo', color: '#E60012' },
  { name: 'Steam (Subscription)', category: 'gaming', defaultPrice: 0, cycle: 'monthly', logo: 'steam', color: '#1B2838' },

  // Health & Fitness
  { name: 'Peloton', category: 'health', defaultPrice: 12.99, cycle: 'monthly', logo: 'peloton', color: '#000000' },
  { name: 'Strava', category: 'health', defaultPrice: 11.99, cycle: 'monthly', logo: 'strava', color: '#FC4C02' },
  { name: 'Headspace', category: 'health', defaultPrice: 12.99, cycle: 'monthly', logo: 'headspace', color: '#F47D31' },
  { name: 'Calm', category: 'health', defaultPrice: 14.99, cycle: 'monthly', logo: 'calm', color: '#6A8FB7' },

  // News & Reading
  { name: 'Medium', category: 'news', defaultPrice: 5.00, cycle: 'monthly', logo: 'medium', color: '#000000' },
  { name: 'The New York Times', category: 'news', defaultPrice: 4.25, cycle: 'monthly', logo: 'nyt', color: '#000000' },
  { name: 'Audible', category: 'news', defaultPrice: 14.95, cycle: 'monthly', logo: 'audible', color: '#F8991C' },
  { name: 'Kindle Unlimited', category: 'news', defaultPrice: 11.99, cycle: 'monthly', logo: 'kindle', color: '#FF9900' },

  // Food & Delivery
  { name: 'DoorDash DashPass', category: 'food', defaultPrice: 9.99, cycle: 'monthly', logo: 'doordash', color: '#FF3008' },
  { name: 'Uber One', category: 'food', defaultPrice: 9.99, cycle: 'monthly', logo: 'uber', color: '#000000' },
];
```
