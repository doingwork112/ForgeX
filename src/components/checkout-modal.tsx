"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe as StripeType } from "@stripe/stripe-js";

/* ─── Load Stripe once (singleton) ─────────────────────────── */
let stripePromise: Promise<StripeType | null> | null = null;
function getStripe() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!stripePromise) {
    stripePromise = key ? loadStripe(key) : Promise.resolve(null);
  }
  return stripePromise;
}

/* ─── Types ─────────────────────────────────────────────────── */
interface CheckoutItem {
  appId?: string;                  // Supabase app UUID (empty for mock apps)
  sellerId?: string;               // Supabase seller UUID
  sellerStripeAccountId?: string;  // Stripe Connect account ID for auto-split
  buyerId?: string;                // Supabase buyer UUID (filled by parent)
  appName: string;
  plan: "basic" | "custom";
  totalPrice: number;   // $ total
  deposit: number;      // $ deposit (40%)
  tailPayment: number;  // $ tail payment (60%)
  customNote?: string;
}

interface CheckoutModalProps {
  item: CheckoutItem;
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
}

/* ─── Inner form (must be inside <Elements>) ─────────────────── */
function PaymentForm({
  item,
  onSuccess,
}: {
  item: CheckoutItem;
  onSuccess: (id: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setError(submitErr.message ?? "Submission failed");
      setLoading(false);
      return;
    }

    // Confirm payment with return URL for 3D-Secure redirect if needed
    const { error: confirmErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
        payment_method_data: {
          billing_details: {},
        },
      },
      redirect: "if_required",
    });

    if (confirmErr) {
      setError(confirmErr.message ?? "Payment failed, please try again");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order summary */}
      <div className="rounded-2xl border border-[#1D9E75]/20 bg-[#1D9E75]/[0.04] p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[#111]">
            {item.appName} · {item.plan === "basic" ? "Standard" : "Custom"}
          </span>
          <span className="text-xs text-muted-foreground">Total ${item.totalPrice}</span>
        </div>
        <div className="border-t border-[#1D9E75]/15 pt-2 flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Today&apos;s payment (40% deposit)</span>
          <span className="text-xl font-black text-[#1D9E75]">${item.deposit}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Remaining ${item.tailPayment} due after approval · Deposit held by platform
        </p>
      </div>

      {/* Stripe Payment Element */}
      <div className="rounded-2xl border border-black/[0.08] bg-white p-4">
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {},
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-2xl bg-[#1D9E75] py-4 text-base font-black text-white hover:bg-[#1D9E75]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(29,158,117,0.3)]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay $${item.deposit} Deposit 🎉`
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">🔒 Secured by Stripe</span>
        <span>·</span>
        <span>Visa, Mastercard, Apple Pay</span>
        <span>·</span>
        <span>Money-back guarantee</span>
      </div>
    </form>
  );
}

/* ─── Outer modal: fetches clientSecret, mounts Elements ─────── */
export function CheckoutModal({ item, onClose, onSuccess }: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [stripeAvailable, setStripeAvailable] = useState(true);

  const fetchIntent = useCallback(async () => {
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: item.deposit * 100,
          appName: item.appName,
          appId: item.appId ?? "",
          buyerId: item.buyerId ?? "",
          sellerId: item.sellerId ?? "",
          sellerStripeAccountId: item.sellerStripeAccountId ?? "",
          plan: item.plan,
          totalPrice: item.totalPrice,
          tailPayment: item.tailPayment,
          currency: "usd",
        }),
      });
      const data = await res.json() as { clientSecret?: string; error?: string };
      if (data.error) {
        if (data.error.includes("not configured") || data.error.includes("未配置")) setStripeAvailable(false);
        else setFetchError(data.error);
      } else {
        setClientSecret(data.clientSecret ?? null);
      }
    } catch {
      setFetchError("Network error, please refresh and try again");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.deposit, item.appName, item.plan, item.appId, item.buyerId, item.sellerId, item.sellerStripeAccountId, item.tailPayment, item.totalPrice]);

  useEffect(() => {
    fetchIntent();
  }, [fetchIntent]);

  const stripePromise = getStripe();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-black/[0.1] bg-white p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-[#111]">Pay Deposit</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Secure payment · Platform protected</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-black/[0.05] hover:text-[#111] transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Stripe not configured — show mock UI */}
        {!stripeAvailable && (
          <MockPaymentFallback item={item} onClose={onClose} onSuccess={onSuccess} />
        )}

        {/* Error */}
        {fetchError && stripeAvailable && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="text-4xl">😕</span>
            <p className="text-sm font-semibold text-[#111]">{fetchError}</p>
            <button
              onClick={fetchIntent}
              className="rounded-xl border border-black/[0.08] px-5 py-2 text-sm text-muted-foreground hover:text-[#111] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {!clientSecret && !fetchError && stripeAvailable && (
          <div className="flex flex-col items-center gap-4 py-10">
            <svg className="h-8 w-8 animate-spin text-[#1D9E75]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-muted-foreground">Initializing payment...</p>
          </div>
        )}

        {/* Stripe Elements */}
        {clientSecret && stripeAvailable && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#1D9E75",
                  colorBackground: "#ffffff",
                  colorText: "#111111",
                  colorDanger: "#ef4444",
                  fontFamily: "system-ui, sans-serif",
                  borderRadius: "12px",
                },
              },
              locale: "en",
            }}
          >
            <PaymentForm item={item} onSuccess={onSuccess} />
          </Elements>
        )}
      </div>
    </div>
  );
}

