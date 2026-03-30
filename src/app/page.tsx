"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "pop" | "settle" | "done">("idle");

  useEffect(() => {
    setPhase("pop");
    setTimeout(() => setPhase("settle"), 600);
    setTimeout(() => setPhase("done"), 1400);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* ─── Metallic background ─── */}
      <div className="fixed inset-0 bg-[#0a0a0a]" />

      <div className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)`,
          backgroundSize: "4px 100%",
        }}
      />

      <div
        className="fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 30% 20%, rgba(255,255,255,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 70% 75%, rgba(255,255,255,0.02) 0%, transparent 60%),
            linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.01) 100%)
          `,
        }}
      />

      <div
        className="fixed inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div
          className={`
            ${phase === "idle" ? "opacity-0 scale-0" : ""}
            ${phase === "pop" ? "animate-logo-pop" : ""}
            ${phase === "settle" ? "animate-logo-settle" : ""}
            ${phase === "done" ? "opacity-100 scale-[0.85] -translate-y-8" : ""}
          `}
          style={{
            filter: "drop-shadow(0 0 30px rgba(255,20,147,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.8))",
          }}
        >
          <Image
            src="/forgex-logo-v2.png"
            alt="ForgeX"
            width={500}
            height={350}
            priority
          />
        </div>

        {/* Auth buttons */}
        <div
          className={`
            flex flex-col items-center gap-4 mt-6
            ${phase === "done" ? "animate-buttons-bounce" : "opacity-0 scale-0 pointer-events-none"}
          `}
        >
          <div className="flex gap-4">
            <Button
              size="lg"
              className="px-8 bg-white text-black font-bold hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Sign up
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-white/20 text-white hover:bg-white/10 font-bold"
            >
              Log in
            </Button>
          </div>
          <button
            className="text-sm text-white/40 hover:text-white/70 transition-colors mt-2"
            onClick={(e) => { e.stopPropagation(); router.push("/home"); }}
          >
            Visit as guest
          </button>
        </div>

      </div>
    </div>
  );
}
