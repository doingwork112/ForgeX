"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface Message {
  id: string;
  from_id: string;
  to_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface OtherUser {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

function timeLabel(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ConversationPage({ params }: { params: { userId: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [msgLoading, setMsgLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    loadData();

    // Mark messages as read
    supabase
      .from("messages")
      .update({ read: true })
      .eq("from_id", params.userId)
      .eq("to_id", user.id)
      .eq("read", false);

    // Realtime subscription
    const channel = supabase
      .channel(`dm-${[user.id, params.userId].sort().join("-")}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `to_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.new.from_id === params.userId) {
          setMessages((prev) => [...prev, payload.new as Message]);
          supabase.from("messages").update({ read: true }).eq("id", payload.new.id);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params.userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadData() {
    if (!user) return;
    setMsgLoading(true);

    const [profileRes, msgsRes] = await Promise.all([
      supabase.from("profiles").select("id, username, display_name, avatar_url").eq("id", params.userId).single(),
      supabase
        .from("messages")
        .select("*")
        .or(
          `and(from_id.eq.${user.id},to_id.eq.${params.userId}),and(from_id.eq.${params.userId},to_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true }),
    ]);

    if (profileRes.data) setOtherUser(profileRes.data);
    if (msgsRes.data) setMessages(msgsRes.data);
    setMsgLoading(false);
  }

  async function sendMessage() {
    if (!text.trim() || !user || sending) return;
    setSending(true);
    const content = text.trim();
    setText("");

    const { data, error } = await supabase.from("messages").insert({
      from_id: user.id,
      to_id: params.userId,
      content,
      read: false,
    }).select().single();

    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
    } else if (error) {
      setText(content); // restore on error
      alert("Failed to send: " + error.message);
    }
    setSending(false);
    inputRef.current?.focus();
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
    <div className="flex min-h-screen flex-col bg-[#f8f9fa]">
      <Navbar />
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 pt-6">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <Link href="/messages" className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-black/[0.05] hover:text-[#111] transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          {otherUser ? (
            <Link href={`/u/${otherUser.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75] overflow-hidden">
                {otherUser.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={otherUser.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  otherUser.username.slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111]">{otherUser.display_name || otherUser.username}</p>
                <p className="text-xs text-muted-foreground">@{otherUser.username}</p>
              </div>
            </Link>
          ) : (
            <div className="h-9 w-32 animate-pulse rounded-xl bg-black/[0.06]" />
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-black/[0.06] bg-white p-4 space-y-3 min-h-[50vh] max-h-[60vh]">
          {msgLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1D9E75] border-t-transparent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center py-10">
              <span className="text-4xl">👋</span>
              <p className="text-sm font-semibold text-[#111]">Say hi to {otherUser?.display_name || otherUser?.username}</p>
              <p className="text-xs text-muted-foreground">This is the beginning of your conversation.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.from_id === user.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isMe
                      ? "bg-[#1D9E75] text-white rounded-br-sm"
                      : "bg-[#f8f9fa] border border-black/[0.06] text-[#111] rounded-bl-sm"
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`mt-1 text-[10px] ${isMe ? "text-white/60 text-right" : "text-muted-foreground"}`}>
                      {timeLabel(msg.created_at)}
                      {isMe && msg.read && <span className="ml-1">✓✓</span>}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="mt-3 flex items-end gap-3 rounded-2xl border border-black/[0.08] bg-white px-4 py-3 shadow-sm focus-within:border-[#1D9E75]/40 transition-colors">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Message ${otherUser?.display_name || otherUser?.username || "..."}`}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-[#111] placeholder:text-gray-400 focus:outline-none"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim() || sending}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1D9E75] text-white hover:bg-[#178c66] disabled:opacity-40 transition-all"
          >
            {sending ? (
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" />
              </svg>
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
