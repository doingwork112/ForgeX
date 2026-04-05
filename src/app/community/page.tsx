"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

const TAGS = ["All", "#buildinpublic", "#launch", "#feedback", "#collab"];

const TAG_COLORS: Record<string, string> = {
  "#buildinpublic": "bg-blue-100 text-blue-700 border-blue-200",
  "#launch": "bg-green-100 text-[#1D9E75] border-green-200",
  "#feedback": "bg-orange-100 text-orange-700 border-orange-200",
  "#collab": "bg-purple-100 text-purple-700 border-purple-200",
};

interface Post {
  id: string;
  author_id: string;
  content: string;
  parent_id: string | null;
  image_url: string | null;
  tag: string | null;
  created_at: string;
  upvotes: number;
  downvotes: number;
  reply_count: number;
  author_username: string;
  author_display_name: string | null;
  author_avatar: string | null;
  my_vote: 1 | -1 | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function PostCard({
  post,
  currentUserId,
  onVote,
  onReply,
}: {
  post: Post;
  currentUserId?: string;
  onVote: (postId: string, value: 1 | -1) => void;
  onReply: (post: Post) => void;
}) {
  const score = post.upvotes - post.downvotes;
  const tagColor = post.tag ? TAG_COLORS[post.tag] ?? "bg-gray-100 text-gray-600 border-gray-200" : "";

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3 hover:border-[#1D9E75]/30 hover:shadow-[0_0_20px_rgba(29,158,117,0.07)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/u/${post.author_username}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75] overflow-hidden hover:ring-2 hover:ring-[#1D9E75]/30 transition-all">
              {post.author_avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.author_avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                post.author_username.slice(0, 2).toUpperCase()
              )}
            </div>
          </Link>
          <div>
            <Link href={`/u/${post.author_username}`} className="text-sm font-semibold text-[#111] hover:text-[#1D9E75] transition-colors">
              {post.author_display_name || post.author_username}
            </Link>
            <p className="text-xs text-muted-foreground">@{post.author_username} · {timeAgo(post.created_at)}</p>
          </div>
        </div>
        {post.tag && (
          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagColor}`}>
            {post.tag}
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-[#333] whitespace-pre-wrap">{post.content}</p>

      {/* Image */}
      {post.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image_url} alt="post image" className="w-full rounded-xl object-cover max-h-72" />
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-1 border-t border-black/[0.04]">
        {/* Upvote */}
        <button
          onClick={() => currentUserId && onVote(post.id, 1)}
          disabled={!currentUserId}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            post.my_vote === 1
              ? "bg-[#1D9E75]/10 text-[#1D9E75]"
              : "text-muted-foreground hover:bg-black/[0.04] hover:text-[#111]"
          } disabled:opacity-50`}
        >
          <svg width="13" height="13" fill={post.my_vote === 1 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          {post.upvotes}
        </button>

        {/* Downvote */}
        <button
          onClick={() => currentUserId && onVote(post.id, -1)}
          disabled={!currentUserId}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            post.my_vote === -1
              ? "bg-red-50 text-red-600"
              : "text-muted-foreground hover:bg-black/[0.04] hover:text-[#111]"
          } disabled:opacity-50`}
        >
          <svg width="13" height="13" fill={post.my_vote === -1 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          {post.downvotes}
        </button>

        {/* Score */}
        <span className={`ml-1 text-xs font-bold ${score > 0 ? "text-[#1D9E75]" : score < 0 ? "text-red-500" : "text-muted-foreground"}`}>
          {score > 0 ? `+${score}` : score}
        </span>

        {/* Reply */}
        <button
          onClick={() => onReply(post)}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-black/[0.04] hover:text-[#111] transition-colors"
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.reply_count > 0 ? post.reply_count : "Reply"}
        </button>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeTag, setActiveTag] = useState("All");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftTag, setDraftTag] = useState<string>("#buildinpublic");
  const [draftImage, setDraftImage] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const [replyTo, setReplyTo] = useState<Post | null>(null);
  const [posted, setPosted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchPosts() {
    setLoading(true);
    try {
      // Fetch top-level posts with author info + vote counts
      const { data: rawPosts, error } = await supabase
        .from("posts")
        .select(`
          id, author_id, content, parent_id, image_url, tag, created_at,
          profiles!author_id(username, display_name, avatar_url)
        `)
        .is("parent_id", null)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      if (!rawPosts) { setLoading(false); return; }

      // Get vote counts + reply counts
      const postIds = rawPosts.map((p) => p.id);

      const [votesRes, repliesRes, myVotesRes] = await Promise.all([
        supabase.from("votes").select("post_id, value").in("post_id", postIds),
        supabase.from("posts").select("parent_id").in("parent_id", postIds),
        user
          ? supabase.from("votes").select("post_id, value").in("post_id", postIds).eq("user_id", user.id)
          : Promise.resolve({ data: [] }),
      ]);

      const voteMap: Record<string, { up: number; down: number }> = {};
      const replyMap: Record<string, number> = {};
      const myVoteMap: Record<string, 1 | -1> = {};

      for (const v of votesRes.data ?? []) {
        if (!voteMap[v.post_id]) voteMap[v.post_id] = { up: 0, down: 0 };
        if (v.value === 1) voteMap[v.post_id].up++;
        else voteMap[v.post_id].down++;
      }

      for (const r of repliesRes.data ?? []) {
        if (r.parent_id) replyMap[r.parent_id] = (replyMap[r.parent_id] ?? 0) + 1;
      }

      for (const v of (myVotesRes.data ?? []) as Array<{ post_id: string; value: number }>) {
        myVoteMap[v.post_id] = v.value as 1 | -1;
      }

      const mapped: Post[] = rawPosts.map((p) => {
        const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles as { username: string; display_name: string | null; avatar_url: string | null } | null;
        return {
          id: p.id,
          author_id: p.author_id,
          content: p.content,
          parent_id: p.parent_id,
          image_url: p.image_url ?? null,
          tag: p.tag ?? null,
          created_at: p.created_at,
          upvotes: voteMap[p.id]?.up ?? 0,
          downvotes: voteMap[p.id]?.down ?? 0,
          reply_count: replyMap[p.id] ?? 0,
          author_username: profile?.username ?? "unknown",
          author_display_name: profile?.display_name ?? null,
          author_avatar: profile?.avatar_url ?? null,
          my_vote: myVoteMap[p.id] ?? null,
        };
      });

      setPosts(mapped);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPosts(); }, [user]);

  async function handleVote(postId: string, value: 1 | -1) {
    if (!user) return;

    const existing = posts.find((p) => p.id === postId)?.my_vote;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const wasUp = p.my_vote === 1;
        const wasDown = p.my_vote === -1;
        const toggling = p.my_vote === value;

        return {
          ...p,
          upvotes: toggling ? (wasUp ? p.upvotes - 1 : p.upvotes) : (value === 1 ? p.upvotes + 1 : (wasUp ? p.upvotes - 1 : p.upvotes)),
          downvotes: toggling ? (wasDown ? p.downvotes - 1 : p.downvotes) : (value === -1 ? p.downvotes + 1 : (wasDown ? p.downvotes - 1 : p.downvotes)),
          my_vote: toggling ? null : value,
        };
      })
    );

    if (existing === value) {
      // Remove vote
      await supabase.from("votes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else if (existing) {
      // Update vote
      await supabase.from("votes").update({ value }).eq("post_id", postId).eq("user_id", user.id);
    } else {
      // Insert vote
      await supabase.from("votes").insert({ post_id: postId, user_id: user.id, value });
    }
  }

  async function submitPost() {
    if (!draft.trim() || !user) return;
    setPosting(true);

    let image_url: string | null = null;

    // Upload image if present
    if (draftImage) {
      const ext = draftImage.name.split(".").pop();
      const path = `posts/${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, draftImage, { upsert: true });
      if (!uploadErr) {
        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
        image_url = publicUrl;
      }
    }

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      content: draft.trim(),
      tag: draftTag,
      image_url,
      parent_id: replyTo?.id ?? null,
    });

    if (error) {
      alert("Failed to post: " + error.message);
    } else {
      setDraft("");
      setDraftImage(null);
      setComposerOpen(false);
      setReplyTo(null);
      setPosted(true);
      setTimeout(() => setPosted(false), 3000);
      fetchPosts();
    }
    setPosting(false);
  }

  const filtered = activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);

  const authorInitials = user?.email?.slice(0, 2).toUpperCase() ?? "YU";

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[#1D9E75]/[0.05] blur-[100px]" />
      </div>

      <Navbar />

      {/* Toast */}
      {posted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/30 bg-white px-6 py-4 shadow-[0_0_40px_rgba(29,158,117,0.15)]">
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
            Share what you&apos;re building, get feedback, find collaborators, and celebrate launches.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
          {/* Feed */}
          <div className="space-y-4">

            {/* Composer */}
            {!user ? (
              <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-sm text-muted-foreground flex items-center justify-between">
                <span>Sign in to post to The Forge</span>
                <Link href="/auth/login" className="rounded-xl bg-[#1D9E75] px-4 py-2 text-xs font-bold text-white hover:bg-[#178c66] transition-colors">
                  Sign In
                </Link>
              </div>
            ) : !composerOpen ? (
              <button
                onClick={() => setComposerOpen(true)}
                className="w-full rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-left text-sm text-muted-foreground hover:border-[#1D9E75]/30 hover:text-[#111] transition-all flex items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75]">
                  {authorInitials}
                </div>
                <span>What are you building? Share an update...</span>
              </button>
            ) : (
              <div className="rounded-2xl border border-[#1D9E75]/20 bg-white p-5 space-y-4 shadow-[0_0_20px_rgba(29,158,117,0.08)]">
                {replyTo && (
                  <div className="flex items-center gap-2 rounded-xl bg-[#f8f9fa] px-3 py-2 text-xs text-muted-foreground">
                    <span>↩ Replying to <strong className="text-[#111]">@{replyTo.author_username}</strong></span>
                    <button onClick={() => setReplyTo(null)} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75]">
                    {authorInitials}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["#buildinpublic", "#launch", "#feedback", "#collab"] as const).map((t) => (
                      <button key={t} onClick={() => setDraftTag(t)}
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                          draftTag === t ? TAG_COLORS[t] ?? "border-[#1D9E75] bg-[#1D9E75]/10 text-[#1D9E75]" : "border-black/[0.08] text-muted-foreground hover:border-black/[0.15]"
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(e) => { if (e.target.value.length <= 500) setDraft(e.target.value); }}
                  placeholder="What are you building today?"
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm text-[#111] placeholder:text-muted-foreground focus:outline-none"
                />
                {draftImage && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>📎 {draftImage.name}</span>
                    <button onClick={() => setDraftImage(null)} className="text-gray-400 hover:text-red-500">✕</button>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-black/[0.06]">
                  <div className="flex items-center gap-2">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-black/[0.04] hover:text-[#111] transition-colors">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Image
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => setDraftImage(e.target.files?.[0] ?? null)} />
                    <span className="text-xs text-muted-foreground">{draft.length}/500</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setComposerOpen(false); setDraft(""); setReplyTo(null); }}
                      className="rounded-xl border border-black/[0.08] px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-black/[0.04] transition-colors">
                      Cancel
                    </button>
                    <button onClick={submitPost} disabled={!draft.trim() || posting}
                      className="rounded-xl bg-[#1D9E75] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#178c66] disabled:opacity-50 transition-colors">
                      {posting ? "Posting..." : "Post 🔥"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tag filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TAGS.map((t) => (
                <button key={t} onClick={() => setActiveTag(t)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    activeTag === t
                      ? "border-[#1D9E75] bg-[#1D9E75] text-white"
                      : "border-black/[0.08] text-muted-foreground hover:border-black/[0.15] hover:text-[#111]"
                  }`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Posts */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-black/[0.06]" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 rounded bg-black/[0.06]" />
                        <div className="h-2.5 w-20 rounded bg-black/[0.04]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-black/[0.04]" />
                      <div className="h-3 w-4/5 rounded bg-black/[0.04]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user?.id}
                    onVote={handleVote}
                    onReply={(p) => { setReplyTo(p); setComposerOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="flex h-40 items-center justify-center rounded-2xl border border-black/[0.06] bg-white text-muted-foreground text-sm">
                    {posts.length === 0 ? "Be the first to post!" : "No posts in this category yet."}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <h3 className="font-bold text-sm text-[#111] mb-4">Community Rules</h3>
              <div className="space-y-3">
                {[
                  { icon: "🔨", text: "Build in public — share progress" },
                  { icon: "💡", text: "Give honest, constructive feedback" },
                  { icon: "🤝", text: "Support fellow builders" },
                  { icon: "🚫", text: "No spam or self-promotion only" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <span className="shrink-0 text-base">{icon}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
              <h3 className="font-bold text-sm text-[#111] mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/marketplace" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-black/[0.04] hover:text-[#111] transition-colors">
                  🛍️ Browse Marketplace
                </Link>
                <Link href="/hunters" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-black/[0.04] hover:text-[#111] transition-colors">
                  🎯 Post a Bounty
                </Link>
                <Link href="/sell/new" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-black/[0.04] hover:text-[#111] transition-colors">
                  ➕ List Your App
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
