"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pause, Play, Pencil, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteSubscription, toggleSubscriptionPause } from "@/app/actions/subscriptions";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  paused: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
  trial: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

const CYCLE_LABELS: Record<string, string> = {
  monthly: "/mo",
  yearly: "/yr",
  weekly: "/wk",
  quarterly: "/qtr",
};

interface SubscriptionCardProps {
  subscription: {
    id: string;
    name: string;
    amount: string;
    currency: string;
    billingCycle: string;
    status: string;
    nextBillingDate: string;
    logo?: string | null;
    color?: string | null;
    category?: { name: string; color: string } | null;
  };
  onEdit: (id: string) => void;
}

export function SubscriptionCard({ subscription, onEdit }: SubscriptionCardProps) {
  const [isPending, startTransition] = useTransition();
  const amount = parseFloat(subscription.amount);

  return (
    <div
      className={`group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04] ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Logo/Color dot */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{
              backgroundColor: subscription.color ?? "#6366F1",
            }}
          >
            {subscription.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-medium text-zinc-100">{subscription.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              {subscription.category && (
                <span className="text-xs text-zinc-500">
                  {subscription.category.name}
                </span>
              )}
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 h-4 ${STATUS_COLORS[subscription.status] ?? ""}`}
              >
                {subscription.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="font-mono font-semibold text-zinc-100 tabular-nums">
              {subscription.currency === "USD" ? "$" : subscription.currency + " "}
              {amount.toFixed(2)}
              <span className="text-xs text-zinc-500 font-normal ml-0.5">
                {CYCLE_LABELS[subscription.billingCycle] ?? ""}
              </span>
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">
              Next: {new Date(subscription.nextBillingDate + "T00:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 group-hover:opacity-100"
                />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(subscription.id)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  startTransition(async () => { await toggleSubscriptionPause(subscription.id); })
                }
              >
                {subscription.status === "paused" ? (
                  <>
                    <Play className="mr-2 h-3.5 w-3.5" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-3.5 w-3.5" />
                    Pause
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  startTransition(async () => { await deleteSubscription(subscription.id); })
                }
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
