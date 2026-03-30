"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { apps, categories, techStacks } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const sortOptions = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc",   label: "Name A–Z" },
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const filteredApps = useMemo(() => {
    let result = apps.filter((app) => {
      if (selectedCategory !== "All" && app.category !== selectedCategory) return false;
      if (selectedTechStacks.length > 0 && !selectedTechStacks.some((ts) => app.techStack.includes(ts))) return false;
      const min = priceRange.min ? Number(priceRange.min) : 0;
      const max = priceRange.max ? Number(priceRange.max) : Infinity;
      if (app.price < min || app.price > max) return false;
      if (search && !app.name.toLowerCase().includes(search.toLowerCase()) && !app.tagline.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    if (sort === "price-asc")  result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "name-asc")   result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [selectedCategory, selectedTechStacks, priceRange, search, sort]);

  function toggleTechStack(stack: string) {
    setSelectedTechStacks((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack]
    );
  }

  function clearFilters() {
    setSelectedCategory("All");
    setSelectedTechStacks([]);
    setPriceRange({ min: "", max: "" });
    setSearch("");
    setSort("default");
  }

  const hasFilters = selectedCategory !== "All" || selectedTechStacks.length > 0 || priceRange.min || priceRange.max || search;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[700px] rounded-full bg-[#1D9E75]/[0.06] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.2]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
      </div>

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-14">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Marketplace</h1>
          <p className="mt-2 text-muted-foreground">
            Discover production-ready apps. Buy the code and launch in minutes.
          </p>
        </div>

        {/* Search + Sort bar */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search apps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none focus:ring-1 focus:ring-[#1D9E75]/40 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-[#111] py-2.5 px-3 text-sm text-white focus:border-[#1D9E75]/50 focus:outline-none transition-colors cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-white transition-colors px-3 py-2 rounded-xl border border-white/[0.08] hover:border-white/20"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-20 space-y-7">
              {/* Category */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category
                </h3>
                <div className="flex flex-col gap-0.5">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
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

              {/* Tech Stack */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tech Stack
                </h3>
                <div className="flex flex-col gap-2">
                  {techStacks.map((stack) => (
                    <label
                      key={stack}
                      className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                      <div
                        onClick={() => toggleTechStack(stack)}
                        className={`h-4 w-4 shrink-0 rounded border transition-colors cursor-pointer flex items-center justify-center ${
                          selectedTechStacks.includes(stack)
                            ? "border-[#1D9E75] bg-[#1D9E75]"
                            : "border-white/20 bg-transparent hover:border-white/40"
                        }`}
                      >
                        {selectedTechStacks.includes(stack) && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span onClick={() => toggleTechStack(stack)}>{stack}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price Range
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                  />
                  <span className="text-muted-foreground text-xs shrink-0">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
                    className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-[#1D9E75]/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* App Grid */}
          <div className="flex-1 min-w-0">
            <p className="mb-5 text-sm text-muted-foreground">
              Showing <span className="text-white font-medium">{filteredApps.length}</span> apps
            </p>

            {filteredApps.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-muted-foreground">
                <span className="text-4xl">🔍</span>
                <p className="text-sm">No apps match your filters.</p>
                <button onClick={clearFilters} className="text-xs text-[#1D9E75] hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredApps.map((app) => (
                  <Link key={app.id} href={`/marketplace/${app.id}`}>
                    <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[#1D9E75]/40 hover:shadow-[0_0_28px_rgba(29,158,117,0.12)] hover:-translate-y-0.5 cursor-pointer">
                      {/* Screenshot */}
                      <div className="relative aspect-video w-full overflow-hidden bg-[#111]">
                        <Image
                          src="/placeholder-app.svg"
                          alt={app.name}
                          fill
                          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-white leading-snug">{app.name}</h3>
                          <Badge variant="secondary" className="text-[11px] shrink-0">{app.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{app.tagline}</p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1">
                            {app.techStack.slice(0, 2).map((tech) => (
                              <span key={tech} className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] text-muted-foreground">
                                {tech}
                              </span>
                            ))}
                            {app.techStack.length > 2 && (
                              <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] text-muted-foreground">
                                +{app.techStack.length - 2}
                              </span>
                            )}
                          </div>
                          <span className="shrink-0 text-lg font-bold text-[#1D9E75]">${app.price}</span>
                        </div>
                      </div>
                    </div>
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
