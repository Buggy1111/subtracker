# SubTracker — Database Schema

## Overview

Postgres via Neon, managed by Drizzle ORM.

## Entity Relationship

```
users
  ├── subscriptions (1:N)
  │     ├── payments (1:N)
  │     └── reminders (1:N)
  ├── categories (1:N, custom categories)
  ├── imports (1:N, CSV import history)
  └── push_subscriptions (1:N, web push endpoints)
```

## Tables

### users

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | cuid2 |
| name | text | nullable | Display name |
| email | text | unique, not null | Login email |
| emailVerified | timestamp | nullable | Auth.js |
| image | text | nullable | Avatar URL |
| currency | text | default 'USD' | User's primary currency |
| locale | text | default 'en' | UI language |
| monthlyBudget | numeric | nullable | Optional budget limit |
| reminderDays | integer | default 3 | Days before renewal to remind |
| reminderTime | text | default '09:00' | Preferred reminder time (HH:MM) |
| weeklyDigest | boolean | default true | Send weekly email digest |
| createdAt | timestamp | default now() | |
| updatedAt | timestamp | default now() | |

### accounts (Auth.js)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | |
| userId | text | FK → users.id | |
| type | text | not null | oauth, email, etc. |
| provider | text | not null | google, github, email |
| providerAccountId | text | not null | |
| refresh_token | text | nullable | |
| access_token | text | nullable | |
| expires_at | integer | nullable | |
| token_type | text | nullable | |
| scope | text | nullable | |
| id_token | text | nullable | |

### sessions (Auth.js)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| sessionToken | text | PK | |
| userId | text | FK → users.id | |
| expires | timestamp | not null | |

### verification_tokens (Auth.js)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| identifier | text | not null | |
| token | text | not null | |
| expires | timestamp | not null | |
| PK | | (identifier, token) | Composite |

### categories

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | cuid2 |
| userId | text | FK → users.id | null = default/global category |
| name | text | not null | "Entertainment", "Productivity"... |
| color | text | not null | Hex color "#8B5CF6" |
| icon | text | nullable | Icon name from Lucide |
| sortOrder | integer | default 0 | Display order |

**Default categories (seeded):**

| Name | Color | Icon |
|------|-------|------|
| Entertainment | #8B5CF6 (Violet) | tv |
| Productivity | #3B82F6 (Blue) | briefcase |
| Streaming | #EC4899 (Pink) | play |
| Music | #10B981 (Emerald) | music |
| Cloud & Storage | #6366F1 (Indigo) | cloud |
| News & Reading | #F59E0B (Amber) | newspaper |
| Gaming | #EF4444 (Red) | gamepad-2 |
| Health & Fitness | #14B8A6 (Teal) | heart-pulse |
| Food & Delivery | #F97316 (Orange) | utensils |
| Shopping | #A855F7 (Purple) | shopping-bag |
| Utilities | #64748B (Slate) | settings |
| Other | #9CA3AF (Gray) | circle |

### subscriptions

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | cuid2 |
| userId | text | FK → users.id, not null | Owner |
| name | text | not null | "Netflix", "Spotify" |
| description | text | nullable | Optional note |
| amount | numeric(10,2) | not null | Price per cycle |
| currency | text | default 'USD' | ISO 4217 |
| billingCycle | text | not null | 'monthly', 'yearly', 'weekly', 'quarterly' |
| billingDay | integer | nullable | Day of month (1-31) |
| startDate | date | nullable | When subscription started |
| nextBillingDate | date | not null | Next charge date |
| categoryId | text | FK → categories.id | |
| status | text | default 'active' | 'active', 'paused', 'cancelled', 'trial' |
| trialEndsAt | date | nullable | Free trial end date |
| url | text | nullable | Service URL |
| logo | text | nullable | Logo URL or service key |
| color | text | nullable | Brand color override |
| cancellationUrl | text | nullable | Direct link to cancel |
| cancellationDifficulty | integer | nullable | 1-5 rating |
| importSource | text | default 'manual' | 'manual', 'csv', 'ofx' |
| importRef | text | nullable | Reference to import record |
| notify | boolean | default true | Send reminders for this sub |
| notes | text | nullable | User notes |
| createdAt | timestamp | default now() | |
| updatedAt | timestamp | default now() | |

