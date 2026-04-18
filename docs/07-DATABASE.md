# 07 — Database

## Stack

- **Postgres 16** (Neon serverless v produkci, `postgres:16-alpine` v Dockeru)
- **Drizzle ORM** `@subtracker/db` (schema + client + validators + seed)
- **Drizzle Kit** (migrace + studio)
- Connection pooling: Neon pooled URL v produkci, direct v lokále

## Schema overview

Kompletní definice v `packages/db/src/schema.ts`. Všechny tabulky mají `id: text` s `cuid2` default generátorem.

### Auth.js tabulky (fixed shape)

| Tabulka | Sloupce (pouze klíčové) | Vztahy |
|---------|-------------------------|--------|
| `users` | id, email (unique), name, image, emailVerified, currency, locale, monthlyBudget, reminderDays, reminderTime, weeklyDigest, createdAt, updatedAt | root |
| `accounts` | id, userId → users, provider, providerAccountId, refresh_token, access_token, id_token, expires_at | cascade on user delete |
| `sessions` | sessionToken (PK), userId → users, expires | cascade |
| `verificationTokens` | identifier + token (composite PK), expires | — |

### Aplikační tabulky

| Tabulka | Sloupce klíčové | Cascade |
|---------|-----------------|---------|
| `categories` | id, userId (nullable → global), name, color, icon, sortOrder | userId cascade |
| `subscriptions` | id, userId, name, description, amount (numeric 10,2), currency, billingCycle, billingDay, startDate, nextBillingDate, categoryId → categories, status, trialEndsAt, url, logo, color, cancellationUrl, cancellationDifficulty, importSource, importRef, notify, notes, createdAt, updatedAt | userId cascade |
| `payments` | id, subscriptionId → subs, userId, amount, currency, date, source, notes | cascade on subscription or user |
| `reminders` | id, subscriptionId, userId, type, scheduledFor, sentAt, channel | cascade |
| `imports` | id, userId, fileName, fileType, bankDetected, rowCount, matchedCount, importedCount, status | cascade |
| `pushSubscriptions` | id, userId, endpoint, p256dh, auth, userAgent | cascade |

### Indexy

```sql
-- subscriptions
CREATE INDEX sub_user_status_idx        ON subscriptions(user_id, status);
CREATE INDEX sub_user_next_billing_idx  ON subscriptions(user_id, next_billing_date);
CREATE INDEX sub_user_category_idx      ON subscriptions(user_id, category_id);

-- payments
CREATE INDEX pay_user_date_idx          ON payments(user_id, date);
CREATE INDEX pay_sub_date_idx           ON payments(subscription_id, date);

-- reminders
CREATE INDEX rem_pending_idx            ON reminders(sent_at, scheduled_for);
```

Všechny query predikáty v `actions/` začínají na `user_id`, což sedí s indexy.

## Poznámky k typům

- **`amount: numeric(10, 2)`** — string v TS (`"15.99"`), v kódu se konvertuje `parseFloat()` při čtení a `String(n)` při zápisu. Viz `createSubscription`:
  ```ts
  amount: String(parsed.data.amount)
  ```
- **`nextBillingDate: date`** — ISO YYYY-MM-DD string (date column, ne timestamp). Pro frontend stringification se používá `.slice(0, 10)` — viz `apps/web/src/app/(app)/subscriptions/[id]/edit/page.tsx:9-16`.
- **`billingCycle` není enum** — je to `text` v PG, enforce jen Zod. Znamená to, že raw SQL insert by mohl vložit libovolnou hodnotu. Migrace na PG ENUM je low-priority improvement.

## Migrace

```bash
# Generovat novou migraci z změn v schema.ts
npm run db:generate

# Aplikovat pending migrace
npm run db:migrate

# Drizzle Studio (local GUI)
npm run db:studio
```

Migrace žijí v `packages/db/drizzle/`. První migrace (`0000_…`) vytváří celou strukturu.

**Pozor:** `drizzle-kit migrate` potřebuje `DATABASE_URL`. Pro produkční Neon:
```bash
DATABASE_URL="<prod url>" npm run db:migrate
```

## Seed data

```bash
npm run db:seed
```

`packages/db/src/seed.ts` vloží 12 default kategorií (Entertainment, Productivity, Streaming, Music, Cloud & Storage, News & Reading, Gaming, Health & Fitness, Food & Delivery, Shopping, Utilities, Other) s `userId: null` (globální).

**Bug (viz 05-FEATURES):** `getCategories()` aktuálně NEvrací global kategorie — query je jen `eq(userId, userId)`, ne `OR(eq(userId, userId), isNull(userId))`. Fix je jednořádková, ale zatím nezfixnuté.

`seed-data.ts` také exportuje `POPULAR_SERVICES` (35 služeb: Netflix, Spotify, ChatGPT Plus, ...) pro Quick Add — to NENÍ perzistováno v DB, jen client-side dropdown.

## Cascade delete flow (delete account)

```
DELETE FROM users WHERE id = $1
  -> CASCADE: accounts, sessions         (Auth.js data)
  -> CASCADE: categories (user's own)    (global ones stay)
  -> CASCADE: subscriptions
       -> CASCADE: payments, reminders   (children of subs)
  -> CASCADE: imports
  -> CASCADE: push_subscriptions
```

Vše v jedné Postgres transakci (pokud Neon http driver podporuje — default ano pro single statement).

## Backup / Restore

- **Neon** — PITR built-in, 7 dní retention na free tier. Dashboard → Branches → Restore point.
- **Docker Postgres** — žádný built-in backup. Doporučuje se `pg_dump` cron:
  ```bash
  docker compose exec db pg_dump -U subtracker subtracker > backup-$(date +%F).sql
  ```

**Ne-testováno:** restore flow není součástí CI. Před production deployem 1× otestovat Neon PITR restore na sibling branch.

## Soft delete / recovery

Není. Po `deleteSubscription()` nebo `deleteAccount()` je data pryč (mimo Neon PITR window).

Roadmap: přidat `deletedAt timestamp` + filtrovat `isNull(deletedAt)` v queries. Zkomplikuje to ownership queries, ale je to nutné pro GDPR "right to be forgotten" soft implementaci (hard delete po 30 dnech).
