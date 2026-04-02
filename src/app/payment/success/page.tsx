"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {/* Animated checkmark */}
      <div className="relative mb-8">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#1D9E75]/10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1D9E75]/20">
            <svg className="h-10 w-10 text-[#1D9E75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full bg-[#1D9E75]/5 animate-ping" style={{ animationDuration: "2s" }} />
      </div>

      <h1 className="text-3xl font-black text-[#111] mb-3">Deposit Paid Successfully! 🎉</h1>
      <p className="text-muted-foreground max-w-md leading-relaxed mb-2">
        The developer has been notified and will reach out within <strong>24 hours</strong> to confirm your requirements.
      </p>

      {paymentIntent && (
        <p className="text-xs text-muted-foreground mb-6">
          Payment ID: <code className="rounded bg-black/[0.06] px-2 py-0.5 font-mono text-[11px]">{paymentIntent}</code>
        </p>
      )}

      {/* What happens next */}
      <div className="w-full max-w-sm rounded-3xl border border-black/[0.06] bg-white p-6 mb-8 text-left space-y-4">
        <p className="text-sm font-bold text-[#111]">What happens next?</p>
        {[
          { step: "Within 24h", desc: "Developer contacts you to confirm details", done: true },
          { step: "3-7 days", desc: "Developer builds your PWA for you to try", done: false },
          { step: "Approval", desc: "Pay remaining balance and get full source code", done: false },
        ].map(({ step, desc, done }) => (
          <div key={step} className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${done ? "bg-[#1D9E75] text-white" : "border-2 border-black/[0.1] text-muted-foreground"}`}>
              {done ? "✓" : "○"}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#111]">{step}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/marketplace">
          <button className="rounded-2xl bg-[#1D9E75] px-7 py-3 font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_4px_20px_rgba(29,158,117,0.25)]">
            Browse More Apps
          </button>
        </Link>
        <Link href="/profile">
          <button className="rounded-2xl border border-black/[0.1] bg-white px-7 py-3 font-semibold text-[#333] hover:border-black/[0.2] transition-colors">
            View My Orders
          </button>
        </Link>
      </div>

      {countdown > 0 && (
        <p className="mt-6 text-xs text-muted-foreground">
          Redirecting in {countdown}s...
        </p>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="relative min-h-screen bg-[#f8f9fa]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-[#1D9E75]/[0.06] blur-[120px]" />
      </div>
      <Navbar />
      <Suspense fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
