"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { userProfiles, forgePosts, apps } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";

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
  "from-[#1D9E75] to-[#0d6e52]",
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-400",
  "from-orange-400 to-rose-500",
  "from-yellow-400 to-orange-500",
  "from-indigo-500 to-purple-600",
];

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const profile = userProfiles.find((u) => u.username === params.username);

  // For unknown usernames, show a generic profile
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
  const [gradient, setGradient] = useState(user.bannerGradient);
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "apps">("feed");

  const userPosts = forgePosts.filter((p) => p.authorUsername === user.username);
  const userApps = apps.filter((a) => user.appIds.includes(a.id));

  const isOwner = true; // mock — in real app check auth

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-foreground">
      <Navbar />

      <main>
        {/* Banner */}
        <div className="relative">
          <div className={`h-48 w-full bg-gradient-to-r ${gradient}`} />

          {isOwner && (
            <div className="absolute right-4 top-4">
              <button
                onClick={() => setShowGradientPicker(!showGradientPicker)}
                className="flex items-center gap-1.5 rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs text-white hover:bg-white/30 transition-colors border border-white/20"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit banner
              </button>
              {showGradientPicker && (
                <div className="absolute right-0 top-10 z-20 rounded-xl border border-black/[0.08] bg-white p-3 shadow-xl flex gap-2">
                  {GRADIENT_PRESETS.map((g) => (
                    <button
                      key={g}
                      onClick={() => { setGradient(g); setShowGradientPicker(false); }}
                      className={`h-8 w-8 rounded-full bg-gradient-to-br ${g} ${gradient === g ? "ring-2 ring-offset-1 ring-[#1D9E75]" : ""} hover:scale-110 transition-transform`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Avatar + header */}
          <div className="relative -mt-12 mb-6 flex items-end justify-between">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#1D9E75]/20 text-2xl font-bold text-[#1D9E75] shadow-lg">
              {user.avatar}
            </div>
            {isOwner && (
              <Link href="/profile">
                <button className="mb-2 rounded-lg border border-black/[0.08] bg-white px-4 py-1.5 text-sm font-medium text-[#111] hover:border-black/[0.15] transition-colors">
                  Edit profile
                </button>
              </Link>
            )}
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
                <span>🔨</span>
                <span>Currently building: <strong>{user.currentlyBuilding}</strong></span>
              </div>
            )}

            {/* Meta */}
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
              {[
                { label: "Posts", value: user.stats.posts },
                { label: "Sales", value: user.stats.sales },
                { label: "Rep", value: user.stats.reputation },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-sm font-bold text-[#111]">{value}</span>
                  <span className="ml-1 text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-black/[0.06] mb-6">
            {(["feed", "apps"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[#1D9E75] text-[#1D9E75]"
                    : "border-transparent text-muted-foreground hover:text-[#111]"
                }`}
              >
                {tab === "feed" ? "Build Log" : "Apps"}
                <span className="ml-1.5 text-xs opacity-60">
                  {tab === "feed" ? userPosts.length : userApps.length}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
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
                        <p className="font-semibold text-sm">{app.name}</p>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
