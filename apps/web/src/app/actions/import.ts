"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, imports, categories } from "@subtracker/db/schema";
import {
  confirmImportSchema,
  type ConfirmImportInput,
} from "@subtracker/db/validators";
import { eq, or, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { guessCategoryName } from "@/lib/category-guess";
import { projectNextBilling } from "@/lib/billing-projection";

export async function confirmImport(input: ConfirmImportInput) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  const parsed = confirmImportSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const toImport = data.subscriptions.filter((s) => s.include);
  if (toImport.length === 0) {
    return { success: false, error: "No subscriptions selected" };
  }

  const today = new Date();
  const fallbackNextBilling = (() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  })();

  function nextBillingFor(sub: (typeof toImport)[number]): string {
    return sub.lastObserved
      ? projectNextBilling(sub.lastObserved, sub.billingCycle, today)
      : fallbackNextBilling;
  }

  // Build a name->id map from the user's accessible categories so we can
  // auto-assign a category on import (Netflix -> Streaming, etc.).
  const categoryRows = await db
    .select()
    .from(categories)
    .where(or(isNull(categories.userId), eq(categories.userId, userId)))
    .catch(() => []);
  const categoryByName = new Map(categoryRows.map((c) => [c.name, c.id]));

  function resolveCategoryId(sub: (typeof toImport)[number]): string | null {
    if (sub.categoryId) return sub.categoryId;
    const guess = guessCategoryName(sub.name);
    if (!guess) return null;
    return categoryByName.get(guess) ?? null;
  }

  // Note: Neon HTTP driver doesn't support transactions. We insert the import
  // record first, then batch-insert subscriptions as a single atomic statement.
  // If the batch insert fails, we clean up the orphan import record.
  let importRecordId: string | null = null;
  try {
    const [importRecord] = await db
      .insert(imports)
      .values({
        userId,
        fileName: data.fileName,
        fileType: "csv",
        bankDetected: data.bankDetected,
        rowCount: data.totalRows,
        matchedCount: data.subscriptions.length,
        importedCount: toImport.length,
      })
      .returning();
    importRecordId = importRecord.id;

    await db.insert(subscriptions).values(
      toImport.map((sub) => ({
        userId,
        name: sub.name,
        amount: String(sub.amount),
        currency: sub.currency,
        billingCycle: sub.billingCycle,
        nextBillingDate: nextBillingFor(sub),
        categoryId: resolveCategoryId(sub),
        importSource: "csv" as const,
        importRef: importRecord.id,
      }))
    );

    revalidatePath("/subscriptions");
    revalidatePath("/dashboard");

    return { success: true, importedCount: toImport.length };
  } catch {
    if (importRecordId) {
      await db.delete(imports).where(eq(imports.id, importRecordId)).catch(() => {});
    }
    return { success: false, error: "Failed to save import — please try again" };
  }
}
