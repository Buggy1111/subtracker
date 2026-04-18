"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, categories, subscriptions, payments, reminders, imports } from "@subtracker/db/schema";
import { updateProfileSchema, type UpdateProfileInput } from "@subtracker/db/validators";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user ?? null;
  } catch {
    return null;
  }
}

export async function updateProfile(input: UpdateProfileInput) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { monthlyBudget, ...rest } = parsed.data;
  const updateData: Record<string, unknown> = { ...rest, updatedAt: new Date() };
  if (monthlyBudget !== undefined) {
    updateData.monthlyBudget = monthlyBudget === null ? null : String(monthlyBudget);
  }

  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId));

  revalidatePath("/settings");
  return { success: true };
}

export async function deleteAccount() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    // Cascade delete handles related data (accounts, sessions, subscriptions,
    // payments, reminders, imports, user categories — see schema FKs)
    await db.delete(users).where(eq(users.id, userId));
    return { success: true };
  } catch (err) {
    console.error("deleteAccount failed", err);
    return {
      success: false,
      error: "Could not delete your account. Please try again or contact support.",
    };
  }
}
