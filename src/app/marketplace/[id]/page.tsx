"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apps } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AppDetailPage({ params }: { params: { id: string } }) {
  const app = apps.find((a) => a.id === params.id);
  if (!app) notFound();

  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState<"screenshots" | "preview">("screenshots");
  const [iframeError, setIframeError] = useState(false);

  const relatedApps = apps.filter((a) => a.id !== app.id && a.category === app.category).slice(0, 3);

  function handleBuy() {
    setShowBuyModal(false);
    setPurchased(true);
    setTimeout(() => setPurchased(false), 4000);
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-foreground">
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
      {purchased && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/30 bg-[#f8f9fa] px-6 py-4 shadow-[0_0_40px_rgba(29,158,117,0.2)] animate-fade-up">
          <span className="text-[#1D9E75] text-xl">✓</span>
          <div>
            <p className="text-sm font-semibold text-[#111]">Purchase complete!</p>
            <p className="text-xs text-muted-foreground">Code delivery link sent to your email.</p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/marketplace"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-[#111]"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Marketplace
        </Link>

        {/* Two-column */}
        <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left */}
          <div className="lg:col-span-3 space-y-8">
            {/* Gallery / Live Preview tabs */}
            <div className="space-y-3">
              {/* Tab switcher */}
              <div className="flex gap-1 rounded-xl border border-black/[0.06] bg-white p-1 w-fit">
                <button
                  onClick={() => setActiveTab("screenshots")}
                  className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === "screenshots"
                      ? "bg-[#1D9E75] text-white shadow"
                      : "text-muted-foreground hover:text-[#111]"
                  }`}
                >
                  Screenshots
                </button>
                <button
                  onClick={() => { setActiveTab("preview"); setIframeError(false); }}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === "preview"
                      ? "bg-[#1D9E75] text-white shadow"
                      : "text-muted-foreground hover:text-[#111]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  Live Preview
                </button>
              </div>

              {activeTab === "screenshots" && (
                <>
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 border border-black/[0.06]">
                    <Image
                      src={app.screenshots[activeScreenshot]}
                      alt={`${app.name} screenshot`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {app.screenshots.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {app.screenshots.map((shot, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveScreenshot(i)}
                          className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 border transition-all ${
                            activeScreenshot === i
                              ? "border-[#1D9E75] shadow-[0_0_12px_rgba(29,158,117,0.3)]"
                              : "border-black/[0.06] opacity-50 hover:opacity-80"
                          }`}
                        >
                          <Image src={shot} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "preview" && (
                <div className="relative w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-gray-50">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 border-b border-black/[0.06] bg-white px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 rounded-md bg-[#f8f9fa] border border-black/[0.06] px-3 py-1 text-xs text-muted-foreground truncate">
                      {app.demoUrl}
                    </div>
                    <a href={app.demoUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-[#111] transition-colors flex items-center gap-1">
                      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open
                    </a>
                  </div>
                  {iframeError ? (
                    <div className="flex h-[480px] flex-col items-center justify-center gap-4 text-center px-8">
                      <span className="text-4xl">🔒</span>
                      <p className="text-sm font-medium text-[#111]">Preview blocked by the demo site</p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        This demo doesn&apos;t allow embedding. Open it in a new tab to try it out.
                      </p>
                      <a
                        href={app.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D9E75]/90 transition-colors"
                      >
                        Open demo →
                      </a>
                    </div>
                  ) : (
                    <iframe
                      src={app.demoUrl}
                      className="h-[480px] w-full"
                      title={`${app.name} live demo`}
                      onError={() => setIframeError(true)}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  )}
                </div>
              )}
            </div>

            {/* About */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">About this app</h2>
              <p className="leading-relaxed text-muted-foreground">{app.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">What&apos;s included</h2>
              <ul className="space-y-2.5">
                {app.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — sticky card */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-2xl border border-black/[0.08] bg-white p-6 backdrop-blur space-y-5">
              {/* Name */}
              <div>
                <h1 className="text-2xl font-bold">{app.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{app.tagline}</p>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5">
                {app.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                ))}
              </div>

              {/* Category */}
              <Badge className="bg-[#1D9E75]/15 text-[#1D9E75] border-[#1D9E75]/30 hover:bg-[#1D9E75]/20">
                {app.category}
              </Badge>

              {/* Price */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Price</p>
                <p
                  className="text-4xl font-bold text-[#1D9E75]"
                  style={{ textShadow: "0 0 30px rgba(29,158,117,0.3)" }}
                >
                  ${app.price}
                </p>
                <p className="text-xs text-muted-foreground mt-1">One-time · Full source code</p>
              </div>

              {/* Buttons */}
              <div className="space-y-2.5">
                <Button
                  variant="outline"
                  className="w-full border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.04]"
                  onClick={() => window.open(app.demoUrl, "_blank")}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Live Demo
                </Button>
                <Button
                  className="w-full bg-[#1D9E75] font-semibold text-white hover:bg-[#1D9E75]/90 shadow-[0_0_20px_rgba(29,158,117,0.3)]"
                  onClick={() => setShowBuyModal(true)}
                >
                  Buy Now — ${app.price}
                </Button>
              </div>

              {/* What you get */}
              <div className="rounded-xl border border-black/[0.06] bg-white p-3 space-y-2">
                {["Full source code", "Lifetime access", "Free updates for 6 months", "MIT license"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-[#1D9E75]">✓</span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Seller */}
              <div className="rounded-xl border border-black/[0.06] p-4">
                <p className="text-xs text-muted-foreground mb-3">Sold by</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75]/20 text-sm font-semibold text-[#1D9E75]">
                    {app.seller.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{app.seller.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <span className="text-yellow-400">★</span>
                      <span>{app.seller.rating}</span>
                      <span className="opacity-40">·</span>
                      <span>{app.seller.sold} sold</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Apps */}
        {relatedApps.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-semibold mb-6">More in {app.category}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {relatedApps.map((related) => (
                <Link key={related.id} href={`/marketplace/${related.id}`}>
                  <div className="group rounded-2xl border border-black/[0.06] bg-white overflow-hidden transition-all hover:border-[#1D9E75]/40 hover:shadow-[0_0_24px_rgba(29,158,117,0.1)] hover:-translate-y-0.5">
                    <div className="relative aspect-video bg-gray-100">
                      <Image src="/placeholder-app.svg" alt={related.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm">{related.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{related.tagline}</p>
                      <p className="mt-2 text-sm font-bold text-[#1D9E75]">${related.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowBuyModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-black/[0.1] bg-white p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            {/* Close */}
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-[#111] hover:bg-white/10 transition-colors"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold">Complete Purchase</h2>
              <p className="text-sm text-muted-foreground mt-1">You&apos;re buying {app.name}</p>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-4 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">App</span>
                <span className="font-medium">{app.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">License</span>
                <span className="font-medium">MIT · Full source</span>
              </div>
              <div className="border-t border-black/[0.06] pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-[#1D9E75]">${app.price}</span>
              </div>
            </div>

            {/* Payment placeholder */}
            <div className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Card number"
                className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM / YY"
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button
              className="w-full bg-[#1D9E75] font-semibold text-white hover:bg-[#1D9E75]/90 shadow-[0_0_24px_rgba(29,158,117,0.35)] py-3 text-base"
              onClick={handleBuy}
            >
              Pay ${app.price}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Secured by Stripe · Money-back guarantee
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
