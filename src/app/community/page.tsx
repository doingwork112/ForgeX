"use client";

import { useState } from "react";
import Link from "next/link";
import { forgePosts, type ForgePost } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TAG_COLORS: Record<string, string> = {
  "#buildinpublic": "bg-blue-100 text-blue-700 border-blue-200",
  "#launch": "bg-green-100 text-[#1D9E75] border-green-200",
  "#feedback": "bg-orange-100 text-orange-700 border-orange-200",
  "#collab": "bg-purple-100 text-purple-700 border-purple-200",
};

const TAGS = ["All", "#buildinpublic", "#launch", "#feedback", "#collab"];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function PostCard({ post }: { post: ForgePost }) {
  const [reactions, setReactions] = useState(post.reactions);

  function bump(key: keyof typeof reactions) {
    setReactions((r) => ({ ...r, [key]: r[key] + 1 }));
  }

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-4 hover:border-[#1D9E75]/30 hover:shadow-[0_0_20px_rgba(29,158,117,0.07)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/u/${post.authorUsername}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75] hover:ring-2 hover:ring-[#1D9E75]/30 transition-all">
              {post.authorAvatar}
            </div>
          </Link>
          <div>
            <Link href={`/u/${post.authorUsername}`} className="text-sm font-semibold text-[#111] hover:text-[#1D9E75] transition-colors">
              {post.authorName}
            </Link>
            <p className="text-xs text-muted-foreground">@{post.authorUsername} · {timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_COLORS[post.tag]}`}>
          {post.tag}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-[#333]">{post.content}</p>

      {/* App ref */}
      {post.appRef && (
        <Link href={`/marketplace/${post.appRef.id}`}>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-3 py-1.5 text-xs text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-colors">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
            </svg>
            {post.appRef.name}
          </div>
        </Link>
      )}

      {/* Reactions */}
      <div className="flex items-center gap-1 pt-1 border-t border-black/[0.04]">
        {(
          [
            { key: "fire" as const, emoji: "🔥", count: reactions.fire },
            { key: "bulb" as const, emoji: "💡", count: reactions.bulb },
            { key: "clap" as const, emoji: "🙌", count: reactions.clap },
            { key: "eyes" as const, emoji: "👀", count: reactions.eyes },
          ] as const
        ).map(({ key, emoji, count }) => (
          <button
            key={key}
            onClick={() => bump(key)}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-black/[0.04] hover:text-[#111] transition-colors"
          >
            <span>{emoji}</span>
            <span>{count}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{post.comments}</span>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftTag, setDraftTag] = useState<ForgePost["tag"]>("#buildinpublic");
  const [posts, setPosts] = useState(forgePosts);
  const [posted, setPosted] = useState(false);

  const filtered = activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);

  function submitPost() {
    if (!draft.trim()) return;
    const newPost: ForgePost = {
      id: `fp-new-${Date.now()}`,
      authorName: "You",
      authorAvatar: "YU",
      authorUsername: "you",
      content: draft.trim(),
      tag: draftTag,
      reactions: { fire: 0, bulb: 0, clap: 0, eyes: 0 },
      comments: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts((p) => [newPost, ...p]);
    setDraft("");
    setComposerOpen(false);
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-foreground">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[#1D9E75]/[0.05] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
      </div>

      <Navbar />

      {/* Toast */}
      {posted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/30 bg-white px-6 py-4 shadow-[0_0_40px_rgba(29,158,117,0.15)] animate-fade-up">
          <span className="text-[#1D9E75] text-xl">🔥</span>
          <p className="text-sm font-semibold text-[#111]">Posted to The Forge!</p>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-4 py-1.5 text-sm text-[#1D9E75] mb-4">
            <span>🔥</span>
            <span className="font-medium">The Forge</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#111]">Build in public. Together.</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Share what you&apos;re building, get feedback, find collaborators, and celebrate launches with the ForgeX community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          {/* Feed */}
          <div className="space-y-4">
            {/* Composer */}
            {!composerOpen ? (
              <button
                onClick={() => setComposerOpen(true)}
                className="w-full rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-left text-sm text-muted-foreground hover:border-[#1D9E75]/30 hover:text-[#111] transition-all flex items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75]">
                  YU
                </div>
                <span>What are you building? Share an update...</span>
              </button>
            ) : (
              <div className="rounded-2xl border border-[#1D9E75]/20 bg-white p-5 space-y-4 shadow-[0_0_20px_rgba(29,158,117,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75]">
                    YU
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["#buildinpublic", "#launch", "#feedback", "#collab"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setDraftTag(t)}
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                          draftTag === t ? TAG_COLORS[t] : "border-black/[0.08] text-muted-foreground hover:border-black/[0.15]"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="What are you building today?"
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm text-[#111] placeholder:text-muted-foreground focus:outline-none"
                />
                <div className="flex justify-between items-center pt-2 border-t border-black/[0.06]">
                  <span className="text-xs text-muted-foreground">{draft.length}/280</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setComposerOpen(false)} className="border-black/[0.08]">
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      disabled={!draft.trim()}
                      onClick={submitPost}
                      className="bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90"
                    >
                      Post 🔥
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tag filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    activeTag === t
                      ? "border-[#1D9E75] bg-[#1D9E75] text-white"
                      : "border-black/[0.08] text-muted-foreground hover:border-black/[0.15] hover:text-[#111]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {filtered.length === 0 && (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-muted-foreground text-sm">
                  No posts yet in this category. Be the first!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Stats */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[#111]">Community</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Builders", value: "1.2k" },
                  { label: "Posts", value: "4.8k" },
                  { label: "Apps Sold", value: "342" },
                  { label: "Bounties", value: "89" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-[#f8f9fa] p-3 text-center">
                    <p className="text-lg font-bold text-[#1D9E75]">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending tags */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3">
              <h3 className="text-sm font-semibold text-[#111]">Trending today</h3>
              {[
                { tag: "#launch", count: "14 posts" },
                { tag: "#buildinpublic", count: "31 posts" },
                { tag: "#feedback", count: "8 posts" },
                { tag: "#collab", count: "6 posts" },
              ].map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-black/[0.03] transition-colors"
                >
                  <span className={`font-medium ${TAG_COLORS[tag]?.split(" ").find(c => c.startsWith("text-")) ?? "text-[#111]"}`}>{tag}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </button>
              ))}
            </div>

            {/* Active builders */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3">
              <h3 className="text-sm font-semibold text-[#111]">Active builders</h3>
              {[
                { name: "Alex Chen", username: "alexchen", avatar: "AC", rep: 412 },
                { name: "James Wu", username: "jameswu", avatar: "JW", rep: 381 },
                { name: "Dev Studio", username: "devstudio", avatar: "DS", rep: 524 },
                { name: "Olivia Park", username: "oliviapark", avatar: "OP", rep: 298 },
              ].map(({ name, username, avatar, rep }) => (
                <Link key={username} href={`/u/${username}`} className="flex items-center justify-between gap-3 rounded-lg hover:bg-black/[0.03] px-2 py-1.5 -mx-2 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-xs font-bold text-[#1D9E75]">
                      {avatar}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#111]">{name}</p>
                      <p className="text-[11px] text-muted-foreground">@{username}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#1D9E75] font-medium">{rep} rep</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
