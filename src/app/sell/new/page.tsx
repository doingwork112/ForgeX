"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

const CATEGORIES = [
  "SaaS", "E-Commerce", "Social", "Tools", "Restaurant",
  "Booking", "Finance", "Education", "Health",
];

const TECH_STACKS = [
  "Next.js", "React", "React Native", "Flutter", "Vue",
  "Node.js", "Python", "Supabase", "Firebase", "Stripe",
  "OpenAI", "Tailwind CSS",
];

interface FormData {
  name: string;
  tagline: string;
  category: string;
  techStack: string[];
  description: string;
  features: string[];
  demoUrl: string;
  screenshots: string[];
  videoUrl: string;
  price: string;
  deliveryType: "github" | "zip";
  deliveryUrl: string;
  terms: boolean;
}

const defaultForm: FormData = {
  name: "",
  tagline: "",
  category: "",
  techStack: [],
  description: "",
  features: [""],
  demoUrl: "",
  screenshots: [""],
  videoUrl: "",
  price: "",
  deliveryType: "github",
  deliveryUrl: "",
  terms: false,
};

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors";

export default function NewListingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);

  const fee = form.price ? (parseFloat(form.price) * 0.15).toFixed(2) : "0.00";
  const earnings = form.price
    ? (parseFloat(form.price) * 0.85).toFixed(2)
    : "0.00";

  function toggleTech(t: string) {
    setForm((f) => ({
      ...f,
      techStack: f.techStack.includes(t)
        ? f.techStack.filter((x) => x !== t)
        : [...f.techStack, t],
    }));
  }

  function setFeature(i: number, val: string) {
    setForm((f) => {
      const features = [...f.features];
      features[i] = val;
      return { ...f, features };
    });
  }

  function addFeature() {
    if (form.features.length < 10) {
      setForm((f) => ({ ...f, features: [...f.features, ""] }));
    }
  }

  function removeFeature(i: number) {
    if (form.features.length > 1) {
      setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
    }
  }

  function setScreenshot(i: number, val: string) {
    setForm((f) => {
      const screenshots = [...f.screenshots];
      screenshots[i] = val;
      return { ...f, screenshots };
    });
  }

  function addScreenshot() {
    if (form.screenshots.length < 4) {
      setForm((f) => ({ ...f, screenshots: [...f.screenshots, ""] }));
    }
  }

  function removeScreenshot(i: number) {
    if (form.screenshots.length > 1) {
      setForm((f) => ({ ...f, screenshots: f.screenshots.filter((_, idx) => idx !== i) }));
    }
  }

  function canContinue(): boolean {
    if (step === 1) return !!(form.name && form.tagline && form.category);
    if (step === 2)
      return !!(
        form.description &&
        form.features.filter((f) => f.trim()).length >= 1
      );
    if (step === 3) return !!form.demoUrl;
    if (step === 4)
      return !!(form.price && parseFloat(form.price) > 0 && form.deliveryUrl && form.terms);
    return false;
  }

  function handleNext() {
    if (step < 4) setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
    else setPublished(true);
  }

  function handleBack() {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  }

  const steps = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Description" },
    { num: 3, label: "Media" },
    { num: 4, label: "Pricing" },
  ];

  if (published) {
    return (
      <div className="relative min-h-screen bg-[#0a0a0a] text-white">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[#1D9E75]/[0.06] blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#1D9E75]/15 shadow-[0_0_60px_rgba(29,158,117,0.3)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-3 text-3xl font-bold">Your app is live!</h1>
          <p className="mb-10 text-muted-foreground">
            It may take a few minutes to appear in the marketplace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/marketplace/1">
              <button className="rounded-xl bg-[#1D9E75] px-7 py-3 font-semibold text-white hover:bg-[#1D9E75]/90 transition-colors">
                View Listing
              </button>
            </Link>
            <button
              onClick={() => {
                setForm(defaultForm);
                setStep(1);
                setPublished(false);
              }}
              className="rounded-xl border border-white/[0.08] px-7 py-3 font-semibold text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
            >
              List Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[#1D9E75]/[0.06] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Navbar />

      <main className="mx-auto max-w-2xl px-6 py-14">
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-bold">Create a new listing</h1>
          <p className="text-sm text-muted-foreground">List your app and start earning.</p>
        </div>

        {/* Progress bar */}
        <div className="mb-10 flex items-center gap-0">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    step === s.num
                      ? "bg-[#1D9E75] text-white"
                      : step > s.num
                      ? "bg-[#1D9E75]/20 text-[#1D9E75]"
                      : "bg-white/[0.06] text-muted-foreground"
                  }`}
                >
                  {step > s.num ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.num
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium ${
                    step === s.num ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`mx-2 mb-5 h-px flex-1 transition-colors ${
                    step > s.num ? "bg-[#1D9E75]/40" : "bg-white/[0.06]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Basic Info</h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  App name
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. InvoiceFlow"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Tagline — One line that sells it
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. AI-powered invoicing for freelancers"
                  value={form.tagline}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Category
                </label>
                <select
                  className={inputClass + " cursor-pointer bg-[#111]"}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-muted-foreground">
                  Tech Stack
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {TECH_STACKS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTech(t)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        form.techStack.includes(t)
                          ? "border-[#1D9E75]/50 bg-[#1D9E75]/10 text-[#1D9E75]"
                          : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Description</h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={5}
                  className={inputClass + " resize-none"}
                  placeholder="Describe your app in detail..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-muted-foreground">
                  Key Features{" "}
                  <span className="text-xs text-muted-foreground/60">(min 3)</span>
                </label>
                <div className="space-y-2">
                  {form.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className={inputClass}
                        placeholder={`Feature ${i + 1}`}
                        value={feat}
                        onChange={(e) => setFeature(i, e.target.value)}
                      />
                      {form.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {form.features.length < 10 && (
                  <button
                    type="button"
                    onClick={addFeature}
                    className="mt-3 text-xs text-[#1D9E75] hover:text-[#1D9E75]/80 transition-colors"
                  >
                    + Add Feature
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Media &amp; Demo</h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Demo URL
                </label>
                <input
                  className={inputClass}
                  placeholder="https://your-demo.vercel.app"
                  value={form.demoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, demoUrl: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Video URL{" "}
                  <span className="text-xs text-muted-foreground/60">(optional)</span>
                </label>
                <input
                  className={inputClass}
                  placeholder="https://youtube.com/..."
                  value={form.videoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Screenshots
                </label>
                <p className="mb-3 text-xs text-muted-foreground/60">
                  Enter public image URLs or Cloudinary links
                </p>
                <div className="space-y-2">
                  {form.screenshots.map((url, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className={inputClass}
                        placeholder={`Screenshot ${i + 1} URL`}
                        value={url}
                        onChange={(e) => setScreenshot(i, e.target.value)}
                      />
                      {form.screenshots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeScreenshot(i)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {form.screenshots.length < 4 && (
                  <button
                    type="button"
                    onClick={addScreenshot}
                    className="mt-3 text-xs text-[#1D9E75] hover:text-[#1D9E75]/80 transition-colors"
                  >
                    + Add Screenshot
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Pricing &amp; Delivery</h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                    $
                  </span>
                  <input
                    className={inputClass + " pl-9 text-2xl font-bold"}
                    placeholder="499"
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>

                {form.price && parseFloat(form.price) > 0 && (
                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sale price</span>
                      <span className="text-white">${parseFloat(form.price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform fee (15%)</span>
                      <span className="text-muted-foreground">-${fee}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/[0.06] pt-2">
                      <span className="font-medium text-white">You earn</span>
                      <span className="font-semibold text-[#1D9E75]">${earnings}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-muted-foreground">
                  Delivery type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["github", "zip"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, deliveryType: type }))}
                      className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                        form.deliveryType === type
                          ? "border-[#1D9E75]/50 bg-[#1D9E75]/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className="mb-1 text-sm font-semibold text-white">
                        {type === "github" ? "GitHub Repo" : "ZIP Download"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {type === "github"
                          ? "Share a private GitHub repository"
                          : "Upload a ZIP file for download"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  {form.deliveryType === "github" ? "GitHub repo URL" : "Download ZIP URL"}
                </label>
                <input
                  className={inputClass}
                  placeholder={
                    form.deliveryType === "github"
                      ? "https://github.com/you/your-app"
                      : "https://drive.google.com/..."
                  }
                  value={form.deliveryUrl}
                  onChange={(e) => setForm((f) => ({ ...f, deliveryUrl: e.target.value }))}
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <div
                  onClick={() => setForm((f) => ({ ...f, terms: !f.terms }))}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors ${
                    form.terms
                      ? "border-[#1D9E75] bg-[#1D9E75]"
                      : "border-white/20 bg-transparent hover:border-white/40"
                  }`}
                >
                  {form.terms && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  I own this code and have rights to sell it
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-white hover:border-white/20 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            disabled={!canContinue()}
            className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors ${
              canContinue()
                ? "bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90"
                : "bg-[#1D9E75]/30 text-white/40 cursor-not-allowed"
            }`}
          >
            {step === 4 ? "Publish Listing" : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}