/* ─── Fallback mock payment (when Stripe key not set) ─────────── */
function MockPaymentFallback({
  item,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
  onSuccess,
}: {
  item: CheckoutItem;
  onClose: () => void;
  onSuccess: (id: string) => void;
}) {
  const [method, setMethod] = useState<"apple" | "google" | "card">("card");
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  function handlePay() {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess("mock_" + Date.now());
    }, 2000);
  }

  return (
    <div className="space-y-5">
      {/* Dev notice */}
      <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-700">
        <p className="font-semibold mb-0.5">⚙️ Dev Mode</p>
        <p>Stripe key not configured. This is a simulated payment.
          <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline ml-1">Get API Key →</a>
        </p>
      </div>

      {/* Order summary */}
      <div className="rounded-2xl border border-[#1D9E75]/20 bg-[#1D9E75]/[0.04] p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[#111]">
            {item.appName} · {item.plan === "basic" ? "Standard" : "Custom"}
          </span>
          <span className="text-xs text-muted-foreground">Total ${item.totalPrice}</span>
        </div>
        <div className="border-t border-[#1D9E75]/15 pt-2 flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Today&apos;s payment (40% deposit)</span>
          <span className="text-xl font-black text-[#1D9E75]">${item.deposit}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">Remaining ${item.tailPayment} due after approval</p>
      </div>

      {/* Payment method */}
      <div className="grid grid-cols-3 gap-2">
        {(["card", "apple", "google"] as const).map((m) => (
          <button key={m} onClick={() => setMethod(m)}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 py-3 text-xs font-semibold transition-all ${method === m ? "border-[#1D9E75] bg-[#1D9E75]/[0.04] text-[#1D9E75]" : "border-black/[0.08] text-muted-foreground hover:border-black/[0.15]"}`}>
            <span className="text-2xl">{m === "card" ? "💳" : m === "apple" ? "🍎" : "🔵"}</span>
            <span>{m === "card" ? "Card" : m === "apple" ? "Apple Pay" : "Google Pay"}</span>
          </button>
        ))}
      </div>

      {method === "card" && (
        <div className="space-y-2.5">
          <input
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
            placeholder="Card number  4242 4242 4242 4242"
            maxLength={19}
            className="w-full rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              placeholder="MM/YY"
              maxLength={5}
              className="flex-1 rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none"
            />
            <input
              value={card.cvv}
              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              placeholder="CVV"
              maxLength={3}
              className="w-20 rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none"
            />
          </div>
        </div>
      )}

      {method !== "card" && (
        <div className="flex items-center justify-center rounded-2xl border border-black/[0.06] bg-[#f8f9fa] py-8 text-center">
          <div>
            <div className="text-5xl mb-3">{method === "apple" ? "🍎" : "🔵"}</div>
            <p className="text-sm font-semibold text-[#111]">
              {method === "apple" ? "Apple Pay" : "Google Pay"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">(Available when Stripe is configured)</p>
          </div>
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full rounded-2xl bg-[#1D9E75] py-4 text-base font-black text-white hover:bg-[#1D9E75]/90 disabled:opacity-50 transition-all shadow-[0_4px_20px_rgba(29,158,117,0.3)]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay $${item.deposit} Deposit 🎉`
        )}
      </button>

      <p className="text-center text-[11px] text-muted-foreground">
        🔒 Deposit held by platform · Pay balance after approval · Money-back guarantee
      </p>
    </div>
  );
}
