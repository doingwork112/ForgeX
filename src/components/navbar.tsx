"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [profile, setProfile] = useState<{ username: string; display_name: string | null; avatar_url: string | null } | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const links = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/hunters", label: "Request App" },
    { href: "/community", label: "Community" },
  ];

  // Fetch profile when user logs in
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [user]);

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

  async function handleSignOut() {
    await signOut();
    setAvatarOpen(false);
    router.push("/");
    router.refresh();
  }

  const initials = profile?.display_name
    ? profile.display_name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "FX";

  return (
    <nav className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f8f9fa]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image src="/forgex-logo-v2.png" alt="ForgeX" width={100} height={32} className="h-8 w-auto" />
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
          {!loading && (
            user ? (
              <>
                {/* Dashboard icon */}
                <Link href="/dashboard" className="hidden md:block">
                  <button className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-[#111] hover:bg-black/[0.04] transition-colors" title="Dashboard">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </Link>

                {/* Avatar dropdown */}
                <div ref={avatarRef} className="relative hidden md:block">
                  <button
                    onClick={() => setAvatarOpen((v) => !v)}
                    className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-[#1D9E75]/15 text-xs font-bold text-[#1D9E75] hover:ring-2 hover:ring-[#1D9E75]/30 transition-all"
                  >
                    {profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                    ) : initials}
                  </button>

                  {avatarOpen && (
                    <div className="absolute right-0 top-10 z-50 w-52 rounded-2xl border border-black/[0.08] bg-white shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-black/[0.06]">
                        <p className="text-sm font-semibold text-[#111]">{profile?.display_name ?? "User"}</p>
                        <p className="text-xs text-muted-foreground">@{profile?.username ?? "..."}</p>
                      </div>
                      <div className="py-1.5">
                        {[
                          { href: "/profile", icon: "👤", label: "Profile Settings" },
                          { href: `/u/${profile?.username ?? "me"}`, icon: "🌐", label: "Public Page" },
                          { href: "/dashboard", icon: "📊", label: "Dashboard" },
                          { href: "/dashboard/orders", icon: "📦", label: "Orders" },
                          { href: "/sell/new", icon: "➕", label: "List an App" },
                        ].map(({ href, icon, label }) => (
                          <Link key={href} href={href} onClick={() => setAvatarOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#333] hover:bg-black/[0.04] transition-colors">
                            <span className="text-base">{icon}</span>{label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-black/[0.06] py-1.5">
                        <button onClick={handleSignOut}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-black/[0.04] transition-colors">
                          <span className="text-base">🚪</span>Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-[#111] hover:bg-black/[0.04] transition-colors">
                  Sign in
                </Link>
                <Link href="/auth/signup"
                  className="rounded-xl bg-[#1D9E75] px-4 py-2 text-sm font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_2px_12px_rgba(29,158,117,0.25)]">
                  Get started
                </Link>
              </div>
            )
          )}

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-[#111] hover:bg-black/[0.04] transition-colors md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-black/[0.06] bg-[#f8f9fa]/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-[#111] bg-black/[0.05] font-medium"
                    : "text-muted-foreground hover:text-[#111] hover:bg-black/[0.04]"
                }`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-[#111] hover:bg-black/[0.04]">Dashboard</Link>
                <button onClick={handleSignOut} className="rounded-md px-3 py-2 text-sm text-left text-muted-foreground hover:text-[#111] hover:bg-black/[0.04]">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-[#111] hover:bg-black/[0.04]">Sign in</Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-bold text-[#1D9E75]">Get started →</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
