import { notFound } from "next/navigation";
import { getSubscription, getCategories } from "@/app/actions/subscriptions";
import type {
  BillingCycle,
  SubscriptionStatus,
} from "@subtracker/db/validators";
import { EditSubscriptionClient } from "./client";

function toDateString(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") {
    // Date columns come back as ISO strings (YYYY-MM-DD) already
    return value.slice(0, 10);
  }
  return value.toISOString().slice(0, 10);
}

export default async function EditSubscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [subResult, catResult] = await Promise.all([
    getSubscription(id),
    getCategories(),
  ]);

  if (!subResult.success || !subResult.data) {
    notFound();
  }

  const subscription = subResult.data;
  const categories = catResult.data ?? [];

  const defaultValues = {
    name: subscription.name,
    currency: subscription.currency,
    amount: Number(subscription.amount),
    billingCycle: subscription.billingCycle as BillingCycle,
    nextBillingDate: toDateString(subscription.nextBillingDate)!,
    status: subscription.status as SubscriptionStatus,
    categoryId: subscription.categoryId ?? undefined,
    url: subscription.url ?? undefined,
    logo: subscription.logo ?? undefined,
    notes: subscription.notes ?? undefined,
    notify: subscription.notify,
    trialEndsAt: toDateString(subscription.trialEndsAt),
    color: subscription.color ?? undefined,
    description: subscription.description ?? undefined,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Subscription</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Update details for <span className="text-zinc-300">{subscription.name}</span>.
        </p>
      </div>

      <EditSubscriptionClient
        id={subscription.id}
        categories={categories}
        defaultValues={defaultValues}
      />
    </div>
  );
}
