"use client";

import { useState } from "react";
import Link from "next/link";
import { bounties } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  open:        { label: "Open",        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  in_progress: { label: "In Progress", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  completed:   { label: "Completed",   className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
} as const;

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const bountyCategories = ["All", ...Array.from(new Set(bounties.map(b => b.category)))];

export default function HuntersPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", budget: "", deadline: "", category: "SaaS", references: "",
  });

  const filtered = selectedCategory === "All"
    ? bounties
    : bounties.filter((b) => b.category === selectedCategory);

  function handlePost() {
    if (!form.title || !form.description || !form.budget) return;
    setShowPostModal(false);
    setPostSuccess(true);
    setForm({ title: "", description: "", budget: "", deadline: "", category: "SaaS", references: "" });
    setTimeout(() => setPostSuccess(false), 4000);
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[#1D9E75]/[0.06] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.2]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
      </div>

      <Navbar />

      {/* Success toast */}
      {postSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/30 bg-[#0a0a0a] px-6 py-4 shadow-[0_0_40px_rgba(29,158,117,0.2)] animate-fade-up">
          <span className="text-[#1D9E75] text-xl">✓</span>
          <div>
            <p className="text-sm font-semibold text-white">Bounty posted!</p>
            <p className="text-xs text-muted-foreground">Builders will be notified.</p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-6 py-14">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Hunters</h1>
            <p className="mt-2 text-muted-foreground max-w-md">
              Post a bounty for the app you need. Developers compete to deliver. Only pay when you love it.
            </p>
          </div>
          <Button
            className="bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white shrink-0 shadow-[0_0_20px_rgba(29,158,117,0.3)] font-semibold"
            onClick={() => setShowPostModal(true)}
          >
            + Post a Bounty
          </Button>
        </div>

        {/* Stats strip */}
        <div className="mb-8 grid grid-cols-3 gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          {[
            { value: bounties.filter(b => b.status === "open").length, label: "Open Bounties" },
            { value: bounties.reduce((s, b) => s + b.submissions, 0), label: "Total Submissions" },
            { value: `$${bounties.reduce((s, b) => s + b.budget, 0).toLocaleString()}`, label: "Total Budget" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {bountyCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-[#1D9E75] text-white shadow-[0_0_16px_rgba(29,158,117,0.3)]"
                  : "border border-white/[0.08] text-muted-foreground hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bounty list */}
        <div className="flex flex-col gap-4">
          {filtered.map((bounty) => {
            const status = statusConfig[bounty.status];
            return (
              <Link key={bounty.id} href={`/hunters/${bounty.id}`}>
                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-[#1D9E75]/40 hover:shadow-[0_0_24px_rgba(29,158,117,0.1)] hover:-translate-y-0.5 cursor-pointer">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="font-semibold text-lg leading-tight">{bounty.title}</h3>
                        <Badge variant="outline" className={`text-xs shrink-0 ${status.className}`}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">{bounty.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className="text-2xl font-bold text-[#1D9E75]"
                        style={{ textShadow: "0 0 20px rgba(29,158,117,0.3)" }}
                      >
                        ${bounty.budget.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">budget</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-white/[0.05]">
                    <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">{bounty.category}</Badge>
                      {bounty.deadline && (
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDeadline(bounty.deadline)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {bounty.submissions} submissions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D9E75]/15 text-xs font-medium text-[#1D9E75]">
                        {bounty.poster.avatar}
                      </div>
                      <span className="text-xs text-muted-foreground">{bounty.poster.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />

      {/* Post Bounty Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPostModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/[0.1] bg-[#0f0f0f] p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPostModal(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold">Post a Bounty</h2>
              <p className="text-sm text-muted-foreground mt-1">Describe what you need and set your budget.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title <span className="text-[#1D9E75]">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Food delivery app like Uber Eats"
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description <span className="text-[#1D9E75]">*</span></label>
                <textarea
                  rows={4}
                  placeholder="Describe the features you need in detail..."
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none resize-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Budget (USD) <span className="text-[#1D9E75]">*</span></label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={form.budget}
                    onChange={(e) => setForm(f => ({ ...f, budget: e.target.value }))}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm(f => ({ ...f, deadline: e.target.value }))}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#111] px-4 py-3 text-sm text-white focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                >
                  {["SaaS","E-Commerce","Social","Tools","Restaurant","Booking","Finance","Education","Health"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Reference Apps</label>
                <input
                  type="text"
                  placeholder="https://example.com, https://another.com"
                  value={form.references}
                  onChange={(e) => setForm(f => ({ ...f, references: e.target.value }))}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated URLs of apps you like</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 text-muted-foreground hover:text-white"
                onClick={() => setShowPostModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#1D9E75] font-semibold text-white hover:bg-[#1D9E75]/90 shadow-[0_0_20px_rgba(29,158,117,0.3)]"
                onClick={handlePost}
                disabled={!form.title || !form.description || !form.budget}
              >
                Post Bounty
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
