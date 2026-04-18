import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

const ERROR_MESSAGES: Record<string, { title: string; detail: string }> = {
  Configuration: {
    title: "Sign-in is misconfigured",
    detail:
      "There is a problem with the server configuration. Please contact the site administrator.",
  },
  AccessDenied: {
    title: "Access denied",
    detail: "You don't have permission to sign in.",
  },
  Verification: {
    title: "Link expired",
    detail:
      "The sign-in link is no longer valid. It may have been used already or expired.",
  },
  OAuthAccountNotLinked: {
    title: "Account already exists",
    detail:
      "This email is already registered with a different sign-in provider. Please use the provider you originally signed up with.",
  },
  OAuthSignin: {
    title: "Sign-in failed",
    detail: "Could not start the sign-in flow with the selected provider.",
  },
  OAuthCallback: {
    title: "Sign-in failed",
    detail: "The provider declined or returned an unexpected response.",
  },
  OAuthCreateAccount: {
    title: "Couldn't create your account",
    detail: "An error happened while creating your account from the OAuth provider.",
  },
  Default: {
    title: "Something went wrong",
    detail:
      "We couldn't sign you in. Please try again — if it keeps failing, let us know.",
  },
};

export default async function AuthErrorPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const info = ERROR_MESSAGES[error ?? "Default"] ?? ERROR_MESSAGES.Default;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#09090B] p-4 overflow-hidden">
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/[0.08] blur-[100px]" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-xl">
            !
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-zinc-50">
            {info.title}
          </h1>
          <p className="mt-3 text-sm text-zinc-400">{info.detail}</p>
          {error && (
            <p className="mt-3 font-mono text-xs text-zinc-600">Code: {error}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link href="/login">
            <Button>Try again</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
