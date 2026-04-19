"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Subscription = {
  id: string;
  name: string;
  amount: string;
  currency: string;
  nextBillingDate: string;
  color?: string | null;
};

interface Props {
  subscriptions: Subscription[];
  fallbackCurrency: string;
}

export function CalendarClient({ subscriptions, fallbackCurrency }: Props) {
  const today = useMemo(() => new Date(), []);
  const [offset, setOffset] = useState(0); // months from today

  const viewDate = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + offset, 1),
    [today, offset],
  );
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayMap = useMemo(() => {
    const map = new Map<number, Subscription[]>();
    for (const sub of subscriptions) {
      const d = new Date(sub.nextBillingDate + "T00:00:00");
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(sub);
      }
    }
    return map;
  }, [subscriptions, year, month]);

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return dayNum;
  });

  const totalThisMonth = useMemo(() => {
    let sum = 0;
    for (const [, subs] of dayMap) {
      for (const s of subs) sum += parseFloat(s.amount);
    }
    return sum;
  }, [dayMap]);

  const isCurrentMonth = offset === 0;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
      {/* Header with month nav */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-100">
          {MONTH_NAMES[month]} {year}
          {!isCurrentMonth && (
            <button
              onClick={() => setOffset(0)}
              className="ml-3 text-xs text-zinc-500 hover:text-indigo-400 font-normal"
            >
              Today
            </button>
          )}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOffset((o) => o - 1)}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOffset((o) => o + 1)}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs text-zinc-600 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isToday =
            isCurrentMonth &&
            day === today.getDate();
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
                          title={`${sub.name} · ${formatCurrency(parseFloat(sub.amount), sub.currency ?? fallbackCurrency)}`}
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

      {/* Legend + total */}
      <div className="mt-6 flex items-start justify-between gap-6">
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-medium text-zinc-400">
            {MONTH_NAMES[month]} renewals
          </h3>
          {dayMap.size === 0 ? (
            <p className="text-sm text-zinc-600">No renewals this month.</p>
          ) : (
            Array.from(dayMap.entries())
              .sort(([a], [b]) => a - b)
              .map(([day, daySubs]) => (
                <div key={day} className="flex items-center gap-3 text-sm flex-wrap">
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
              ))
          )}
        </div>

        {dayMap.size > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-xs text-zinc-600 uppercase tracking-wide">Month total</p>
            <p className="font-mono font-semibold text-zinc-200 tabular-nums">
              {formatCurrency(totalThisMonth, fallbackCurrency)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
