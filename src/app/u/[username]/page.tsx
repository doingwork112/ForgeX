"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const GRADIENT_PRESETS = [
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-black/[0.06] ${className}`} />;
}

function SaveBadge({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
  if (status === "idle") return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg ${
          status === "saving"
            ? "bg-amber-50 text-amber-700 border border-amber-200"
            : status === "saved"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}
      >
        {status === "saving" && (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Error saving"}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { user, loading: authLoading } = useAuth();

  // Profile data from Supabase
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Is the logged-in user the owner of this profile?
  const [isOwner, setIsOwner] = useState(false);

  // Editable fields (local state, synced to DB on save)
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [currentlyBuilding, setCurrentlyBuilding] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [bannerColor, setBannerColor] = useState(GRADIENT_PRESETS[0]);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [role, setRole] = useState<Profile["role"]>("buyer");

  // UI state
  const [showBannerPicker, setShowBannerPicker] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingLinks, setEditingLinks] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Refs
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const bannerPickerRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------------- */
  /*  Fetch profile                                                    */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", params.username)
        .single();

      if (error || !data) {
        setNotFound(true);
        setProfileLoading(false);
        return;
      }

      setProfile(data);
      setDisplayName(data.display_name ?? "");
      setBio(data.bio ?? "");
      setCurrentlyBuilding(data.currently_building ?? "");
      setWebsite(data.website ?? "");
      setTwitter(data.twitter ?? "");
      setBannerColor(data.banner_color ?? GRADIENT_PRESETS[0]);
      setBannerUrl(data.banner_url ?? null);
      setAvatarUrl(data.avatar_url ?? null);
      setRole(data.role ?? "buyer");
      setProfileLoading(false);
    }

    load();
  }, [params.username]);

  /* ---------------------------------------------------------------- */
  /*  Detect ownership                                                 */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (!authLoading && user && profile) {
      setIsOwner(user.id === profile.id);
    }
  }, [authLoading, user, profile]);

  /* ---------------------------------------------------------------- */
  /*  Close banner picker on outside click                             */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bannerPickerRef.current && !bannerPickerRef.current.contains(e.target as Node)) {
        setShowBannerPicker(false);
      }
    }
    if (showBannerPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showBannerPicker]);

  /* ---------------------------------------------------------------- */
  /*  Save helper                                                      */
  /* ---------------------------------------------------------------- */

  const saveField = useCallback(
    async (fields: Partial<Profile>) => {
      if (!user || !profile || user.id !== profile.id) return;
      setSaveStatus("saving");
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      const { error } = await supabase.from("profiles").update(fields).eq("id", user.id);

      if (error) {
        console.error("Save error:", error);
        setSaveStatus("error");
      } else {
        setSaveStatus("saved");
        setProfile((prev) => (prev ? { ...prev, ...fields } : prev));
      }

      saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
    },
    [user, profile]
  );

  /* ---------------------------------------------------------------- */
  /*  Upload helpers                                                   */
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
      saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${publicUrl}?t=${Date.now()}`;
    setAvatarUrl(url);
    await saveField({ avatar_url: url });
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
      saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${publicUrl}?t=${Date.now()}`;
    setBannerUrl(url);
    await saveField({ banner_url: url, banner_color: null });
    setShowBannerPicker(false);
  }

  function selectGradient(gradient: string) {
    setBannerColor(gradient);
    setBannerUrl(null);
    saveField({ banner_color: gradient, banner_url: null });
    setShowBannerPicker(false);
  }

  /* ---------------------------------------------------------------- */
  /*  Derived values                                                   */
  /* ---------------------------------------------------------------- */

  const initials = displayName
    ? displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : params.username.slice(0, 2).toUpperCase();

  const githubUsername = user?.user_metadata?.user_name ?? "";

  /* ---------------------------------------------------------------- */
  /*  Loading state                                                    */
  /* ---------------------------------------------------------------- */

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <Navbar />
        <SkeletonBlock className="h-48 w-full rounded-none" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative -mt-12 mb-6 flex items-end gap-4">
            <SkeletonBlock className="h-24 w-24 rounded-full shrink-0" />
            <div className="space-y-2 pb-2">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
          </div>
          <SkeletonBlock className="h-4 w-64 mb-3" />
          <SkeletonBlock className="h-20 w-full mb-6" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="text-6xl opacity-20">404</div>
          <h1 className="text-xl font-bold text-[#111]">User not found</h1>
          <p className="text-sm text-muted-foreground">
            No user with the username <strong>@{params.username}</strong> exists.
          </p>
          <Link href="/marketplace" className="mt-4 rounded-xl bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#178c66] transition-colors">
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-foreground">
      <Navbar />

      {/* Hidden file inputs */}
      <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

      <main>
        {/* ============================================================ */}
        {/*  BANNER                                                      */}
        {/* ============================================================ */}
        <div className="relative">
          <div
            className="h-48 w-full"
            style={
              bannerUrl
                ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                : { background: bannerColor }
            }
          />

          {isOwner && (
            <div className="absolute right-4 top-4" ref={bannerPickerRef}>
              <button
                onClick={() => setShowBannerPicker(!showBannerPicker)}
                className="flex items-center gap-1.5 rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs text-white hover:bg-white/30 transition-colors border border-white/20"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Banner
              </button>

              {showBannerPicker && (
                <div className="absolute right-0 top-10 z-20 w-72 rounded-2xl border border-black/[0.08] bg-white p-4 shadow-xl">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Choose gradient</p>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {GRADIENT_PRESETS.map((g, i) => (
                      <button
                        key={i}
                        onClick={() => selectGradient(g)}
                        className={`h-10 w-full rounded-xl transition-all hover:scale-105 ${
                          !bannerUrl && bannerColor === g ? "ring-2 ring-offset-2 ring-[#1D9E75]" : ""
                        }`}
                        style={{ background: g }}
                      />
                    ))}
                  </div>
                  <div className="border-t border-black/[0.06] pt-3">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Or upload an image</p>
                    <button
                      onClick={() => bannerInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/[0.12] py-2.5 text-xs text-gray-500 hover:border-[#1D9E75]/40 hover:text-[#1D9E75] transition-colors"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* ============================================================ */}
          {/*  AVATAR + NAME ROW                                           */}
          {/* ============================================================ */}
          <div className="relative -mt-12 mb-6 flex items-end justify-between">
            {/* Avatar */}
            <div className="relative group">
              <div
                className="h-24 w-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden text-2xl font-bold"
                style={{
                  backgroundColor: avatarUrl ? undefined : "#1D9E7520",
                  color: avatarUrl ? undefined : "#1D9E75",
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              {isOwner && (
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Change avatar"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pb-1">
              {isOwner && (
                <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-gray-500">
                  This is your page
                </span>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/*  PROFILE INFO                                                */}
          {/* ============================================================ */}
          <div className="mb-8 space-y-3">
            {/* Display name */}
            <div>
              {isOwner && editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoFocus
                    className="text-2xl font-bold text-[#111] bg-transparent border-b-2 border-[#1D9E75] focus:outline-none w-auto"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditingName(false);
                        saveField({ display_name: displayName || null });
                      }
                    }}
                    onBlur={() => {
                      setEditingName(false);
                      saveField({ display_name: displayName || null });
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 group/name">
                  <h1 className="text-2xl font-bold text-[#111]">
                    {displayName || params.username}
                  </h1>
                  {isOwner && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="opacity-0 group-hover/name:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/[0.04]"
                      title="Edit name"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500">@{params.username}</p>
            </div>

            {/* Role badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-3 py-1 text-xs font-medium text-[#1D9E75]">
                {role === "both" ? "Creator & Buyer" : role === "creator" ? "Creator" : "Buyer"}
              </span>
            </div>

            {/* Bio */}
            <div className="group/bio">
              {isOwner && editingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={bio}
                    onChange={(e) => { if (e.target.value.length <= 200) setBio(e.target.value); }}
                    autoFocus
                    rows={3}
                    placeholder="Tell people about yourself..."
                    className="w-full max-w-lg resize-none rounded-xl border border-[#1D9E75]/30 bg-white px-4 py-2.5 text-sm text-[#333] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/10"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingBio(false);
                        saveField({ bio: bio || null });
                      }}
                      className="rounded-lg bg-[#1D9E75] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#178c66] transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingBio(false);
                        setBio(profile?.bio ?? "");
                      }}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-black/[0.04] transition-colors"
                    >
                      Cancel
                    </button>
                    <span className="text-xs text-gray-400 ml-auto">{bio.length}/200</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  {bio ? (
                    <p className="text-sm text-[#333] max-w-lg leading-relaxed">{bio}</p>
                  ) : isOwner ? (
                    <p className="text-sm text-gray-400 italic">Click to add a bio...</p>
                  ) : null}
                  {isOwner && (
                    <button
                      onClick={() => setEditingBio(true)}
                      className="opacity-0 group-hover/bio:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/[0.04] shrink-0 mt-0.5"
                      title="Edit bio"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Currently building */}
            <div className="group/status">
              {isOwner && editingStatus ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentlyBuilding}
                    onChange={(e) => setCurrentlyBuilding(e.target.value)}
                    autoFocus
                    placeholder="What are you working on?"
                    className="rounded-lg border border-[#1D9E75]/30 bg-white px-3 py-1.5 text-xs text-[#111] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/10 w-64"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditingStatus(false);
                        saveField({ currently_building: currentlyBuilding || null });
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      setEditingStatus(false);
                      saveField({ currently_building: currentlyBuilding || null });
                    }}
                    className="rounded-lg bg-[#1D9E75] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#178c66] transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingStatus(false);
                      setCurrentlyBuilding(profile?.currently_building ?? "");
                    }}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-black/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {currentlyBuilding ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-3 py-1.5 text-xs text-[#1D9E75]">
                      Currently building: <strong>{currentlyBuilding}</strong>
                    </span>
                  ) : isOwner ? (
                    <span className="text-xs text-gray-400 italic">Click to set what you&apos;re building...</span>
                  ) : null}
                  {isOwner && (
                    <button
                      onClick={() => setEditingStatus(true)}
                      className="opacity-0 group-hover/status:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/[0.04]"
                      title="Edit status"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="group/links">
              {isOwner && editingLinks ? (
                <div className="space-y-3 max-w-md">
                  <div className="flex items-center rounded-xl border border-black/[0.08] bg-white overflow-hidden focus-within:border-[#1D9E75]/30 focus-within:ring-2 focus-within:ring-[#1D9E75]/10">
                    <span className="pl-3 text-gray-400">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </span>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yoursite.com"
                      className="flex-1 bg-transparent px-3 py-2 text-sm text-[#111] placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center rounded-xl border border-black/[0.08] bg-white overflow-hidden focus-within:border-[#1D9E75]/30 focus-within:ring-2 focus-within:ring-[#1D9E75]/10">
                    <span className="pl-3 text-gray-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value.replace("@", ""))}
                      placeholder="twitter handle"
                      className="flex-1 bg-transparent px-3 py-2 text-sm text-[#111] placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingLinks(false);
                        saveField({ website: website || null, twitter: twitter || null });
                      }}
                      className="rounded-lg bg-[#1D9E75] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#178c66] transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingLinks(false);
                        setWebsite(profile?.website ?? "");
                        setTwitter(profile?.twitter ?? "");
                      }}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-black/[0.04] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  {website && (
                    <a href={website.startsWith("http") ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111] transition-colors">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {twitter && (
                    <a href={`https://x.com/${twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111] transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      @{twitter}
                    </a>
                  )}
                  {githubUsername && (
                    <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111] transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      {githubUsername}
                    </a>
                  )}
                  {!website && !twitter && !githubUsername && !isOwner && (
                    <span className="text-gray-400">No links</span>
                  )}
                  {isOwner && (
                    <button
                      onClick={() => setEditingLinks(true)}
                      className="opacity-0 group-hover/links:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/[0.04]"
                      title="Edit links"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                  {isOwner && !website && !twitter && !editingLinks && (
                    <button
                      onClick={() => setEditingLinks(true)}
                      className="text-xs text-gray-400 italic hover:text-[#1D9E75] transition-colors"
                    >
                      + Add links
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Member since */}
            {profile?.created_at && (
              <p className="text-xs text-gray-400">
                Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            )}
          </div>

          {/* ============================================================ */}
          {/*  CONTENT AREA — Placeholder for future tabs                  */}
          {/* ============================================================ */}
          <div className="border-t border-black/[0.06] pt-6 pb-16">
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-black/[0.1] bg-white text-sm text-gray-400">
              More content coming soon — apps, reviews, build log
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <SaveBadge status={saveStatus} />
    </div>
  );
}
