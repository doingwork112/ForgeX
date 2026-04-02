"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/marketplace");
      }
    });

    // Also handle the code exchange directly
    const hash = window.location.hash;
    if (hash) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.replace("/marketplace");
        }
      });
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1D9E75] border-t-transparent mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
