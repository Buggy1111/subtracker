"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, imports } from "@subtracker/db/schema";
import { revalidatePath } from "next/cache";

interface ImportSubscription {
  name: string;
  amount: number;
  currency: string;
  billingCycle: "monthly" | "yearly" | "weekly" | "quarterly";
  categoryId?: string;
  include: boolean;
}

export async function confirmImport(input: {
  fileName: string;
  bankDetected: string;
  totalRows: number;
  subscriptions: ImportSubscription[];
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  const toImport = input.subscriptions.filter((s) => s.include);
  if (toImport.length === 0) return { success: false, error: "No subscriptions selected" };

  // Create import record
  const [importRecord] = await db
    .insert(imports)
    .values({
      userId,
      fileName: input.fileName,
      fileType: "csv",
      bankDetected: input.bankDetected,
      rowCount: input.totalRows,
      matchedCount: input.subscriptions.length,
      importedCount: toImport.length,
    })
    .returning();

  // Create subscriptions
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
