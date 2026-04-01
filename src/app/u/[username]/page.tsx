"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { userProfiles, forgePosts, apps, buyerReviews } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const TAG_COLORS: Record<string, string> = {
  "#buildinpublic": "bg-blue-100 text-blue-700 border-blue-200",
  "#launch": "bg-green-100 text-[#1D9E75] border-green-200",
  "#feedback": "bg-orange-100 text-orange-700 border-orange-200",
  "#collab": "bg-purple-100 text-purple-700 border-purple-200",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const GRADIENT_PRESETS = [
  { id: "g1",  class: "from-[#1D9E75] to-[#0d6e52]",     hex: "#1D9E75" },
  { id: "g2",  class: "from-purple-500 to-pink-500",       hex: "#a855f7" },
  { id: "g3",  class: "from-blue-500 to-cyan-400",         hex: "#3b82f6" },
  { id: "g4",  class: "from-orange-400 to-rose-500",       hex: "#fb923c" },
  { id: "g5",  class: "from-yellow-400 to-orange-500",     hex: "#facc15" },
  { id: "g6",  class: "from-indigo-500 to-purple-600",     hex: "#6366f1" },
  { id: "g7",  class: "from-red-500 to-pink-600",          hex: "#ef4444" },
  { id: "g8",  class: "from-teal-400 to-blue-500",         hex: "#2dd4bf" },
  { id: "g9",  class: "from-pink-400 to-rose-400",         hex: "#f472b6" },
  { id: "g10", class: "from-green-400 to-teal-500",        hex: "#4ade80" },
  { id: "g11", class: "from-slate-700 to-slate-900",       hex: "#334155" },
  { id: "g12", class: "from-amber-400 to-yellow-300",      hex: "#fbbf24" },
  { id: "g13", class: "from-violet-500 to-indigo-600",     hex: "#8b5cf6" },
  { id: "g14", class: "from-sky-400 to-blue-600",          hex: "#38bdf8" },
  { id: "g15", class: "from-fuchsia-500 to-purple-600",    hex: "#d946ef" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= rating ? "#f59e0b" : "none"} stroke={s <= rating ? "#f59e0b" : "#d1d5db"} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const profile = userProfiles.find((u) => u.username === params.username);

  const genericProfile = {
    username: params.username,
    name: params.username.charAt(0).toUpperCase() + params.username.slice(1),
    avatar: params.username.slice(0, 2).toUpperCase(),
    bannerGradient: "from-[#1D9E75] to-[#0d6e52]",
    bio: "Builder on ForgeX.",
    currentlyBuilding: "",
    location: "",
    website: "",
    twitter: "",
    github: "",
    joinedAt: "2026-01-01",
    badges: [] as { id: string; label: string; icon: string; color: string }[],
    appIds: [] as string[],
    stats: { posts: 0, sales: 0, reputation: 0 },
  };

  const user = profile ?? genericProfile;
  const isOwner = user.username === "alexchen";

  const [gradient, setGradient] = useState(GRADIENT_PRESETS.find(g => g.class === user.bannerGradient)?.class ?? GRADIENT_PRESETS[0].class);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "apps" | "reviews">("feed");
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setBannerImage(reader.result as string); setShowGradientPicker(false); };
    reader.readAsDataURL(file);
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarImage(reader.result as string);
    reader.readAsDataURL(file);
  }
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(148);
  const [newComment, setNewComment] = useState("");
  const [reviews, setReviews] = useState(
    buyerReviews.filter(() => user.appIds.some((id) => {
      const app = apps.find((a) => a.id === id);
      return app?.seller.name === user.name;
    }))
  );

  const userPosts = forgePosts.filter((p) => p.authorUsername === user.username);
  const userApps = apps.filter((a) => user.appIds.includes(a.id));

  function toggleFollow() {
    setFollowing((f) => !f);
    setFollowerCount((c) => following ? c - 1 : c + 1);
  }

  function submitComment() {
    if (!newComment.trim()) return;
    const added = {
      id: `rev-new-${Date.now()}`,
      authorName: "You",
      authorAvatar: "YU",
      authorUsername: "you",
      rating: 5,
      content: newComment.trim(),
      appName: userApps[0]?.name ?? "ForgeX",
      createdAt: new Date().toISOString(),
      verified: false,
    };
    setReviews((r) => [added, ...r]);
    setNewComment("");
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-foreground">
      <Navbar />

      <main>
        {/* Hidden file inputs */}
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

        {/* Banner */}
        <div className="relative">
          {bannerImage ? (
            <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${bannerImage})` }} />
          ) : (
            <div className={`h-48 w-full bg-gradient-to-r ${gradient}`} />
          )}
          {isOwner && (
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setShowGradientPicker(!showGradientPicker)}
                className="flex items-center gap-1.5 rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs text-white hover:bg-white/30 transition-colors border border-white/20"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                编辑背景
              </button>
              {showGradientPicker && (
                <div className="absolute right-0 top-10 z-20 w-72 rounded-2xl border border-black/[0.08] bg-white p-4 shadow-xl">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">选择渐变色</p>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {GRADIENT_PRESETS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => { setGradient(g.class); setBannerImage(null); setShowGradientPicker(false); }}
                        title={g.class}
                        className={`h-10 w-full rounded-xl bg-gradient-to-br ${g.class} transition-all hover:scale-105 ${gradient === g.class && !bannerImage ? "ring-2 ring-offset-2 ring-[#1D9E75]" : ""}`}
                      />
                    ))}
                  </div>
                  <div className="border-t border-black/[0.06] pt-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">或上传图片背景</p>
                    <button
                      onClick={() => bannerInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/[0.12] py-2.5 text-xs text-muted-foreground hover:border-[#1D9E75]/40 hover:text-[#1D9E75] transition-colors"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      上传图片
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Avatar + actions */}
          <div className="relative -mt-12 mb-6 flex items-end justify-between">
            <div className="relative group">
              {avatarImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarImage}
                  alt={user.name}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#1D9E75]/20 text-2xl font-bold text-[#1D9E75] shadow-lg">
                  {user.avatar}
                </div>
              )}
              {isOwner && (
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="更换头像"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 pb-1">
              {!isOwner && (
                <button
                  onClick={toggleFollow}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    following
                      ? "border border-[#1D9E75]/30 bg-[#1D9E75]/10 text-[#1D9E75] hover:bg-[#1D9E75]/15"
                      : "bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90 shadow-[0_0_16px_rgba(29,158,117,0.3)]"
                  }`}
                >
                  {following ? (
                    <>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Following
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Follow
                    </>
                  )}
                </button>
              )}
              {isOwner && (
                <Link href="/profile">
                  <button className="rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-sm font-medium text-[#111] hover:border-black/[0.15] transition-colors">
                    Edit profile
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mb-8 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-[#111]">{user.name}</h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <p className="text-sm text-[#333] max-w-lg">{user.bio}</p>

            {user.currentlyBuilding && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-3 py-1.5 text-xs text-[#1D9E75]">
                🔨 Currently: <strong className="ml-1">{user.currentlyBuilding}</strong>
              </div>
            )}

            {/* Meta links */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {user.location && (
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {user.location}
                </span>
              )}
              {user.github && (
                <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111] transition-colors">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.479 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  {user.github}
                </a>
              )}
              {user.twitter && (
                <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111] transition-colors">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.727-8.836L1.546 2.25h6.337l4.26 5.632 5.101-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @{user.twitter}
                </a>
              )}
              {user.website && (
                <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#111] transition-colors">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {user.website}
                </a>
              )}
            </div>

            {/* Badges */}
            {user.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <span key={badge.id} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${badge.color}`}>
                    <span>{badge.icon}</span>
                    {badge.label}
                  </span>
                ))}
              </div>
            )}

            {/* Stats strip */}
            <div className="flex gap-6 pt-1">
              <div>
                <span className="text-sm font-bold text-[#111]">{user.stats.posts}</span>
                <span className="ml-1 text-xs text-muted-foreground">Posts</span>
              </div>
              <div>
                <span className="text-sm font-bold text-[#111]">{user.stats.sales}</span>
                <span className="ml-1 text-xs text-muted-foreground">Sales</span>
              </div>
              <div>
                <span className="text-sm font-bold text-[#111]">{followerCount}</span>
                <span className="ml-1 text-xs text-muted-foreground">Followers</span>
              </div>
              <div>
                <span className="text-sm font-bold text-[#111]">{user.stats.reputation}</span>
                <span className="ml-1 text-xs text-muted-foreground">Rep</span>
              </div>
              {avgRating && (
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-sm font-bold text-[#111]">{avgRating}</span>
                  <span className="text-xs text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-black/[0.06] mb-6">
            {(["feed", "apps", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[#1D9E75] text-[#1D9E75]"
                    : "border-transparent text-muted-foreground hover:text-[#111]"
                }`}
              >
                {tab === "feed" ? "Build Log" : tab === "apps" ? "Apps" : "Reviews"}
                <span className="ml-1.5 text-xs opacity-60">
                  {tab === "feed" ? userPosts.length : tab === "apps" ? userApps.length : reviews.length}
                </span>
              </button>
            ))}
          </div>

          {/* Build Log tab */}
          {activeTab === "feed" && (
            <div className="space-y-4 pb-16">
              {userPosts.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-sm text-muted-foreground">
                  No posts yet.
                </div>
              ) : (
                userPosts.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_COLORS[post.tag]}`}>
                        {post.tag}
                      </span>
                      <span className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#333]">{post.content}</p>
                    {post.appRef && (
                      <Link href={`/marketplace/${post.appRef.id}`}>
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-3 py-1 text-xs text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-colors">
                          🔗 {post.appRef.name}
                        </div>
                      </Link>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-black/[0.04]">
                      <span>🔥 {post.reactions.fire}</span>
                      <span>💡 {post.reactions.bulb}</span>
                      <span>🙌 {post.reactions.clap}</span>
                      <span>👀 {post.reactions.eyes}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Apps tab */}
          {activeTab === "apps" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pb-16">
              {userApps.length === 0 ? (
                <div className="col-span-2 flex h-40 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-sm text-muted-foreground">
                  No apps listed yet.
                </div>
              ) : (
                userApps.map((app) => (
                  <Link key={app.id} href={`/marketplace/${app.id}`}>
                    <div className="group rounded-2xl border border-black/[0.06] bg-white overflow-hidden hover:border-[#1D9E75]/40 hover:shadow-[0_0_24px_rgba(29,158,117,0.1)] hover:-translate-y-0.5 transition-all">
                      <div className="relative aspect-video bg-gray-100">
                        <Image src="/placeholder-app.svg" alt={app.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="font-semibold text-sm text-[#111]">{app.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{app.tagline}</p>
                        <div className="flex items-center justify-between pt-1">
                          <p className="text-sm font-bold text-[#1D9E75]">${app.price}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="text-yellow-400">★</span>
                            <span>{app.seller.rating}</span>
                            <span className="opacity-40">·</span>
                            <span>{app.seller.sold} sold</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <div className="space-y-5 pb-16">
              {/* Summary */}
              {reviews.length > 0 && (
                <div className="rounded-2xl border border-black/[0.06] bg-white p-5 flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#111]">{avgRating}</p>
                    <StarRating rating={Math.round(Number(avgRating))} />
                    <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-4">{star}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                            <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-4">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Leave a comment */}
              {!isOwner && (
                <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3">
                  <p className="text-sm font-semibold text-[#111]">Leave a review</p>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience buying from this seller..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={submitComment}
                      disabled={!newComment.trim()}
                      className="rounded-xl bg-[#1D9E75] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1D9E75]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Post review
                    </button>
                  </div>
                </div>
              )}

              {/* Review list */}
              {reviews.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-sm text-muted-foreground">
                  No reviews yet. Be the first!
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-xs font-bold text-[#1D9E75]">
                          {review.authorAvatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#111]">{review.authorName}</p>
                            {review.verified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 border border-green-200">
                                ✓ Verified buyer
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} />
                            <span className="text-xs text-muted-foreground">· {review.appName} · {timeAgo(review.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[#444]">{review.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
