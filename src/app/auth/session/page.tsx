"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function SessionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/marketplace");
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          setError(error.message);
          setTimeout(() => router.replace("/auth/login?error=" + encodeURIComponent(error.message)), 2000);
        } else {
          router.replace("/marketplace");
        }
      });
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <p className="text-sm text-red-500">Login error: {error}. Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#1D9E75] border-t-transparent" />
        <p className="text-sm text-muted-foreground">Logging you in…</p>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionHandler />
    </Suspense>
  );
}
