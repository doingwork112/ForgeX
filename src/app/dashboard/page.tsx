"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apps, mockOrders } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

// Generate 14 days of mock sales data
function generateSalesData() {
  const data = [];
  const now = new Date("2026-03-31");
  const amounts = [0, 499, 0, 499, 998, 0, 499, 0, 0, 499, 499, 0, 998, 499];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    data.push({ date: label, amount: amounts[13 - i] });
  }
  return data;
}

const salesData = generateSalesData();
const periodRevenue = salesData.reduce((sum, d) => sum + d.amount, 0);
const maxAmount = Math.max(...salesData.map((d) => d.amount), 1);

function statusBadge(status: string) {
  if (status === "pending_delivery")
    return (
      <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-0.5 text-[11px] font-medium text-yellow-400">
        Pending
      </span>
    );
  if (status === "delivered")
    return (
      <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-400">
        Delivered
      </span>
    );
  return (
    <span className="rounded-full border border-[#1D9E75]/30 bg-[#1D9E75]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#1D9E75]">
      Complete
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const recentOrders = [...mockOrders]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);

const sellerApp = apps.find((a) => a.id === "1");

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[#1D9E75]/[0.06] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Welcome back, Alex Chen</p>
          </div>
          <Link href="/sell/new">
            <button className="rounded-xl bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D9E75]/90 transition-colors">
              + New Listing
            </button>
          </Link>
        </div>

        {/* Stats cards */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Revenue", value: "$11,477", green: true },
            { label: "This Month", value: "$2,495", green: false },
            { label: "Total Orders", value: "23", green: false },
            { label: "Avg Rating", value: "★ 4.9", green: false },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <p className="mb-1 text-xs text-muted-foreground">{stat.label}</p>
              <p
                className={`text-2xl font-bold ${
                  stat.green ? "text-[#1D9E75]" : "text-white"
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT col */}
          <div className="space-y-6 lg:col-span-2">
            {/* Sales chart */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Sales (Last 14 days)</h2>
                <span className="text-sm text-[#1D9E75] font-semibold">
                  ${periodRevenue.toLocaleString()} total
                </span>
              </div>
              {/* Bars */}
              <div className="flex h-40 items-end gap-1">
                {salesData.map((d) => (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-[#1D9E75]/30 hover:bg-[#1D9E75]/60 transition-colors cursor-default"
                      style={{
                        height: `${Math.max((d.amount / maxAmount) * 100, d.amount > 0 ? 8 : 2)}%`,
                      }}
                      title={`${d.date}: $${d.amount}`}
                    />
                  </div>
                ))}
              </div>
              {/* Labels */}
              <div className="mt-1 flex gap-1">
                {salesData.map((d, i) => (
                  <div key={d.date} className="flex flex-1 justify-center">
                    {i % 2 === 0 && (
                      <span
                        className="text-[10px] text-muted-foreground"
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      >
                        {d.date}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">Recent Orders</h2>
                <Link
                  href="/dashboard/orders"
                  className="text-xs text-[#1D9E75] hover:text-[#1D9E75]/80 transition-colors"
                >
                  View all orders →
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3"
                  >
                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-xs font-semibold text-[#1D9E75]">
                      {order.buyerAvatar}
                    </div>
                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {order.buyerName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {order.buyerEmail}
                      </p>
                    </div>
                    {/* App */}
                    <div className="hidden sm:block">
                      <Badge variant="secondary" className="text-[11px]">
                        {order.appName}
                      </Badge>
                    </div>
                    {/* Earnings */}
                    <span className="shrink-0 text-sm font-semibold text-[#1D9E75]">
                      ${order.sellerEarnings.toFixed(2)}
                    </span>
                    {/* Status */}
                    <div className="hidden sm:block">{statusBadge(order.status)}</div>
                    {/* Date */}
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT col */}
          <div className="space-y-6">
            {/* My listings */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="mb-4 font-semibold">My Listings</h2>
              {sellerApp && (
                <div className="mb-4 rounded-xl border border-white/[0.04] bg-white/[0.02] overflow-hidden">
                  <div className="aspect-video w-full bg-[#111] flex items-center justify-center">
                    <span className="text-xs text-muted-foreground/40">Preview</span>
                  </div>
                  <div className="p-4">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="font-medium text-white">{sellerApp.name}</span>
                      <span className="text-sm font-bold text-[#1D9E75]">
                        ${sellerApp.price}
                      </span>
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">
                      {sellerApp.seller.sold} sold
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/marketplace/${sellerApp.id}`} className="flex-1">
                        <button className="w-full rounded-lg border border-white/[0.08] py-1.5 text-xs text-muted-foreground hover:text-white hover:border-white/20 transition-colors">
                          Manage
                        </button>
                      </Link>
                      <Link href="/sell/new" className="flex-1">
                        <button className="w-full rounded-lg border border-white/[0.08] py-1.5 text-xs text-muted-foreground hover:text-white hover:border-white/20 transition-colors">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <Link href="/sell/new">
                <button className="w-full rounded-xl border border-[#1D9E75]/30 bg-[#1D9E75]/[0.05] py-2.5 text-sm font-medium text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-colors">
                  + Add New Listing
                </button>
              </Link>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="mb-4 font-semibold">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: "Post a Bounty", href: "/hunters" },
                  { label: "View Marketplace", href: "/marketplace" },
                  { label: "My Public Profile", href: "/sellers/alex-chen" },
                ].map((action) => (
                  <Link key={action.href} href={action.href}>
                    <button className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-left text-sm text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-colors">
                      {action.label}
                      <span className="float-right text-muted-foreground/40">→</span>
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
