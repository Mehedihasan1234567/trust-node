"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Zap } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";

interface HeaderProps {
  org: { name: string; slug: string; plan: string };
  user: { email?: string };
}

function SignOutForm() {
  return (
    <form action={signOut} className="w-full">
      <button
        type="submit"
        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-[#FF4C4C] hover:bg-[#242424]"
      >
        Sign Out
      </button>
    </form>
  );
}

export function DashboardHeader({ org, user }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const initials = org.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#333333] bg-[#121212]/80 px-6 backdrop-blur-xl">
      {/* Search Trigger */}
      <div className="flex flex-1 items-center">
        <button
          onClick={() => setSearchOpen(true)}
          className="group flex h-9 w-full max-w-md items-center gap-2 rounded-md border border-[#333333] bg-[#1C1C1C] px-3 text-sm text-[#A0A0A0] transition-colors hover:border-[#444444] hover:text-white"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="hidden rounded border border-[#333333] bg-[#242424] px-1.5 py-0.5 text-[10px] font-medium text-[#A0A0A0] sm:inline-block">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* System Status */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FFC2] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FFC2]" />
          </span>
          <span className="text-xs font-medium text-[#A0A0A0]">
            System Operational
          </span>
        </div>

        <div className="hidden h-4 w-[1px] bg-[#333333] md:block" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 outline-none">
              <div className="hidden text-right md:block">
                <p className="text-sm font-medium text-white">
                  {user.email || org.name}
                </p>
                <p className="text-xs text-[#A0A0A0]">{org.plan} Plan</p>
              </div>
              <Avatar className="h-8 w-8 border border-[#333333]">
                <AvatarFallback className="bg-[#1C1C1C] text-xs font-medium text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-[#333333] bg-[#1C1C1C] text-white"
          >
            <DropdownMenuLabel className="text-[#A0A0A0]">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#333333]" />
            <DropdownMenuItem className="text-white focus:bg-[#242424] focus:text-white">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white focus:bg-[#242424] focus:text-white">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#333333]" />
            <SignOutForm />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Command Palette Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="overflow-hidden border-[#333333] bg-[#1C1C1C] p-0 shadow-2xl">
          <DialogHeader className="border-b border-[#333333] px-4 pb-4 pt-4">
            <DialogTitle className="flex items-center gap-2 text-sm font-normal text-[#A0A0A0]">
              <Search className="h-4 w-4" />
              Type a command or search...
            </DialogTitle>
          </DialogHeader>
          <div className="p-2">
            <Input
              placeholder="Search across your domains, audits, and settings..."
              className="border-[#333333] bg-[#242424] text-white placeholder:text-[#A0A0A0] focus-visible:ring-[#00FFC2]"
              autoFocus
            />
            <div className="mt-4 space-y-1 px-2 pb-2">
              <p className="mb-2 text-xs font-medium text-[#A0A0A0]">Recent</p>
              {[
                "Compliance Report Q1",
                "Domain: acme.com",
                "Audit Log #2847",
              ].map((item) => (
                <div
                  key={item}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-white transition-colors hover:bg-[#242424]"
                >
                  <Zap className="h-3.5 w-3.5 text-[#00FFC2]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
