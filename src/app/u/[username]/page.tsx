"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type App = Database["public"]["Tables"]["apps"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Bounty = Database["public"]["Tables"]["bounties"]["Row"];

interface PostWithAuthor {
  id: string;
  author_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  author_name?: string;
  author_username?: string;
  author_avatar?: string | null;
  reply_count?: number;
}

interface FollowUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

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

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  draft: "bg-gray-50 text-gray-600 border-gray-200",
  paused: "bg-amber-50 text-amber-700 border-amber-200",
  open: "bg-blue-50 text-blue-700 border-blue-200",
  claimed: "bg-purple-50 text-purple-700 border-purple-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  deposit_paid: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  refunded: "bg-red-50 text-red-600 border-red-200",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-black/[0.06] ${className}`} />;
}

function SaveBadge({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
  if (status === "idle") return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg ${
        status === "saving" ? "bg-amber-50 text-amber-700 border border-amber-200"
          : status === "saved" ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}>
        {status === "saving" && (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Error — check console"}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {label}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="text-3xl opacity-30">{icon}</span>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Follow List Modal                                                  */
/* ------------------------------------------------------------------ */

function FollowModal({
  title,
  users,
  onClose,
}: {
  title: string;
  users: FollowUser[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-black/[0.08] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
          <h3 className="text-sm font-semibold text-[#111]">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/[0.04] transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No one yet</p>
          ) : (
            users.map((u) => (
              <Link key={u.id} href={`/u/${u.username}`} onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 hover:bg-black/[0.02] transition-colors">
                <div className="h-9 w-9 rounded-full bg-[#1D9E75]/15 flex items-center justify-center text-xs font-bold text-[#1D9E75] overflow-hidden shrink-0">
                  {u.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    u.username.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#111] truncate">{u.display_name || u.username}</p>
                  <p className="text-xs text-gray-500">@{u.username}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { user, loading: authLoading } = useAuth();

  // Profile data
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Editable fields
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [currentlyBuilding, setCurrentlyBuilding] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [bannerColor, setBannerColor] = useState(GRADIENT_PRESETS[0]);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [role, setRole] = useState<Profile["role"]>("buyer");

  // Tab data
  const [activeTab, setActiveTab] = useState<"posts" | "replies" | "selling" | "bounties" | "sales">("posts");
  const [myApps, setMyApps] = useState<App[]>([]);
  const [myBounties, setMyBounties] = useState<Bounty[]>([]);
  const [mySales, setMySales] = useState<(Order & { app_name?: string })[]>([]);
  const [myPosts, setMyPosts] = useState<PostWithAuthor[]>([]);
  const [myReplies, setMyReplies] = useState<PostWithAuthor[]>([]);
  const [tabLoading, setTabLoading] = useState(true);

  // Follow data
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followModalType, setFollowModalType] = useState<"followers" | "following" | null>(null);
  const [followModalUsers, setFollowModalUsers] = useState<FollowUser[]>([]);
  const [followModalLoading, setFollowModalLoading] = useState(false);

  // New post
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);

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
        // If the logged-in user matches the URL username, auto-create their profile
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser && params.username) {
          const { data: created } = await supabase
            .from("profiles")
            .upsert({
              id: currentUser.id,
              username: params.username,
              display_name: params.username,
              role: "buyer" as const,
            })
            .select()
            .single();
          if (created) {
            setProfile(created);
            setDisplayName(created.display_name ?? "");
            setBio(created.bio ?? "");
            setCurrentlyBuilding(created.currently_building ?? "");
            setWebsite(created.website ?? "");
            setTwitter(created.twitter ?? "");
            setBannerColor(created.banner_color ?? GRADIENT_PRESETS[0]);
            setBannerUrl(created.banner_url ?? null);
            setAvatarUrl(created.avatar_url ?? null);
            setRole(created.role ?? "buyer");
            setProfileLoading(false);
            fetchTabData(created.id);
            fetchFollowCounts(created.id);
            return;
          }
        }
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

      fetchTabData(data.id);
      fetchFollowCounts(data.id);
    }

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.username]);

  /* ---------------------------------------------------------------- */
  /*  Fetch tab data                                                   */
  /* ---------------------------------------------------------------- */

  async function fetchTabData(userId: string) {
    setTabLoading(true);

    const [appsRes, bountiesRes, salesRes, postsRes, repliesRes] = await Promise.all([
      supabase.from("apps").select("*").eq("seller_id", userId).order("created_at", { ascending: false }),
      supabase.from("bounties").select("*").eq("poster_id", userId).order("created_at", { ascending: false }),
      supabase.from("orders").select("*").eq("seller_id", userId).order("created_at", { ascending: false }),
      supabase.from("posts").select("*").eq("author_id", userId).is("parent_id", null).order("created_at", { ascending: false }),
      supabase.from("posts").select("*").eq("author_id", userId).not("parent_id", "is", null).order("created_at", { ascending: false }),
    ]);

    setMyApps(appsRes.data ?? []);
    setMyBounties(bountiesRes.data ?? []);
    setMyPosts((postsRes.data ?? []) as PostWithAuthor[]);
    setMyReplies((repliesRes.data ?? []) as PostWithAuthor[]);

    // Enrich orders with app names
    const orders = salesRes.data ?? [];
    if (orders.length > 0) {
      const appIds = Array.from(new Set(orders.map((o) => o.app_id)));
      const { data: appNames } = await supabase.from("apps").select("id, name").in("id", appIds);
      const appMap = new Map((appNames ?? []).map((a) => [a.id, a.name]));
      setMySales(orders.map((o) => ({ ...o, app_name: appMap.get(o.app_id) ?? "Unknown" })));
    } else {
      setMySales([]);
    }

    setTabLoading(false);
  }

  /* ---------------------------------------------------------------- */
  /*  Follow system                                                    */
  /* ---------------------------------------------------------------- */

  async function fetchFollowCounts(userId: string) {
    const [followersRes, followingRes] = await Promise.all([
      supabase.from("follows").select("id", { count: "exact", head: true }).eq("following_id", userId),
      supabase.from("follows").select("id", { count: "exact", head: true }).eq("follower_id", userId),
    ]);
    setFollowerCount(followersRes.count ?? 0);
    setFollowingCount(followingRes.count ?? 0);
  }

  // Check if current user follows this profile
  useEffect(() => {
    if (!user || !profile || user.id === profile.id) return;
    supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", profile.id)
      .maybeSingle()
      .then(({ data }) => setIsFollowing(!!data));
  }, [user, profile]);

  async function toggleFollow() {
    if (!user || !profile) return;
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", profile.id);
      setIsFollowing(false);
      setFollowerCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from("follows").insert({ id: crypto.randomUUID(), follower_id: user.id, following_id: profile.id });
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }
  }

  async function openFollowModal(type: "followers" | "following") {
    if (!profile) return;
    setFollowModalType(type);
    setFollowModalLoading(true);
    setFollowModalUsers([]);

    const column = type === "followers" ? "following_id" : "follower_id";
    const joinColumn = type === "followers" ? "follower_id" : "following_id";

    const { data: followRows } = await supabase.from("follows").select(joinColumn).eq(column, profile.id);
    const userIds = (followRows ?? []).map((r: Record<string, string>) => r[joinColumn]);

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", userIds);
      setFollowModalUsers(profiles ?? []);
    }
    setFollowModalLoading(false);
  }

  /* ---------------------------------------------------------------- */
  /*  Create post                                                      */
  /* ---------------------------------------------------------------- */

  async function handleCreatePost() {
    if (!newPostContent.trim() || !user || !profile) return;
    setPosting(true);
    const { data, error } = await supabase
      .from("posts")
      .insert({ id: crypto.randomUUID(), author_id: user.id, content: newPostContent.trim(), parent_id: null })
      .select()
      .single();

    if (!error && data) {
      setMyPosts((prev) => [data as PostWithAuthor, ...prev]);
      setNewPostContent("");
    }
    setPosting(false);
  }

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
  /*  Upload helpers — instant local preview                           */
  /* ---------------------------------------------------------------- */

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const localUrl = URL.createObjectURL(file);
    setAvatarUrl(localUrl);

    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    setSaveStatus("saving");
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      console.error("Avatar upload error:", error);
      setSaveStatus("error");
      saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const remoteUrl = `${publicUrl}?t=${Date.now()}`;
    setAvatarUrl(remoteUrl);
    await saveField({ avatar_url: remoteUrl });
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const localUrl = URL.createObjectURL(file);
    setBannerUrl(localUrl);
    setShowBannerPicker(false);

    const ext = file.name.split(".").pop();
    const path = `${user.id}/banner.${ext}`;
    setSaveStatus("saving");
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      console.error("Banner upload error:", error);
      setSaveStatus("error");
      saveTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    const remoteUrl = `${publicUrl}?t=${Date.now()}`;
    setBannerUrl(remoteUrl);
    await saveField({ banner_url: remoteUrl, banner_color: null });
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
  const totalSales = mySales.filter((o) => o.status === "completed").length;
  const totalRevenue = mySales.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.total_price, 0);

  /* ---------------------------------------------------------------- */
  /*  Loading / 404                                                    */
  /* ---------------------------------------------------------------- */

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <Navbar />
        <SkeletonBlock className="h-48 w-full rounded-none" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative -mt-12 mb-6 flex items-end gap-4">
            <SkeletonBlock className="h-24 w-24 rounded-full shrink-0" />
            <div className="space-y-2 pb-2"><SkeletonBlock className="h-6 w-40" /><SkeletonBlock className="h-4 w-24" /></div>
          </div>
          <SkeletonBlock className="h-4 w-64 mb-3" /><SkeletonBlock className="h-20 w-full mb-6" />
          <SkeletonBlock className="h-10 w-full mb-4" /><SkeletonBlock className="h-48 w-full" />
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
          <p className="text-sm text-gray-500">No user with the username <strong>@{params.username}</strong> exists.</p>
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
                className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-medium text-[#111] shadow-md hover:shadow-lg transition-all border border-black/[0.08]"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Banner
              </button>

              {showBannerPicker && (
                <div className="absolute right-0 top-12 z-20 w-72 rounded-2xl border border-black/[0.08] bg-white p-4 shadow-xl">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Choose gradient</p>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {GRADIENT_PRESETS.map((g, i) => (
                      <button key={i} onClick={() => selectGradient(g)}
                        className={`h-10 w-full rounded-xl transition-all hover:scale-105 ${!bannerUrl && bannerColor === g ? "ring-2 ring-offset-2 ring-[#1D9E75]" : ""}`}
                        style={{ background: g }} />
                    ))}
                  </div>
                  <div className="border-t border-black/[0.06] pt-3">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Or upload an image</p>
                    <button onClick={() => bannerInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/[0.12] py-2.5 text-xs text-gray-500 hover:border-[#1D9E75]/40 hover:text-[#1D9E75] transition-colors">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
          {/*  AVATAR ROW                                                  */}
          {/* ============================================================ */}
          <div className="relative -mt-12 mb-6 flex items-end justify-between">
            {/* Avatar */}
            <div className="relative group">
              <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden text-2xl font-bold"
                style={{ backgroundColor: avatarUrl ? undefined : "#1D9E7520", color: avatarUrl ? undefined : "#1D9E75" }}>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : initials}
              </div>
              {isOwner && (
                <button onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" title="Change avatar">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Follow button (for non-owner) */}
            {!isOwner && user && (
              <button onClick={toggleFollow}
                className={`mb-1 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  isFollowing
                    ? "border border-[#1D9E75]/30 bg-[#1D9E75]/10 text-[#1D9E75] hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    : "bg-[#1D9E75] text-white hover:bg-[#178c66] shadow-[0_0_16px_rgba(29,158,117,0.3)]"
                }`}>
                {isFollowing ? "Following" : "+ Follow"}
              </button>
            )}
          </div>

          {/* ============================================================ */}
          {/*  PROFILE INFO                                                */}
          {/* ============================================================ */}
          <div className="mb-6 space-y-3">
            {/* Name */}
            <div>
              {isOwner && editingName ? (
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} autoFocus
                  className="text-2xl font-bold text-[#111] bg-transparent border-b-2 border-[#1D9E75] focus:outline-none w-auto"
                  onKeyDown={(e) => { if (e.key === "Enter") { setEditingName(false); saveField({ display_name: displayName || null }); } }}
                  onBlur={() => { setEditingName(false); saveField({ display_name: displayName || null }); }} />
              ) : (
                <div className="flex items-center gap-2 group/name">
                  <h1 className="text-2xl font-bold text-[#111]">{displayName || params.username}</h1>
                  {isOwner && <button onClick={() => setEditingName(true)} className="opacity-0 group-hover/name:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/[0.04]"><PencilIcon /></button>}
                </div>
              )}
              <p className="text-sm text-gray-500">@{params.username}</p>
            </div>

            {/* Role + Followers/Following */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex rounded-full border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-3 py-1 text-xs font-medium text-[#1D9E75]">
                {role === "both" ? "Creator & Buyer" : role === "creator" ? "Creator" : "Buyer"}
              </span>
              <button onClick={() => openFollowModal("followers")} className="text-sm hover:underline transition-colors">
                <strong className="text-[#111]">{followerCount}</strong> <span className="text-gray-500">Followers</span>
              </button>
              <button onClick={() => openFollowModal("following")} className="text-sm hover:underline transition-colors">
                <strong className="text-[#111]">{followingCount}</strong> <span className="text-gray-500">Following</span>
              </button>
            </div>

            {/* Bio */}
            <div className="group/bio">
              {isOwner && editingBio ? (
                <div className="space-y-2">
                  <textarea value={bio} onChange={(e) => { if (e.target.value.length <= 200) setBio(e.target.value); }} autoFocus rows={3} placeholder="Tell people about yourself..."
                    className="w-full max-w-lg resize-none rounded-xl border border-[#1D9E75]/30 bg-white px-4 py-2.5 text-sm text-[#333] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/10" />
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingBio(false); saveField({ bio: bio || null }); }} className="rounded-lg bg-[#1D9E75] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#178c66]">Save</button>
                    <button onClick={() => { setEditingBio(false); setBio(profile?.bio ?? ""); }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-black/[0.04]">Cancel</button>
                    <span className="text-xs text-gray-400 ml-auto">{bio.length}/200</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  {bio ? <p className="text-sm text-[#333] max-w-lg leading-relaxed">{bio}</p>
                    : isOwner ? <button onClick={() => setEditingBio(true)} className="text-sm text-gray-400 italic hover:text-[#1D9E75]">Click to add a bio...</button> : null}
                  {isOwner && bio && <button onClick={() => setEditingBio(true)} className="opacity-0 group-hover/bio:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/[0.04] shrink-0 mt-0.5"><PencilIcon /></button>}
                </div>
              )}
            </div>

            {/* Currently building */}
            <div className="group/status">
              {isOwner && editingStatus ? (
                <div className="flex items-center gap-2">
                  <input type="text" value={currentlyBuilding} onChange={(e) => setCurrentlyBuilding(e.target.value)} autoFocus placeholder="What are you working on?"
                    className="rounded-lg border border-[#1D9E75]/30 bg-white px-3 py-1.5 text-xs text-[#111] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/10 w-64"
                    onKeyDown={(e) => { if (e.key === "Enter") { setEditingStatus(false); saveField({ currently_building: currentlyBuilding || null }); } }} />
                  <button onClick={() => { setEditingStatus(false); saveField({ currently_building: currentlyBuilding || null }); }} className="rounded-lg bg-[#1D9E75] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#178c66]">Save</button>
                  <button onClick={() => { setEditingStatus(false); setCurrentlyBuilding(profile?.currently_building ?? ""); }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-black/[0.04]">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {currentlyBuilding ? (
                    <span className="inline-flex items-center gap-2 rounded-lg border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-3 py-1.5 text-xs text-[#1D9E75]">
                      Currently building: <strong>{currentlyBuilding}</strong>
                    </span>
                  ) : isOwner ? <button onClick={() => setEditingStatus(true)} className="text-xs text-gray-400 italic hover:text-[#1D9E75]">+ Set what you&apos;re building</button> : null}
                  {isOwner && currentlyBuilding && <button onClick={() => setEditingStatus(true)} className="opacity-0 group-hover/status:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/[0.04]"><PencilIcon /></button>}
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="group/links">
              {isOwner && editingLinks ? (
                <div className="space-y-3 max-w-md">
                  <div className="flex items-center rounded-xl border border-black/[0.08] bg-white overflow-hidden focus-within:border-[#1D9E75]/30 focus-within:ring-2 focus-within:ring-[#1D9E75]/10">
                    <span className="pl-3 text-gray-400"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg></span>
                    <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yoursite.com" className="flex-1 bg-transparent px-3 py-2 text-sm text-[#111] placeholder:text-gray-400 focus:outline-none" />
                  </div>
                  <div className="flex items-center rounded-xl border border-black/[0.08] bg-white overflow-hidden focus-within:border-[#1D9E75]/30 focus-within:ring-2 focus-within:ring-[#1D9E75]/10">
                    <span className="pl-3 text-gray-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></span>
                    <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value.replace("@", ""))} placeholder="twitter handle" className="flex-1 bg-transparent px-3 py-2 text-sm text-[#111] placeholder:text-gray-400 focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingLinks(false); saveField({ website: website || null, twitter: twitter || null }); }} className="rounded-lg bg-[#1D9E75] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#178c66]">Save</button>
                    <button onClick={() => { setEditingLinks(false); setWebsite(profile?.website ?? ""); setTwitter(profile?.twitter ?? ""); }} className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-black/[0.04]">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  {website && <a href={website.startsWith("http") ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111] transition-colors"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>{website.replace(/^https?:\/\//, "")}</a>}
                  {twitter && <a href={`https://x.com/${twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111] transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>@{twitter}</a>}
                  {githubUsername && <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111] transition-colors"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>{githubUsername}</a>}
                  {isOwner && !website && !twitter && <button onClick={() => setEditingLinks(true)} className="text-xs text-gray-400 italic hover:text-[#1D9E75]">+ Add links</button>}
                  {isOwner && (website || twitter) && <button onClick={() => setEditingLinks(true)} className="opacity-0 group-hover/links:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/[0.04]"><PencilIcon /></button>}
                </div>
              )}
            </div>

            {/* Member since */}
            {profile?.created_at && (
              <p className="text-xs text-gray-400">Member since {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            )}
          </div>

          {/* ============================================================ */}
          {/*  TABS                                                        */}
          {/* ============================================================ */}
          <div className="flex gap-1 border-b border-black/[0.06] mb-6 overflow-x-auto">
            {([
              { key: "posts" as const, label: "Posts", count: myPosts.length },
              { key: "replies" as const, label: "Replies", count: myReplies.length },
              { key: "selling" as const, label: "Selling", count: myApps.length },
              { key: "bounties" as const, label: "Bounties", count: myBounties.length },
              { key: "sales" as const, label: "Sales", count: mySales.length },
            ]).map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key ? "border-[#1D9E75] text-[#1D9E75]" : "border-transparent text-gray-500 hover:text-[#111]"
                }`}>
                {tab.label}
                <span className="ml-1.5 text-xs opacity-60">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* ============================================================ */}
          {/*  TAB CONTENT                                                 */}
          {/* ============================================================ */}
          <div className="pb-16">
            {tabLoading ? (
              <div className="space-y-4"><SkeletonBlock className="h-24 w-full" /><SkeletonBlock className="h-24 w-full" /></div>
            ) : (
              <>
                {/* ---- POSTS ---- */}
                {activeTab === "posts" && (
                  <div className="space-y-4">
                    {/* New post composer (owner only) */}
                    {isOwner && (
                      <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
                        <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="What&apos;s on your mind?"
                          rows={3}
                          className="w-full resize-none rounded-xl border border-black/[0.08] bg-[#f8f9fa] px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-[#1D9E75]/30 focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/10 transition-all" />
                        <div className="flex justify-end mt-3">
                          <button onClick={handleCreatePost} disabled={!newPostContent.trim() || posting}
                            className="rounded-full bg-[#1D9E75] px-5 py-2 text-sm font-semibold text-white hover:bg-[#178c66] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            {posting ? "Posting..." : "Post"}
                          </button>
                        </div>
                      </div>
                    )}

                    {myPosts.length === 0 && !isOwner ? (
                      <EmptyState icon="📝" text="No posts yet" />
                    ) : myPosts.length === 0 && isOwner ? (
                      <p className="text-center text-sm text-gray-400 py-8">Write your first post above!</p>
                    ) : (
                      myPosts.map((post) => (
                        <div key={post.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-8 w-8 rounded-full bg-[#1D9E75]/15 flex items-center justify-center text-xs font-bold text-[#1D9E75] overflow-hidden">
                              {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                              ) : initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#111]">{displayName || params.username}</p>
                              <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-[#333] leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ---- REPLIES ---- */}
                {activeTab === "replies" && (
                  myReplies.length === 0 ? (
                    <EmptyState icon="💬" text="No replies yet" />
                  ) : (
                    <div className="space-y-4">
                      {myReplies.map((reply) => (
                        <div key={reply.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-8 w-8 rounded-full bg-[#1D9E75]/15 flex items-center justify-center text-xs font-bold text-[#1D9E75] overflow-hidden">
                              {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                              ) : initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#111]">{displayName || params.username}</p>
                              <p className="text-xs text-gray-400">{timeAgo(reply.created_at)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-[#333] leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                          <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-black/[0.04]">Replying to a post</p>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* ---- SELLING ---- */}
                {activeTab === "selling" && (
                  myApps.length === 0 ? (
                    <EmptyState icon="🏪" text="Nothing listed for sale yet" />
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {myApps.map((app) => (
                        <Link key={app.id} href={`/marketplace/${app.id}`}>
                          <div className="group rounded-2xl border border-black/[0.06] bg-white p-5 hover:border-[#1D9E75]/30 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <div className="min-w-0">
                                <h3 className="text-sm font-semibold text-[#111] group-hover:text-[#1D9E75] transition-colors">{app.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{app.tagline}</p>
                              </div>
                              <StatusBadge status={app.status} />
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04]">
                              <p className="text-sm font-bold text-[#1D9E75]">${app.price_basic}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><span className="text-yellow-400">&#9733;</span> {app.rating}</span>
                                <span>{app.sold} sold</span>
                              </div>
                            </div>
                            {app.category && <span className="inline-block mt-2 rounded-full bg-black/[0.03] px-2.5 py-0.5 text-[11px] text-gray-500">{app.category}</span>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                )}

                {/* ---- BOUNTIES ---- */}
                {activeTab === "bounties" && (
                  myBounties.length === 0 ? (
                    <EmptyState icon="🎯" text="No bounties posted yet" />
                  ) : (
                    <div className="space-y-4">
                      {myBounties.map((bounty) => (
                        <div key={bounty.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-[#111]">{bounty.title}</h3>
                              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{bounty.description}</p>
                            </div>
                            <StatusBadge status={bounty.status} />
                          </div>
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-black/[0.04] text-xs text-gray-500">
                            <span className="font-semibold text-[#1D9E75]">${bounty.budget} budget</span>
                            <span>{bounty.category}</span>
                            <span>{timeAgo(bounty.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* ---- SALES ---- */}
                {activeTab === "sales" && (
                  mySales.length === 0 ? (
                    <EmptyState icon="💰" text="No sales yet" />
                  ) : (
                    <div className="space-y-3">
                      {totalSales > 0 && (
                        <div className="rounded-2xl border border-black/[0.06] bg-white p-5 flex items-center gap-8 mb-2">
                          <div>
                            <p className="text-2xl font-bold text-[#111]">${(totalRevenue / 100).toFixed(2)}</p>
                            <p className="text-xs text-gray-500">Total Revenue</p>
                          </div>
                          <div className="h-8 w-px bg-black/[0.06]" />
                          <div>
                            <p className="text-2xl font-bold text-[#111]">{totalSales}</p>
                            <p className="text-xs text-gray-500">Completed</p>
                          </div>
                        </div>
                      )}
                      {mySales.map((order) => (
                        <div key={order.id} className="rounded-2xl border border-black/[0.06] bg-white p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-semibold text-[#111]">{order.app_name}</h3>
                              <p className="text-xs text-gray-500 mt-0.5">{order.plan === "custom" ? "Custom" : "Basic"} &middot; #{order.id.slice(0, 8)}</p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-black/[0.04] text-xs text-gray-500">
                            <span className="font-semibold text-[#111]">${(order.total_price / 100).toFixed(2)}</span>
                            <span>Deposit: ${(order.deposit_paid / 100).toFixed(2)}</span>
                            <span className="ml-auto">{timeAgo(order.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <SaveBadge status={saveStatus} />

      {/* Follow modal */}
      {followModalType && (
        <FollowModal
          title={followModalType === "followers" ? "Followers" : "Following"}
          users={followModalLoading ? [] : followModalUsers}
          onClose={() => setFollowModalType(null)}
        />
      )}
    </div>
  );
}
