# SubTracker — API Routes & Server Actions

## Architecture Decision

**Primary:** Server Actions (for mutations from UI)
**Secondary:** API Routes (for cron jobs, webhooks, external integrations)

Server Actions are co-located with forms and provide better DX for Next.js App Router.
API Routes are used only where Server Actions don't apply.

## Server Actions

### Subscriptions

```typescript
// app/(app)/subscriptions/actions.ts
'use server'

// Create a new subscription
async function createSubscription(data: CreateSubscriptionInput): Promise<Subscription>

// Update an existing subscription
async function updateSubscription(id: string, data: UpdateSubscriptionInput): Promise<Subscription>

// Delete (cancel) a subscription
async function cancelSubscription(id: string): Promise<void>

// Pause a subscription
async function pauseSubscription(id: string): Promise<void>

// Resume a paused subscription
async function resumeSubscription(id: string): Promise<void>

// Bulk update category
async function bulkUpdateCategory(ids: string[], categoryId: string): Promise<void>

// Bulk pause
async function bulkPause(ids: string[]): Promise<void>
```

### Categories

```typescript
// app/(app)/settings/actions.ts
'use server'

// Create custom category
async function createCategory(data: CreateCategoryInput): Promise<Category>

// Update category
async function updateCategory(id: string, data: UpdateCategoryInput): Promise<Category>

// Delete category (reassign subs to "Other")
async function deleteCategory(id: string): Promise<void>

// Reorder categories
async function reorderCategories(orderedIds: string[]): Promise<void>
```

### Import

```typescript
// app/(app)/import/actions.ts
'use server'

// Parse uploaded CSV file
async function parseCSVFile(formData: FormData): Promise<ImportResult>

// Confirm and import detected subscriptions
async function confirmImport(data: ConfirmImportInput): Promise<ImportSummary>
```

### User Settings

```typescript
// app/(app)/settings/actions.ts
'use server'

// Update user profile
async function updateProfile(data: UpdateProfileInput): Promise<User>

// Update notification preferences
async function updateNotificationPrefs(data: NotificationPrefsInput): Promise<void>

// Delete account
async function deleteAccount(): Promise<void>

// Export all data (GDPR)
async function exportUserData(): Promise<ExportData>
```

### Push Subscriptions

```typescript
// app/(app)/settings/actions.ts
'use server'

// Register push subscription
async function registerPushSubscription(subscription: PushSubscriptionJSON): Promise<void>

// Unregister push subscription
async function unregisterPushSubscription(endpoint: string): Promise<void>
```

## API Routes

### Cron Jobs

```
GET /api/cron/check-renewals
```
- **Auth:** `CRON_SECRET` header (Vercel Cron)
- **Schedule:** Daily at 8:00 UTC
- **Logic:**
  1. Find all subscriptions where `nextBillingDate - reminderDays <= today`
  2. Check if reminder already sent (avoid duplicates)
  3. Send email via Resend / SMTP
  4. Send web push if subscribed
  5. Create reminder record
  6. Auto-advance `nextBillingDate` for past-due subscriptions
  7. Create payment record for auto-tracked payments

```
GET /api/cron/weekly-digest
```
- **Auth:** `CRON_SECRET` header
- **Schedule:** Every Monday at 8:00 UTC
- **Logic:**
  1. For each user with `weeklyDigest: true`
  2. Compile: upcoming renewals this week, total spend, trends
  3. Send digest email

```
GET /api/cron/exchange-rates
```
- **Auth:** `CRON_SECRET` header
- **Schedule:** Daily at 6:00 UTC
- **Logic:**
  1. Fetch rates from frankfurter.app
  2. Cache in DB or KV store

### Webhooks

```
POST /api/webhooks/stripe
```
- **Auth:** Stripe signature verification
- **Events:**
  - `checkout.session.completed` — activate Pro/Family plan
  - `customer.subscription.updated` — plan changes
  - `customer.subscription.deleted` — downgrade to free
  - `invoice.payment_failed` — notify user

### Health

```
GET /api/health
```
- **Auth:** None
- **Response:** `{ status: 'ok', version: '1.0.0', db: 'connected' }`
- Used by Docker health checks and monitoring

## Zod Schemas (Shared Validation)

```typescript
// packages/db/src/validators.ts
import { z } from 'zod';

export const billingCycleEnum = z.enum(['monthly', 'yearly', 'weekly', 'quarterly']);
export const statusEnum = z.enum(['active', 'paused', 'cancelled', 'trial']);
export const currencyEnum = z.string().length(3).toUpperCase(); // ISO 4217

export const createSubscriptionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  amount: z.number().positive().max(99999.99),
  currency: currencyEnum.default('USD'),
  billingCycle: billingCycleEnum,
  billingDay: z.number().int().min(1).max(31).optional(),
  startDate: z.string().date().optional(),
  nextBillingDate: z.string().date(),
  categoryId: z.string().optional(),
  status: statusEnum.default('active'),
  trialEndsAt: z.string().date().optional(),
  url: z.string().url().optional().or(z.literal('')),
  logo: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  cancellationUrl: z.string().url().optional().or(z.literal('')),
  notify: z.boolean().default(true),
  notes: z.string().max(1000).optional(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  currency: currencyEnum.optional(),
  locale: z.string().optional(),
  monthlyBudget: z.number().positive().optional().nullable(),
  reminderDays: z.number().int().min(1).max(30).optional(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  weeklyDigest: z.boolean().optional(),
});

export const confirmImportSchema = z.object({
  importId: z.string(),
  subscriptions: z.array(z.object({
    name: z.string(),
    amount: z.number().positive(),
    currency: z.string(),
    billingCycle: billingCycleEnum,
    categoryId: z.string().optional(),
    existingId: z.string().optional(),  // Map to existing subscription
    include: z.boolean(),
  })),
});
```

## Data Fetching Patterns

### Dashboard (Server Component)

```typescript
// app/(app)/dashboard/page.tsx
export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');

  // Parallel data fetching
  const [
    subscriptions,
    monthlyTrend,
    categoryBreakdown,
    upcomingRenewals,
  ] = await Promise.all([
    getActiveSubscriptions(session.user.id),
    getMonthlyTrend(session.user.id, 6),
    getCategoryBreakdown(session.user.id),
    getUpcomingRenewals(session.user.id, 7),
  ]);

  const totalMonthly = calculateMonthlyTotal(subscriptions);

  return (
    <Dashboard
      totalMonthly={totalMonthly}
      subscriptions={subscriptions}
      monthlyTrend={monthlyTrend}
      categoryBreakdown={categoryBreakdown}
      upcomingRenewals={upcomingRenewals}
    />
  );
}
```

### Subscription List (Server Component + Client Filters)

```typescript
// app/(app)/subscriptions/page.tsx
export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; sort?: string; q?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  const subscriptions = await getSubscriptions(session.user.id, {
    category: params.category,
    status: params.status,
    sort: params.sort,
    search: params.q,
  });

  return <SubscriptionList subscriptions={subscriptions} />;
}
```

URL-based filtering via `nuqs` — filters persist in URL, shareable, SSR-friendly.

## Rate Limiting

For API routes (not Server Actions):
- Health: No limit
- Cron: Protected by secret
- Webhooks: Verified by signature
- Future public API: 100 req/min per user
