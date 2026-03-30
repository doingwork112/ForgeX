import { notFound } from "next/navigation";
import Link from "next/link";
import { bounties } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function getStatusBadge(status: "open" | "in_progress" | "completed") {
  switch (status) {
    case "open":
      return (
        <Badge className="bg-[#1D9E75]/15 text-[#1D9E75] border-[#1D9E75]/30 hover:bg-[#1D9E75]/20">
          Open
        </Badge>
      );
    case "in_progress":
      return (
        <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20">
          In Progress
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-zinc-500/15 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/20">
          Completed
        </Badge>
      );
  }
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "No deadline";
  return new Date(deadline).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatBudget(budget: number) {
  return budget.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default async function BountyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bounty = bounties.find((b) => b.id === id);

  if (!bounty) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back link */}
        <Link
          href="/hunters"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors mb-8"
        >
          ← Back to Hunters
        </Link>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left column */}
          <div className="flex-1 lg:max-w-[65%] space-y-8">
            {/* Title and status */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {bounty.title}
              </h1>
              {getStatusBadge(bounty.status)}
            </div>

            {/* Full Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white">
                Full Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {bounty.description}
              </p>
            </div>

            {/* Reference Apps */}
            {bounty.references.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">
                  Reference Apps
                </h2>
                <ul className="space-y-2">
                  {bounty.references.map((ref) => (
                    <li key={ref}>
                      <a
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1D9E75] hover:underline inline-flex items-center gap-1.5 text-sm"
                      >
                        {ref}
                        <span className="text-xs">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="lg:w-[35%]">
            <Card className="sticky top-20 bg-[#111111] border-white/10">
              <CardContent className="p-6 space-y-5">
                {/* Budget */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Budget</p>
                  <p className="text-3xl font-bold text-[#1D9E75]">
                    {formatBudget(bounty.budget)}
                  </p>
                </div>

                {/* Deadline */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                  <p className="text-sm text-white">
                    {formatDeadline(bounty.deadline)}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <Badge variant="secondary">{bounty.category}</Badge>
                </div>

                {/* Poster info */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                    {bounty.poster.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {bounty.poster.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Posted by</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Submissions */}
                <p className="text-sm text-muted-foreground">
                  <span className="text-white font-medium">
                    {bounty.submissions}
                  </span>{" "}
                  developer{bounty.submissions !== 1 ? "s" : ""} have submitted
                </p>

                {/* Submit button */}
                <Button className="w-full bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white font-bold">
                  Submit Your Demo
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Build it, submit a demo URL, and get paid
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
