import { NextResponse, type NextRequest } from "next/server";

// The app uses localStorage-based auth (supabase-js createClient).
// No server-side session management needed — just pass requests through.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
