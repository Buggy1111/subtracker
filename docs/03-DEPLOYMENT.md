# 03 — Deployment

Dva podporované cesty:

1. **Vercel + Neon** — one-click, zero-ops (stejný stack jako produkce na https://subtracker-web-six.vercel.app/)
2. **Docker Compose self-host** — app + Postgres na vlastním serveru

## Vercel + Neon

### Prerekvizity

- GitHub fork / vlastní repo se SubTrackerem
- Vercel účet (free tier stačí pro hobby use)
- Neon účet → vytvoř projekt → zkopíruj **pooled** connection string

### Postup

1. **Import do Vercelu** — New Project → Import Git Repository → vyber SubTracker repo
2. Root directory: ponechej `/` (Vercel najde `apps/web` přes `vercel.json` / workspace config)
3. Framework preset: **Next.js**
4. Build command: `npm run build` (Turborepo vybere správné cíle)
5. **Environment Variables** (Settings → Environment Variables):

```
DATABASE_URL=postgresql://...neon pooled URL...
AUTH_SECRET=<generuj znovu, openssl rand -base64 32>
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

6. Po první deploy aktualizuj OAuth redirect URIs na produkční URL.
7. **Migrace** — Neon nemá `drizzle-kit migrate` v build kroku. Spusť lokálně:
   ```bash
   DATABASE_URL="<prod url>" npm run db:migrate
   DATABASE_URL="<prod url>" npm run db:seed
   ```
   Alternativa: použij [Neon's migration feature](https://neon.tech/docs) nebo Vercel Postgres migration hook.

### `vercel-env-production.txt` (hot warning)

Repo obsahuje soubor `vercel-env-production.txt` s produkčními hodnotami (gitignorovaný).
**Před distribucí forku tento soubor smaž** — jinak riskuješ, že ho přes omyl commitneš. `.gitignore` má pattern `vercel-env-*.txt`, takže git ho ignoruje, ale soubor stále sedí na disku.

## Docker Compose self-host

Repo obsahuje funkční `Dockerfile` (multi-stage, non-root user) a `docker-compose.yml`.

### Quick start

```bash
git clone https://github.com/Buggy1111/subtracker.git
cd subtracker

# Generuj secret — docker compose odmítne start bez něj
export AUTH_SECRET=$(openssl rand -base64 32)

# OAuth creds (aspoň jedna dvojice)
export AUTH_GOOGLE_ID=...
export AUTH_GOOGLE_SECRET=...
# nebo
export AUTH_GITHUB_ID=...
export AUTH_GITHUB_SECRET=...

export NEXT_PUBLIC_APP_URL=https://your-domain

docker compose up -d

# První migrace
docker compose exec app npx drizzle-kit migrate
# Seed
docker compose exec app npx tsx packages/db/src/seed.ts
```

### Co compose dělá

- **`app`** — builduje `Dockerfile`, exposuje port 3000, healthcheck `GET /api/health`
- **`db`** — `postgres:16-alpine`, výchozí credentials `subtracker:subtracker`, volume `pgdata`
- **FAIL FAST** — compose odmítne start pokud `AUTH_SECRET` není nastaven:
  ```
  AUTH_SECRET=${AUTH_SECRET:?AUTH_SECRET is required. Generate with: openssl rand -base64 32}
  ```

### Security warning pro self-host

`docker-compose.yml` obsahuje default DB credentials `subtracker:subtracker` pro usnadnění dev setupu. **Před provozem na veřejné síti:**

1. Změň `POSTGRES_USER` / `POSTGRES_PASSWORD` na silné hodnoty
2. Aktualizuj `DATABASE_URL` v `app` service
3. Zvažuj odstranění `ports: - "5432:5432"` — není nutné exposovat Postgres ven, app komunikuje přes Docker network. Ponechání `5432` otevřeného na internet + slabé heslo = RCE risk.
4. Pro HTTPS dej před kontejner reverse proxy (Caddy, nginx, Cloudflare Tunnel)
5. Doplň resource limits (`mem_limit`, `cpus`) — proti CSV import DoS

### Upgrade

```bash
git pull
docker compose build --no-cache
docker compose up -d
docker compose exec app npx drizzle-kit migrate   # pokud jsou nové migrace
```

## Health check

Oba deploymenty exposují `GET /api/health` → `{ "status": "ok", "timestamp": "..." }`. Docker healthcheck to používá každých 30 s. Endpoint je **public** (záměrně) a nevrací žádná citlivá data.

## Monitoring (roadmap)

Aktuálně v0.5 **nemá** zapojený error tracking / APM. `error.tsx` logguje do `console.error`, což na Vercelu skončí v **Deployments → Runtime Logs**. Pro serious provoz přidej:

- [Sentry](https://sentry.io/) — `@sentry/nextjs` integration
- [Axiom](https://axiom.co/) — Vercel log drain
- Self-hosted: [OpenObserve](https://openobserve.ai/) nebo Grafana + Loki
