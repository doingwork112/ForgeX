"use client";

import { useState } from "react";
import Link from "next/link";
import { apps, mockOrders, mockPurchases, bounties } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const myApps = apps.filter((a) => ["1"].includes(a.id));
const myBounties = bounties.filter((_, i) => i < 2);

function statusColor(status: string) {
  if (status === "complete") return "bg-green-100 text-green-700 border-green-200";
  if (status === "delivered") return "bg-blue-100 text-blue-700 border-blue-200";
  if (status === "pending_delivery") return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}
function statusLabel(status: string) {
  if (status === "complete") return "Complete";
  if (status === "delivered") return "Delivered";
  if (status === "pending_delivery") return "Awaiting delivery";
  return status;
}

export default function ProfilePage() {
  const [tab, setTab] = useState<"creator" | "buyer">("creator");
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("Alex Chen");
  const [bio, setBio] = useState("Full-stack dev. Building SaaS tools that actually make money.");
  const [building, setBuilding] = useState("InvoiceFlow v3 with recurring billing");

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-foreground">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[250px] w-[600px] rounded-full bg-[#1D9E75]/[0.04] blur-[100px]" />
      </div>

      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Profile header card */}
        <div className="mb-8 rounded-2xl border border-black/[0.06] bg-white overflow-hidden shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#1D9E75] to-[#0d6e52]" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#1D9E75]/20 text-xl font-bold text-[#1D9E75] shadow">
                AC
              </div>
              <div className="flex gap-2 pb-1">
                <Link href="/u/alexchen">
                  <Button variant="outline" size="sm" className="border-black/[0.08] text-sm">
                    View public page
                  </Button>
                </Link>
                <Button size="sm" onClick={() => setEditOpen(true)} className="bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90 text-sm">
                  Edit profile
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-[#111]">{name}</h1>
              <p className="text-sm text-muted-foreground">{bio}</p>
              {building && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#1D9E75]/20 bg-[#1D9E75]/5 px-3 py-1 text-xs text-[#1D9E75]">
                  🔨 Currently: <strong className="ml-1">{building}</strong>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-5 text-sm">
              {[
                { label: "Total Sales", value: "23" },
                { label: "Revenue", value: "$11.4k" },
                { label: "Reputation", value: "412" },
                { label: "Purchases", value: mockPurchases.length },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="font-bold text-[#111]">{value}</span>
                  <span className="ml-1 text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-xl border border-black/[0.06] bg-white p-1 shadow-sm w-fit">
          {(["creator", "buyer"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-[#1D9E75] text-white shadow"
                  : "text-muted-foreground hover:text-[#111]"
              }`}
            >
              <span>{t === "creator" ? "🔨" : "🛒"}</span>
              {t === "creator" ? "Creator" : "Buyer"}
            </button>
          ))}
        </div>

        {/* Creator tab */}
        {tab === "creator" && (
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Active listings", value: myApps.length, icon: "📦" },
                { label: "Total orders", value: mockOrders.length, icon: "📋" },
                { label: "Pending delivery", value: mockOrders.filter(o => o.status === "pending_delivery").length, icon: "⏳" },
                { label: "This month", value: "$2,545", icon: "💰" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm">
                  <div className="text-xl mb-1">{icon}</div>
                  <p className="text-2xl font-bold text-[#111]">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* My listings */}
            <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
                <h2 className="text-sm font-semibold text-[#111]">My listings</h2>
                <Link href="/sell/new">
                  <Button size="sm" className="bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90 h-7 text-xs px-3">
                    + New listing
                  </Button>
                </Link>
              </div>
              {myApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between px-5 py-4 border-b border-black/[0.03] last:border-b-0 hover:bg-black/[0.01] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#1D9E75]/10 flex items-center justify-center text-sm font-bold text-[#1D9E75]">
                      {app.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111]">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{app.category} · {app.seller.sold} sold</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-[#1D9E75]">${app.price}</p>
                    <Link href={`/marketplace/${app.id}`}>
                      <button className="text-xs text-muted-foreground hover:text-[#111] transition-colors">View →</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
                <h2 className="text-sm font-semibold text-[#111]">Recent orders</h2>
                <Link href="/dashboard/orders" className="text-xs text-[#1D9E75] hover:underline">
                  View all
                </Link>
              </div>
              {mockOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.03] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/10 text-xs font-bold text-[#1D9E75]">
                      {order.buyerAvatar}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#111]">{order.buyerName}</p>
                      <p className="text-[11px] text-muted-foreground">{order.appName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColor(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                    <span className="text-xs font-semibold text-[#1D9E75]">+${order.sellerEarnings.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buyer tab */}
        {tab === "buyer" && (
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "Purchases", value: mockPurchases.length, icon: "🛒" },
                { label: "Bounties posted", value: myBounties.length, icon: "🎯" },
                { label: "Total spent", value: "$1,298", icon: "💳" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm">
                  <div className="text-xl mb-1">{icon}</div>
                  <p className="text-2xl font-bold text-[#111]">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* My purchases */}
            <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-black/[0.04]">
                <h2 className="text-sm font-semibold text-[#111]">My purchases</h2>
              </div>
              {mockPurchases.map((p) => {
                const app = apps.find((a) => a.id === p.appId);
                return (
                  <div key={p.id} className="flex items-center justify-between px-5 py-4 border-b border-black/[0.03] last:border-b-0 hover:bg-black/[0.01] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#1D9E75]/10 flex items-center justify-center text-sm font-bold text-[#1D9E75]">
                        {p.appName.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111]">{p.appName}</p>
                        <p className="text-xs text-muted-foreground">{app?.category} · ${p.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-[10px] font-medium text-green-700">
                        Delivered
                      </span>
                      <a
                        href={p.deliveryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1D9E75] hover:underline"
                      >
                        Download →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* My bounties */}
            <div className="rounded-2xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
                <h2 className="text-sm font-semibold text-[#111]">My bounties</h2>
                <Link href="/hunters" className="text-xs text-[#1D9E75] hover:underline">
                  Post new
                </Link>
              </div>
              {myBounties.map((b) => (
                <div key={b.id} className="flex items-center justify-between px-5 py-4 border-b border-black/[0.03] last:border-b-0 hover:bg-black/[0.01] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#111]">{b.title}</p>
                    <p className="text-xs text-muted-foreground">{b.submissions} submissions · {b.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                      b.status === "open" ? "bg-green-100 text-green-700 border-green-200" :
                      b.status === "in_progress" ? "bg-blue-100 text-blue-700 border-blue-200" :
                      "bg-gray-100 text-gray-600 border-gray-200"
                    }`}>
                      {b.status === "open" ? "Open" : b.status === "in_progress" ? "In progress" : "Completed"}
                    </span>
                    <span className="text-xs font-bold text-[#1D9E75]">${b.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Edit profile modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-black/[0.1] bg-white p-7 shadow-2xl">
            <button onClick={() => setEditOpen(false)} className="absolute right-5 top-5 text-muted-foreground hover:text-[#111] text-xl">✕</button>
            <h2 className="text-lg font-bold text-[#111] mb-5">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Display name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Currently building</label>
                <input
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 border-black/[0.08]" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button className="flex-1 bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90" onClick={() => setEditOpen(false)}>Save changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
