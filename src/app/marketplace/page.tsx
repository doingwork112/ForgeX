"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  consumerApps,
  consumerCategories,
  consumerBounties,
  successStories,
  type ConsumerApp,
} from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CheckoutModal } from "@/components/checkout-modal";

/* ─── helpers ─── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Live Demo Modal ─── */
function DemoModal({ app, onClose, onBuy }: { app: ConsumerApp; onClose: () => void; onBuy: () => void }) {
  const [iframeError, setIframeError] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-4xl flex-col rounded-3xl border border-black/[0.1] bg-white shadow-2xl overflow-hidden" style={{ height: "88vh" }}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] bg-white px-5 py-3.5">
          <div>
            <p className="font-bold text-sm text-[#111]">{app.name} — Free Demo (PWA)</p>
            <p className="text-xs text-muted-foreground">This is a live demo — try any feature · Pay only if you love it</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={app.pwaDemoUrl} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 rounded-lg border border-[#1D9E75]/30 bg-[#1D9E75]/5 px-3 py-1.5 text-xs font-medium text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-colors">
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Full Screen
            </a>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-black/[0.05] hover:text-[#111] transition-colors text-lg">✕</button>
          </div>
        </div>
        {/* Fake browser chrome */}
        <div className="flex shrink-0 items-center gap-2 border-b border-black/[0.06] bg-[#f8f9fa] px-4 py-2">
          <div className="flex gap-1.5"><div className="h-3 w-3 rounded-full bg-red-400" /><div className="h-3 w-3 rounded-full bg-yellow-400" /><div className="h-3 w-3 rounded-full bg-green-400" /></div>
          <div className="flex-1 rounded-md border border-black/[0.08] bg-white px-3 py-1 text-xs text-muted-foreground truncate">{app.pwaDemoUrl}</div>
        </div>
        {/* Iframe */}
        {iframeError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="text-5xl">🔒</span>
            <div>
              <p className="text-base font-bold text-[#111]">This demo doesn&apos;t support embedding</p>
              <p className="text-sm text-muted-foreground mt-1">Click below to open the full experience</p>
            </div>
            <a href={app.pwaDemoUrl} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl bg-[#1D9E75] px-8 py-3.5 font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_4px_20px_rgba(29,158,117,0.3)]">
              Open Full Demo →
            </a>
          </div>
        ) : (
          <iframe src={app.demoUrl} className="flex-1 w-full" title={`${app.name} Demo`}
            onError={() => setIframeError(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
        )}
        {/* Footer CTA */}
        <div className="shrink-0 border-t border-black/[0.06] bg-gradient-to-r from-[#1D9E75]/[0.04] to-transparent px-5 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#111]">Love it? Pay <span className="text-[#1D9E75]">${app.deposit}</span> deposit to get started</p>
            <p className="text-[11px] text-muted-foreground">Money-back guarantee · Platform protected</p>
          </div>
          <button onClick={() => { onClose(); onBuy(); }} className="shrink-0 rounded-2xl bg-[#1D9E75] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_2px_12px_rgba(29,158,117,0.3)]">
            Pay ${app.deposit} Deposit →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Buy Modal ─── */
/* PlanPickerModal — choose basic/custom, then open real CheckoutModal */
function PlanPickerModal({
  app,
  onClose,
  onConfirm,
}: {
  app: ConsumerApp;
  onClose: () => void;
  onConfirm: (plan: "basic" | "custom") => void;
}) {
  const [plan, setPlan] = useState<"basic" | "custom">("basic");
  const [customNote, setCustomNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-black/[0.1] bg-white p-7 shadow-2xl">
        <button onClick={onClose} className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-black/[0.05] hover:text-[#111] text-lg">✕</button>
        <h2 className="text-xl font-bold text-[#111] mb-1">Choose Your Plan</h2>
        <p className="text-sm text-muted-foreground mb-5">Pay 40% deposit now, rest after you&apos;re satisfied</p>

        <div className="space-y-3 mb-5">
          <button onClick={() => setPlan("basic")}
            className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${plan === "basic" ? "border-[#1D9E75] bg-[#1D9E75]/[0.04]" : "border-black/[0.08] hover:border-black/[0.15]"}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-sm text-[#111]">Standard</p>
                <p className="text-xs text-muted-foreground mt-0.5">Full features, ready to use</p>
                <p className="text-xs text-muted-foreground">Deposit: <span className="font-semibold text-[#1D9E75]">${app.deposit}</span> · Balance: ${app.priceBasic - app.deposit}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-[#1D9E75]">${app.priceBasic}</p>
                <p className="text-[11px] text-muted-foreground">Total</p>
              </div>
            </div>
          </button>
          {app.priceCustom && (
            <button onClick={() => setPlan("custom")}
              className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${plan === "custom" ? "border-[#1D9E75] bg-[#1D9E75]/[0.04]" : "border-black/[0.08] hover:border-black/[0.15]"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#111]">Custom</p>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">Popular</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Custom branding, deployed and ready</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-[#1D9E75]">${app.priceCustom}</p>
                  <p className="text-[11px] text-muted-foreground">Total</p>
                </div>
              </div>
            </button>
          )}
        </div>

        {plan === "custom" && (
          <div className="mb-4">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Customization notes (optional)</label>
            <textarea value={customNote} onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g., Change the logo to my company brand, use our blue color scheme..."
              rows={2} className="w-full resize-none rounded-xl border border-black/[0.08] px-3 py-2.5 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none" />
          </div>
        )}

        <div className="rounded-xl border border-black/[0.06] bg-[#f8f9fa] px-4 py-3 mb-5 space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-2"><span className="text-[#1D9E75] font-bold">1.</span> Pay 40% deposit, developer starts customizing</p>
          <p className="flex items-center gap-2"><span className="text-[#1D9E75] font-bold">2.</span> Try the PWA for 3-7 days, pay balance when satisfied</p>
          <p className="flex items-center gap-2"><span className="text-[#1D9E75] font-bold">3.</span> Not satisfied? Request a deposit refund, platform protected</p>
        </div>

        <button onClick={() => onConfirm(plan)}
          className="w-full rounded-2xl bg-[#1D9E75] py-4 text-base font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_4px_20px_rgba(29,158,117,0.3)]">
          Confirm & Pay ${app.deposit} Deposit →
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3">Visa, Mastercard, Apple Pay accepted</p>
      </div>
    </div>
  );
}

/* ─── Product Card ─── */
function AppCard({ app, onTry, onBuy }: { app: ConsumerApp; onTry: () => void; onBuy: () => void }) {
  const catIcon = consumerCategories.find((c) => c.id === app.category)?.icon ?? "📱";
  const catLabel = consumerCategories.find((c) => c.id === app.category)?.label ?? "";
  const isHot = app.sold > 80;
  const isNew = app.id === "c8";

  return (
    <div className="group flex flex-col rounded-3xl border border-black/[0.06] bg-white overflow-hidden hover:border-[#1D9E75]/40 hover:shadow-[0_8px_40px_rgba(29,158,117,0.13)] hover:-translate-y-1 transition-all duration-300">
      {/* Image / preview area */}
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0fdf8] to-[#ecfdf5]">
        <span className="text-7xl select-none opacity-80 group-hover:scale-110 transition-transform duration-500">{catIcon}</span>
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onTry}
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-[#111] hover:bg-gray-50 transition-colors shadow-xl">
            <span className="h-2 w-2 rounded-full bg-[#1D9E75] animate-pulse" />
            Try Free PWA
          </button>
        </div>
        {/* Badges */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-[#111] shadow-sm">{catLabel}</span>
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 items-end">
          {isHot && <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">🔥 Hot</span>}
          {isNew && <span className="rounded-full bg-blue-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">✨ New</span>}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <div>
          <h3 className="font-bold text-[15px] text-[#111] leading-snug">{app.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{app.tagline}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {app.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-2.5 py-0.5 text-[11px] font-medium text-[#1D9E75]">
              ✓ {tag}
            </span>
          ))}
        </div>

        {/* Rating + sold */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <StarRating rating={app.rating} />
          <span className="font-semibold text-[#111]">{app.rating}</span>
          <span>·</span>
          <span>{app.sold} sold</span>
        </div>

        {/* Price */}
        <div className="rounded-2xl border border-[#1D9E75]/15 bg-gradient-to-r from-[#1D9E75]/[0.04] to-transparent p-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-[#1D9E75]">${app.priceBasic}</span>
              {app.priceCustom && <span className="text-xs text-muted-foreground ml-1">+</span>}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-orange-600">Deposit: ${app.deposit}</p>
              <p className="text-[10px] text-muted-foreground">Try before you pay the rest</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-auto">
          <button onClick={onTry}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1D9E75]/30 py-2.5 text-sm font-bold text-[#1D9E75] hover:border-[#1D9E75] hover:bg-[#1D9E75]/5 transition-all">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
            Try Free
          </button>
          <button onClick={onBuy}
            className="flex flex-1 items-center justify-center rounded-2xl bg-[#1D9E75] py-2.5 text-sm font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_2px_12px_rgba(29,158,117,0.25)]">
            Deposit ${app.deposit}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [demoApp, setDemoApp] = useState<ConsumerApp | null>(null);
  const [planApp, setPlanApp] = useState<ConsumerApp | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<{ appName: string; plan: "basic" | "custom"; totalPrice: number; deposit: number; tailPayment: number } | null>(null);
  const [boughtName, setBoughtName] = useState<string | null>(null);
  const [bountyText, setBountyText] = useState("");
  const [bountyPosted, setBountyPosted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const gridSectionRef = useRef<HTMLElement>(null);

  // JS-based fullpage scroll for intro sections (Apple-style strong snap)
  useEffect(() => {
    const el = containerRef.current;
    const hero = heroRef.current;
    const hiw = howItWorksRef.current;
    const grid = gridSectionRef.current;
    if (!el || !hero || !hiw || !grid) return;

    // Capture non-null refs for closures
    const container = el;
    const heroEl = hero;
    const gridEl = grid;

    let isAnimating = false;
    let currentSection = 0; // 0=hero, 1=how-it-works, 2=grid (free scroll)

    function getSnapTargets() {
      return [
        0,                         // hero top
        heroEl.offsetHeight,       // how-it-works top
        gridEl.offsetTop,          // grid top
      ];
    }

    function scrollToSection(idx: number) {
      const targets = getSnapTargets();
      const target = targets[idx] ?? targets[targets.length - 1];
      isAnimating = true;
      container.scrollTo({ top: target, behavior: "smooth" });
      // Release lock after animation
      setTimeout(() => { isAnimating = false; }, 700);
    }

    // Determine current section from scroll position
    function detectSection(): number {
      const targets = getSnapTargets();
      const st = container.scrollTop;
      if (st >= targets[2] - 50) return 2;
      if (st >= targets[1] - 50) return 1;
      return 0;
    }

    // Wheel handler — hijack scroll in intro sections
    function onWheel(e: WheelEvent) {
      if (isAnimating) { e.preventDefault(); return; }

      currentSection = detectSection();

      // If in the grid zone (section 2+), allow natural scroll
      // But if scrolling UP from very top of grid, snap back to how-it-works
      if (currentSection >= 2) {
        if (e.deltaY < 0 && container.scrollTop <= gridEl.offsetTop + 10) {
          e.preventDefault();
          currentSection = 1;
          scrollToSection(1);
        }
        return; // free scroll in grid area
      }

      // In intro sections: hijack scroll
      e.preventDefault();
      const threshold = 30; // minimum delta to trigger
      if (Math.abs(e.deltaY) < threshold) return;

      if (e.deltaY > 0) {
        // scroll down
        currentSection = Math.min(currentSection + 1, 2);
      } else {
        // scroll up
        currentSection = Math.max(currentSection - 1, 0);
      }
      scrollToSection(currentSection);
    }

    // Touch handler — same logic for mobile swipe
    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      if (isAnimating) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      currentSection = detectSection();

      // Free scroll in grid, but catch swipe-up at top of grid
      if (currentSection >= 2) {
        if (deltaY < -60 && container.scrollTop <= gridEl.offsetTop + 10) {
          currentSection = 1;
          scrollToSection(1);
        }
        return;
      }

      const threshold = 50;
      if (Math.abs(deltaY) < threshold) return;

      if (deltaY > 0) {
        currentSection = Math.min(currentSection + 1, 2);
      } else {
        currentSection = Math.max(currentSection - 1, 0);
      }
      scrollToSection(currentSection);
    }

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const filtered = consumerApps.filter((a) => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.includes(q) || a.tagline.includes(q) || a.tags.some((t) => t.includes(q));
    return matchCat && matchSearch;
  });

  function handlePlanConfirm(plan: "basic" | "custom") {
    if (!planApp) return;
    const totalPrice = plan === "basic" ? planApp.priceBasic : (planApp.priceCustom ?? planApp.priceBasic);
    setCheckoutItem({
      appName: planApp.name,
      plan,
      totalPrice,
      deposit: planApp.deposit,
      tailPayment: totalPrice - planApp.deposit,
    });
    setPlanApp(null);
  }

  function handleCheckoutSuccess(paymentIntentId: string) {
    const name = checkoutItem?.appName ?? "";
    setCheckoutItem(null);
    setBoughtName(name);
    console.log("Payment intent:", paymentIntentId);
    setTimeout(() => setBoughtName(null), 5000);
  }

  function submitBounty() {
    if (!bountyText.trim()) return;
    setBountyPosted(true);
    setBountyText("");
    setTimeout(() => setBountyPosted(false), 4000);
  }

  return (
    <div ref={containerRef} className="relative bg-[#f8f9fa]" style={{ height: "100vh", overflowY: "auto", WebkitOverflowScrolling: "touch" as never }}>
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[900px] rounded-full bg-[#1D9E75]/[0.06] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <Navbar />

      {/* Modals */}
      {demoApp && <DemoModal app={demoApp} onClose={() => setDemoApp(null)} onBuy={() => { setDemoApp(null); setPlanApp(demoApp); }} />}
      {planApp && <PlanPickerModal app={planApp} onClose={() => setPlanApp(null)} onConfirm={handlePlanConfirm} />}
      {checkoutItem && <CheckoutModal item={checkoutItem} onClose={() => setCheckoutItem(null)} onSuccess={handleCheckoutSuccess} />}

      {/* Toast: purchase success */}
      {boughtName && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/20 bg-white px-6 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.15)] animate-fade-up">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-bold text-[#111]">Deposit paid successfully!</p>
            <p className="text-xs text-muted-foreground">The developer has been notified and will reach out within 24h</p>
          </div>
        </div>
      )}

      {/* Toast: bounty posted */}
      {bountyPosted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/20 bg-white px-6 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.15)] animate-fade-up">
          <span className="text-2xl">🚀</span>
          <div>
            <p className="text-sm font-bold text-[#111]">Request posted!</p>
            <p className="text-xs text-muted-foreground">Developers can see it now, waiting for quotes...</p>
          </div>
        </div>
      )}

      <main>
        {/* ══════════════════════════════
            HERO — Full viewport snap section
        ══════════════════════════════ */}
        <section ref={heroRef} className="relative flex flex-col items-center justify-center px-6 text-center" style={{ height: "calc(100vh - 57px)" }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1D9E75]/25 bg-white px-4 py-1.5 text-sm font-medium text-[#1D9E75] shadow-sm mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
            1,200+ apps sold to happy customers 🎊
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#111] md:text-5xl">
            Don&apos;t Code? Buy Ready-Made Apps!
            <br />
            <span className="text-[#1D9E75]">Try Free, Pay Only If You Love It ✨</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
            Every app has a free PWA demo · Try for 3-7 days · Pay balance when satisfied · Deposit refund if not
          </p>

          {/* Benefit pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              { icon: "🎮", text: "Try Free PWA Demo" },
              { icon: "🔒", text: "Deposit Held in Escrow" },
              { icon: "↩️", text: "Money-Back Guarantee" },
              { icon: "⚡", text: "Customization in 24h" },
            ].map(({ icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-xs font-medium text-[#333] shadow-sm">
                {icon} {text}
              </span>
            ))}
          </div>

          {/* Search */}
          <div className="mx-auto mt-7 max-w-xl relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input ref={searchRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search: invoicing, booking, fitness, restaurant, campus..."
              className="w-full rounded-2xl border border-black/[0.08] bg-white pl-12 pr-4 py-3.5 text-sm text-[#111] placeholder:text-muted-foreground shadow-sm focus:border-[#1D9E75]/50 focus:outline-none transition-colors" />
          </div>

          {/* Scroll down indicator */}
          <div className="mt-8 flex flex-col items-center gap-1 animate-bounce text-gray-400">
            <span className="text-xs font-medium">Scroll</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* ══════════════════════════════
            HOW IT WORKS — Full viewport snap section
        ══════════════════════════════ */}
        <section ref={howItWorksRef} className="flex items-center justify-center px-4 sm:px-6" style={{ height: "100vh" }}>
          <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1D9E75]/25 bg-white px-4 py-1.5 text-sm font-medium text-[#1D9E75] shadow-sm mb-5">
                How It Works
              </span>
              <h2 className="text-3xl font-black text-[#111] md:text-4xl">Four simple steps to your own app</h2>
              <p className="text-base text-gray-500 mt-3 max-w-lg mx-auto">No coding, no risk. Try first, pay later.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {[
                { icon: "🎮", title: "Try Free PWA", desc: "No signup, no payment required. Open the demo and explore every feature." },
                { icon: "💰", title: "Pay 40% Deposit", desc: "Only pay when you love it. Deposit held safely in escrow." },
                { icon: "🛠️", title: "Developer Customizes", desc: "Logo, colors, content — all yours. Delivered within 24 hours." },
                { icon: "🎉", title: "Review & Pay Balance", desc: "Happy? Pay the rest. Not happy? Get your deposit refunded." },
              ].map(({ icon, title, desc }, i) => (
                <div key={title} className="relative flex flex-col items-center text-center gap-4">
                  {i < 3 && (
                    <div className="absolute right-0 top-8 hidden h-px w-1/2 translate-x-1/2 border-t-2 border-dashed border-[#1D9E75]/25 sm:block" />
                  )}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1D9E75]/10 text-3xl shadow-sm">
                    {icon}
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1D9E75] text-xs font-black text-white shadow">{i + 1}</span>
                  </div>
                  <p className="text-base font-bold text-[#111]">{title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{desc}</p>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <div className="mt-10 flex flex-col items-center gap-1 animate-bounce text-gray-400">
              <span className="text-xs font-medium">Browse Apps</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            MAIN: SIDEBAR + GRID — free scroll after snap disabled
        ══════════════════════════════ */}
        <section ref={gridSectionRef} className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 pt-10">
          <div className="flex gap-7">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-20 rounded-2xl border border-black/[0.06] bg-white p-2.5 shadow-sm">
                <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Categories</p>
                {consumerCategories.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left ${activeCategory === cat.id ? "bg-[#1D9E75] text-white shadow-[0_2px_8px_rgba(29,158,117,0.3)]" : "text-[#444] hover:bg-black/[0.04]"}`}>
                    <span className="text-base">{cat.icon}</span>
                    {cat.label}
                    {activeCategory === cat.id && (
                      <svg className="ml-auto" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </aside>

            {/* Mobile categories */}
            <div className="lg:hidden w-full -mt-4 mb-2">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {consumerCategories.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all ${activeCategory === cat.id ? "border-[#1D9E75] bg-[#1D9E75] text-white shadow-[0_2px_8px_rgba(29,158,117,0.25)]" : "border-black/[0.08] bg-white text-muted-foreground hover:text-[#111]"}`}>
                    <span>{cat.icon}</span>{cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-[#111]">{filtered.length}</span> apps
                  {activeCategory !== "all" && <span className="ml-1 text-[#1D9E75]">· {consumerCategories.find(c => c.id === activeCategory)?.label}</span>}
                </p>
                {search && (
                  <button onClick={() => setSearch("")} className="text-xs text-muted-foreground hover:text-[#111] transition-colors">
                    Clear ✕
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-black/[0.06] bg-white text-center px-8">
                  <span className="text-5xl">🤔</span>
                  <p className="text-sm font-semibold text-[#111]">Can&apos;t find what you need?</p>
                  <p className="text-xs text-muted-foreground">Post a custom request below and developers will build it for you!</p>
                  <button onClick={() => { setSearch(""); setActiveCategory("all"); }}
                    className="text-xs text-[#1D9E75] hover:underline">
                    View all apps →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((app) => (
                    <AppCard key={app.id} app={app} onTry={() => setDemoApp(app)} onBuy={() => setPlanApp(app)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            CUSTOM REQUEST / BOUNTY
        ══════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#0d6e52] to-[#1D9E75] p-8 md:p-10 text-white overflow-hidden relative">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium mb-4">
                  🎯 Custom Request
                </div>
                <h2 className="text-3xl font-black leading-tight mb-2">
                  Can&apos;t find what you need?
                  <br />Describe your idea — developers will build it!
                </h2>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  Describe it in plain English · Free to post · Multiple developers bid · See a PWA demo before you pay
                </p>
                <textarea value={bountyText} onChange={(e) => setBountyText(e.target.value)}
                  placeholder="e.g., I need a used textbook marketplace for students — photo uploads, school-based categories, buyer-seller messaging, mobile-friendly..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none backdrop-blur-sm" />
                <div className="mt-4 flex items-center gap-3">
                  <button onClick={submitBounty} disabled={!bountyText.trim()}
                    className="flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-[#1D9E75] hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                    🚀 Post Request Free
                  </button>
                  <span className="text-xs text-white/60">Free · No signup · Multiple bids</span>
                </div>
              </div>

              {/* Right: bounty wall */}
              <div>
                <p className="text-sm font-bold text-white/80 mb-3">📋 Latest Requests</p>
                <div className="space-y-3">
                  {consumerBounties.map((b) => (
                    <div key={b.id} className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-4 hover:bg-white/15 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">{b.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white leading-snug line-clamp-2">{b.title}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-xs text-white/60">{b.author}</span>
                            <span className="text-sm font-black text-yellow-300">{b.budget}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/hunters" className="block text-center text-xs text-white/60 hover:text-white transition-colors py-1">
                    View all {">"}{">"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            SUCCESS STORIES
        ══════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1D9E75] mb-2">Success Stories</p>
            <h2 className="text-2xl font-black text-[#111]">They can&apos;t code either, but they got their own app 🏆</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {successStories.map((story) => (
              <div key={story.id} className={`rounded-3xl border border-black/[0.06] bg-gradient-to-br ${story.gradient} p-6 space-y-4`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow text-xl font-black text-[#1D9E75]">{story.avatar}</div>
                  <div>
                    <p className="font-bold text-sm text-[#111]">{story.name}</p>
                    <p className="text-xs text-muted-foreground">{story.role}</p>
                  </div>
                  <span className="ml-auto text-3xl">{story.emoji}</span>
                </div>
                <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-4 space-y-2">
                  <p className="text-xs font-bold text-[#1D9E75]">Bought: {story.appName}</p>
                  <p className="text-xs text-[#444] leading-relaxed">&ldquo;{story.story}&rdquo;</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#1D9E75] text-lg">→</span>
                  <p className="text-xs font-semibold text-[#111] leading-relaxed">{story.result}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════
            TRUST BAR
        ══════════════════════════════ */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: "🔒", title: "Escrow Protected", desc: "Deposit held by platform, released only after approval" },
              { icon: "🎮", title: "Try Before You Buy", desc: "Every app has a free PWA demo you can test" },
              { icon: "↩️", title: "Money-Back Guarantee", desc: "7-day review period — not satisfied, get your deposit back" },
              { icon: "💬", title: "1-on-1 Support", desc: "Chat directly with the developer after purchase" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-black/[0.06] bg-white p-5 text-center hover:border-[#1D9E75]/30 hover:shadow-sm transition-all">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-sm font-bold text-[#111]">{title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
