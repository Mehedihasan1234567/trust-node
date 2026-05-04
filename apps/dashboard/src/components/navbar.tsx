"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-slate-200/60 bg-white/90 shadow-[0_4px_20px_-4px_rgba(11,61,145,0.08)] backdrop-blur-xl"
            : "border-b border-transparent bg-white/60 backdrop-blur-md"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl text-[#0B3D91] shrink-0"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#00D4FF] shadow-md shadow-[#00D4FF]/20">
              <Shield className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="tracking-tight">TrustNode</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-slate-500 hover:text-[#0B3D91] hover:bg-[#0B3D91]/[0.04] transition-colors"
                >
                  {link.label}
                </Button>
              </Link>
            ))}

            <div className="w-px h-5 bg-slate-200 mx-1" />

            <Link href="/login">
              <Button
                variant="ghost"
                className="text-sm font-medium text-slate-500 hover:text-[#0B3D91] hover:bg-[#0B3D91]/[0.04] transition-colors"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#00D4FF] hover:bg-[#00BFE6] text-[#0B3D91] font-semibold px-5 shadow-lg shadow-[#00D4FF]/20 transition-all hover:shadow-xl hover:shadow-[#00D4FF]/25">
                Get Started
              </Button>
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0B3D91]/10 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-16 left-4 right-4 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-[#0B3D91]/10 p-6 transition-all duration-300 ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-[#0B3D91] hover:bg-[#EAF4FF] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-slate-100 my-1" />

            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:text-[#0B3D91] hover:bg-[#EAF4FF] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center px-4 py-3 rounded-xl bg-[#00D4FF] text-[#0B3D91] font-semibold shadow-lg shadow-[#00D4FF]/20 mt-1"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
