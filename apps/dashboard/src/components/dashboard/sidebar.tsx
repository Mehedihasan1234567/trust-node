"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Globe,
  FileText,
  Settings,
  CreditCard,
  LogOut,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  Key,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

interface SidebarProps {
  org: { slug: string; name: string };
  user: { email?: string };
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/websites", label: "Domains", icon: Globe },
  { href: "/dashboard/reports", label: "AI Audit Logs", icon: FileText },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/usage", label: "Billing", icon: CreditCard },
];

export function DashboardSidebar({ org }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-[#333333] bg-[#0A0A0A] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[#333333] bg-[#0A0A0A] text-[#A0A0A0] transition-colors hover:text-white"
      >
        {collapsed ? (
          <PanelLeftOpen className="h-3 w-3" />
        ) : (
          <PanelLeftClose className="h-3 w-3" />
        )}
      </button>

      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-[#333333] px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00FFC2]/10">
          <Shield className="h-4 w-4 text-[#00FFC2]" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold tracking-tight text-white">
              Certence
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0]">
              {org.name}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col justify-between py-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#0D3B2E] text-[#00FFC2]"
                      : "text-[#A0A0A0] hover:bg-[#1C1C1C] hover:text-white",
                    collapsed && "justify-center px-0"
                  )}
                >
                    {isActive && !collapsed && (
                    <div className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-[#00FFC2]" />
                  )}
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive
                        ? "text-[#00FFC2]"
                        : "text-[#A0A0A0] group-hover:text-white"
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-1 px-3">
          <form action={signOut}>
            <button
              type="submit"
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#A0A0A0] transition-colors hover:bg-[#1C1C1C]/50 hover:text-white",
                collapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
