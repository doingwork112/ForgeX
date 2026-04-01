"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { consumerApps, consumerCategories, consumerBounties } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );
}

// Live Preview Modal
function PreviewModal({ app, onClose }: { app: typeof consumerApps[0]; onClose: () => void }) {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-black/[0.1] bg-white shadow-2xl overflow-hidden flex flex-col" style={{ height: "85vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-3.5 shrink-0">
          <div>
            <p className="font-semibold text-sm text-[#111]">{app.name} — 在线体验</p>
            <p className="text-xs text-muted-foreground">这是实际运行的 Demo，点击任意功能试试看</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={app.demoUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#1D9E75] hover:underline flex items-center gap-1">
              新窗口打开 ↗
            </a>
            <button onClick={onClose} className="text-muted-foreground hover:text-[#111] text-xl leading-none">✕</button>
          </div>
        </div>
        {/* Browser bar */}
        <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#f8f9fa] px-4 py-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 rounded-md border border-black/[0.08] bg-white px-3 py-1 text-xs text-muted-foreground truncate">
            {app.demoUrl}
          </div>
        </div>
        {/* Iframe */}
        {iframeError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-8">
            <span className="text-5xl">🔒</span>
            <p className="text-base font-semibold text-[#111]">该 Demo 不支持直接嵌入预览</p>
            <p className="text-sm text-muted-foreground">点击下方按钮在新窗口完整体验</p>
            <a href={app.demoUrl} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl bg-[#1D9E75] px-7 py-3 font-semibold text-white hover:bg-[#1D9E75]/90 transition-colors">
              打开完整 Demo →
            </a>
          </div>
        ) : (
          <iframe
            src={app.demoUrl}
            className="flex-1 w-full"
            title={`${app.name} 在线体验`}
            onError={() => setIframeError(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
      </div>
    </div>
  );
}

// Buy Modal
function BuyModal({ app, onClose, onBuy }: { app: typeof consumerApps[0]; onClose: () => void; onBuy: () => void }) {
  const [plan, setPlan] = useState<"basic" | "custom">("basic");
  const [contact, setContact] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-black/[0.1] bg-white p-7 shadow-2xl">
        <button onClick={onClose} className="absolute right-5 top-5 text-muted-foreground hover:text-[#111] text-xl">✕</button>
        <h2 className="text-xl font-bold text-[#111] mb-1">购买 {app.name}</h2>
        <p className="text-sm text-muted-foreground mb-5">买断制，一次付费永久使用</p>

        {/* Plan picker */}
        <div className="space-y-3 mb-5">
          <button
            onClick={() => setPlan("basic")}
            className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${plan === "basic" ? "border-[#1D9E75] bg-[#1D9E75]/5" : "border-black/[0.08] hover:border-black/[0.15]"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-[#111]">基础版</p>
                <p className="text-xs text-muted-foreground mt-0.5">完整源代码，自己部署</p>
              </div>
              <p className="text-2xl font-bold text-[#1D9E75]">¥{app.priceBasic}</p>
            </div>
          </button>
          {app.priceCustom && (
            <button
              onClick={() => setPlan("custom")}
              className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${plan === "custom" ? "border-[#1D9E75] bg-[#1D9E75]/5" : "border-black/[0.08] hover:border-black/[0.15]"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[#111]">定制版</p>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-600">推荐</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">帮你改好名字/logo，部署好直接用</p>
                </div>
                <p className="text-2xl font-bold text-[#1D9E75]">¥{app.priceCustom}</p>
              </div>
            </button>
          )}
        </div>

        {plan === "custom" && (
          <div className="mb-4">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">定制要求（选填）</label>
            <textarea
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="例如：帮我改成北京大学 logo，加上我们学校的配色..."
              rows={2}
              className="w-full resize-none rounded-xl border border-black/[0.08] px-3 py-2.5 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none"
            />
          </div>
        )}

        <div className="rounded-xl border border-black/[0.06] bg-[#f8f9fa] p-3 mb-5 space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-2"><span className="text-[#1D9E75]">✓</span> 付款后 24 小时内收到源代码</p>
          <p className="flex items-center gap-2"><span className="text-[#1D9E75]">✓</span> 买断制，不收任何年费</p>
          <p className="flex items-center gap-2"><span className="text-[#1D9E75]">✓</span> 7 天内不满意全额退款</p>
        </div>

        <button
          onClick={onBuy}
          className="w-full rounded-2xl bg-[#1D9E75] py-4 text-base font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_4px_20px_rgba(29,158,117,0.3)]"
        >
          立即付款 ¥{plan === "basic" ? app.priceBasic : app.priceCustom}
        </button>
        <p className="text-center text-xs text-muted-foreground mt-3">支持微信支付 / 支付宝 / 银行卡</p>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [previewApp, setPreviewApp] = useState<typeof consumerApps[0] | null>(null);
  const [buyApp, setBuyApp] = useState<typeof consumerApps[0] | null>(null);
  const [boughtId, setBoughtId] = useState<string | null>(null);
  const [bountyText, setBountyText] = useState("");
  const [bountyPosted, setBountyPosted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = consumerApps.filter((a) => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const matchSearch = search === "" || a.name.includes(search) || a.tagline.includes(search) || a.tags.some(t => t.includes(search));
    return matchCat && matchSearch;
  });

  function handleBuy() {
    if (!buyApp) return;
    setBoughtId(buyApp.id);
    setBuyApp(null);
    setTimeout(() => setBoughtId(null), 4000);
  }

  function submitBounty() {
    if (!bountyText.trim()) return;
    setBountyPosted(true);
    setBountyText("");
    setTimeout(() => setBountyPosted(false), 4000);
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa]">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[800px] rounded-full bg-[#1D9E75]/[0.05] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      </div>

      <Navbar />

      {previewApp && <PreviewModal app={previewApp} onClose={() => setPreviewApp(null)} />}
      {buyApp && <BuyModal app={buyApp} onClose={() => setBuyApp(null)} onBuy={handleBuy} />}

      {/* Success toast */}
      {boughtId && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/30 bg-white px-6 py-4 shadow-xl animate-fade-up">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-bold text-[#111]">购买成功！</p>
            <p className="text-xs text-muted-foreground">卖家将在 24 小时内发送源代码到你的邮箱</p>
          </div>
        </div>
      )}

      {/* Bounty posted toast */}
      {bountyPosted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-[#1D9E75]/30 bg-white px-6 py-4 shadow-xl animate-fade-up">
          <span className="text-2xl">🚀</span>
          <div>
            <p className="text-sm font-bold text-[#111]">需求已发布！</p>
            <p className="text-xs text-muted-foreground">程序员们马上就能看到你的需求，等待报价吧</p>
          </div>
        </div>
      )}

      <main>
        {/* ─── Hero ─── */}
        <section className="relative text-center px-6 pt-16 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1D9E75]/25 bg-[#1D9E75]/8 px-4 py-1.5 text-sm text-[#1D9E75] mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
            已有 <strong>1200+</strong> 人买到自己想要的软件
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#111] leading-tight max-w-3xl mx-auto">
            不用懂编程，直接买现成软件 🛍️
            <br />
            <span className="text-[#1D9E75]">或者描述想法，让程序员帮你做！</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-lg mx-auto">
            所有软件买断制，一次付费永久使用。7 天不满意全额退款，放心买。
          </p>

          {/* Search */}
          <div className="mt-8 mx-auto max-w-xl relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索：记账、预约、校园、健身..."
              className="w-full rounded-2xl border border-black/[0.1] bg-white pl-12 pr-4 py-3.5 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none shadow-sm transition-colors"
            />
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm">
            {[
              { v: "9 大类", l: "软件分类" },
              { v: "买断制", l: "一次付费永久用" },
              { v: "24h", l: "交付速度" },
              { v: "7 天", l: "不满意退款" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="text-xl font-bold text-[#1D9E75]">{v}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Main: Sidebar + Grid ─── */}
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-20 rounded-2xl border border-black/[0.06] bg-white p-3 space-y-1">
                <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">软件分类</p>
                {consumerCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                      activeCategory === cat.id
                        ? "bg-[#1D9E75] text-white"
                        : "text-[#333] hover:bg-black/[0.04]"
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Mobile category row */}
            <div className="lg:hidden w-full mb-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {consumerCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                      activeCategory === cat.id
                        ? "border-[#1D9E75] bg-[#1D9E75] text-white"
                        : "border-black/[0.08] text-muted-foreground hover:text-[#111]"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              <p className="mb-4 text-sm text-muted-foreground">
                找到 <span className="font-semibold text-[#111]">{filtered.length}</span> 款软件
              </p>

              {filtered.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-black/[0.06] bg-white text-muted-foreground">
                  <span className="text-4xl">🔍</span>
                  <p className="text-sm">没找到？ 试试在下面&ldquo;我要定制&rdquo;说说你的想法</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((app) => (
                    <div
                      key={app.id}
                      className="group rounded-2xl border border-black/[0.06] bg-white overflow-hidden hover:border-[#1D9E75]/40 hover:shadow-[0_4px_30px_rgba(29,158,117,0.12)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {/* Image area */}
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-[#1D9E75]/10 to-[#1D9E75]/5 flex items-center justify-center overflow-hidden">
                        <span className="text-6xl select-none">
                          {consumerCategories.find(c => c.id === app.category)?.icon ?? "📱"}
                        </span>
                        {/* Preview button on hover */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setPreviewApp(app)}
                            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#111] hover:bg-gray-50 transition-colors shadow-lg"
                          >
                            <span className="h-2 w-2 rounded-full bg-[#1D9E75] animate-pulse" />
                            在线体验
                          </button>
                        </div>
                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-[#111]">
                            {consumerCategories.find(c => c.id === app.category)?.label}
                          </span>
                        </div>
                        {app.sold > 100 && (
                          <div className="absolute top-3 right-3">
                            <span className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">
                              🔥 热卖
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-base text-[#111] leading-snug">{app.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{app.tagline}</p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {app.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full bg-[#f8f9fa] border border-black/[0.06] px-2.5 py-0.5 text-[11px] text-muted-foreground">
                              ✓ {tag}
                            </span>
                          ))}
                        </div>

                        {/* Rating + sold */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <StarRating rating={app.rating} />
                          <span className="font-medium text-[#111]">{app.rating}</span>
                          <span>·</span>
                          <span>已售 {app.sold} 份</span>
                        </div>

                        {/* Price + buttons */}
                        <div className="pt-1 border-t border-black/[0.04]">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-2xl font-bold text-[#1D9E75]">¥{app.priceBasic}</span>
                              {app.priceCustom && (
                                <span className="ml-1.5 text-xs text-muted-foreground">起</span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground rounded-full bg-green-50 border border-green-100 px-2 py-0.5 text-green-600">
                              买断制
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setPreviewApp(app)}
                              className="flex-1 rounded-xl border border-black/[0.08] py-2.5 text-sm font-medium text-[#333] hover:border-[#1D9E75]/40 hover:text-[#1D9E75] transition-colors"
                            >
                              在线体验
                            </button>
                            <button
                              onClick={() => setBuyApp(app)}
                              className="flex-1 rounded-xl bg-[#1D9E75] py-2.5 text-sm font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_2px_12px_rgba(29,158,117,0.25)]"
                            >
                              立即购买
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── 我要定制 Section ─── */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#1D9E75]/15 bg-gradient-to-br from-[#1D9E75]/[0.04] to-transparent p-8 md:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              {/* Left: composer */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#1D9E75]/25 bg-[#1D9E75]/8 px-3 py-1.5 text-sm text-[#1D9E75] mb-4">
                  🎯 我要定制
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#111] mb-2 leading-tight">
                  没找到想要的？
                  <br />
                  说说你的想法，<span className="text-[#1D9E75]">免费程序员帮你做！</span>
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  描述你想要什么软件，提交后程序员们会来报价。不懂技术没关系，用大白话说就行。
                </p>
                <textarea
                  value={bountyText}
                  onChange={(e) => setBountyText(e.target.value)}
                  placeholder="例如：我想做一个给学生用的二手教材交换平台，可以发图片，按学校分类，买卖双方可以私信..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-black/[0.08] bg-white px-5 py-4 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none shadow-sm transition-colors"
                />
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={submitBounty}
                    disabled={!bountyText.trim()}
                    className="flex items-center gap-2 rounded-2xl bg-[#1D9E75] px-7 py-3 font-bold text-white hover:bg-[#1D9E75]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_4px_20px_rgba(29,158,117,0.3)]"
                  >
                    🚀 发布需求
                  </button>
                  <span className="text-xs text-muted-foreground">完全免费，无需注册</span>
                </div>
              </div>

              {/* Right: bounty wall */}
              <div>
                <p className="text-sm font-semibold text-[#111] mb-3">📋 最新需求墙</p>
                <div className="space-y-3">
                  {consumerBounties.map((b) => (
                    <div key={b.id} className="rounded-2xl border border-black/[0.06] bg-white p-4 hover:border-[#1D9E75]/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75]">
                          {b.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#111] leading-snug">{b.title}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-xs text-muted-foreground">{b.author}</span>
                            <span className="text-sm font-bold text-[#1D9E75]">预算 {b.budget}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/hunters">
                    <div className="text-center text-xs text-[#1D9E75] hover:underline mt-2 cursor-pointer">
                      查看全部需求 →
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Trust bar ─── */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: "🔒", title: "安全交易", desc: "资金由平台托管，收货后才结算" },
              { icon: "💬", title: "卖家在线答疑", desc: "购买后可直接联系卖家提问" },
              { icon: "🔄", title: "7 天退款", desc: "不满意无理由全额退款" },
              { icon: "📦", title: "24h 交付", desc: "付款后一天内收到源代码" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-black/[0.06] bg-white p-5 text-center">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="text-sm font-semibold text-[#111]">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
