// Tolerant JSON importer. Accepts both our native export format and Wallos
// exports, plus any "reasonable" shape that has a subscriptions array.

export type ImportedCategory = { name: string; color: string | null };

export type ImportedSubscription = {
  name: string;
  amount: number;
  currency: string;
  billingCycle: "monthly" | "yearly" | "weekly" | "quarterly";
  nextBillingDate: string; // ISO date YYYY-MM-DD
  categoryName: string | null;
  status: "active" | "paused" | "cancelled" | "trial";
  notes: string | null;
  url: string | null;
};

export type ParseResult =
  | {
      success: true;
      source: "subtracker" | "wallos" | "generic";
      subscriptions: ImportedSubscription[];
      categories: ImportedCategory[];
    }
  | { success: false; error: string };

const MAX_SUBSCRIPTIONS = 1000;
const MAX_NAME = 200;
const MAX_NOTES = 2000;
const MAX_URL = 500;

const VALID_CYCLES = new Set(["monthly", "yearly", "weekly", "quarterly"]);
const VALID_STATUSES = new Set(["active", "paused", "cancelled", "trial"]);

// Wallos numeric cycle → our cycle. Wallos uses 1-daily 2-weekly 3-monthly
// 4-quarterly 5-semiannually 6-yearly. We don't support daily/semiannual, so
// we collapse daily→weekly and semiannual→yearly.
const WALLOS_CYCLE: Record<number, ImportedSubscription["billingCycle"]> = {
  1: "weekly",
  2: "weekly",
  3: "monthly",
  4: "quarterly",
  5: "yearly",
  6: "yearly",
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function truncate(s: string | null | undefined, max: number): string | null {
  if (s == null) return null;
  const str = String(s).trim();
  if (str.length === 0) return null;
  return str.length > max ? str.slice(0, max) : str;
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return isFinite(n) ? n : null;
  }
  return null;
}

function toDate(v: unknown): string {
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  }
  // Fallback: today
  return new Date().toISOString().split("T")[0];
}

function normalizeCycle(v: unknown): ImportedSubscription["billingCycle"] {
  if (typeof v === "number" && WALLOS_CYCLE[v]) return WALLOS_CYCLE[v];
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    if (VALID_CYCLES.has(s)) {
      return s as ImportedSubscription["billingCycle"];
    }
    if (s === "daily") return "weekly";
    if (s === "semiannually" || s === "semi-annually" || s === "biannual") return "yearly";
    if (s === "annual" || s === "annually") return "yearly";
  }
  return "monthly";
}

function normalizeStatus(v: unknown): ImportedSubscription["status"] {
  if (typeof v === "string" && VALID_STATUSES.has(v)) {
    return v as ImportedSubscription["status"];
  }
  if (typeof v === "boolean") return v ? "active" : "paused";
  return "active";
}

function detectSource(
  input: Record<string, unknown>,
): "subtracker" | "wallos" | "generic" {
  // Explicit marker from our exporter
  if (input.source === "subtracker") return "subtracker";
  // Wallos exports use `price`/`cycle`/`next_payment` on the first sub
  const subs = input.subscriptions;
  if (Array.isArray(subs) && subs.length > 0) {
    const first = subs[0];
    if (isPlainObject(first)) {
      if ("price" in first || "next_payment" in first || "currency_id" in first) {
        return "wallos";
      }
    }
  }
  return "generic";
}

function extractSubscription(
  raw: unknown,
  wallosCategoryMap: Map<number | string, string>,
): ImportedSubscription | null {
  if (!isPlainObject(raw)) return null;

  const name =
    truncate(
      (raw.name as string) ||
        (raw.title as string) ||
        (raw.service as string) ||
        (raw.subscription_name as string),
      MAX_NAME,
    );
  if (!name) return null;

  const amountRaw =
    raw.amount ??
    raw.price ??
    raw.cost ??
    raw.monthly_cost ??
    raw.payment;
  const amount = toNumber(amountRaw);
  if (amount == null || amount < 0) return null;

  const currency =
    (typeof raw.currency === "string" && raw.currency.trim()) ||
    (typeof raw.currency_code === "string" && raw.currency_code.trim()) ||
    "USD";

  const billingCycle = normalizeCycle(
    raw.billingCycle ?? raw.billing_cycle ?? raw.cycle ?? raw.interval ?? raw.frequency,
  );

  const nextBillingDate = toDate(
    raw.nextBillingDate ??
      raw.next_billing_date ??
      raw.next_payment ??
      raw.next_due ??
      raw.renews_at,
  );

  // Category resolution — either a name string, or Wallos numeric id we look up
  let categoryName: string | null = null;
  if (typeof raw.category === "string") {
    categoryName = truncate(raw.category, MAX_NAME);
  } else if (typeof raw.categoryName === "string") {
    categoryName = truncate(raw.categoryName, MAX_NAME);
  } else if (typeof raw.category_name === "string") {
    categoryName = truncate(raw.category_name, MAX_NAME);
  } else if (raw.category_id != null) {
    const catId = raw.category_id as number | string;
    categoryName = wallosCategoryMap.get(catId) ?? null;
  }

  return {
    name,
    amount,
    currency: currency.toUpperCase().slice(0, 3),
    billingCycle,
    nextBillingDate,
    categoryName,
    status: normalizeStatus(raw.status ?? raw.active ?? raw.inactive),
    notes: truncate(
      (raw.notes as string) || (raw.description as string) || (raw.comment as string),
      MAX_NOTES,
    ),
    url: truncate(
      (raw.url as string) || (raw.website as string) || (raw.link as string),
      MAX_URL,
    ),
  };
}

function extractCategories(
  input: Record<string, unknown>,
): { imported: ImportedCategory[]; wallosIdMap: Map<number | string, string> } {
  const imported: ImportedCategory[] = [];
  const wallosIdMap = new Map<number | string, string>();

  const cats = (input.userCategories as unknown) ?? input.categories;
  if (!Array.isArray(cats)) return { imported, wallosIdMap };

  for (const raw of cats) {
    if (!isPlainObject(raw)) continue;
    const name = truncate(raw.name as string, MAX_NAME);
    if (!name) continue;
    const color = typeof raw.color === "string" ? raw.color : null;

    imported.push({ name, color });

    // Track Wallos numeric IDs for reference mapping
    if (raw.id != null) {
      wallosIdMap.set(raw.id as number | string, name);
    }
  }

  return { imported, wallosIdMap };
}

export function parseImportPayload(input: unknown): ParseResult {
  if (!isPlainObject(input)) {
    return { success: false, error: "File is not a valid JSON object" };
  }

  const rawSubs = input.subscriptions;
  if (!Array.isArray(rawSubs) || rawSubs.length === 0) {
    return {
      success: false,
      error: "File does not contain a 'subscriptions' array",
    };
  }

  if (rawSubs.length > MAX_SUBSCRIPTIONS) {
    return {
      success: false,
      error: `File contains ${rawSubs.length} subscriptions — maximum is ${MAX_SUBSCRIPTIONS}`,
    };
  }

  const source = detectSource(input);
  const { imported: categories, wallosIdMap } = extractCategories(input);

  const subscriptions = rawSubs
    .map((r) => extractSubscription(r, wallosIdMap))
    .filter((s): s is ImportedSubscription => s !== null);

  if (subscriptions.length === 0) {
    return {
      success: false,
      error: "No valid subscriptions found in file",
    };
  }

  return { success: true, source, subscriptions, categories };
}
