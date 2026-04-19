"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { SubscriptionCard } from "@/components/subscription-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import {
  filterAndSortSubscriptions,
  SORT_OPTIONS,
  type SortKey,
} from "@/lib/subscription-filter";

type Subscription = {
  id: string;
  name: string;
  amount: string;
  currency: string;
  billingCycle: string;
  status: string;
  nextBillingDate: string;
  createdAt: Date | string;
  logo?: string | null;
  color?: string | null;
};

const FILTERS = ["all", "active", "paused", "trial", "cancelled"] as const;

export function SubscriptionList({
  subscriptions,
  currency = "USD",
}: {
  subscriptions: Subscription[];
  currency?: string;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("next-asc");
  const router = useRouter();

  const statusFiltered =
    filter === "all"
      ? subscriptions
      : subscriptions.filter((s) => s.status === filter);

  const visible = filterAndSortSubscriptions(statusFiltered, query, sort);

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
            {formatCurrency(totalMonthly, currency)}
          </span>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="pl-9"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Select value={sort} onValueChange={(v) => setSort((v ?? "next-asc") as SortKey)}>
          <SelectTrigger className="w-full sm:w-60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status filters */}
      <div className="flex gap-1 overflow-x-auto">
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
        {visible.map((sub) => (
          <SubscriptionCard
            key={sub.id}
            subscription={sub}
            onEdit={(id) => router.push(`/subscriptions/${id}/edit`)}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-12 text-zinc-500 text-sm">
          {query
            ? `No subscriptions matching "${query}"`
            : `No ${filter} subscriptions found.`}
        </div>
      )}
    </div>
  );
}
