# SubTracker — Business Model & Launch Strategy

## Pricing

### Free Tier (self-hosted or hosted)
- Up to **10 subscriptions**
- Manual entry
- Basic dashboard with charts
- Monthly email digest
- 1 CSV import per month
- Dark mode, responsive
- Docker self-host (unlimited everything)

### Pro — $4/month (~100 CZK)
- **Unlimited** subscriptions
- **Unlimited** CSV/OFX imports
- Auto-detection of recurring charges from bank data
- Custom reminder schedules (1, 3, 7, 14, 30 days before)
- Web Push notifications
- Spending predictions & annual forecast
- Multi-currency with auto-conversion
- Spending Score
- Priority email support

### Family — $8/month (~200 CZK)
- Everything in Pro
- Up to **5 family members**
- Shared dashboard
- Split subscription tracking
- Individual + household views

## Revenue Projections

| Milestone | Users (free) | Users (paid) | MRR | Costs | Profit |
|-----------|-------------|-------------|-----|-------|--------|
| Launch | 100 | 0 | $0 | $0 | -$0 |
| Month 3 | 500 | 15 | $60 | $21 | $39 |
| Month 6 | 2,000 | 80 | $320 | $70 | $250 |
| Month 12 | 5,000 | 250 | $1,000 | $100 | $900 |
| Month 18 | 10,000 | 500 | $2,000 | $150 | $1,850 |

## Cost Breakdown

### Phase 1 (Development) — $0/month
- Vercel Hobby (free)
- Neon Free (0.5 GB)
- Resend Free (3K emails)
- GitHub Free

### Phase 2 (Launch) — ~$21/month
- Vercel Pro ($20) — needed for commercial use
- Neon Free ($0)
- Resend Free ($0)
- Domain (~$15/year = ~$1.25/mo)

### Phase 3 (Growth) — ~$70/month
- Vercel Pro ($20)
- Neon Pro ($19) — when DB exceeds 0.5 GB
- Resend Pro ($20) — when exceeding 3K emails
- Upstash ($10) — advanced cron/queues

## License: AGPL-3.0

### Why AGPL
- Anyone can use, modify, self-host
- If someone modifies and hosts it, they MUST share their changes
- Prevents companies from competing with a proprietary fork
- We (as copyright holder) can still offer commercial license
- Same license as Plausible, Cal.com — proven model

### Self-Hosted vs Hosted
- Self-hosted: fully free, unlimited, Docker
- Hosted: free tier (limited) + paid tiers
- No artificial limitations in self-hosted — all features available
- Hosted value = convenience (no server management, updates, backups)

## Launch Strategy

### Pre-Launch (2 weeks before)

1. **GitHub repo setup**
   - Beautiful README with screenshots/GIF
   - Social preview image (1280x640)
   - Issue templates, contribution guide
   - License (AGPL-3.0)

2. **Landing page live** on subtracker.app (or chosen domain)
   - Email signup for launch notification
   - "Star on GitHub" button

3. **Seed content**
   - Write Dev.to article: "Building an Open-Source Subscription Tracker with Next.js"
   - Prepare Reddit posts (drafts)
   - Prepare HN "Show HN" post

### Launch Day (Tuesday-Thursday, 17-19 CET)

**Hour 0: Reddit r/selfhosted**
```
Title: I built an open-source subscription tracker because I was tired of
       paying $12/month to track my $12/month subscriptions

Body:
- The problem (personal story)
- What it does (3-4 bullet points)
- Screenshots (2-3)
- Demo link
- GitHub link
- Docker one-liner
- "Would love feedback!"
```

**Hour 2: r/SideProject**
```
Title: [Open Source] SubTracker — Track your subscriptions, import bank
       CSV, self-hostable

Body: Shorter version, focus on tech journey
```

**Hour 4: r/opensource**
```
Title: SubTracker — Open-source subscription tracker (Next.js, self-hosted)
Body: Focus on open-source aspects, contribution welcome
```

**Same day: Dev.to article**
- "How I Built an Open-Source Subscription Tracker That Saves People Money"
- Technical details, screenshots, lessons learned

### Week 1 Post-Launch

- Respond to EVERY comment on Reddit (first 48 hours critical)
- Fix bugs reported by early users ASAP
- Merge first community PRs
- r/personalfinance post (if rules allow self-promo)
- r/Frugal post (focus on saving money angle)

### Week 2-4

- **Hacker News** "Show HN" post
- Product Hunt launch (Thursday)
- r/webdev "Showoff Saturday"
- r/reactjs
- r/privacy (privacy-first angle)
- r/degoogle (for Google One trackers)
- Cross-post Dev.to article to Medium, Hashnode

### Month 2-3

- **YouTube** — reach out to self-hosted YouTubers
  - Techno Tim, Wolfgang's Channel, Awesome Open Source
- **Docker Hub** listing optimization
- **awesome-selfhosted** PR (submit after 100+ stars)
- Blog posts: "How I saved $X/year with subscription tracking"
- Community bank parser contributions

## GitHub README Structure

```markdown
<div align="center">
  <img src="logo.svg" width="80" />
  <h1>SubTracker</h1>
  <p>Know exactly where your money goes every month.</p>
  <p>
    <a href="https://subtracker.app">Website</a> •
    <a href="https://subtracker.app/demo">Live Demo</a> •
    <a href="#self-hosting">Self-Host</a> •
    <a href="#features">Features</a>
  </p>
  <img src="dashboard-screenshot.png" width="800" />
</div>

## Features
- 📊 Beautiful dashboard with spending insights
- 📥 Import bank statements (CSV, OFX)
- 🔔 Smart renewal reminders
- 🌙 Dark mode
- 🐳 Self-hostable via Docker
- 🔒 Privacy-first — your data stays yours
- 🌍 Multi-currency support
- 📱 Mobile-friendly

## Quick Start

### Cloud (Hosted)
Visit [subtracker.app](https://subtracker.app) — free tier available.

### Self-Hosted (Docker)
\```bash
docker compose up -d
\```

## Tech Stack
Next.js 15 • TypeScript • Tailwind CSS • shadcn/ui • Neon Postgres • Drizzle ORM

## Contributing
We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License
AGPL-3.0
```

## Marketing Channels (Ongoing)

| Channel | Frequency | Content Type |
|---------|-----------|-------------|
| Reddit | Weekly | Community engagement, feature announcements |
| Dev.to/Medium | Bi-weekly | Technical articles, build logs |
| GitHub | Continuous | Release notes, discussions |
| Twitter/X | Daily | Tips, milestones, screenshots |
| Product Hunt | One-time | Launch |
| YouTube | Monthly | Feature demos, tutorials |

## Success Metrics

### North Star: Monthly Active Users (MAU)
- People who log in and view dashboard at least 1x/month

### Key Metrics
| Metric | Target (Month 6) |
|--------|-----------------|
| GitHub stars | 2,000+ |
| MAU | 500+ |
| Paid users | 80+ |
| MRR | $320+ |
| Docker pulls | 5,000+ |
| NPS score | > 50 |
| Churn rate | < 5%/month |

### Engagement Metrics
- Average subscriptions per user (target: 8+)
- CSV import completion rate (target: 70%+)
- Notification open rate (target: 40%+)
- Weekly active rate (target: 30% of MAU)
