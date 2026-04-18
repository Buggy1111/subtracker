"use client";

import { useRouter } from "next/navigation";
import { SubscriptionForm } from "@/components/subscription-form";
import { updateSubscription } from "@/app/actions/subscriptions";
import type { CreateSubscriptionInput } from "@subtracker/db/validators";

interface EditSubscriptionClientProps {
  id: string;
  categories: { id: string; name: string; color: string }[];
  defaultValues: Partial<CreateSubscriptionInput>;
}

export function EditSubscriptionClient({
  id,
  categories,
  defaultValues,
}: EditSubscriptionClientProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
      <SubscriptionForm
        categories={categories}
        defaultValues={defaultValues}
        submitLabel="Save Changes"
        onSubmit={async (data) => {
          const result = await updateSubscription(id, data);
          if (result.success) {
            router.push("/subscriptions");
            router.refresh();
          }
          return result;
        }}
      />
    </div>
  );
}
