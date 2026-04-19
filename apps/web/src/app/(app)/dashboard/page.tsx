import { CreditCard, TrendingUp, Bell, DollarSign } from "lucide-react";
import { getDashboardData, getMonthlyTrend } from "@/app/actions/dashboard";
import { getProfile } from "@/app/actions/settings";
import { formatCurrency } from "@/lib/format";
import { budgetStatus } from "@/lib/budget";
import { MonthlyTrendChart } from "@/components/monthly-trend-chart";
import Link from "next/link";

export default async function DashboardPage() {
  const [data, profile, trend] = await Promise.all([
    getDashboardData(),
    getProfile(),
    getMonthlyTrend(6),
  ]);

  const currency = profile?.currency ?? "USD";
  const budget = profile?.monthlyBudget ? parseFloat(profile.monthlyBudget) : null;
  const monthlySpend = data?.monthlySpend ?? 0;
  const budget_ = budgetStatus(monthlySpend, budget);
  const annualProjection = data?.annualProjection ?? 0;
  const activeCount = data?.activeCount ?? 0;
  const nextRenewal = data?.nextRenewal;
  const upcomingRenewals = data?.upcomingRenewals ?? [];

  const kpiCards = [
    {
      title: "Monthly Spend",
      value: formatCurrency(monthlySpend, currency),
      subtitle: activeCount > 0 ? `${activeCount} active subscriptions` : "Add subscriptions to start",
      icon: DollarSign,
      gradient: true,
    },
    {
      title: "Active Subscriptions",
      value: String(activeCount),
      subtitle: activeCount > 0 ? `${data?.totalCount ?? 0} total` : "No active subscriptions",
      icon: CreditCard,
    },
    {
      title: "Next Renewal",
      value: nextRenewal
        ? new Date(nextRenewal.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "\u2014",
      subtitle: nextRenewal
        ? `${nextRenewal.name} · ${formatCurrency(parseFloat(nextRenewal.amount), nextRenewal.currency ?? currency)}`
        : "No upcoming renewals",
      icon: Bell,
    },
    {
      title: "Annual Projection",
      value: formatCurrency(annualProjection, currency),
      subtitle: "Estimated yearly total",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em]">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Your subscription overview at a glance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl border p-6 transition-all duration-200 hover:border-white/[0.12] ${
              card.gradient
                ? "border-indigo-500/[0.15] bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.04]"
                : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-medium text-zinc-500">
                {card.title}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                <card.icon className="h-4 w-4 text-zinc-500" />
              </div>
            </div>
            <div
              className={`text-3xl font-bold font-mono tracking-tight tabular-nums ${
                card.gradient
                  ? "bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
                  : "text-zinc-100"
              }`}
            >
              {card.value}
            </div>
            <p className="text-xs text-zinc-600 mt-1">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder + Category breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Budget — only shown when configured */}
        {budget_ && (
          <div className="md:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight">Monthly Budget</h3>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {formatCurrency(budget_.spend, currency)} of {formatCurrency(budget_.budget, currency)} · {budget_.percent}%
                </p>
              </div>
              <span
                className={`text-sm font-mono tabular-nums font-semibold ${
                  budget_.state === "over"
                    ? "text-red-400"
                    : budget_.state === "near"
                      ? "text-amber-400"
                      : "text-emerald-400"
                }`}
              >
                {budget_.state === "over"
                  ? `${formatCurrency(Math.abs(budget_.remaining), currency)} over`
                  : `${formatCurrency(budget_.remaining, currency)} left`}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budget_.state === "over"
                    ? "bg-gradient-to-r from-red-500 to-rose-500"
                    : budget_.state === "near"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500"
                }`}
                style={{ width: `${budget_.displayPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="text-[15px] font-semibold tracking-tight mb-1">
            Monthly Trend
          </h3>
          <p className="text-xs text-zinc-600 mb-4">Last 6 months</p>
          {activeCount > 0 && trend ? (
            <MonthlyTrendChart data={trend} currency={currency} />
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-zinc-600">
              Add subscriptions to see spending trends
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="text-[15px] font-semibold tracking-tight mb-1">
            By Category
          </h3>
          <p className="text-xs text-zinc-600 mb-6">Spend distribution</p>
          {data && data.categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.categoryBreakdown
                .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
                .map((cat) => (
                  <div key={cat.categoryId} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-zinc-400 truncate">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </span>
                    <span className="font-mono text-sm text-zinc-200 tabular-nums">
                      {formatCurrency(cat.monthlyAmount, currency)}/mo
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-zinc-600">
              Add subscriptions to see category breakdown
            </div>
          )}
        </div>
      </div>

      {/* Upcoming renewals */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="text-[15px] font-semibold tracking-tight mb-1">
          Upcoming Renewals
        </h3>
        <p className="text-xs text-zinc-600 mb-6">Next 7 days</p>
        {upcomingRenewals.length > 0 ? (
          <div className="space-y-3">
            {upcomingRenewals.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-md flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: sub.color ?? "#6366F1" }}
                  >
                    {sub.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{sub.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-zinc-200 tabular-nums">
                    {formatCurrency(parseFloat(sub.amount), sub.currency ?? currency)}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {new Date(sub.nextBillingDate + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center text-sm text-zinc-600">
            No upcoming renewals
          </div>
        )}
      </div>
    </div>
  );
}
