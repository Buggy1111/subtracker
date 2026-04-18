# 06 — API

> SubTracker používá **Server Actions** jako primární mutační vrstvu a **App Router route handlers** pro pár specifických case (OAuth callback, CSV upload, health).

## Server Actions

Všechny v `apps/web/src/app/actions/*.ts`. Volají se přímo z Client Components jako normální async funkce — Next.js je serializuje přes RPC over POST s CSRF/origin check.

Všechny actions vrací `ActionResult<T>`:

```ts
type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### `actions/subscriptions.ts`

| Funkce | Vstup | Output | Auth | Validace |
|--------|-------|--------|------|----------|
| `getSubscriptions()` | — | `ActionResult<Subscription[]>` | ✅ required | — |
| `getSubscription(id)` | `string` | `ActionResult<Subscription>` | ✅ required | ownership `eq(userId)` |
| `getCategories()` | — | `ActionResult<Category[]>` | ✅ required | ⚠️ **bug** — nevrací global kategorie |
| `createSubscription(input)` | `CreateSubscriptionInput` | `ActionResult<Subscription>` | ✅ required | Zod `createSubscriptionSchema` |
| `updateSubscription(id, input)` | `(string, UpdateSubscriptionInput)` | `ActionResult<Subscription>` | ✅ required | Zod + ownership |
| `deleteSubscription(id)` | `string` | `ActionResult<Subscription>` | ✅ required | ownership |
| `toggleSubscriptionPause(id)` | `string` | `ActionResult<Subscription>` | ✅ required | ownership |

**Revalidation:** mutační actions volají `revalidatePath('/subscriptions')` a `revalidatePath('/dashboard')`. Calendar a Analytics se automaticky revalidate-nou přes RSC.

**Ownership pattern:**
```ts
.where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
```
Bezpečné proti cross-tenant access i když útočník zná `id` jiného usera.

### `actions/dashboard.ts`

| Funkce | Vstup | Output | Auth |
|--------|-------|--------|------|
| `getDashboardData()` | — | `{ monthlySpend, annualProjection, activeCount, totalCount, nextRenewal, upcomingRenewals[], categoryBreakdown[] } \| null` | ✅ (null if not authed) |

Neplatí pravidlo `ActionResult<T>` — vrací `null` nebo objekt přímo. Konvence je trochu nekonzistentní s ostatními actions.

### `actions/import.ts`

| Funkce | Vstup | Output | Auth |
|--------|-------|--------|------|
| `confirmImport({ fileName, bankDetected, totalRows, subscriptions[] })` | `ImportConfirmInput` | `{ success: boolean, importedCount?: number, error?: string }` | ✅ required |

Vkládá vybrané subskripce + import log. Nová `nextBillingDate` je nastavena na "dnes + 1 měsíc" pro všechny (bez detekce ze CSV historie).

⚠️ **`confirmImport` nepoužívá `confirmImportSchema` z validators** — parametry validuje jen TypeScript. Pokud někdo obejde TS check (stačí `any`), lze insert-nout libovolná data. Low priority, protože action je volaná jen z vlastního UI.

### `actions/settings.ts`

| Funkce | Vstup | Output | Auth |
|--------|-------|--------|------|
| `getProfile()` | — | `User \| null` | ✅ |
| `updateProfile(input)` | `UpdateProfileInput` | `ActionResult` | ✅ + Zod `updateProfileSchema` |
| `deleteAccount()` | — | `ActionResult` | ✅ |

Delete account → `DELETE FROM users WHERE id = ?` → cascade smaže accounts, sessions, subscriptions, payments, reminders, imports, push_subscriptions.

## API Routes

### `GET /api/auth/[...nextauth]` + `POST`
- `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- Exportuje `{ GET, POST } = handlers` z `lib/auth.ts`.
- Handles: OAuth redirect, callback, signin, signout, session, providers, csrf.
- Auth.js route — nedotýkat se bez znalosti Auth.js internals.

### `POST /api/import`
- `apps/web/src/app/api/import/route.ts`
- Vstup: `multipart/form-data` s polem `file`
- Auth: session cookie (vyžaduje přihlášení, 401 jinak)
- Validace:
  - `file !== null` → 400 "No file provided"
  - `file.name.endsWith('.csv')` → 400 "Only CSV files are supported"
  - `file.size ≤ 5 MB` → 400 "File too large (max 5MB)"
- Response:
  ```ts
  ImportResult = {
    totalRows: number;
    parsedRows: number;
    detectedSubscriptions: DetectedSubscription[];
    bankDetected: string;   // "Fio Banka" | "Revolut" | "Wise" | "Generic CSV"
    warnings: string[];
  }
  ```
- Errors: catch-all → 500 `{ error: "Failed to parse CSV file" }` (bez stack trace leak)
- ⚠️ **Žádný rate limit** — viz `04-SECURITY.md` blocker #4

### `GET /api/health`
- Returns `{ status: "ok", timestamp: "2026-04-17T..." }`
- Public (no auth)
- Docker healthcheck target.

## Zod schemas (single source of truth)

Viz `packages/db/src/validators.ts`:

### `createSubscriptionSchema`
```ts
{
  name: string.min(1).max(100),
  description?: string.max(500),
  amount: number.positive().max(99999.99),
  currency: string.length(3).toUpperCase().default('USD'),
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly',
  billingDay?: int.min(1).max(31),
  startDate?: dateString,
  nextBillingDate: dateString,
  categoryId?: string,
  status: 'active' | 'paused' | 'cancelled' | 'trial' = 'active',
  trialEndsAt?: dateString,
  url?: url | '',
  logo?: string,
  color?: #RRGGBB pattern,
  cancellationUrl?: url | '',
  notify: boolean = true,
  notes?: string.max(1000),
}
```

### `updateSubscriptionSchema`
`= createSubscriptionSchema.partial()` — všechny fieldy volitelné.

### `updateProfileSchema`
```ts
{
  name?: string.min(1).max(100),
  currency?: string.length(3),
  locale?: string,
  monthlyBudget?: number.positive() | null,
  reminderDays?: int.min(1).max(30),
  reminderTime?: /^\d{2}:\d{2}$/,
  weeklyDigest?: boolean,
}
```

### `confirmImportSchema`
Definován v validators.ts, ale **není použit** v `actions/import.ts` (viz výše).

## Response shape konvence

- **Úspěch:** `{ success: true, data?: T, importedCount?: number }`
- **Chyba:** `{ success: false, error: string }` — `error` je user-facing, nikdy stack trace
- **Not authenticated:** `{ success: false, error: "Not authenticated" }`
- **Not found:** `{ success: false, error: "Subscription not found" }`
- **Validation fail:** `{ success: false, error: parsed.error.issues[0].message }`

## Idempotency

- **createSubscription** — NE, vyrobí nový row s novým cuid každým voláním.
- **updateSubscription** — Idempotent.
- **deleteSubscription** — Idempotent (druhé volání vrátí `undefined` v `data`, ale `success: true` pořád).
- **toggleSubscriptionPause** — NE idempotent (flipne status).

## Konvence pro rozšiřování

- **Nová action:** přidej do `apps/web/src/app/actions/*.ts`, začni `"use server"`, check `getAuthUserId()`, Zod validate, query s ownership check, revalidate paths.
- **Nový Zod schema:** přidej do `packages/db/src/validators.ts` (sdíleno mezi app a budoucími klienty jako mobile).
- **Nová route:** prefer Server Actions. API route jen pokud potřebuješ `Request`/`Response` (file upload, streaming, webhooks).
