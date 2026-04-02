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
  appName: string;
  plan: "basic" | "custom";
  totalPrice: number;   // ¥ total
  deposit: number;      // ¥ deposit (40%)
  tailPayment: number;  // ¥ tail payment (60%)
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
      setError(submitErr.message ?? "提交失败");
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
      setError(confirmErr.message ?? "支付失败，请重试");
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
            {item.appName} · {item.plan === "basic" ? "基础版" : "定制版"}
          </span>
          <span className="text-xs text-muted-foreground">总价 ¥{item.totalPrice}</span>
        </div>
        <div className="border-t border-[#1D9E75]/15 pt-2 flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">本次支付（40% 定金）</span>
          <span className="text-xl font-black text-[#1D9E75]">¥{item.deposit}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          剩余 ¥{item.tailPayment} 尾款在验收满意后支付 · 定金由平台托管
        </p>
      </div>

      {/* Stripe Payment Element — renders card / WeChat / Alipay based on setup */}
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
            支付中...
          </span>
        ) : (
          `确认支付定金 ¥${item.deposit} 🎉`
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">🔒 Stripe 加密保护</span>
        <span>·</span>
        <span>支持微信 / 支付宝 / 银行卡</span>
        <span>·</span>
        <span>不满意退定金</span>
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
          amount: item.deposit * 100,          // ¥ → 分
          appName: item.appName,
          plan: item.plan,
          currency: "cny",
        }),
      });
      const data = await res.json() as { clientSecret?: string; error?: string };
      if (data.error) {
        if (data.error.includes("未配置")) setStripeAvailable(false);
        else setFetchError(data.error);
      } else {
        setClientSecret(data.clientSecret ?? null);
      }
    } catch {
      setFetchError("网络错误，请刷新后重试");
    }
  }, [item.deposit, item.appName, item.plan]);

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
            <h2 className="text-xl font-black text-[#111]">支付定金</h2>
            <p className="text-xs text-muted-foreground mt-0.5">安全支付 · 平台托管</p>
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
              重试
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
            <p className="text-sm text-muted-foreground">正在初始化支付...</p>
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
              locale: "zh",
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
  const [method, setMethod] = useState<"wechat" | "alipay" | "card">("wechat");
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
        <p className="font-semibold mb-0.5">⚙️ 开发模式</p>
        <p>Stripe Key 未配置，当前为模拟支付。
          <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline ml-1">获取 Key →</a>
        </p>
      </div>

      {/* Order summary */}
      <div className="rounded-2xl border border-[#1D9E75]/20 bg-[#1D9E75]/[0.04] p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[#111]">
            {item.appName} · {item.plan === "basic" ? "基础版" : "定制版"}
          </span>
          <span className="text-xs text-muted-foreground">总价 ¥{item.totalPrice}</span>
        </div>
        <div className="border-t border-[#1D9E75]/15 pt-2 flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">本次支付（40% 定金）</span>
          <span className="text-xl font-black text-[#1D9E75]">¥{item.deposit}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">剩余 ¥{item.tailPayment} 尾款验收满意后支付</p>
      </div>

      {/* Payment method */}
      <div className="grid grid-cols-3 gap-2">
        {(["wechat", "alipay", "card"] as const).map((m) => (
          <button key={m} onClick={() => setMethod(m)}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 py-3 text-xs font-semibold transition-all ${method === m ? "border-[#1D9E75] bg-[#1D9E75]/[0.04] text-[#1D9E75]" : "border-black/[0.08] text-muted-foreground hover:border-black/[0.15]"}`}>
            <span className="text-2xl">{m === "wechat" ? "💚" : m === "alipay" ? "💙" : "💳"}</span>
            <span>{m === "wechat" ? "微信支付" : m === "alipay" ? "支付宝" : "银行卡"}</span>
          </button>
        ))}
      </div>

      {method === "card" && (
        <div className="space-y-2.5">
          <input
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
            placeholder="卡号  4242 4242 4242 4242"
            maxLength={19}
            className="w-full rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              placeholder="有效期 MM/YY"
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
            <div className="text-5xl mb-3">{method === "wechat" ? "💚" : "💙"}</div>
            <p className="text-sm font-semibold text-[#111]">
              {method === "wechat" ? "微信扫码支付" : "支付宝扫码支付"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">（配置 Stripe 后自动显示真实二维码）</p>
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
            支付中...
          </span>
        ) : (
          `确认支付定金 ¥${item.deposit} 🎉`
        )}
      </button>

      <p className="text-center text-[11px] text-muted-foreground">
        🔒 定金由平台托管 · 验收满意再付尾款 · 不满意退定金
      </p>
    </div>
  );
}
