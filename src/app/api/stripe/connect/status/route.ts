import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ connected: false });

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
  if (!user) return NextResponse.json({ connected: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_account_id) return NextResponse.json({ connected: false });

  try {
    const stripe = new Stripe(stripeKey);
    const account = await stripe.accounts.retrieve(profile.stripe_account_id);
    return NextResponse.json({
      connected: account.charges_enabled,
      pending: !account.charges_enabled,
      accountId: profile.stripe_account_id,
    });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
