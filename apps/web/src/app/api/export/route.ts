import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscriptions, categories } from "@subtracker/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const [subs, cats] = await Promise.all([
      db.select().from(subscriptions).where(eq(subscriptions.userId, userId)),
      db
        .select()
        .from(categories)
        .where(and(eq(categories.userId, userId), isNotNull(categories.userId))),
    ]);

    // Build a name->id map so we can emit category NAMES in the export rather
    // than DB ids. The importer maps back to ids on the target instance.
    const catById = new Map(cats.map((c) => [c.id, c.name]));

    const payload = {
      version: 1,
      source: "subtracker",
      exportedAt: new Date().toISOString(),
      userCategories: cats.map((c) => ({
        name: c.name,
        color: c.color,
        icon: c.icon,
      })),
      subscriptions: subs.map((s) => ({
        name: s.name,
        description: s.description,
        amount: s.amount,
        currency: s.currency,
        billingCycle: s.billingCycle,
        billingDay: s.billingDay,
        startDate: s.startDate,
        nextBillingDate: s.nextBillingDate,
        category: s.categoryId ? catById.get(s.categoryId) ?? null : null,
        status: s.status,
        trialEndsAt: s.trialEndsAt,
        url: s.url,
        logo: s.logo,
        color: s.color,
        cancellationUrl: s.cancellationUrl,
        notes: s.notes,
      })),
    };

    const filename = `subtracker-export-${new Date().toISOString().split("T")[0]}.json`;
    return new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json({ error: "Export failed" }, { status: 500 });
  }
}
