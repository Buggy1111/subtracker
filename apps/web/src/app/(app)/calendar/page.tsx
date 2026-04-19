import { getSubscriptions } from "@/app/actions/subscriptions";
import { getProfile } from "@/app/actions/settings";
import { CalendarClient } from "./calendar-client";

export default async function CalendarPage() {
  const [result, profile] = await Promise.all([getSubscriptions(), getProfile()]);
  const subs = (result.data ?? []).filter((s) => s.status === "active");
  const fallbackCurrency = profile?.currency ?? "USD";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-zinc-500 mt-1">
          See when your subscriptions renew.
        </p>
      </div>

      {subs.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-white/[0.06] text-zinc-500">
          Add subscriptions to see renewal calendar
        </div>
      ) : (
        <CalendarClient subscriptions={subs} fallbackCurrency={fallbackCurrency} />
      )}
    </div>
  );
}
