import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#09090B] p-6 text-center">
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.06] blur-[100px]" />
      <div className="relative z-10 max-w-md">
        <div className="text-7xl font-bold tracking-tight text-zinc-50">404</div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-100">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/">
            <Button variant="outline">Go home</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
