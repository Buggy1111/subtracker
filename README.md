# SubTracker

> **🚧 v0.5 Early Access** — Core features work. Some items listed as *"Roadmap"* are not yet implemented (email reminders, web push, multi-currency). See [Roadmap](#roadmap) below for honesty about current state.

Open-source subscription tracker. Know exactly where your money goes every month.

![SubTracker Dashboard](docs/screenshot-dashboard.png)

## What works today

- **Subscription Management** — Add, edit, pause, and delete subscriptions
- **CSV Bank Import** — Auto-detect Fio, Revolut, Wise, or generic CSV files and suggest subscriptions from recurring payments
- **Smart Dashboard** — Monthly spend, annual projection, upcoming renewals
- **Analytics** — Top subscriptions, category breakdown, billing cycle distribution
- **Renewal Calendar** — Visual calendar of upcoming charges
- **Quick Add** — 35+ popular services with pre-filled data
- **Dark Mode** — Dark-first design, polished UI
- **OAuth Login** — Google and GitHub sign-in
- **Self-Hostable** — Docker Compose with PostgreSQL, or deploy to Vercel
- **AGPL-3.0** — Free to use, self-host, and modify

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Database:** PostgreSQL (Neon serverless or self-hosted)
- **ORM:** Drizzle ORM
- **Auth:** Auth.js v5 (Google, GitHub)
- **Monorepo:** Turborepo

## Quick Start

```bash
# Clone
git clone https://github.com/Buggy1111/subtracker.git
cd subtracker

# Install
npm install

# Setup environment — see apps/web/.env.example
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your DATABASE_URL, AUTH_SECRET, and OAuth credentials

# Generate a secure AUTH_SECRET
npx auth secret

# Run database migrations
npm run db:migrate

# Seed default categories
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### OAuth setup (required for login)

1. **Google** — [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 Client ID
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (dev) / your-domain for prod
2. **GitHub** — [github.com/settings/developers](https://github.com/settings/developers)
   - Create OAuth App
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## Self-Hosting with Docker

```bash
# Clone and configure
git clone https://github.com/Buggy1111/subtracker.git
cd subtracker

# Generate secrets
export AUTH_SECRET=$(openssl rand -base64 32)

# Configure .env (see .env.example). AUTH_SECRET is required — no default.
cp apps/web/.env.example .env
# Edit .env with your OAuth credentials and DATABASE_URL

# Start
docker compose up -d

# Run migrations (first-time setup)
docker compose exec app npx drizzle-kit migrate
```

## Project Structure

```
subtracker/
  apps/
    web/          # Next.js frontend
  packages/
    db/           # Database schema, validators, seed data
    parsers/      # CSV bank parsers + subscription detection engine
    email/        # Email templates (Resend integration — roadmap)
```

## Environment Variables

See [`apps/web/.env.example`](apps/web/.env.example) for all variables.

**Required:**
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — Auth.js secret (generate with `npx auth secret`)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — for Google OAuth
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — for GitHub OAuth
- `NEXT_PUBLIC_APP_URL` — your base URL (e.g. `http://localhost:3000`)

## Roadmap

Features on the way — currently **not implemented**:

- [ ] Email renewal reminders (Resend + SMTP fallback)
- [ ] Weekly email digest
- [ ] Multi-currency support with live FX rates
- [ ] Web push notifications
- [ ] Mobile bottom navigation
- [ ] Search and advanced filters
- [ ] Native charts in Dashboard (Tremor)
- [ ] Magic-link email sign-in
- [ ] i18n (currently English only)

If a feature matters to you, [open an issue](https://github.com/Buggy1111/subtracker/issues) or upvote an existing one.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[AGPL-3.0](LICENSE) — Free to use, self-host, and modify. If you host a modified version and make it network-available, you must share your source changes with users.

---

Built by [Michal Bürgermeister](https://github.com/Buggy1111) — a factory operator learning to ship software with AI. Feedback and contributions welcome.
