import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apps } from "@/lib/mock-data";

const stats = [
  { value: "120+", label: "Apps Available" },
  { value: "45",   label: "Open Bounties" },
  { value: "200+", label: "Builders" },
  { value: "$500k+", label: "Paid Out" },
];

const steps = [
  {
    number: "01",
    title: "Post a bounty",
    description: "Describe the app you need and set your budget. No tech knowledge required.",
    icon: "📋",
  },
  {
    number: "02",
    title: "Builders deliver",
    description: "Developers build your app and submit a live demo for you to try.",
    icon: "⚡",
  },
  {
    number: "03",
    title: "Buy or pass",
    description: "Love it? Pay and get the full codebase. Pass? It hits the public marketplace.",
    icon: "🎯",
  },
];

const featuredApps = apps.slice(0, 6);

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* ─── Global background glow ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-glow-pulse absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[#1D9E75]/[0.08] blur-[120px]" />
        <div className="absolute top-1/3 -left-48 h-[400px] w-[400px] rounded-full bg-[#1D9E75]/[0.04] blur-[100px]" />
        <div className="absolute bottom-1/4 -right-48 h-[400px] w-[400px] rounded-full bg-[#1D9E75]/[0.04] blur-[100px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center px-6 pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1D9E75]/30 bg-[#1D9E75]/10 px-4 py-1.5 text-sm text-[#1D9E75] mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
          Now live — browse 120+ ready-made apps
        </div>

        <h1 className="relative max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
          The marketplace for
          <br />
          <span
            className="text-[#1D9E75]"
            style={{
              textShadow: "0 0 80px rgba(29,158,117,0.4), 0 0 40px rgba(29,158,117,0.2)",
            }}
          >
            ready-made apps
          </span>
        </h1>

        <p className="relative mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed">
          Browse finished apps built by AI-powered developers.
          Buy the code instantly, or post a bounty and get exactly what you need.
        </p>

        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/marketplace">
            <Button
              size="lg"
              className="bg-[#1D9E75] text-white font-semibold px-8 hover:bg-[#1D9E75]/90 shadow-[0_0_24px_rgba(29,158,117,0.35)]"
            >
              Browse Apps
            </Button>
          </Link>
          <Link href="/hunters">
            <Button
              variant="outline"
              size="lg"
              className="px-8 border-white/15 text-white hover:bg-white/5 hover:border-white/30"
            >
              Post a Bounty
            </Button>
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 text-xs text-muted-foreground/50">
          <span>Scroll to explore</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/10 to-transparent" />
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <span className="text-2xl font-bold text-white md:text-3xl">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-[#1D9E75] mb-3">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight">Three steps to launch</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all hover:border-[#1D9E75]/30 hover:bg-[#1D9E75]/[0.03]"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-1/2 -right-3 hidden h-px w-6 bg-gradient-to-r from-white/10 to-transparent md:block" />
              )}
              <div className="mb-4 text-2xl">{step.icon}</div>
              <span className="font-mono text-xs font-semibold text-[#1D9E75] tracking-wider">
                {step.number}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Apps ─── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#1D9E75] mb-2">Marketplace</p>
            <h2 className="text-3xl font-bold tracking-tight">Featured apps</h2>
          </div>
          <Link
            href="/marketplace"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-white flex items-center gap-1.5 shrink-0"
          >
            View all <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredApps.map((app) => (
            <Link key={app.id} href={`/marketplace/${app.id}`}>
              <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[#1D9E75]/40 hover:shadow-[0_0_30px_rgba(29,158,117,0.1)] hover:-translate-y-0.5">
                {/* Screenshot */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#111]">
                  <Image
                    src="/placeholder-app.svg"
                    alt={app.name}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-white leading-tight">{app.name}</h3>
                    <span className="shrink-0 text-base font-bold text-[#1D9E75]">${app.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{app.tagline}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {app.techStack.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-[11px] px-2 py-0.5">
                        {tech}
                      </Badge>
                    ))}
                    {app.techStack.length > 3 && (
                      <Badge variant="secondary" className="text-[11px] px-2 py-0.5">
                        +{app.techStack.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-[#1D9E75]/20 bg-[#1D9E75]/[0.05] p-12 text-center">
          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 120%, rgba(29,158,117,0.15), transparent)"
          }} />
          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-widest text-[#1D9E75] mb-4">For builders</p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Got an app idea?
            </h2>
            <p className="mt-4 max-w-md mx-auto text-muted-foreground">
              Post a bounty and let the best developers compete to bring it to life.
              Only pay when you love the result.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/hunters">
                <Button
                  size="lg"
                  className="bg-[#1D9E75] text-white font-semibold px-10 hover:bg-[#1D9E75]/90 shadow-[0_0_24px_rgba(29,158,117,0.4)]"
                >
                  Post a Bounty
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-muted-foreground hover:text-white px-8"
                >
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
