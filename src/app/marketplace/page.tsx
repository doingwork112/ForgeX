"use client";

import { useState, useRef } from "react";
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
function DemoModal({ app, onClose }: { app: ConsumerApp; onClose: () => void }) {
  const [iframeError, setIframeError] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-4xl flex-col rounded-3xl border border-black/[0.1] bg-white shadow-2xl overflow-hidden" style={{ height: "88vh" }}>
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] bg-white px-5 py-3.5">
          <div>
            <p className="font-bold text-sm text-[#111]">{app.name} — 免费体验版 (PWA)</p>
            <p className="text-xs text-muted-foreground">这是真实运行的演示，点击任意功能试试看 · 满意了再付款</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={app.pwaDemoUrl} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 rounded-lg border border-[#1D9E75]/30 bg-[#1D9E75]/5 px-3 py-1.5 text-xs font-medium text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-colors">
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              全屏打开
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
              <p className="text-base font-bold text-[#111]">该演示不支持直接嵌入</p>
              <p className="text-sm text-muted-foreground mt-1">点击下方按钮在新窗口完整体验</p>
            </div>
            <a href={app.pwaDemoUrl} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl bg-[#1D9E75] px-8 py-3.5 font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_4px_20px_rgba(29,158,117,0.3)]">
              打开完整体验 →
            </a>
          </div>
        ) : (
          <iframe src={app.demoUrl} className="flex-1 w-full" title={`${app.name} 体验版`}
            onError={() => setIframeError(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
        )}
        {/* Footer CTA */}
        <div className="shrink-0 border-t border-black/[0.06] bg-gradient-to-r from-[#1D9E75]/[0.04] to-transparent px-5 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#111]">体验满意？先付 <span className="text-[#1D9E75]">¥{app.deposit}</span> 定金，开发者立即开始为你定制</p>
            <p className="text-[11px] text-muted-foreground">不满意可退定金，全程平台保障</p>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-2xl bg-[#1D9E75] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_2px_12px_rgba(29,158,117,0.3)]">
            付定金 ¥{app.deposit} →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Buy Modal ─── */
function BuyModal({ app, onClose, onBuy }: { app: ConsumerApp; onClose: () => void; onBuy: () => void }) {
  const [plan, setPlan] = useState<"basic" | "custom">("basic");
  const [step, setStep] = useState<"plan" | "deposit">("plan");
  const [customNote, setCustomNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-black/[0.1] bg-white p-7 shadow-2xl">
        <button onClick={onClose} className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-black/[0.05] hover:text-[#111] text-lg">✕</button>

        {step === "plan" ? (
          <>
            <h2 className="text-xl font-bold text-[#111] mb-1">选择购买方案</h2>
            <p className="text-sm text-muted-foreground mb-5">先付 40% 定金，体验满意再付尾款</p>
            <div className="space-y-3 mb-5">
              <button onClick={() => setPlan("basic")}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${plan === "basic" ? "border-[#1D9E75] bg-[#1D9E75]/[0.04]" : "border-black/[0.08] hover:border-black/[0.15]"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-[#111]">基础版</p>
                    <p className="text-xs text-muted-foreground mt-0.5">完整功能，直接可用</p>
                    <p className="text-xs text-muted-foreground">先付定金 <span className="font-semibold text-[#1D9E75]">¥{app.deposit}</span>，满意再付尾款 <span className="font-semibold">¥{app.priceBasic - app.deposit}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1D9E75]">¥{app.priceBasic}</p>
                    <p className="text-[11px] text-muted-foreground">总价</p>
                  </div>
                </div>
              </button>
              {app.priceCustom && (
                <button onClick={() => setPlan("custom")}
                  className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${plan === "custom" ? "border-[#1D9E75] bg-[#1D9E75]/[0.04]" : "border-black/[0.08] hover:border-black/[0.15]"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-[#111]">定制版</p>
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">推荐</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">帮你改 logo/配色，部署好直接用</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1D9E75]">¥{app.priceCustom}</p>
                      <p className="text-[11px] text-muted-foreground">总价</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
            {plan === "custom" && (
              <div className="mb-4">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">定制要求（选填）</label>
                <textarea value={customNote} onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="例如：帮我改成北京大学的 logo，加上我们学校的绿色配色..."
                  rows={2} className="w-full resize-none rounded-xl border border-black/[0.08] px-3 py-2.5 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none" />
              </div>
            )}
            <div className="rounded-xl border border-black/[0.06] bg-[#f8f9fa] px-4 py-3 mb-5 space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><span className="text-[#1D9E75] font-bold">①</span> 先付 40% 定金，开发者开始为你定制</p>
              <p className="flex items-center gap-2"><span className="text-[#1D9E75] font-bold">②</span> 体验 PWA 版 3~7 天，满意再付尾款</p>
              <p className="flex items-center gap-2"><span className="text-[#1D9E75] font-bold">③</span> 不满意可申请退定金，平台全程保障</p>
            </div>
            <button onClick={() => setStep("deposit")}
              className="w-full rounded-2xl bg-[#1D9E75] py-4 text-base font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_4px_20px_rgba(29,158,117,0.3)]">
              确认方案，先付定金 ¥{app.deposit} →
            </button>
            <p className="text-center text-xs text-muted-foreground mt-3">支持微信支付 / 支付宝 / 银行卡</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep("plan")} className="text-muted-foreground hover:text-[#111] transition-colors">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-xl font-bold text-[#111]">支付定金 ¥{app.deposit}</h2>
            </div>
            <div className="rounded-2xl border border-[#1D9E75]/20 bg-[#1D9E75]/[0.04] p-4 mb-5 space-y-1 text-sm">
              <p className="font-semibold text-[#111]">{app.name} · {plan === "basic" ? "基础版" : "定制版"}</p>
              <p className="text-muted-foreground text-xs">定金 ¥{app.deposit} · 尾款 ¥{(plan === "basic" ? app.priceBasic : (app.priceCustom ?? app.priceBasic)) - app.deposit} · 总计 ¥{plan === "basic" ? app.priceBasic : app.priceCustom}</p>
            </div>
            {/* Card form (mock) */}
            <div className="space-y-3 mb-5">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#f8f9fa] px-3 py-3">
                  <span className="text-xl">💚</span>
                  <span className="text-sm font-medium text-[#111]">微信支付</span>
                </div>
                <div className="flex-1 flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#f8f9fa] px-3 py-3">
                  <span className="text-xl">💙</span>
                  <span className="text-sm font-medium text-[#111]">支付宝</span>
                </div>
              </div>
              <div className="text-center text-xs text-muted-foreground">或</div>
              <input placeholder="卡号" className="w-full rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none" />
              <div className="flex gap-2">
                <input placeholder="有效期 MM/YY" className="flex-1 rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none" />
                <input placeholder="CVV" className="w-20 rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none" />
              </div>
            </div>
            <button onClick={onBuy}
              className="w-full rounded-2xl bg-[#1D9E75] py-4 text-base font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_4px_20px_rgba(29,158,117,0.3)]">
              确认支付定金 ¥{app.deposit} 🎉
            </button>
            <p className="text-center text-[11px] text-muted-foreground mt-3">定金由平台托管，验收满意后再释放给开发者</p>
          </>
        )}
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
            免费体验 PWA
          </button>
        </div>
        {/* Badges */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-[#111] shadow-sm">{catLabel}</span>
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 items-end">
          {isHot && <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">🔥 热卖</span>}
          {isNew && <span className="rounded-full bg-blue-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">✨ 新品</span>}
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
          <span>已售 {app.sold} 份</span>
        </div>

        {/* Price */}
        <div className="rounded-2xl border border-[#1D9E75]/15 bg-gradient-to-r from-[#1D9E75]/[0.04] to-transparent p-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-[#1D9E75]">¥{app.priceBasic}</span>
              {app.priceCustom && <span className="text-xs text-muted-foreground ml-1">起</span>}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-orange-600">定金仅 ¥{app.deposit}</p>
              <p className="text-[10px] text-muted-foreground">先体验再付尾款</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-auto">
          <button onClick={onTry}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1D9E75]/30 py-2.5 text-sm font-bold text-[#1D9E75] hover:border-[#1D9E75] hover:bg-[#1D9E75]/5 transition-all">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
            免费试用
          </button>
          <button onClick={onBuy}
            className="flex flex-1 items-center justify-center rounded-2xl bg-[#1D9E75] py-2.5 text-sm font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_2px_12px_rgba(29,158,117,0.25)]">
            付定金 ¥{app.deposit}
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
  const [buyApp, setBuyApp] = useState<ConsumerApp | null>(null);
  const [boughtName, setBoughtName] = useState<string | null>(null);
  const [bountyText, setBountyText] = useState("");
  const [bountyPosted, setBountyPosted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = consumerApps.filter((a) => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.includes(q) || a.tagline.includes(q) || a.tags.some((t) => t.includes(q));
    return matchCat && matchSearch;
  });

  function handleBuy() {
    if (!buyApp) return;
    setBoughtName(buyApp.name);
    setBuyApp(null);
    setTimeout(() => setBoughtName(null), 5000);
  }

  function submitBounty() {
    if (!bountyText.trim()) return;
    setBountyPosted(true);
    setBountyText("");
    setTimeout(() => setBountyPosted(false), 4000);
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[400px] w-[900px] rounded-full bg-[#1D9E75]/[0.06] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <Navbar />

      {/* Modals */}
      {demoApp && <DemoModal app={demoApp} onClose={() => setDemoApp(null)} />}
      {buyApp && <BuyModal app={buyApp} onClose={() => setBuyApp(null)} onBuy={handleBuy} />}

      {/* Toast: purchase success */}
      {boughtName && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/20 bg-white px-6 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.15)] animate-fade-up">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-bold text-[#111]">定金支付成功！</p>
            <p className="text-xs text-muted-foreground">开发者已收到通知，将在 24h 内联系你</p>
          </div>
        </div>
      )}

      {/* Toast: bounty posted */}
      {bountyPosted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/20 bg-white px-6 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.15)] animate-fade-up">
          <span className="text-2xl">🚀</span>
          <div>
            <p className="text-sm font-bold text-[#111]">需求发布成功！</p>
            <p className="text-xs text-muted-foreground">程序员们马上就能看到，等候报价中...</p>
          </div>
        </div>
      )}

      <main>
        {/* ══════════════════════════════
            HERO
        ══════════════════════════════ */}
        <section className="relative px-6 pt-14 pb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1D9E75]/25 bg-white px-4 py-1.5 text-sm font-medium text-[#1D9E75] shadow-sm mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
            1200+ 人已经买到自己的 App 🎊
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#111] md:text-5xl">
            不想编程？直接买现成 App！
            <br />
            <span className="text-[#1D9E75]">先免费体验，满意再付款 ✨</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
            所有 App 都有免费 PWA 体验版 · 先试用 3~7 天 · 满意再付尾款 · 不满意退定金
          </p>

          {/* Benefit pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {[
              { icon: "🎮", text: "先免费试用 PWA" },
              { icon: "🔒", text: "定金平台托管" },
              { icon: "↩️", text: "不满意退定金" },
              { icon: "⚡", text: "24h 内开始定制" },
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
              placeholder="搜索：记账 / 预约 / 校园 / 餐厅 / 健身..."
              className="w-full rounded-2xl border border-black/[0.08] bg-white pl-12 pr-4 py-3.5 text-sm text-[#111] placeholder:text-muted-foreground shadow-sm focus:border-[#1D9E75]/50 focus:outline-none transition-colors" />
          </div>
        </section>

        {/* ══════════════════════════════
            HOW IT WORKS — horizontal strip
        ══════════════════════════════ */}
        <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
          <div className="rounded-3xl border border-black/[0.06] bg-white p-5 sm:p-6 shadow-sm">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">怎么买？超简单 👇</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { step: "01", icon: "🎮", title: "免费体验 PWA", desc: "先试用，不用注册，不用付钱" },
                { step: "02", icon: "💰", title: "付 40% 定金", desc: "满意了再付定金，启动定制" },
                { step: "03", icon: "🛠️", title: "开发者定制", desc: "帮你改 logo、配色、内容" },
                { step: "04", icon: "🎉", title: "验收付尾款", desc: "满意才付尾款，不满意退定金" },
              ].map(({ step, icon, title, desc }, i) => (
                <div key={step} className="relative flex flex-col items-center text-center gap-2">
                  {i < 3 && (
                    <div className="absolute right-0 top-5 hidden h-px w-1/2 translate-x-1/2 border-t-2 border-dashed border-[#1D9E75]/25 sm:block" />
                  )}
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1D9E75]/10 text-2xl">
                    {icon}
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1D9E75] text-[10px] font-black text-white">{i + 1}</span>
                  </div>
                  <p className="text-sm font-bold text-[#111]">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            MAIN: SIDEBAR + GRID
        ══════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex gap-7">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-20 rounded-2xl border border-black/[0.06] bg-white p-2.5 shadow-sm">
                <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">软件分类</p>
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
                  共 <span className="font-bold text-[#111]">{filtered.length}</span> 款软件
                  {activeCategory !== "all" && <span className="ml-1 text-[#1D9E75]">· {consumerCategories.find(c => c.id === activeCategory)?.label}</span>}
                </p>
                {search && (
                  <button onClick={() => setSearch("")} className="text-xs text-muted-foreground hover:text-[#111] transition-colors">
                    清除搜索 ✕
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-3xl border border-black/[0.06] bg-white text-center px-8">
                  <span className="text-5xl">🤔</span>
                  <p className="text-sm font-semibold text-[#111]">没找到你想要的？</p>
                  <p className="text-xs text-muted-foreground">在下方「我要定制」说说你的想法，程序员帮你免费做！</p>
                  <button onClick={() => { setSearch(""); setActiveCategory("all"); }}
                    className="text-xs text-[#1D9E75] hover:underline">
                    查看全部软件 →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((app) => (
                    <AppCard key={app.id} app={app} onTry={() => setDemoApp(app)} onBuy={() => setBuyApp(app)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            我要定制 / BOUNTY
        ══════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#0d6e52] to-[#1D9E75] p-8 md:p-10 text-white overflow-hidden relative">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium mb-4">
                  🎯 我要定制 / 发布悬赏
                </div>
                <h2 className="text-3xl font-black leading-tight mb-2">
                  没找到想要的？
                  <br />说说你的想法，程序员帮你做！
                </h2>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  完全用大白话描述 · 免费发布 · 多个程序员报价 · 先看 PWA Demo 再决定付不付
                </p>
                <textarea value={bountyText} onChange={(e) => setBountyText(e.target.value)}
                  placeholder="例如：我想做一个给学生用的二手教材交换平台，可以发图片，按学校分类，买卖双方可以私信聊天，手机版就行..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none backdrop-blur-sm" />
                <div className="mt-4 flex items-center gap-3">
                  <button onClick={submitBounty} disabled={!bountyText.trim()}
                    className="flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-[#1D9E75] hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                    🚀 免费发布需求
                  </button>
                  <span className="text-xs text-white/60">免费 · 无需注册 · 多人报价</span>
                </div>
              </div>

              {/* Right: bounty wall */}
              <div>
                <p className="text-sm font-bold text-white/80 mb-3">📋 最新悬赏需求</p>
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
                    查看全部 {">"}{">"}
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
            <p className="text-xs font-bold uppercase tracking-widest text-[#1D9E75] mb-2">真实用户故事</p>
            <h2 className="text-2xl font-black text-[#111]">他们也不懂编程，但买到了自己的 App 🏆</h2>
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
                  <p className="text-xs font-bold text-[#1D9E75]">买了：{story.appName}</p>
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
              { icon: "🔒", title: "定金平台托管", desc: "资金平台保管，验收满意才打给开发者" },
              { icon: "🎮", title: "先试用 PWA", desc: "每款 App 都能免费体验，不满意不买" },
              { icon: "↩️", title: "不满意退定金", desc: "7 天内验收，不满意申请退定金" },
              { icon: "💬", title: "一对一服务", desc: "购买后可直接联系开发者提问和定制" },
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
