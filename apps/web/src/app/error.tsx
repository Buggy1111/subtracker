"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in development. In production, forward to monitoring.
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#09090B] p-6 text-center">
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/[0.08] blur-[100px]" />
      <div className="relative z-10 max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 text-2xl">
          !
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
          Something went wrong
        </h1>
        <p className="mt-4 text-sm text-zinc-400">
          An unexpected error occurred. We&apos;ve logged it and will take a look.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-zinc-600">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
          <Link href="/">
            <Button>Go home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
