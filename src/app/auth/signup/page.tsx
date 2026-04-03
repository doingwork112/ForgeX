"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"buyer" | "creator">("buyer");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"github" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callbackError = params.get("error");
    if (callbackError) setError(callbackError);
  }, []);

  async function handleOAuth(provider: "github" | "google") {
    setOauthLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

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

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username, role },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Explicitly create profile row — don't rely on DB trigger
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authData.user.id,
        username,
        display_name: username,
        role,
      });
      if (profileError && profileError.code !== "23505") {
        // 23505 = unique violation (profile already exists), safe to ignore
        setError("Account created but profile setup failed: " + profileError.message);
        setLoading(false);
        return;
      }
    }

    router.push(`/u/${username}`);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D9E75]">
              <span className="text-white font-black text-xs">FX</span>
            </div>
            <span className="text-lg font-black text-[#111]">ForgeX</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
          {/* Heading */}
          <h1 className="text-2xl font-bold text-[#111] mb-2">Sign Up</h1>
          <p className="text-xs text-gray-500 mb-6">
            By continuing, you agree to our User Agreement and acknowledge our Privacy Policy.
          </p>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-5">
            <button
              onClick={() => handleOAuth("github")}
              disabled={!!oauthLoading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-black/[0.1] bg-[#24292e] py-2.5 text-sm font-semibold text-white hover:bg-[#24292e]/90 transition-colors disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {oauthLoading === "github" ? "Redirecting..." : "Continue with GitHub"}
            </button>

            <button
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-black/[0.1] bg-white py-2.5 text-sm font-semibold text-[#111] hover:bg-black/[0.03] transition-colors disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {oauthLoading === "google" ? "Redirecting..." : "Continue with Google"}
            </button>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-black/[0.08]" />
            <span className="text-xs font-bold text-gray-400">OR</span>
            <div className="flex-1 h-px bg-black/[0.08]" />
          </div>

          <form onSubmit={handleSignup} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-full border border-black/[0.1] bg-[#f8f9fa] px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-[#1D9E75] focus:outline-none transition-colors"
            />

            <div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                  )
                }
                placeholder="Username"
                className="w-full rounded-full border border-black/[0.1] bg-[#f8f9fa] px-4 py-3 text-sm text-[#111] placeholder:text-gray-400 focus:border-[#1D9E75] focus:outline-none transition-colors"
              />
              <p className="mt-1 ml-4 text-xs text-gray-400">
                forgex.com/u/{username || "yourname"}
              </p>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-full border border-black/[0.1] bg-[#f8f9fa] px-4 py-3 pr-11 text-sm text-[#111] placeholder:text-gray-400 focus:border-[#1D9E75] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              <p className="mt-1 ml-4 text-xs text-gray-400">Must be at least 8 characters</p>
            </div>

            {/* Role selector */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${
                  role === "buyer"
                    ? "bg-[#1D9E75]/10 text-[#1D9E75] border-2 border-[#1D9E75]"
                    : "bg-[#f8f9fa] text-gray-500 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                I want to buy
              </button>
              <button
                type="button"
                onClick={() => setRole("creator")}
                className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${
                  role === "creator"
                    ? "bg-[#1D9E75]/10 text-[#1D9E75] border-2 border-[#1D9E75]"
                    : "bg-[#f8f9fa] text-gray-500 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                I want to sell
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#1D9E75] py-3 text-sm font-bold text-white hover:bg-[#178c66] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-5 text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-[#1D9E75] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
