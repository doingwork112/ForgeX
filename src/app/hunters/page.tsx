"use client";

import { useState } from "react";
import Link from "next/link";
import { bounties, categories } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const statusConfig = {
  open: { label: "Open", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  in_progress: { label: "In Progress", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  completed: { label: "Completed", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
} as const;

function formatDeadline(deadline: string) {
  const date = new Date(deadline);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function HuntersPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered =
    selectedCategory === "All"
      ? bounties
      : bounties.filter((b) => b.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hunters</h1>
            <p className="mt-2 text-muted-foreground">
              Post a bounty for the app you need. Builders compete to deliver.
            </p>
          </div>
          <Button className="bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white shrink-0">
            Post a Bounty
          </Button>
        </div>

        {/* Category filters */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "ghost"}
              size="sm"
              className={
                selectedCategory === cat
                  ? "bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white shrink-0"
                  : "text-muted-foreground hover:text-white shrink-0"
              }
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Bounty list */}
        <div className="mt-10 flex flex-col gap-4">
          {filtered.map((bounty) => {
            const status = statusConfig[bounty.status];
            return (
              <Link key={bounty.id} href={`/hunters/${bounty.id}`}>
                <Card className="border-border/50 bg-card hover:border-[#1D9E75]/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-lg">{bounty.title}</h3>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                      {bounty.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {bounty.category}
                        </Badge>
                        {bounty.deadline && (
                          <span>Due: {formatDeadline(bounty.deadline)}</span>
                        )}
                        <span>{bounty.submissions} submissions</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-lg font-bold text-[#1D9E75]">
                          ${bounty.budget.toLocaleString()}
                        </span>
                        <Button variant="outline" size="sm" className="text-xs">
                          Take Bounty
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
