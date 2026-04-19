"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSubscriptionSchema,
  type CreateSubscriptionInput,
} from "@subtracker/db/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";
import { SUPPORTED_CURRENCIES } from "@/lib/format";

const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "weekly", label: "Weekly" },
  { value: "quarterly", label: "Quarterly" },
] as const;

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "trial", label: "Trial" },
  { value: "paused", label: "Paused" },
] as const;

interface SubscriptionFormProps {
  categories: { id: string; name: string; color: string }[];
  defaultValues?: Partial<CreateSubscriptionInput>;
  onSubmit: (data: CreateSubscriptionInput) => Promise<{ success: boolean; error?: string }>;
  submitLabel?: string;
}

export function SubscriptionForm({
  categories,
  defaultValues,
  onSubmit,
  submitLabel = "Add Subscription",
}: SubscriptionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateSubscriptionInput>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      currency: "USD",
      status: "active",
      billingCycle: "monthly",
      notify: true,
      nextBillingDate: new Date().toISOString().split("T")[0],
      ...defaultValues,
    },
  });

  const billingCycle = watch("billingCycle");
  const status = watch("status");

  const onFormSubmit = handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const result = await onSubmit(data);
      if (!result.success && result.error) {
        setServerError(result.error);
      }
    });
  });

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      {/* Name & Amount */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="e.g. Netflix"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="15.99"
            {...register("amount", { valueAsNumber: true })}
            aria-invalid={!!errors.amount}
          />
          {errors.amount && (
            <p className="text-xs text-red-400">{errors.amount.message}</p>
          )}
        </div>
      </div>

      {/* Billing Cycle & Currency */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Billing Cycle *</Label>
          <Select value={billingCycle} onValueChange={(v) => setValue("billingCycle", v as CreateSubscriptionInput["billingCycle"])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BILLING_CYCLES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={watch("currency") ?? "USD"}
            onValueChange={(v) => setValue("currency", v ?? "USD", { shouldValidate: true })}
          >
            <SelectTrigger id="currency" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.code} — {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextBillingDate">Next Billing *</Label>
          <Input
            id="nextBillingDate"
            type="date"
            {...register("nextBillingDate")}
            aria-invalid={!!errors.nextBillingDate}
          />
          {errors.nextBillingDate && (
            <p className="text-xs text-red-400">{errors.nextBillingDate.message}</p>
          )}
        </div>
      </div>

      {/* Category & Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={watch("categoryId") ?? ""}
            onValueChange={(v) => setValue("categoryId", v || undefined)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full mr-1.5"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setValue("status", v as CreateSubscriptionInput["status"])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* URL & Notes */}
      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://netflix.com"
          {...register("url")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cancellationUrl">
          Cancellation URL{" "}
          <span className="text-xs text-zinc-500 font-normal">
            (direct link to cancel this subscription)
          </span>
        </Label>
        <Input
          id="cancellationUrl"
          type="url"
          placeholder="https://netflix.com/cancelplan"
          {...register("cancellationUrl")}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Cancellation Difficulty{" "}
          <span className="text-xs text-zinc-500 font-normal">(1 = easy, 5 = hard)</span>
        </Label>
        <Select
          value={String(watch("cancellationDifficulty") ?? "")}
          onValueChange={(v) =>
            setValue(
              "cancellationDifficulty",
              v ? parseInt(v) : undefined,
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Not set" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 — Easy (one click)</SelectItem>
            <SelectItem value="2">2 — Simple (a form)</SelectItem>
            <SelectItem value="3">3 — Medium (account settings)</SelectItem>
            <SelectItem value="4">4 — Hard (chat or email)</SelectItem>
            <SelectItem value="5">5 — Nightmare (phone call)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          placeholder="Family plan, shared with..."
          {...register("notes")}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
