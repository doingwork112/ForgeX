"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { mockOrders, Order } from "@/lib/mock-data";

type FilterType = "all" | "pending_delivery" | "delivered" | "complete";

interface DeliverModal {
  open: boolean;
  orderId: string;
  url: string;
}

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
    year: "numeric",
  });
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [deliverModal, setDeliverModal] = useState<DeliverModal>({
    open: false,
    orderId: "",
    url: "",
  });
  const [toast, setToast] = useState("");
  const [deliveryTab, setDeliveryTab] = useState<"github" | "zip">("github");

  const counts = {
    all: orders.length,
    pending_delivery: orders.filter((o) => o.status === "pending_delivery").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    complete: orders.filter((o) => o.status === "complete").length,
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  function openDeliverModal(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    setDeliveryTab("github");
    setDeliverModal({ open: true, orderId, url: order?.deliveryUrl || "" });
  }

  function sendDelivery() {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === deliverModal.orderId
          ? { ...o, status: "delivered", deliveryUrl: deliverModal.url }
          : o
      )
    );
    setDeliverModal({ open: false, orderId: "", url: "" });
    setToast("Delivery sent!");
    setTimeout(() => setToast(""), 3000);
  }

  const modalOrder = orders.find((o) => o.id === deliverModal.orderId);

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "pending_delivery", label: `Pending (${counts.pending_delivery})` },
    { key: "delivered", label: `Delivered (${counts.delivered})` },
    { key: "complete", label: `Complete (${counts.complete})` },
  ];

  const inputClass =
    "w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors";

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] text-[#111]">
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

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-[#111] transition-colors"
          >
            ← Dashboard
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-sm text-muted-foreground">{counts.all} orders total</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-[#1D9E75]/15 text-[#1D9E75] border border-[#1D9E75]/30"
                  : "border border-black/[0.06] text-muted-foreground hover:text-[#111] hover:border-black/[0.15]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-black/[0.06] bg-white">
              <p className="text-sm text-muted-foreground">No orders found.</p>
            </div>
          )}
          {filtered.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-black/[0.06] bg-white px-6 py-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Buyer info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-sm font-semibold text-[#1D9E75]">
                    {order.buyerAvatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[#111]">{order.buyerName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.buyerEmail}
                    </p>
                  </div>
                </div>

                {/* App + ID + date */}
                <div className="flex flex-col gap-1 sm:items-center">
                  <span className="inline-block rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs text-muted-foreground">
                    {order.appName}
                  </span>
                  <span className="text-[11px] text-muted-foreground/50">
                    #{order.id}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Earnings + actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-base font-bold text-[#1D9E75]">
                      ${order.sellerEarnings.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      of ${order.appPrice}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(order.status)}
                    {order.status === "pending_delivery" && (
                      <button
                        onClick={() => openDeliverModal(order.id)}
                        className="rounded-lg border border-[#1D9E75]/40 bg-[#1D9E75]/[0.05] px-3 py-1.5 text-xs font-medium text-[#1D9E75] hover:bg-[#1D9E75]/10 transition-colors"
                      >
                        Deliver Code
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button className="rounded-lg border border-black/[0.08] px-3 py-1.5 text-xs text-muted-foreground hover:text-[#111] hover:border-black/[0.15] transition-colors">
                        View Delivery
                      </button>
                    )}
                    {order.status === "complete" && (
                      <span className="text-xs text-muted-foreground/50">Complete</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      {/* Deliver modal */}
      {deliverModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget)
              setDeliverModal({ open: false, orderId: "", url: "" });
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-black/[0.08] bg-white p-7 shadow-2xl">
            <h2 className="mb-1 text-lg font-bold">Deliver Code</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Order #{deliverModal.orderId} · {modalOrder?.appName}
            </p>

            {/* Tabs */}
            <div className="mb-5 flex gap-2 rounded-xl border border-black/[0.06] bg-white p-1">
              {(["github", "zip"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDeliveryTab(tab)}
                  className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                    deliveryTab === tab
                      ? "bg-[#1D9E75]/15 text-[#1D9E75]"
                      : "text-muted-foreground hover:text-[#111]"
                  }`}
                >
                  {tab === "github" ? "GitHub Repo" : "ZIP Download"}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm text-muted-foreground">
                {deliveryTab === "github"
                  ? "GitHub repository URL"
                  : "ZIP download URL"}
              </label>
              <input
                className={inputClass}
                placeholder={
                  deliveryTab === "github"
                    ? "https://github.com/you/repo"
                    : "https://drive.google.com/..."
                }
                value={deliverModal.url}
                onChange={(e) =>
                  setDeliverModal((m) => ({ ...m, url: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeliverModal({ open: false, orderId: "", url: "" })
                }
                className="flex-1 rounded-xl border border-black/[0.08] py-2.5 text-sm text-muted-foreground hover:text-[#111] hover:border-black/[0.15] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendDelivery}
                disabled={!deliverModal.url}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                  deliverModal.url
                    ? "bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90"
                    : "bg-[#1D9E75]/30 text-white/40 cursor-not-allowed"
                }`}
              >
                Send Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#1D9E75]/30 bg-[#1D9E75]/15 px-5 py-3 text-sm font-medium text-[#1D9E75] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
