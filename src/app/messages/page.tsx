"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface Conversation {
  userId: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  last_message: string;
  last_at: string;
  unread: number;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [convoLoading, setConvoLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  async function loadConversations() {
    if (!user) return;
    setConvoLoading(true);

    // Get all messages involving this user
    const { data: msgs } = await supabase
      .from("messages")
      .select("id, from_id, to_id, content, read, created_at")
      .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!msgs || msgs.length === 0) {
      setConvoLoading(false);
      return;
    }

    // Group by other-user ID, pick last message per convo
    const seen = new Map<string, typeof msgs[0]>();
    for (const m of msgs) {
      const otherId = m.from_id === user.id ? m.to_id : m.from_id;
      if (!seen.has(otherId)) seen.set(otherId, m);
    }

    // Count unread (messages TO me, not read)
    const unreadMap = new Map<string, number>();
    for (const m of msgs) {
      if (m.to_id === user.id && !m.read) {
        const k = m.from_id;
        unreadMap.set(k, (unreadMap.get(k) ?? 0) + 1);
      }
    }

    const otherIds = Array.from(seen.keys());
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", otherIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

    const result: Conversation[] = otherIds
      .map((id) => {
        const msg = seen.get(id)!;
        const profile = profileMap.get(id);
        return {
          userId: id,
          username: profile?.username ?? "unknown",
          display_name: profile?.display_name ?? null,
          avatar_url: profile?.avatar_url ?? null,
          last_message: msg.content,
          last_at: msg.created_at,
          unread: unreadMap.get(id) ?? 0,
        };
      })
      .sort((a, b) => new Date(b.last_at).getTime() - new Date(a.last_at).getTime());

    setConvos(result);
    setConvoLoading(false);
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1D9E75] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#111]">Messages</h1>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden shadow-sm">
          {convoLoading ? (
            <div className="divide-y divide-black/[0.04]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                  <div className="h-11 w-11 rounded-full bg-black/[0.06]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-32 rounded bg-black/[0.06]" />
                    <div className="h-3 w-48 rounded bg-black/[0.04]" />
                  </div>
                </div>
              ))}
            </div>
          ) : convos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
              <span className="text-5xl">💬</span>
              <p className="text-base font-semibold text-[#111]">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                When you contact a developer or buyer, conversations will appear here.
              </p>
              <Link href="/marketplace" className="rounded-xl bg-[#1D9E75] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#178c66] transition-colors">
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-black/[0.04]">
              {convos.map((c) => (
                <Link key={c.userId} href={`/messages/${c.userId}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-black/[0.02] transition-colors">
                  <div className="relative shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75] overflow-hidden">
                      {c.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        c.username.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    {c.unread > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1D9E75] text-[10px] font-bold text-white">
                        {c.unread > 9 ? "9+" : c.unread}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-semibold ${c.unread > 0 ? "text-[#111]" : "text-[#333]"}`}>
                        {c.display_name || c.username}
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(c.last_at)}</span>
                    </div>
                    <p className={`truncate text-xs mt-0.5 ${c.unread > 0 ? "font-medium text-[#333]" : "text-muted-foreground"}`}>
                      {c.last_message}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
