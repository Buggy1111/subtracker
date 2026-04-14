"use client";

import { PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function AppHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-white/[0.06] px-4">
      <button
        onClick={toggleSidebar}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-all duration-150 md:hidden"
      >
        <PanelLeft className="h-4 w-4" />
      </button>

      <div className="flex-1" />
    </header>
  );
}
