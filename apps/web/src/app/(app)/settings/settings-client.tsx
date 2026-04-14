"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateProfile, deleteAccount } from "@/app/actions/settings";
import { signOut } from "next-auth/react";

interface SettingsClientProps {
  profile: {
    name: string | null;
    email: string;
    currency: string;
    locale: string;
    monthlyBudget: string | null;
    reminderDays: number;
    reminderTime: string;
    weeklyDigest: boolean;
  };
}

export function SettingsClient({ profile }: SettingsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const [name, setName] = useState(profile.name ?? "");
  const [currency, setCurrency] = useState(profile.currency);
  const [monthlyBudget, setMonthlyBudget] = useState(profile.monthlyBudget ?? "");
  const [reminderDays, setReminderDays] = useState(String(profile.reminderDays));
  const [reminderTime, setReminderTime] = useState(profile.reminderTime);
  const [weeklyDigest, setWeeklyDigest] = useState(profile.weeklyDigest);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(false);
    startTransition(async () => {
      await updateProfile({
        name: name || undefined,
        currency: currency || undefined,
        monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : null,
        reminderDays: parseInt(reminderDays) || 3,
        reminderTime,
        weeklyDigest,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteAccount();
      await signOut({ redirectTo: "/" });
    });
  };

  return (
    <div className="space-y-8">
      {/* Profile */}
      <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Input
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              maxLength={3}
              placeholder="USD"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder="No budget set"
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
        <h2 className="text-lg font-semibold">Notifications</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="reminderDays">Remind before (days)</Label>
            <Input
              id="reminderDays"
              type="number"
              min={1}
              max={30}
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminderTime">Reminder time</Label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-zinc-200">Weekly Digest</p>
            <p className="text-xs text-zinc-500">Get a weekly summary of your subscriptions</p>
          </div>
          <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
        </div>
      </section>

      {/* Save button */}
      <Button onClick={handleSave} disabled={isPending} className="w-full">
        {isPending ? "Saving..." : saved ? "Saved!" : "Save Changes"}
      </Button>

      {/* Danger Zone */}
      <section className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        <p className="text-sm text-zinc-400">
          Permanently delete your account and all data. This cannot be undone.
        </p>
        {showDeleteConfirm ? (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </div>
        ) : (
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        )}
      </section>
    </div>
  );
}
