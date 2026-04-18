"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, imports } from "@subtracker/db/schema";
import {
  confirmImportSchema,
  type ConfirmImportInput,
} from "@subtracker/db/validators";
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

  // Create import record (fileName is already sanitized by Zod transform)
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

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextBillingDate = nextMonth.toISOString().split("T")[0];

  for (const sub of toImport) {
    await db.insert(subscriptions).values({
      userId,
      name: sub.name,
      amount: String(sub.amount),
      currency: sub.currency,
      billingCycle: sub.billingCycle,
      nextBillingDate,
      categoryId: sub.categoryId || null,
      importSource: "csv",
      importRef: importRecord.id,
    });
  }

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");

  return { success: true, importedCount: toImport.length };
}
