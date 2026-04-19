"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, categories } from "@subtracker/db/schema";
import { eq, asc, or, isNull } from "drizzle-orm";

function monthlyCost(amount: string, cycle: string): number {
  const n = parseFloat(amount);
  if (cycle === "yearly") return n / 12;
  if (cycle === "quarterly") return n / 3;
  if (cycle === "weekly") return n * 4.33;
  return n;
}

export async function getDashboardData() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  // Fetch subscriptions and the category lookup in parallel — they have no
  // data dependency on each other and each Neon round-trip is ~50ms.
  let allSubs;
  let categoryRows: (typeof categories.$inferSelect)[];
  try {
    [allSubs, categoryRows] = await Promise.all([
      db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .orderBy(asc(subscriptions.nextBillingDate)),
      db
        .select()
        .from(categories)
        .where(or(isNull(categories.userId), eq(categories.userId, userId))),
    ]);
  } catch {
    // DB not available (dev mode with dummy URL)
    return null;
  }

  const activeSubs = allSubs.filter((s) => s.status === "active");

  // Monthly spend (normalize all cycles to monthly)
  const monthlySpend = activeSubs.reduce(
    (sum, s) => sum + monthlyCost(s.amount, s.billingCycle),
    0
  );

  // Annual projection
  const annualProjection = monthlySpend * 12;

  // Next renewal
  const today = new Date().toISOString().split("T")[0];
  const nextRenewal = activeSubs.find((s) => s.nextBillingDate >= today);

  // Upcoming renewals (next 7 days)
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const upcomingDate = sevenDaysLater.toISOString().split("T")[0];

  const upcomingRenewals = activeSubs.filter(
    (s) => s.nextBillingDate >= today && s.nextBillingDate <= upcomingDate
  );

  // Category breakdown — join with categories to resolve names
  const categoryTotals = new Map<string, number>();
  for (const sub of activeSubs) {
    const key = sub.categoryId ?? "uncategorized";
    categoryTotals.set(
      key,
      (categoryTotals.get(key) ?? 0) + monthlyCost(sub.amount, sub.billingCycle)
    );
  }

  const categoryMap = new Map(categoryRows.map((c) => [c.id, c]));

  return {
    monthlySpend,
    annualProjection,
    activeCount: activeSubs.length,
    totalCount: allSubs.length,
    nextRenewal: nextRenewal
      ? {
          name: nextRenewal.name,
          date: nextRenewal.nextBillingDate,
          amount: nextRenewal.amount,
          currency: nextRenewal.currency,
        }
      : null,
    upcomingRenewals: upcomingRenewals.map((s) => ({
      id: s.id,
      name: s.name,
      amount: s.amount,
      currency: s.currency,
      nextBillingDate: s.nextBillingDate,
      color: s.color,
    })),
    categoryBreakdown: Array.from(categoryTotals.entries()).map(([id, amount]) => {
      const cat = categoryMap.get(id);
      return {
        categoryId: id,
        name: cat?.name ?? "Uncategorized",
        color: cat?.color ?? "#64748B",
        monthlyAmount: amount,
      };
    }),
    // Expose the raw active subs so callers (like analytics/page.tsx) can
    // avoid a second full-table fetch.
    activeSubs,
  };
}

export async function getMonthlyTrend(months = 6) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  let subs;
  try {
    subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
  } catch {
    return null;
  }

  const now = new Date();
  const result: { month: string; label: string; total: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

    // Include subs that existed by end of this month and weren't cancelled then
    const total = subs.reduce((sum, s) => {
      const created = s.createdAt instanceof Date ? s.createdAt : new Date(s.createdAt);
      if (created > endOfMonth) return sum;
      if (s.status === "cancelled") return sum;
      return sum + monthlyCost(s.amount, s.billingCycle);
    }, 0);

    result.push({
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleString("en-US", { month: "short" }),
      total: Math.round(total * 100) / 100,
    });
  }

  return result;
}
