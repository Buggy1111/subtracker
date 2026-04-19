import { getCategories } from "@/app/actions/subscriptions";
import { NewSubscriptionClient } from "./client";
import type { CreateSubscriptionInput } from "@subtracker/db/validators";

const VALID_CYCLES = new Set(["monthly", "yearly", "weekly", "quarterly"]);

function parsePrefill(
  sp: Record<string, string | string[] | undefined>,
  categoryMap: Record<string, string>,
): Partial<CreateSubscriptionInput> | undefined {
  const pick = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);

  const name = pick("name");
  const amountRaw = pick("amount");
  if (!name && amountRaw === undefined) return undefined;

  const prefill: Partial<CreateSubscriptionInput> = {};
  if (name) prefill.name = name.slice(0, 200);

  const amount = amountRaw !== undefined ? parseFloat(amountRaw) : NaN;
  if (isFinite(amount) && amount > 0) prefill.amount = amount;

  const currency = pick("currency");
  if (currency && /^[A-Z]{3}$/i.test(currency)) prefill.currency = currency.toUpperCase();

  const cycle = pick("cycle") || pick("billingCycle");
  if (cycle && VALID_CYCLES.has(cycle.toLowerCase())) {
    prefill.billingCycle = cycle.toLowerCase() as CreateSubscriptionInput["billingCycle"];
  }

  const nextDate = pick("next") || pick("nextBillingDate");
  if (nextDate && /^\d{4}-\d{2}-\d{2}$/.test(nextDate)) prefill.nextBillingDate = nextDate;

  const url = pick("url");
  if (url && /^https?:\/\//.test(url)) prefill.url = url.slice(0, 500);

  const categoryName = pick("category");
  if (categoryName && categoryMap[categoryName]) {
    prefill.categoryId = categoryMap[categoryName];
  }

  return Object.keys(prefill).length > 0 ? prefill : undefined;
}

export default async function NewSubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [result, sp] = await Promise.all([getCategories(), searchParams]);
  const categories = result.data ?? [];

  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));
  const prefill = parsePrefill(sp, categoryMap);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Subscription</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {prefill
            ? "Review the pre-filled details and save."
            : "Quick-add a popular service or enter details manually."}
        </p>
      </div>

      <NewSubscriptionClient
        categories={categories}
        prefill={prefill}
        initialMode={prefill ? "manual" : "quick"}
      />
    </div>
  );
}
