"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function AppHeader() {
  const { theme, setTheme } = useTheme();
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

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-all duration-150"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>
    </header>
  );
}
