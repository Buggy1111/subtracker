import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { getSubscriptions } from "@/app/actions/subscriptions";
import { SubscriptionList } from "./subscription-list";

export default async function SubscriptionsPage() {
  const result = await getSubscriptions();
  const subscriptions = result.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage all your recurring payments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" render={<Link href="/import" />}>
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button render={<Link href="/subscriptions/new" />}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subscription
          </Button>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <CreditCardIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No subscriptions yet</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              Add your first subscription to see where your money goes every
              month.
            </p>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" render={<Link href="/import" />}>
                <Upload className="mr-2 h-4 w-4" />
                Import from Bank CSV
              </Button>
              <Button render={<Link href="/subscriptions/new" />}>
                <Plus className="mr-2 h-4 w-4" />
                Add Manually
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <SubscriptionList subscriptions={subscriptions} />
      )}
    </div>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
