import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialise Stripe — reads STRIPE_SECRET_KEY from env
const stripeKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe 未配置，请在 .env.local 中设置 STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey);

  try {
    const body = await req.json();
    const { amount, appName, plan, currency = "cny" } = body as {
      amount: number;   // amount in fen (分), e.g. 8000 = ¥80
      appName: string;
      plan: "basic" | "custom";
      currency?: string;
    };

    if (!amount || amount < 100) {
      return NextResponse.json({ error: "金额不合法" }, { status: 400 });
    }

    // Create a PaymentIntent for the deposit amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount,                     // in 分 (fen)
      currency,                   // "cny"
      automatic_payment_methods: { enabled: true },
      metadata: {
        appName,
        plan,
        type: "deposit",          // 40% deposit
        platform: "ForgeX",
      },
      description: `ForgeX 定金 — ${appName} (${plan === "basic" ? "基础版" : "定制版"})`,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "支付初始化失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
