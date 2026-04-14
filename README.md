# SubTracker

Open-source subscription tracker. Know exactly where your money goes every month.

## Features

- **Subscription Management** — Add, edit, pause, and delete subscriptions
- **CSV Bank Import** — Auto-detect Fio, Revolut, Wise, or generic CSV files
- **Smart Dashboard** — Monthly spend, annual projection, upcoming renewals
- **Analytics** — Top subscriptions, category breakdown, billing cycle distribution
- **Renewal Calendar** — Visual calendar of upcoming charges
- **Quick Add** — 35+ popular services with pre-filled data
- **Email Notifications** — Renewal reminders and weekly digests
- **Dark Mode** — Beautiful dark-first design
- **Self-Hostable** — Docker Compose with PostgreSQL

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Database:** PostgreSQL (Neon serverless or self-hosted)
- **ORM:** Drizzle ORM
- **Auth:** Auth.js v5 (Google, GitHub, email)
- **Email:** Resend (with SMTP fallback)
- **Monorepo:** Turborepo

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/subtracker.git
cd subtracker

# Install
npm install

# Setup environment
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your values

# Run database migrations
npm run db:migrate

# Seed default categories
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Self-Hosting with Docker

```bash
# Clone and configure
git clone https://github.com/YOUR_USERNAME/subtracker.git
cd subtracker
export AUTH_SECRET=$(openssl rand -base64 32)

# Start
docker compose up -d

# Run migrations
docker compose exec app npx drizzle-kit migrate
```

## Project Structure

```
subtracker/
  apps/
    web/          # Next.js frontend
  packages/
    db/           # Database schema, validators, seed data
    parsers/      # CSV bank parsers + subscription detection
    email/        # Email templates + Resend integration
```

## Environment Variables

See [`apps/web/.env.example`](apps/web/.env.example) for all variables.

Required for development:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — Auth.js secret (`npx auth secret`)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[AGPL-3.0](LICENSE) — Free to use, self-host, and modify. If you host a modified version, you must share your changes.
