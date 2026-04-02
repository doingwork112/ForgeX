import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialise Stripe — reads STRIPE_SECRET_KEY from env
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
    const { amount, appName, plan, currency = "usd" } = body as {
      amount: number;   // amount in cents, e.g. 2000 = $20
      appName: string;
      plan: "basic" | "custom";
      currency?: string;
    };

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Create a PaymentIntent for the deposit amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount,                     // in cents
      currency,                   // "usd"
      automatic_payment_methods: { enabled: true },
      metadata: {
        appName,
        plan,
        type: "deposit",          // 40% deposit
        platform: "ForgeX",
      },
      description: `ForgeX Deposit — ${appName} (${plan === "basic" ? "Standard" : "Custom"})`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
