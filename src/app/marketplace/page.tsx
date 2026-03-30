"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apps, categories, techStacks } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (selectedCategory !== "All" && app.category !== selectedCategory) {
        return false;
      }

      if (
        selectedTechStacks.length > 0 &&
        !selectedTechStacks.some((ts) => app.techStack.includes(ts))
      ) {
        return false;
      }

      const min = priceRange.min ? Number(priceRange.min) : 0;
      const max = priceRange.max ? Number(priceRange.max) : Infinity;
      if (app.price < min || app.price > max) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedTechStacks, priceRange]);

  function toggleTechStack(stack: string) {
    setSelectedTechStacks((prev) =>
      prev.includes(stack)
        ? prev.filter((s) => s !== stack)
        : [...prev, stack]
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Marketplace</h1>
          <p className="mt-2 text-muted-foreground">
            Discover production-ready apps built by top developers. Buy, deploy,
            and launch in minutes.
          </p>
        </div>

        <div className="flex gap-10">
          {/* Left Sidebar */}
          <aside className="w-[240px] shrink-0 space-y-8">
            {/* Category Filter */}
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Category
              </h3>
              <div className="flex flex-col gap-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-[#1D9E75]/15 text-[#1D9E75] font-medium"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack Filter */}
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Tech Stack
              </h3>
              <div className="flex flex-col gap-2">
                {techStacks.map((stack) => (
                  <label
                    key={stack}
                    className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTechStacks.includes(stack)}
                      onChange={() => toggleTechStack(stack)}
                      className="h-3.5 w-3.5 rounded border-border bg-transparent accent-[#1D9E75]"
                    />
                    {stack}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Price Range
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full rounded-md border border-border/50 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none focus:ring-1 focus:ring-[#1D9E75]/50"
                />
                <span className="text-muted-foreground text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full rounded-md border border-border/50 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none focus:ring-1 focus:ring-[#1D9E75]/50"
                />
              </div>
            </div>
          </aside>

          {/* App Grid */}
          <div className="flex-1">
            {filteredApps.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                No apps match your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredApps.map((app) => (
                  <Link key={app.id} href={`/marketplace/${app.id}`}>
                    <Card className="group overflow-hidden border-border/50 bg-card transition-colors hover:border-[#1D9E75]/50">
                      {/* Screenshot */}
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        <Image
                          src="/placeholder-app.svg"
                          alt={app.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Body */}
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base font-semibold leading-tight">
                            {app.name}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-xs"
                          >
                            {app.category}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 text-sm">
                          {app.tagline}
                        </CardDescription>
                      </CardHeader>

                      {/* Footer */}
                      <CardContent className="flex items-center justify-between pt-0">
                        <span className="text-lg font-bold text-[#1D9E75]">
                          ${app.price}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="pointer-events-none text-xs"
                          tabIndex={-1}
                        >
                          Open Demo
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
