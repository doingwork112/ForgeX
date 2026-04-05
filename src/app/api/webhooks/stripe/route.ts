import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Dev mode: parse raw body (no signature verification)
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch {
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const { appId, buyerId, sellerId, plan, totalPrice, tailPayment } = pi.metadata;

    if (appId && buyerId && sellerId) {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!serviceKey) {
        console.error("SUPABASE_SERVICE_ROLE_KEY not set — order not saved via webhook");
        return NextResponse.json({ received: true });
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey
      );

      const { error } = await supabase.from("orders").upsert({
        id: pi.id,
        app_id: appId,
        buyer_id: buyerId,
        seller_id: sellerId,
        plan: (plan as "basic" | "custom") ?? "basic",
        total_price: Number(totalPrice) || Math.round((pi.amount / 100) / 0.4),
        deposit_paid: pi.amount / 100,
        tail_payment: Number(tailPayment) || 0,
        status: "deposit_paid" as const,
        payment_intent_id: pi.id,
      });

      if (error) console.error("Webhook order creation error:", error);
    }
  }

  return NextResponse.json({ received: true });
}
