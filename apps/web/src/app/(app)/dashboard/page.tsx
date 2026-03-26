import { CreditCard, TrendingUp, Bell, DollarSign } from "lucide-react";

const kpiCards = [
  {
    title: "Monthly Spend",
    value: "$0.00",
    subtitle: "Add subscriptions to start",
    icon: DollarSign,
    gradient: true,
  },
  {
    title: "Active Subscriptions",
    value: "0",
    subtitle: "No active subscriptions",
    icon: CreditCard,
  },
  {
    title: "Next Renewal",
    value: "\u2014",
    subtitle: "No upcoming renewals",
    icon: Bell,
  },
  {
    title: "Annual Projection",
    value: "$0.00",
    subtitle: "Estimated yearly total",
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
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

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="text-[15px] font-semibold tracking-tight mb-1">
            Monthly Trend
          </h3>
          <p className="text-xs text-zinc-600 mb-6">Last 6 months</p>
          <div className="flex h-48 items-center justify-center text-sm text-zinc-600">
            Add subscriptions to see spending trends
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="text-[15px] font-semibold tracking-tight mb-1">
            By Category
          </h3>
          <p className="text-xs text-zinc-600 mb-6">Spend distribution</p>
          <div className="flex h-48 items-center justify-center text-sm text-zinc-600">
            Add subscriptions to see category breakdown
          </div>
        </div>
      </div>

      {/* Upcoming renewals */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="text-[15px] font-semibold tracking-tight mb-1">
          Upcoming Renewals
        </h3>
        <p className="text-xs text-zinc-600 mb-6">Next 7 days</p>
        <div className="flex h-24 items-center justify-center text-sm text-zinc-600">
          No upcoming renewals
        </div>
      </div>
    </div>
  );
}
