"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionCard } from "@/components/subscription-card";
import { Button } from "@/components/ui/button";

type Subscription = {
  id: string;
  name: string;
  amount: string;
  currency: string;
  billingCycle: string;
  status: string;
  nextBillingDate: string;
  logo?: string | null;
  color?: string | null;
};

const FILTERS = ["all", "active", "paused", "trial", "cancelled"] as const;

export function SubscriptionList({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();

  const filtered =
    filter === "all"
      ? subscriptions
      : subscriptions.filter((s) => s.status === filter);

  const totalMonthly = subscriptions
    .filter((s) => s.status === "active")
    .reduce((sum, s) => {
      const amount = parseFloat(s.amount);
      switch (s.billingCycle) {
        case "yearly":
          return sum + amount / 12;
        case "quarterly":
          return sum + amount / 3;
        case "weekly":
          return sum + amount * 4.33;
        default:
          return sum + amount;
      }
    }, 0);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3">
        <div className="text-sm text-zinc-500">
          <span className="text-zinc-200 font-semibold">{subscriptions.length}</span>{" "}
          subscription{subscriptions.length !== 1 ? "s" : ""}
        </div>
        <div className="text-sm">
          <span className="text-zinc-500">Monthly total: </span>
          <span className="font-mono font-semibold text-zinc-200 tabular-nums">
            ${totalMonthly.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1">
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={filter === f ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
            {f !== "all" && (
              <span className="ml-1 text-xs text-zinc-500">
                {subscriptions.filter((s) => s.status === f).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {filtered.map((sub) => (
          <SubscriptionCard
            key={sub.id}
            subscription={sub}
            onEdit={(id) => router.push(`/subscriptions/${id}/edit`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-zinc-500 text-sm">
          No {filter} subscriptions found.
        </div>
      )}
    </div>
  );
}
