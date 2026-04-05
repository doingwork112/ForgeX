import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  // Get current user from session
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = new Stripe(stripeKey);
  const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";

  try {
    // Check if user already has a Stripe account
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_account_id")
      .eq("id", user.id)
      .single();

    let accountId = profile?.stripe_account_id;

    // Create Express account if they don't have one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        metadata: { user_id: user.id },
      });
      accountId = account.id;

      // Save immediately so we don't create duplicates
      await supabase
        .from("profiles")
        .update({ stripe_account_id: accountId })
        .eq("id", user.id);
    }

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/dashboard?stripe=refresh`,
      return_url: `${origin}/dashboard?stripe=success`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create Connect account";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
