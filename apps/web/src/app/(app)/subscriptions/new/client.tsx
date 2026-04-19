"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubscriptionForm } from "@/components/subscription-form";
import { QuickAdd } from "@/components/quick-add";
import { createSubscription } from "@/app/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Zap, PenLine } from "lucide-react";
import type { CreateSubscriptionInput } from "@subtracker/db/validators";

interface NewSubscriptionClientProps {
  categories: { id: string; name: string; color: string }[];
  prefill?: Partial<CreateSubscriptionInput>;
  initialMode?: "quick" | "manual";
}

export function NewSubscriptionClient({
  categories,
  prefill,
  initialMode = "quick",
}: NewSubscriptionClientProps) {
  const [mode, setMode] = useState<"quick" | "manual">(initialMode);
  const router = useRouter();

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.name, c.id])
  );

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
        <Button
          variant={mode === "quick" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMode("quick")}
          className="flex-1"
        >
          <Zap className="mr-1.5 h-3.5 w-3.5" />
          Quick Add
        </Button>
        <Button
          variant={mode === "manual" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMode("manual")}
          className="flex-1"
        >
          <PenLine className="mr-1.5 h-3.5 w-3.5" />
          Manual
        </Button>
      </div>

      {mode === "quick" ? (
        <QuickAdd categoryMap={categoryMap} />
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <SubscriptionForm
            categories={categories}
            defaultValues={prefill}
            onSubmit={async (data) => {
              const result = await createSubscription(data);
              if (result.success) {
                router.push("/subscriptions");
              }
              return result;
            }}
          />
        </div>
      )}
    </div>
  );
}
