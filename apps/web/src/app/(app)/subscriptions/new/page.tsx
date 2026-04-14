import { getCategories } from "@/app/actions/subscriptions";
import { NewSubscriptionClient } from "./client";

export default async function NewSubscriptionPage() {
  const result = await getCategories();
  const categories = result.data ?? [];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Subscription</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Quick-add a popular service or enter details manually.
        </p>
      </div>

      <NewSubscriptionClient categories={categories} />
    </div>
  );
}
