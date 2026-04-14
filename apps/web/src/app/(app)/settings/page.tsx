import { auth } from "@/lib/auth";
import { getProfile } from "@/app/actions/settings";
import { SettingsClient } from "./settings-client";
import { redirect } from "next/navigation";

const DEFAULT_PROFILE = {
  name: null,
  email: "user@subtracker.app",
  currency: "USD",
  locale: "en",
  monthlyBudget: null,
  reminderDays: 3,
  reminderTime: "09:00",
  weeklyDigest: true,
} as const;

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await getProfile();

  const displayProfile = profile ?? {
    ...DEFAULT_PROFILE,
    name: session.user.name ?? null,
    email: session.user.email ?? DEFAULT_PROFILE.email,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your account and preferences.
        </p>
      </div>

      <SettingsClient profile={displayProfile} />
    </div>
  );
}
