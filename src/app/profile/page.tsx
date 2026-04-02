"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth, signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type SaveStatus = "idle" | "saving" | "saved" | "error";

/* ------------------------------------------------------------------ */
/*  Preset data                                                        */
/* ------------------------------------------------------------------ */

const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #1D9E75 0%, #0d6e52 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f5576c 0%, #ff6a00 100%)",
  "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
  "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
  "linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)",
  "linear-gradient(135deg, #feada6 0%, #f5efef 100%)",
  "linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)",
];

const PRESET_ACCENTS = [
  "#1D9E75",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#14B8A6",
  "#06B6D4",
  "#6366F1",
  "#D946EF",
  "#78716C",
];

const ROLES: { value: Profile["role"]; label: string; desc: string }[] = [
  { value: "creator", label: "Creator", desc: "I build and sell apps" },
  { value: "buyer", label: "Buyer", desc: "I discover and buy apps" },
  { value: "both", label: "Both", desc: "I build and buy apps" },
];

/* ------------------------------------------------------------------ */
/*  Helper components                                                  */
/* ------------------------------------------------------------------ */

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
        status === "saving"
          ? "bg-amber-50 text-amber-600 border border-amber-200"
          : status === "saved"
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-red-50 text-red-600 border border-red-200"
      }`}
    >
      {status === "saving" && (
        <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Error saving"}
    </span>
  );
}

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-black/[0.06] bg-white shadow-sm overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-black/[0.04]">
        <h2 className="text-sm font-semibold text-[#111]">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-muted-foreground mb-1.5">{children}</label>;
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-black/[0.04] ${className}`} />;
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Local form state
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState<Profile["role"]>("buyer");
  const [currentlyBuilding, setCurrentlyBuilding] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [bannerColor, setBannerColor] = useState(PRESET_GRADIENTS[0]);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState("#1D9E75");

  // Upload refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Save timeout ref for auto-dismiss
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  /* ---------------------------------------------------------------- */
  /*  Redirect if not logged in                                        */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  /* ---------------------------------------------------------------- */
  /*  Fetch profile on mount                                           */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (data && !error) {
        setProfile(data);
        setDisplayName(data.display_name ?? "");
        setUsername(data.username ?? "");
        setBio(data.bio ?? "");
        setRole(data.role ?? "buyer");
        setCurrentlyBuilding(data.currently_building ?? "");
        setWebsite(data.website ?? "");
        setTwitter(data.twitter ?? "");
        setBannerUrl(data.banner_url ?? null);
        setBannerColor(data.banner_color ?? PRESET_GRADIENTS[0]);
        setAvatarUrl(data.avatar_url ?? null);
      }
      setProfileLoading(false);
    }

    fetchProfile();
  }, [user]);

  /* ---------------------------------------------------------------- */
  /*  Update helper                                                    */
  /* ---------------------------------------------------------------- */

  const updateProfile = useCallback(
    async (fields: Partial<Profile>) => {
      if (!user) return;
      setSaveStatus("saving");
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      const { error } = await supabase
        .from("profiles")
        .update(fields)
        .eq("id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        setSaveStatus("error");
      } else {
        setSaveStatus("saved");
        setProfile((prev) => (prev ? { ...prev, ...fields } : prev));
      }

      saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    },
    [user]
  );

  /* ---------------------------------------------------------------- */
  /*  File upload helpers                                               */
  /* ---------------------------------------------------------------- */

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    setSaveStatus("saving");
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });

    if (error) {
      console.error("Avatar upload error:", error);
      setSaveStatus("error");
      saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    // Bust cache with timestamp
    const url = `${publicUrl}?t=${Date.now()}`;
    setAvatarUrl(url);
    await updateProfile({ avatar_url: url });
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const ext = file.name.split(".").pop();
    const path = `${user.id}/banner.${ext}`;

    setSaveStatus("saving");
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });

    if (error) {
      console.error("Banner upload error:", error);
      setSaveStatus("error");
      saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    const url = `${publicUrl}?t=${Date.now()}`;
    setBannerUrl(url);
    await updateProfile({ banner_url: url, banner_color: null });
  }

  function selectGradient(gradient: string) {
    setBannerColor(gradient);
    setBannerUrl(null);
    updateProfile({ banner_color: gradient, banner_url: null });
  }

  /* ---------------------------------------------------------------- */
  /*  Sign out                                                         */
  /* ---------------------------------------------------------------- */

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  /* ---------------------------------------------------------------- */
  /*  Initials fallback                                                */
  /* ---------------------------------------------------------------- */

  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "FX";

  /* ---------------------------------------------------------------- */
  /*  Loading / auth guard                                             */
  /* ---------------------------------------------------------------- */

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="relative min-h-screen bg-[#f8f9fa]">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <SkeletonBlock className="h-40 w-full mb-6" />
          <SkeletonBlock className="h-6 w-48 mb-4" />
          <SkeletonBlock className="h-32 w-full mb-4" />
          <SkeletonBlock className="h-32 w-full" />
        </main>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="relative min-h-screen bg-[#f8f9fa]">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <SkeletonBlock className="h-40 w-full rounded-2xl mb-6" />
          <div className="flex items-center gap-4 mb-8">
            <SkeletonBlock className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
          </div>
          <SkeletonBlock className="h-48 w-full rounded-2xl mb-4" />
          <SkeletonBlock className="h-36 w-full rounded-2xl mb-4" />
          <SkeletonBlock className="h-36 w-full rounded-2xl" />
        </main>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-foreground">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 h-[250px] w-[600px] rounded-full blur-[100px] opacity-[0.04]"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111]">Profile Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Customize how you appear on ForgeX
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SaveIndicator status={saveStatus} />
            <Link
              href={`/u/${username || "me"}`}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-sm font-medium text-[#333] hover:bg-black/[0.02] transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View public page
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* ============================================================ */}
          {/*  1. BANNER SECTION                                           */}
          {/* ============================================================ */}
          <SectionCard title="Banner">
            {/* Current banner preview */}
            <div className="relative group mb-5">
              <div
                className="h-36 w-full rounded-2xl overflow-hidden"
                style={
                  bannerUrl
                    ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: bannerColor }
                }
              />
              <button
                onClick={() => bannerInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 group-hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100"
              >
                <span className="rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-[#111] shadow-sm">
                  Upload banner image
                </span>
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
            </div>

            {/* Gradient presets */}
            <FieldLabel>Or choose a gradient</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {PRESET_GRADIENTS.map((g) => (
                <button
                  key={g}
                  onClick={() => selectGradient(g)}
                  className={`h-8 w-12 rounded-lg transition-all ${
                    !bannerUrl && bannerColor === g
                      ? "ring-2 ring-[#1D9E75] ring-offset-2"
                      : "hover:ring-2 hover:ring-black/10 hover:ring-offset-1"
                  }`}
                  style={{ background: g }}
                  title="Select gradient"
                />
              ))}
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  2. AVATAR SECTION                                           */}
          {/* ============================================================ */}
          <SectionCard title="Avatar">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div
                  className="h-20 w-20 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden text-xl font-bold"
                  style={{
                    backgroundColor: avatarUrl ? undefined : `${accentColor}20`,
                    color: avatarUrl ? undefined : accentColor,
                  }}
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/30 transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z" />
                  </svg>
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Click to upload a new avatar.</p>
                <p className="text-xs mt-0.5">Recommended: 256x256px, JPG or PNG</p>
              </div>
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  3. BASIC INFO                                               */}
          {/* ============================================================ */}
          <SectionCard title="Basic Info">
            <div className="space-y-5">
              {/* Display name */}
              <div>
                <FieldLabel>Display name</FieldLabel>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onBlur={() => updateProfile({ display_name: displayName || null })}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-[#111] placeholder:text-muted-foreground/50 focus:border-[#1D9E75]/50 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
                />
              </div>

              {/* Username */}
              <div>
                <FieldLabel>Username</FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center rounded-xl border border-black/[0.08] bg-white overflow-hidden focus-within:border-[#1D9E75]/50 focus-within:ring-2 focus-within:ring-[#1D9E75]/10 transition-all">
                    <span className="pl-4 text-sm text-muted-foreground/60 select-none">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      onBlur={() => updateProfile({ username })}
                      placeholder="username"
                      className="flex-1 bg-transparent px-1 py-2.5 text-sm text-[#111] placeholder:text-muted-foreground/50 focus:outline-none"
                    />
                  </div>
                </div>
                {username && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    forgex.com/u/{username}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel>Bio</FieldLabel>
                  <span
                    className={`text-xs ${
                      bio.length > 200 ? "text-red-500 font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {bio.length}/200
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setBio(e.target.value);
                  }}
                  onBlur={() => updateProfile({ bio: bio || null })}
                  rows={3}
                  placeholder="Tell people about yourself..."
                  className="w-full resize-none rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-[#111] placeholder:text-muted-foreground/50 focus:border-[#1D9E75]/50 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
                />
              </div>

              {/* Role */}
              <div>
                <FieldLabel>Role</FieldLabel>
                <div className="grid grid-cols-3 gap-3">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => {
                        setRole(r.value);
                        updateProfile({ role: r.value });
                      }}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        role === r.value
                          ? "border-[#1D9E75] bg-[#1D9E75]/5 ring-1 ring-[#1D9E75]/20"
                          : "border-black/[0.08] bg-white hover:border-black/[0.15]"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          role === r.value ? "text-[#1D9E75]" : "text-[#111]"
                        }`}
                      >
                        {r.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  4. STATUS                                                   */}
          {/* ============================================================ */}
          <SectionCard title="Status">
            <div>
              <FieldLabel>Currently building</FieldLabel>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={currentlyBuilding}
                  onChange={(e) => setCurrentlyBuilding(e.target.value)}
                  onBlur={() => updateProfile({ currently_building: currentlyBuilding || null })}
                  placeholder="What are you working on?"
                  className="flex-1 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-[#111] placeholder:text-muted-foreground/50 focus:border-[#1D9E75]/50 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/10 transition-all"
                />
              </div>
              {currentlyBuilding && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1.5">Preview:</p>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium"
                    style={{
                      borderColor: `${accentColor}30`,
                      backgroundColor: `${accentColor}08`,
                      color: accentColor,
                    }}
                  >
                    Currently building: <strong>{currentlyBuilding}</strong>
                  </span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  5. SOCIAL LINKS                                             */}
          {/* ============================================================ */}
          <SectionCard title="Social Links">
            <div className="space-y-4">
              {/* Website */}
              <div>
                <FieldLabel>Website</FieldLabel>
                <div className="flex items-center rounded-xl border border-black/[0.08] bg-white overflow-hidden focus-within:border-[#1D9E75]/50 focus-within:ring-2 focus-within:ring-[#1D9E75]/10 transition-all">
                  <span className="pl-4 text-sm text-muted-foreground/60 select-none">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </span>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    onBlur={() => updateProfile({ website: website || null })}
                    placeholder="https://yoursite.com"
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[#111] placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Twitter */}
              <div>
                <FieldLabel>Twitter / X</FieldLabel>
                <div className="flex items-center rounded-xl border border-black/[0.08] bg-white overflow-hidden focus-within:border-[#1D9E75]/50 focus-within:ring-2 focus-within:ring-[#1D9E75]/10 transition-all">
                  <span className="pl-4 text-sm text-muted-foreground/60 select-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value.replace("@", ""))}
                    onBlur={() => updateProfile({ twitter: twitter || null })}
                    placeholder="handle"
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[#111] placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* GitHub (read-only from OAuth) */}
              <div>
                <FieldLabel>GitHub</FieldLabel>
                <div className="flex items-center rounded-xl border border-black/[0.08] bg-black/[0.02] overflow-hidden">
                  <span className="pl-4 text-sm text-muted-foreground/60 select-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={user?.user_metadata?.user_name ?? ""}
                    readOnly
                    placeholder="Connected via OAuth"
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none cursor-default"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Automatically detected from your login provider.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  6. ACCENT COLOR                                             */}
          {/* ============================================================ */}
          <SectionCard title="Profile Accent Color">
            <div>
              <FieldLabel>Pick a color for your profile accents</FieldLabel>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {PRESET_ACCENTS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setAccentColor(c);
                      // accent_color not in DB schema, so this is local-only / cosmetic
                    }}
                    className={`h-9 w-9 rounded-full transition-all ${
                      accentColor === c
                        ? "ring-2 ring-offset-2"
                        : "hover:ring-2 hover:ring-offset-1 hover:ring-black/10"
                    }`}
                    style={{
                      backgroundColor: c,
                      ...(accentColor === c ? { outline: `2px solid ${c}`, outlineOffset: "2px" } : {}),
                    }}
                    title={c}
                  />
                ))}
              </div>
              {/* Preview */}
              <div className="mt-4 p-4 rounded-xl border border-black/[0.06] bg-black/[0.01]">
                <p className="text-xs text-muted-foreground mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111]">{displayName || "Your Name"}</p>
                    <p className="text-xs" style={{ color: accentColor }}>
                      @{username || "username"}
                    </p>
                  </div>
                  <span
                    className="ml-auto rounded-lg px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${accentColor}10`,
                      color: accentColor,
                      border: `1px solid ${accentColor}30`,
                    }}
                  >
                    {role === "both" ? "Creator & Buyer" : role === "creator" ? "Creator" : "Buyer"}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ============================================================ */}
          {/*  7. DANGER ZONE                                              */}
          {/* ============================================================ */}
          <div className="rounded-2xl border border-red-200/60 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100">
              <h2 className="text-sm font-semibold text-red-600">Danger Zone</h2>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#111]">Sign out</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sign out of your ForgeX account on this device.
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-10" />
      </main>

      <Footer />
    </div>
  );
}
