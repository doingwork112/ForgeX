"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apps } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AppDetailPage({ params }: { params: { id: string } }) {
  const app = apps.find((a) => a.id === params.id);

  if (!app) {
    notFound();
  }

  const [activeScreenshot, setActiveScreenshot] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/marketplace"
          className="mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to Marketplace
        </Link>

        {/* Two-column layout */}
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left column (60%) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Screenshot gallery */}
            <div className="space-y-3">
              {/* Main screenshot */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-card">
                <Image
                  src={app.screenshots[activeScreenshot]}
                  alt={`${app.name} screenshot ${activeScreenshot + 1}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnail row */}
              {app.screenshots.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {app.screenshots.map((screenshot, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveScreenshot(index)}
                      className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-card transition-all ${
                        activeScreenshot === index
                          ? "ring-2 ring-[#1D9E75] ring-offset-2 ring-offset-[#0a0a0a]"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={screenshot}
                        alt={`${app.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About this app */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">About this app</h2>
              <p className="leading-relaxed text-muted-foreground">
                {app.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Features</h2>
              <ul className="space-y-2">
                {app.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#1D9E75] font-bold">&#10003;</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column (40%) */}
          <div className="lg:col-span-2">
            <Card className="sticky top-20 space-y-6 border-border/50 bg-card/50 p-6 backdrop-blur">
              {/* App name & tagline */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{app.name}</h1>
                <p className="text-muted-foreground">{app.tagline}</p>
              </div>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-2">
                {app.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Category badge */}
              <div>
                <Badge className="bg-[#1D9E75] text-white hover:bg-[#1D9E75]/90">
                  {app.category}
                </Badge>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-[#1D9E75]">
                ${app.price}
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(app.demoUrl, "_blank")}
                >
                  Open Demo
                </Button>
                <Button className="w-full bg-[#1D9E75] font-bold text-white hover:bg-[#1D9E75]/90">
                  Buy Now
                </Button>
              </div>

              {/* Seller info */}
              <div className="rounded-lg border border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                    {app.seller.avatar}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{app.seller.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="text-yellow-500">&#9733;</span>
                      <span>{app.seller.rating}</span>
                      <span>&middot;</span>
                      <span>{app.seller.sold} apps sold</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
