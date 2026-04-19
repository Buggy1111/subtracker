"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, imports } from "@subtracker/db/schema";
import {
  confirmImportSchema,
  type ConfirmImportInput,
} from "@subtracker/db/validators";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextBillingDate = nextMonth.toISOString().split("T")[0];

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
        nextBillingDate,
        categoryId: sub.categoryId || null,
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
