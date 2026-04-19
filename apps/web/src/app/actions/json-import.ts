"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, categories } from "@subtracker/db/schema";
import { and, eq, isNull, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { parseImportPayload, type ImportedSubscription } from "@/lib/json-import";
import { guessCategoryName } from "@/lib/category-guess";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB — generous for a JSON export

export async function importJson(
  rawText: string,
): Promise<
  | { success: true; imported: number; skipped: number; source: string }
  | { success: false; error: string }
> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  if (typeof rawText !== "string" || rawText.length === 0) {
    return { success: false, error: "Empty file" };
  }
  if (rawText.length > MAX_BYTES) {
    return { success: false, error: "File too large (max 2 MB)" };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    return { success: false, error: "Could not parse file as JSON" };
  }

  const parsed = parseImportPayload(parsedJson);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }

  try {
    const existingSubs = await db
      .select({
        name: subscriptions.name,
        amount: subscriptions.amount,
        billingCycle: subscriptions.billingCycle,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    const seen = new Set(
      existingSubs.map((s) => dedupKey(s.name, parseFloat(s.amount), s.billingCycle)),
    );

    const accessibleCats = await db
      .select()
      .from(categories)
      .where(or(isNull(categories.userId), eq(categories.userId, userId)));
    const catByName = new Map(accessibleCats.map((c) => [c.name, c.id]));

    // Create any user categories from the payload that don't already exist.
    // Single batched insert instead of one round-trip per category.
    const newCats = parsed.categories.filter((c) => !catByName.has(c.name));
    if (newCats.length > 0) {
      const inserted = await db
        .insert(categories)
        .values(
          newCats.map((c) => ({
            userId,
            name: c.name,
            color: c.color ?? "#64748B",
            icon: null,
            sortOrder: 100,
          })),
        )
        .returning({ id: categories.id, name: categories.name });
      for (const row of inserted) {
        catByName.set(row.name, row.id);
      }
    }

    const rowsToInsert = parsed.subscriptions
      .filter((s) => !seen.has(dedupKey(s.name, s.amount, s.billingCycle)))
      .map((s) => ({
        userId,
        name: s.name,
        amount: String(s.amount),
        currency: s.currency,
        billingCycle: s.billingCycle,
        nextBillingDate: s.nextBillingDate,
        status: s.status,
        notes: s.notes,
        url: s.url,
        categoryId: resolveCategoryId(s, catByName),
        importSource: "json" as const,
      }));

    if (rowsToInsert.length > 0) {
      await db.insert(subscriptions).values(rowsToInsert);
    }

    revalidatePath("/subscriptions");
    revalidatePath("/dashboard");

    return {
      success: true,
      imported: rowsToInsert.length,
      skipped: parsed.subscriptions.length - rowsToInsert.length,
      source: parsed.source,
    };
  } catch {
    return { success: false, error: "Failed to save imported subscriptions" };
  }
}

function dedupKey(name: string, amount: number, cycle: string): string {
  return `${name.trim().toLowerCase()}|${amount.toFixed(2)}|${cycle}`;
}

function resolveCategoryId(
  sub: ImportedSubscription,
  catByName: Map<string, string>,
): string | null {
  if (sub.categoryName) {
    const direct = catByName.get(sub.categoryName);
    if (direct) return direct;
  }
  const guess = guessCategoryName(sub.name);
  return guess ? catByName.get(guess) ?? null : null;
}
