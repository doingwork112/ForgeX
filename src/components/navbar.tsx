"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const links = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/hunters", label: "Hunters" },
    { href: "/sell", label: "Sell" },
    { href: "/community", label: "Community" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f8f9fa]/80 backdrop-blur-xl">
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
                    ? "text-[#111] bg-black/[0.05] font-medium"
                    : "text-muted-foreground hover:text-[#111] hover:bg-black/[0.04]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Dashboard icon */}
          <Link href="/dashboard" className="hidden md:block">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-[#111] hover:bg-black/[0.04] transition-colors"
              title="Dashboard"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </Link>

          {/* Avatar + dropdown */}
          <div ref={avatarRef} className="relative hidden md:block">
            <button
              onClick={() => setAvatarOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D9E75]/15 text-xs font-bold text-[#1D9E75] hover:ring-2 hover:ring-[#1D9E75]/30 transition-all"
            >
              AC
            </button>

            {avatarOpen && (
              <div className="absolute right-0 top-10 z-50 w-52 rounded-2xl border border-black/[0.08] bg-white shadow-xl overflow-hidden">
                {/* User info */}
                <div className="px-4 py-3 border-b border-black/[0.06]">
                  <p className="text-sm font-semibold text-[#111]">Alex Chen</p>
                  <p className="text-xs text-muted-foreground">@alexchen</p>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {[
                    { href: "/profile", icon: "👤", label: "Profile" },
                    { href: "/u/alexchen", icon: "🌐", label: "Public page" },
                    { href: "/dashboard", icon: "📊", label: "Dashboard" },
                    { href: "/dashboard/orders", icon: "📦", label: "Orders" },
                    { href: "/sell/new", icon: "➕", label: "New listing" },
                  ].map(({ href, icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setAvatarOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#333] hover:bg-black/[0.04] transition-colors"
                    >
                      <span className="text-base">{icon}</span>
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-black/[0.06] py-1.5">
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-black/[0.04] transition-colors">
                    <span className="text-base">🚪</span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-[#111] hover:bg-black/[0.04] transition-colors md:hidden"
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
        <div className="border-t border-black/[0.06] bg-[#f8f9fa]/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-[#111] bg-black/[0.05] font-medium"
                    : "text-muted-foreground hover:text-[#111] hover:bg-black/[0.04]"
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
                  ? "text-[#111] bg-black/[0.05] font-medium"
                  : "text-muted-foreground hover:text-[#111] hover:bg-black/[0.04]"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                pathname.startsWith("/profile")
                  ? "text-[#111] bg-black/[0.05] font-medium"
                  : "text-muted-foreground hover:text-[#111] hover:bg-black/[0.04]"
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
