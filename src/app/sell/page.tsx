import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function SellPage() {
  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-[#111]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[#1D9E75]/[0.06] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-20">
        {/* Hero */}
        <div className="mb-20 flex flex-col items-center text-center">
          <span className="mb-4 inline-block rounded-full border border-[#1D9E75]/30 bg-[#1D9E75]/10 px-4 py-1.5 text-xs font-medium text-[#1D9E75]">
            For Developers
          </span>
          <h1 className="mb-5 text-5xl font-bold tracking-tight sm:text-6xl">
            Turn your code into cash
          </h1>
          <p className="mb-10 max-w-lg text-lg text-muted-foreground">
            Sell your apps to 10,000+ buyers. Keep 85% of every sale.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/sell/new">
              <button className="rounded-xl bg-[#1D9E75] px-7 py-3 font-semibold text-white hover:bg-[#1D9E75]/90 transition-colors">
                Start Selling
              </button>
            </Link>
            <Link href="/marketplace">
              <button className="rounded-xl border border-black/[0.08] px-7 py-3 font-semibold text-muted-foreground hover:text-[#111] hover:border-black/[0.15] transition-colors">
                View Marketplace
              </button>
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mb-20 rounded-2xl border border-black/[0.06] bg-white px-8 py-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "85% payout", label: "You keep 85% of every sale" },
              { value: "10k+ buyers", label: "Active buyers on the platform" },
              { value: "$800 avg", label: "Average sale price" },
              { value: "Free to list", label: "No upfront or monthly fees" },
            ].map((stat) => (
              <div key={stat.value} className="flex flex-col items-center text-center gap-1">
                <span className="text-xl font-bold text-[#1D9E75]">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to sell */}
        <div className="mb-20">
          <h2 className="mb-10 text-center text-2xl font-bold">How it works</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "List your app",
                desc: "Describe your app, add screenshots, and set your price. Takes under 5 minutes.",
              },
              {
                step: "2",
                title: "Buyers purchase",
                desc: "Get notified instantly when someone buys. No haggling, no negotiations.",
              },
              {
                step: "3",
                title: "Deliver & earn",
                desc: "Share your GitHub repo or ZIP file. Payment lands in your account right away.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-black/[0.06] bg-white p-7"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-bold text-[#1D9E75]">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-[#111]">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="mb-10 text-center text-2xl font-bold">Why sell on ForgeX</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                title: "Instant payout",
                desc: "Funds hit your account the moment a buyer confirms delivery. No 30-day holds.",
              },
              {
                title: "Keep 85%",
                desc: "We take a small 15% platform fee. Everything else is yours.",
              },
              {
                title: "Global buyers",
                desc: "Reach thousands of founders, agencies, and developers from over 80 countries.",
              },
              {
                title: "Zero upfront cost",
                desc: "Listing is completely free. You only pay when you sell — and only from the proceeds.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-black/[0.06] bg-white p-7"
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1D9E75]/15">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[#111]">{benefit.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-9">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-[#1D9E75]/20 bg-[#1D9E75]/[0.04] px-8 py-12 text-center">
          <h2 className="mb-3 text-2xl font-bold">Ready to start selling?</h2>
          <p className="mb-8 text-muted-foreground">
            Create your first listing in minutes. No credit card required.
          </p>
          <Link href="/sell/new">
            <button className="rounded-xl bg-[#1D9E75] px-8 py-3 font-semibold text-white hover:bg-[#1D9E75]/90 transition-colors">
              Create Your First Listing
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
