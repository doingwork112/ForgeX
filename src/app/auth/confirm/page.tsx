"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthConfirmPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setError("No authorization code found");
        return;
      }

      try {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }

        // Session is now stored by the browser client — redirect to marketplace
        router.replace("/marketplace");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Authentication failed");
      }
    }

    handleAuth();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-black/[0.06] bg-white p-8 shadow-sm text-center space-y-4">
          <span className="text-4xl">😕</span>
          <h1 className="text-lg font-bold text-[#111]">Login Failed</h1>
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-200">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="rounded-2xl bg-[#1D9E75] px-6 py-3 text-sm font-bold text-white hover:bg-[#1D9E75]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg className="h-8 w-8 animate-spin text-[#1D9E75]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
