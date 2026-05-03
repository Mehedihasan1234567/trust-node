"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Globe,
  Tags,
  BarChart3,
  FileText,
  Settings,
  Users,
  Key,
  LogOut,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

interface SidebarProps {
  org: { slug: string; name: string };
  user: { email?: string };
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/websites", label: "Websites", icon: Globe },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/labels", label: "AI Labels", icon: Tags },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/usage", label: "Usage", icon: BarChart3 },
];

const bottomItems = [
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ org, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="font-bold text-lg">TrustNode</div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="space-y-1">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
          <form action={signOut}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
