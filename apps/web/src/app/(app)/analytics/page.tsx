import { getDashboardData } from "@/app/actions/dashboard";
import { getProfile } from "@/app/actions/settings";
import { formatCurrency } from "@/lib/format";

export default async function AnalyticsPage() {
  const [dashData, profile] = await Promise.all([
    getDashboardData(),
    getProfile(),
  ]);
  const currency = profile?.currency ?? "USD";

  const activeSubs = dashData?.activeSubs ?? [];
  const monthlySpend = dashData?.monthlySpend ?? 0;
  const annualProjection = dashData?.annualProjection ?? 0;

  // Top subscriptions by monthly cost
  const topSubs = activeSubs
    .map((s) => {
      const amount = parseFloat(s.amount);
      const monthly =
        s.billingCycle === "yearly"
          ? amount / 12
          : s.billingCycle === "quarterly"
            ? amount / 3
            : s.billingCycle === "weekly"
              ? amount * 4.33
              : amount;
      return { ...s, monthly };
    })
    .sort((a, b) => b.monthly - a.monthly);

  // Cycle distribution
  const cycleCount = activeSubs.reduce(
    (acc, s) => {
      acc[s.billingCycle] = (acc[s.billingCycle] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Detailed spending insights and trends.
        </p>
      </div>

      {activeSubs.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-white/[0.06] text-zinc-500">
          Add subscriptions to see analytics
        </div>
      ) : (
        <>
          {/* Overview cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs text-zinc-500 mb-1">Monthly Spend</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-zinc-100">{formatCurrency(monthlySpend, currency)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs text-zinc-500 mb-1">Annual Projection</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-zinc-100">{formatCurrency(annualProjection, currency)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="text-xs text-zinc-500 mb-1">Daily Average</p>
              <p className="text-2xl font-bold font-mono tabular-nums text-zinc-100">{formatCurrency(monthlySpend / 30, currency)}</p>
            </div>
          </div>

          {/* Top subscriptions */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-[15px] font-semibold mb-4">Top Subscriptions by Cost</h2>
            <div className="space-y-3">
              {topSubs.slice(0, 10).map((sub, i) => {
                const percent = monthlySpend > 0 ? (sub.monthly / monthlySpend) * 100 : 0;
                return (
                  <div key={sub.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 w-5">{i + 1}.</span>
                        <div
                          className="h-5 w-5 rounded flex items-center justify-center text-[10px] text-white font-bold"
                          style={{ backgroundColor: sub.color ?? "#6366F1" }}
                        >
                          {sub.name.charAt(0)}
                        </div>
                        <span className="text-zinc-200">{sub.name}</span>
                      </div>
                      <span className="font-mono text-zinc-200 tabular-nums">
                        {formatCurrency(sub.monthly, currency)}/mo
                        <span className="text-zinc-600 ml-1">({percent.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden ml-7">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Billing cycle distribution */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-[15px] font-semibold mb-4">Billing Cycle Distribution</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(["monthly", "yearly", "weekly", "quarterly"] as const).map((cycle) => (
                <div key={cycle} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 text-center">
                  <p className="text-2xl font-bold text-zinc-100">{cycleCount[cycle] ?? 0}</p>
                  <p className="text-xs text-zinc-500 capitalize mt-1">{cycle}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
