"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "creator">("buyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check username availability
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (existing) {
      setError("Username already taken. Please choose another.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username, role },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/marketplace");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D9E75] shadow-[0_4px_16px_rgba(29,158,117,0.3)]">
              <span className="text-white font-black text-sm">FX</span>
            </div>
            <span className="text-xl font-black text-[#111]">ForgeX</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">Create your account</p>
        </div>

        <div className="rounded-3xl border border-black/[0.06] bg-white p-8 shadow-sm">
          {/* Role picker */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`flex-1 rounded-2xl border-2 py-3 text-sm font-bold transition-all ${
                role === "buyer"
                  ? "border-[#1D9E75] bg-[#1D9E75]/[0.06] text-[#1D9E75]"
                  : "border-black/[0.08] text-muted-foreground hover:border-black/[0.15]"
              }`}
            >
              🛒 I want to buy apps
            </button>
            <button
              type="button"
              onClick={() => setRole("creator")}
              className={`flex-1 rounded-2xl border-2 py-3 text-sm font-bold transition-all ${
                role === "creator"
                  ? "border-[#1D9E75] bg-[#1D9E75]/[0.06] text-[#1D9E75]"
                  : "border-black/[0.08] text-muted-foreground hover:border-black/[0.15]"
              }`}
            >
              🔨 I want to sell apps
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111] mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="yourname"
                className="w-full rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
              />
              <p className="mt-1 text-xs text-muted-foreground">forgex.com/u/{username || "yourname"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111] mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-black/[0.08] px-4 py-3 text-sm text-[#111] placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#1D9E75] py-3.5 text-sm font-bold text-white hover:bg-[#1D9E75]/90 transition-colors shadow-[0_4px_20px_rgba(29,158,117,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account — Free"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              By signing up you agree to our Terms of Service
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-[#1D9E75] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
