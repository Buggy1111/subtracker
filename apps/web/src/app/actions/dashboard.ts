"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions } from "@subtracker/db/schema";
import { eq, and, asc, lte, gte } from "drizzle-orm";

export async function getDashboardData() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  let allSubs;
  try {
    allSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(asc(subscriptions.nextBillingDate));
  } catch {
    // DB not available (dev mode with dummy URL)
    return null;
  }

  const activeSubs = allSubs.filter((s) => s.status === "active");

  // Monthly spend (normalize all cycles to monthly)
  const monthlySpend = activeSubs.reduce((sum, s) => {
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

  // Category breakdown
  const categoryTotals = new Map<string, number>();
  for (const sub of activeSubs) {
    const key = sub.categoryId ?? "uncategorized";
    const amount = parseFloat(sub.amount);
    const monthly =
      sub.billingCycle === "yearly"
        ? amount / 12
        : sub.billingCycle === "quarterly"
          ? amount / 3
          : sub.billingCycle === "weekly"
            ? amount * 4.33
            : amount;
    categoryTotals.set(key, (categoryTotals.get(key) ?? 0) + monthly);
  }

  return {
    monthlySpend,
    annualProjection,
    activeCount: activeSubs.length,
    totalCount: allSubs.length,
    nextRenewal: nextRenewal
      ? { name: nextRenewal.name, date: nextRenewal.nextBillingDate, amount: nextRenewal.amount }
      : null,
    upcomingRenewals: upcomingRenewals.map((s) => ({
      id: s.id,
      name: s.name,
      amount: s.amount,
      currency: s.currency,
      nextBillingDate: s.nextBillingDate,
      color: s.color,
    })),
    categoryBreakdown: Array.from(categoryTotals.entries()).map(([id, amount]) => ({
      categoryId: id,
      monthlyAmount: amount,
    })),
  };
}