**Indexes:**
- `(userId, status)` — filter active subs
- `(userId, nextBillingDate)` — upcoming renewals
- `(userId, categoryId)` — category breakdown

### payments

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | cuid2 |
| subscriptionId | text | FK → subscriptions.id | |
| userId | text | FK → users.id | Denormalized for queries |
| amount | numeric(10,2) | not null | Actual amount paid |
| currency | text | not null | |
| date | date | not null | Payment date |
| source | text | default 'auto' | 'auto', 'manual', 'csv-import' |
| notes | text | nullable | |
| createdAt | timestamp | default now() | |

**Indexes:**
- `(userId, date)` — spending over time
- `(subscriptionId, date)` — payment history per sub

### reminders

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | cuid2 |
| subscriptionId | text | FK → subscriptions.id | |
| userId | text | FK → users.id | |
| type | text | not null | 'renewal', 'trial_ending', 'price_change' |
| scheduledFor | timestamp | not null | When to send |
| sentAt | timestamp | nullable | Null = not yet sent |
| channel | text | default 'email' | 'email', 'push', 'both' |
| createdAt | timestamp | default now() | |

**Indexes:**
- `(sentAt, scheduledFor)` — find unsent reminders due now

### imports

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | cuid2 |
| userId | text | FK → users.id | |
| fileName | text | not null | Original file name |
| fileType | text | not null | 'csv', 'ofx', 'qfx' |
| bankDetected | text | nullable | Auto-detected bank name |
| rowCount | integer | not null | Total rows in file |
| matchedCount | integer | not null | Subscriptions detected |
| importedCount | integer | not null | Actually imported |
| status | text | default 'completed' | 'processing', 'completed', 'failed' |
| createdAt | timestamp | default now() | |

### push_subscriptions

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | cuid2 |
| userId | text | FK → users.id | |
| endpoint | text | not null | Web Push endpoint URL |
| p256dh | text | not null | Public key |
| auth | text | not null | Auth secret |
| userAgent | text | nullable | Browser info |
| createdAt | timestamp | default now() | |

## Drizzle Schema (TypeScript)

```typescript
import { pgTable, text, numeric, integer, boolean, timestamp, date, primaryKey } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// ---- Auth.js tables ----

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  currency: text('currency').notNull().default('USD'),
  locale: text('locale').notNull().default('en'),
  monthlyBudget: numeric('monthly_budget', { precision: 10, scale: 2 }),
  reminderDays: integer('reminder_days').notNull().default(3),
  reminderTime: text('reminder_time').notNull().default('09:00'),
  weeklyDigest: boolean('weekly_digest').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
});

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.identifier, table.token] }),
}));

// ---- App tables ----

export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull(),
  icon: text('icon'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  billingCycle: text('billing_cycle').notNull(), // monthly, yearly, weekly, quarterly
  billingDay: integer('billing_day'),
  startDate: date('start_date'),
  nextBillingDate: date('next_billing_date').notNull(),
  categoryId: text('category_id').references(() => categories.id),
  status: text('status').notNull().default('active'),
  trialEndsAt: date('trial_ends_at'),
  url: text('url'),
  logo: text('logo'),
  color: text('color'),
  cancellationUrl: text('cancellation_url'),
  cancellationDifficulty: integer('cancellation_difficulty'),
  importSource: text('import_source').notNull().default('manual'),
  importRef: text('import_ref'),
  notify: boolean('notify').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const payments = pgTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  subscriptionId: text('subscription_id').notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  date: date('date').notNull(),
  source: text('source').notNull().default('auto'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reminders = pgTable('reminders', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  subscriptionId: text('subscription_id').notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // renewal, trial_ending, price_change
  scheduledFor: timestamp('scheduled_for').notNull(),
  sentAt: timestamp('sent_at'),
  channel: text('channel').notNull().default('email'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const imports = pgTable('imports', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  bankDetected: text('bank_detected'),
  rowCount: integer('row_count').notNull(),
  matchedCount: integer('matched_count').notNull(),
  importedCount: integer('imported_count').notNull(),
  status: text('status').notNull().default('completed'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

## Migrations

Managed by `drizzle-kit`:

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Open Drizzle Studio (DB browser)
npx drizzle-kit studio
```
