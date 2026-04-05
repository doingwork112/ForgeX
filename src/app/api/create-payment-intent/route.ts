import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe not configured. Set STRIPE_SECRET_KEY in .env.local" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey);

  try {
    const body = await req.json();
    const {
      amount,
      appName,
      appId = "",
      buyerId = "",
      sellerId = "",
      sellerStripeAccountId = "",
      plan,
      totalPrice,
      tailPayment,
      currency = "usd",
    } = body as {
      amount: number;
      appName: string;
      appId?: string;
      buyerId?: string;
      sellerId?: string;
      sellerStripeAccountId?: string;
      plan: "basic" | "custom";
      totalPrice?: number;
      tailPayment?: number;
      currency?: string;
    };

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 10% platform fee
    const platformFee = Math.round(amount * 0.10);

    const intentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        appName,
        appId,
        buyerId,
        sellerId,
        plan,
        totalPrice: String(totalPrice ?? ""),
        tailPayment: String(tailPayment ?? ""),
        type: "deposit",
        platform: "ForgeX",
        platformFee: String(platformFee),
      },
      description: `ForgeX Deposit — ${appName} (${plan === "basic" ? "Standard" : "Custom"})`,
    };

    // Auto-split only when seller has connected Stripe
    if (sellerStripeAccountId) {
      intentParams.application_fee_amount = platformFee;
      intentParams.transfer_data = { destination: sellerStripeAccountId };
    }

    const paymentIntent = await stripe.paymentIntents.create(intentParams);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
