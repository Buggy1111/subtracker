"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, categories } from "@subtracker/db/schema";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  type CreateSubscriptionInput,
  type UpdateSubscriptionInput,
} from "@subtracker/db/validators";
import { eq, and, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

async function getAuthUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getSubscriptions(): Promise<ActionResult<typeof subscriptions.$inferSelect[]>> {
  const userId = await getAuthUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const data = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(asc(subscriptions.nextBillingDate));

    return { success: true, data };
  } catch {
    return { success: true, data: [] };
  }
}

export async function getSubscription(
  id: string,
): Promise<ActionResult<typeof subscriptions.$inferSelect>> {
  const userId = await getAuthUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const [data] = await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
      .limit(1);

    if (!data) return { success: false, error: "Subscription not found" };
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load subscription" };
  }
}

export async function getCategories(): Promise<ActionResult<typeof categories.$inferSelect[]>> {
  const userId = await getAuthUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    const data = await db
      .select()
      .from(categories)
      .where(
        // Global categories (userId = null) OR user's own
        eq(categories.userId, userId)
      )
      .orderBy(asc(categories.sortOrder));

    return { success: true, data };
  } catch {
    return { success: true, data: [] };
  }
}

export async function createSubscription(
  input: CreateSubscriptionInput
): Promise<ActionResult> {
  const userId = await getAuthUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  const parsed = createSubscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const [created] = await db
    .insert(subscriptions)
    .values({
      ...parsed.data,
      amount: String(parsed.data.amount),
      userId,
    })
    .returning();

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");

  return { success: true, data: created };
}

export async function updateSubscription(
  id: string,
  input: UpdateSubscriptionInput
): Promise<ActionResult> {
  const userId = await getAuthUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  const parsed = updateSubscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const values: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.amount !== undefined) {
    values.amount = String(parsed.data.amount);
  }

  const [updated] = await db
    .update(subscriptions)
    .set(values)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .returning();

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");

  return { success: true, data: updated };
}

export async function deleteSubscription(id: string): Promise<ActionResult> {
  const userId = await getAuthUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  const [deleted] = await db
    .delete(subscriptions)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .returning();

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");

  return { success: true, data: deleted };
}

export async function toggleSubscriptionPause(id: string): Promise<ActionResult> {
  const userId = await getAuthUserId();
  if (!userId) return { success: false, error: "Not authenticated" };

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)));

  if (!sub) return { success: false, error: "Subscription not found" };

  const newStatus = sub.status === "paused" ? "active" : "paused";

  const [updated] = await db
    .update(subscriptions)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .returning();

  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");

  return { success: true, data: updated };
}
