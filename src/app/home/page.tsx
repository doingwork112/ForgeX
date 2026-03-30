import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apps } from "@/lib/mock-data";

const steps = [
  {
    number: "01",
    title: "Post a bounty",
    description: "Describe the app you need and set your budget",
  },
  {
    number: "02",
    title: "Builders deliver",
    description: "Developers build your app and submit a live demo",
  },
  {
    number: "03",
    title: "Buy or pass",
    description:
      "Love it? Pay and get the code. Pass? It hits the marketplace.",
  },
];

const featuredApps = apps.slice(0, 6);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ─── Navbar ─── */}
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center px-6 pt-32 pb-24 text-center">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[480px] w-[720px] rounded-full bg-white/[0.03] blur-3xl" />

        <h1 className="relative max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          The marketplace for
          <br />
          <span className="text-accent">ready-made apps</span>
        </h1>

        <p className="relative mt-6 max-w-xl text-lg text-muted-foreground">
          Browse finished apps built by AI-powered developers. Buy, sell, or
          post a bounty.
        </p>

        <div className="relative mt-10 flex gap-4">
          <Link href="/marketplace">
            <Button size="lg" className="bg-accent text-white font-bold px-6 hover:bg-accent/90">
              Browse Apps
            </Button>
          </Link>
          <Link href="/hunters">
            <Button variant="outline" size="lg" className="px-6">
              Post a Bounty
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight">
          How it works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-xl border border-border/50 bg-card/50 p-8"
            >
              <span className="font-mono text-sm font-medium text-accent">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Apps ─── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight">
          Featured on the marketplace
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredApps.map((app) => (
            <Link key={app.id} href={`/marketplace/${app.id}`}>
              <Card className="border-border/50 bg-card/60 transition-colors hover:border-border">
                <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
                  <Image
                    src="/placeholder-app.svg"
                    alt={app.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {app.name}
                  </CardTitle>
                  <CardDescription>{app.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {app.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-accent">
                    ${app.price}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            View all apps &rarr;
          </Link>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Card className="border-accent/20 bg-card/60 py-16 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Got an app idea?
            </CardTitle>
            <CardDescription className="text-base">
              Post a bounty and let builders compete to bring it to life.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/hunters">
              <Button size="lg" className="bg-accent text-white font-bold px-8 hover:bg-accent/90">
                Post a Bounty
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* ─── Footer ─── */}
      <Footer />
    </div>
  );
}
