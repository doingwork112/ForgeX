import { NextRequest, NextResponse } from "next/server";

// Redirect to a client-side page that handles the code exchange
// This ensures the browser's Supabase client handles the session
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
    // Pass the code to a client-side page for exchange
    return NextResponse.redirect(
      new URL(`/auth/confirm?code=${code}`, requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
}
