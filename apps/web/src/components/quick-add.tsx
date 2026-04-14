"use client";

import { POPULAR_SERVICES } from "@subtracker/db";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { createSubscription } from "@/app/actions/subscriptions";
import { useRouter } from "next/navigation";

interface QuickAddProps {
  categoryMap: Record<string, string>; // category name -> id
}

export function QuickAdd({ categoryMap }: QuickAddProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = POPULAR_SERVICES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(service: (typeof POPULAR_SERVICES)[number]) {
    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    startTransition(async () => {
      await createSubscription({
        name: service.name,
        amount: service.defaultPrice,
        currency: "USD",
        billingCycle: service.cycle as "monthly" | "yearly" | "weekly" | "quarterly",
        nextBillingDate: nextBilling.toISOString().split("T")[0],
        categoryId: categoryMap[service.category],
        status: "active",
        notify: true,
        color: service.color,
        logo: service.logo,
      });
      router.push("/subscriptions");
    });
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search services..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white/[0.03]"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
        {filtered.map((service) => (
          <button
            key={service.name}
            onClick={() => handleAdd(service)}
            disabled={isPending}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.05] disabled:opacity-50"
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white text-xs font-bold"
              style={{ backgroundColor: service.color }}
            >
              {service.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">
                {service.name}
              </p>
              <p className="text-xs text-zinc-500">
                ${service.defaultPrice.toFixed(2)}/{service.cycle === "monthly" ? "mo" : "yr"}
              </p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-zinc-500 py-8">
          No services match &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  );
}
