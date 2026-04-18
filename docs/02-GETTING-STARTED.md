# 02 — Getting Started

> Cíl: během ~15 minut mít lokální SubTracker, do kterého se přihlásíš přes Google nebo GitHub.

## Požadavky

- **Node.js 20+** (Dockerfile pin: `node:20-alpine`)
- **npm 10+** (workspace manager, repo používá `"packageManager": "npm@10.9.2"`)
- **Postgres** — buď [Neon serverless](https://console.neon.tech/) (doporučeno, free tier stačí), nebo lokální/Dockerový Postgres 16
- **OAuth aplikace** — alespoň jedna z dvojice Google / GitHub. Bez OAuth se v produkčním režimu (`NODE_ENV=production`) nepřihlásíš.

## Instalace

```bash
git clone https://github.com/Buggy1111/subtracker.git
cd subtracker
npm install
```

Turborepo si pull-ne všechny workspace packages (`apps/web`, `packages/{db,parsers,email}`).

## Environment

Zkopíruj šablonu:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Povinné hodnoty:

| Proměnná | Popis |
|----------|-------|
| `DATABASE_URL` | Postgres connection string (Neon pooled, nebo `postgresql://user:pass@localhost:5432/subtracker`) |
| `AUTH_SECRET` | Secret pro Auth.js. Generuj: `npx auth secret` nebo `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` pro dev |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | OAuth credentials — viz níže |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | OAuth credentials — viz níže |

`.env.example` obsahuje i volitelné proměnné pro email (`RESEND_API_KEY`, SMTP fallback), web push (`VAPID_*`), cron — tyto fíčury zatím NEJSOU zapojené (viz [10-ROADMAP](10-ROADMAP.md)).

## OAuth setup

### Google

1. https://console.cloud.google.com/apis/credentials → **Create Credentials → OAuth 2.0 Client ID**
2. Type: **Web application**
3. Authorized redirect URIs:
   - dev: `http://localhost:3000/api/auth/callback/google`
   - prod: `https://your-domain/api/auth/callback/google`
4. Zkopíruj **Client ID** → `AUTH_GOOGLE_ID`, **Client Secret** → `AUTH_GOOGLE_SECRET`

### GitHub

1. https://github.com/settings/developers → **New OAuth App**
2. Authorization callback URL:
   - dev: `http://localhost:3000/api/auth/callback/github`
   - prod: `https://your-domain/api/auth/callback/github`
3. **Client ID** → `AUTH_GITHUB_ID`, **Generate a new client secret** → `AUTH_GITHUB_SECRET`

## Databáze

### Varianta A — Neon (doporučené, 0 setup)

1. https://console.neon.tech/ → **New Project**
2. Copy pooled connection string → `DATABASE_URL`
3. Migrace:
   ```bash
   npm run db:migrate
   npm run db:seed     # vloží 12 default kategorií
   ```

### Varianta B — Lokální Postgres přes Docker

```bash
docker run --name subtracker-db -e POSTGRES_PASSWORD=subtracker \
  -e POSTGRES_USER=subtracker -e POSTGRES_DB=subtracker \
  -p 5432:5432 -d postgres:16-alpine
```

Pak nastav:
```
DATABASE_URL=postgresql://subtracker:subtracker@localhost:5432/subtracker
```

A znovu:
```bash
npm run db:migrate
npm run db:seed
```

## Spuštění

```bash
npm run dev
```

Aplikace běží na http://localhost:3000.

Co uvidíš:

- `/` — marketing landing (veřejná)
- `/login` — OAuth buttons (Google / GitHub)
- `/dashboard`, `/subscriptions`, atd. — vyžaduje přihlášení; layout v `apps/web/src/app/(app)/layout.tsx` redirectne na `/login`, pokud nemáš session

## Dev mode gotcha

Pokud `NODE_ENV=development` (což `next dev` nastaví), Auth.js přidává navíc **Credentials provider** (`dev@subtracker.app`, jakákoliv hodnota). Toto je **pouze pro dev** — v produkčním buildu se nenasadí.

Konfigurace: `apps/web/src/lib/auth.ts`, řádek 10-25.

## Dev bez OAuth

Pokud nechceš dělat Google/GitHub OAuth aplikaci pro lokální dev:

- `npm run dev` s dev providerem (viz výše)
- Nebo nastav `DATABASE_URL=postgresql://dummy:dummy@dummy:5432/dummy` — `apps/web/src/lib/db.ts` a `lib/auth.ts` to detekují a přepnou na fallback proxy (DB queries throw-nou, ale build/dev server poběží)

## Časté problémy

**"Invalid redirect_uri"** — OAuth app má jiný callback URL než aplikace. Zkontroluj `NEXT_PUBLIC_APP_URL` a authorized redirect URIs v Google/GitHub konzoli.

**"AUTH_SECRET is not set"** — chybí v `.env.local`. Generuj `openssl rand -base64 32`.

**Build fail "DATABASE_URL is required"** — v Dockerfile je `ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/subtracker` pro build, `lib/db.ts` to rozpozná jako dummy a vrátí proxy. Pokud selže lokálně, zkontroluj že DB proměnná v `.env.local` existuje.

**Build fail na Vercelu** — nastav env proměnné v **Vercel → Settings → Environment Variables** (nejen v `.env.local`, ty se do buildu neprolinkují).
