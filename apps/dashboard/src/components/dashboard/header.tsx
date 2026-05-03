"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  org: { name: string; slug: string; plan: string };
  user: { email?: string };
}

export function DashboardHeader({ org, user }: HeaderProps) {
  const initials = org.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-semibold">{org.name}</h2>
          <p className="text-xs text-muted-foreground">
            {org.plan} Plan
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
