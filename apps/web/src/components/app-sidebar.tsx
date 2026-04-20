"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Upload,
  BarChart3,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { title: "Import", href: "/import", icon: Upload },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Calendar", href: "/calendar", icon: Calendar },
];

interface AppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar className="bg-[#0A0A0B] border-r border-white/[0.06]">
      <SidebarHeader className="border-b border-white/[0.06] px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={closeMobile}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4ff3d] text-[#0a0a0b] font-bold text-sm" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
            S
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-100" style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.02em" }}>
            Sub<span style={{ color: "#c4ff3d", fontStyle: "italic" }}>·</span>Tracker
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-[0.05em] uppercase text-zinc-600 px-3 pt-5 pb-2">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} onClick={closeMobile} />}
                      isActive={isActive}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-white/[0.08] text-zinc-100"
                          : "text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.05]"
                      }`}
                    >
                      <item.icon
                        className={`h-[18px] w-[18px] ${
                          isActive ? "opacity-100" : "opacity-60"
                        }`}
                      />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/[0.06] p-3 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? ""}
            />
            <AvatarFallback className="rounded-lg bg-zinc-800 text-xs text-zinc-400">
              {user.name?.charAt(0)?.toUpperCase() ??
                user.email?.charAt(0)?.toUpperCase() ??
                "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">
              {user.name ?? "User"}
            </p>
            <p className="text-xs text-zinc-600 truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Link
            href="/settings"
            onClick={closeMobile}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-all duration-150"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Link>
          <form action="/api/auth/signout" method="POST" className="flex-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-150"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
