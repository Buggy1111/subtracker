import { getSubscriptions } from "@/app/actions/subscriptions";
import { getProfile } from "@/app/actions/settings";
import { formatCurrency } from "@/lib/format";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default async function CalendarPage() {
  const [result, profile] = await Promise.all([getSubscriptions(), getProfile()]);
  const subs = (result.data ?? []).filter((s) => s.status === "active");
  const fallbackCurrency = profile?.currency ?? "USD";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map subs to days
  const dayMap = new Map<number, typeof subs>();
  for (const sub of subs) {
    const d = new Date(sub.nextBillingDate + "T00:00:00");
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!dayMap.has(day)) dayMap.set(day, []);
      dayMap.get(day)!.push(sub);
    }
  }

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return dayNum;
  });

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
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">
            {MONTH_NAMES[month]} {year}
          </h2>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs text-zinc-600 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isToday = day === now.getDate();
              const daySubs = day ? dayMap.get(day) : undefined;

              return (
                <div
                  key={i}
                  className={`min-h-[72px] rounded-lg border p-1.5 transition-all ${
                    day === null
                      ? "border-transparent"
                      : isToday
                        ? "border-indigo-500/30 bg-indigo-500/[0.05]"
                        : "border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03]"
                  }`}
                >
                  {day !== null && (
                    <>
                      <span
                        className={`text-xs ${
                          isToday ? "text-indigo-400 font-semibold" : "text-zinc-500"
                        }`}
                      >
                        {day}
                      </span>
                      {daySubs && (
                        <div className="mt-1 space-y-0.5">
                          {daySubs.slice(0, 2).map((sub) => (
                            <div
                              key={sub.id}
                              className="rounded px-1 py-0.5 text-[10px] text-white truncate"
                              style={{ backgroundColor: sub.color ?? "#6366F1" }}
                            >
                              {sub.name}
                            </div>
                          ))}
                          {daySubs.length > 2 && (
                            <div className="text-[10px] text-zinc-500 px-1">
                              +{daySubs.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-zinc-400">This month&apos;s renewals</h3>
            {Array.from(dayMap.entries())
              .sort(([a], [b]) => a - b)
              .map(([day, daySubs]) => (
                <div key={day} className="flex items-center gap-3 text-sm">
                  <span className="text-zinc-500 w-8 text-right">{day}.</span>
                  {daySubs.map((sub) => (
                    <span key={sub.id} className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: sub.color ?? "#6366F1" }}
                      />
                      <span className="text-zinc-300">{sub.name}</span>
                      <span className="text-zinc-600 font-mono text-xs">
                        {formatCurrency(parseFloat(sub.amount), sub.currency ?? fallbackCurrency)}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            {dayMap.size === 0 && (
              <p className="text-sm text-zinc-600">No renewals this month.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
