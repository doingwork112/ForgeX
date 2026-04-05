import { NextRequest, NextResponse } from "next/server";

// This route receives the OAuth/magic-link callback from Supabase.
// We forward the code to a client-side page so the browser's
// localStorage-based Supabase client can exchange it and persist the session.
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    );
  }

  if (code) {
    // Forward to client-side handler so the browser Supabase client
    // (localStorage-based) exchanges the code and stores the session.
    return NextResponse.redirect(
      new URL(`/auth/session?code=${encodeURIComponent(code)}`, requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL("/marketplace", requestUrl.origin));
}
