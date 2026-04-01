"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/hunters", label: "Hunters" },
    { href: "/sell", label: "Sell" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-8">
          <Link href="/home" className="flex items-center">
            <Image
              src="/forgex-logo-v2.png"
              alt="ForgeX"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-white bg-white/8"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <button
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              title="Dashboard"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </Link>
          <Button
            size="sm"
            className="hidden bg-accent text-white hover:bg-accent/90 md:inline-flex"
          >
            Sign in
          </Button>
          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-white hover:bg-white/5 transition-colors md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-[#0a0a0a]/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-white bg-white/8"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                pathname.startsWith("/dashboard")
                  ? "text-white bg-white/8"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              Dashboard
            </Link>
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <Button size="sm" className="w-full bg-accent text-white hover:bg-accent/90">
                Sign in
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
