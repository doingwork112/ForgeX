"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bounties } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function getStatusBadge(status: "open" | "in_progress" | "completed") {
  const map = {
    open:        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    in_progress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    completed:   "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };
  const labels = { open: "Open", in_progress: "In Progress", completed: "Completed" };
  return (
    <Badge variant="outline" className={`text-xs ${map[status]}`}>
      {labels[status]}
    </Badge>
  );
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "No deadline";
  return new Date(deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BountyDetailPage({ params }: { params: { id: string } }) {
  const bounty = bounties.find((b) => b.id === params.id);
  if (!bounty) notFound();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitForm, setSubmitForm] = useState({ demoUrl: "", notes: "" });

  function handleSubmit() {
    if (!submitForm.demoUrl) return;
    setShowSubmitModal(false);
    setSubmitSuccess(true);
    setSubmitForm({ demoUrl: "", notes: "" });
    setTimeout(() => setSubmitSuccess(false), 4000);
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-[#111]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[#1D9E75]/[0.06] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.2]" style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
      </div>

      <Navbar />

      {/* Success toast */}
      {submitSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/30 bg-[#f8f9fa] px-6 py-4 shadow-[0_0_40px_rgba(29,158,117,0.2)] animate-fade-up">
          <span className="text-[#1D9E75] text-xl">✓</span>
          <div>
            <p className="text-sm font-semibold text-[#111]">Demo submitted!</p>
            <p className="text-xs text-muted-foreground">The bounty poster will review your submission.</p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Back */}
        <Link
          href="/hunters"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-[#111]"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Hunters
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Left */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(bounty.status)}
                <Badge variant="secondary" className="text-xs">{bounty.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight leading-tight">{bounty.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D9E75]/15 text-xs font-semibold text-[#1D9E75]">
                  {bounty.poster.avatar}
                </div>
                <span>Posted by <span className="text-[#111] font-medium">{bounty.poster.name}</span></span>
                <span className="opacity-30">·</span>
                <span>{bounty.submissions} submissions</span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 space-y-3">
              <h2 className="font-semibold">Description</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{bounty.description}</p>
            </div>

            {/* What to build */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 space-y-3">
              <h2 className="font-semibold">Submission requirements</h2>
              <ul className="space-y-2.5">
                {[
                  "Submit a live demo URL (must be publicly accessible)",
                  "Include full source code in a GitHub repository",
                  "App must match the description above",
                  "Code must be clean and production-ready",
                  "Include a short README with setup instructions",
                ].map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-[#1D9E75] text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* References */}
            {bounty.references.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-semibold">Reference apps</h2>
                <div className="flex flex-col gap-2">
                  {bounty.references.map((ref) => (
                    <a
                      key={ref}
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-sm text-[#1D9E75] hover:border-[#1D9E75]/30 transition-colors group"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="group-hover:underline truncate">{ref}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="lg:w-[340px] shrink-0">
            <div className="sticky top-20 rounded-2xl border border-black/[0.08] bg-white p-6 space-y-5">
              {/* Budget */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bounty</p>
                <p
                  className="text-4xl font-bold text-[#1D9E75]"
                  style={{ textShadow: "0 0 30px rgba(29,158,117,0.3)" }}
                >
                  ${bounty.budget.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Paid on acceptance</p>
              </div>

              <div className="border-t border-black/[0.06]" />

              {/* Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-medium">{formatDeadline(bounty.deadline)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(bounty.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Submissions</span>
                  <span className="font-medium">{bounty.submissions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary" className="text-xs">{bounty.category}</Badge>
                </div>
              </div>

              <div className="border-t border-black/[0.06]" />

              {/* Poster */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-semibold text-[#1D9E75]">
                  {bounty.poster.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{bounty.poster.name}</p>
                  <p className="text-xs text-muted-foreground">Bounty poster</p>
                </div>
              </div>

              <Button
                className="w-full bg-[#1D9E75] font-semibold text-white hover:bg-[#1D9E75]/90 shadow-[0_0_20px_rgba(29,158,117,0.3)] py-5"
                onClick={() => setShowSubmitModal(true)}
                disabled={bounty.status === "completed"}
              >
                {bounty.status === "completed" ? "Bounty Closed" : "Submit Your Demo"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Build it · Submit demo · Get paid
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Submit Demo Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSubmitModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-black/[0.1] bg-white p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-[#111] hover:bg-white/10 transition-colors"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold">Submit Your Demo</h2>
              <p className="text-sm text-muted-foreground mt-1">For: {bounty.title}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Demo URL <span className="text-[#1D9E75]">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://your-demo.vercel.app"
                  value={submitForm.demoUrl}
                  onChange={(e) => setSubmitForm(f => ({ ...f, demoUrl: e.target.value }))}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                />
                <p className="text-xs text-muted-foreground mt-1">Must be a live, publicly accessible URL</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">GitHub Repo</label>
                <input
                  type="url"
                  placeholder="https://github.com/you/repo"
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Notes to the poster</label>
                <textarea
                  rows={3}
                  placeholder="Describe what you built, tech stack used, any special features..."
                  value={submitForm.notes}
                  onChange={(e) => setSubmitForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none resize-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 text-muted-foreground hover:text-[#111]"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#1D9E75] font-semibold text-white hover:bg-[#1D9E75]/90 shadow-[0_0_20px_rgba(29,158,117,0.3)]"
                onClick={handleSubmit}
                disabled={!submitForm.demoUrl}
              >
                Submit Demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
