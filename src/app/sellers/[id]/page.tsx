import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { sellers, apps } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: { id: string };
}

export default function SellerProfilePage({ params }: PageProps) {
  const seller = sellers.find((s) => s.id === params.id);
  if (!seller) notFound();

  const sellerApps = apps.filter((a) => seller.appIds.includes(a.id));
  const joinedYear = new Date(seller.joinedAt).getFullYear();

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

      <main className="mx-auto max-w-6xl px-6 py-14">
        {/* Seller header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]/15 text-2xl font-bold text-[#1D9E75]">
            {seller.avatar}
          </div>

          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold">{seller.name}</h1>
            <p className="mb-4 max-w-lg text-muted-foreground">{seller.bio}</p>

            {/* Stats row */}
            <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-white">
                ★ <span className="text-[#1D9E75]">{seller.rating}</span>
              </span>
              <span>{seller.appIds.length} app{seller.appIds.length !== 1 ? "s" : ""}</span>
              <span>{seller.totalSold} sold</span>
              <span>Member since {joinedYear}</span>
            </div>

            <button className="rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-white hover:border-white/20 transition-colors">
              Contact
            </button>
          </div>
        </div>

        {/* Apps section */}
        <div>
          <h2 className="mb-6 text-xl font-bold">Apps by {seller.name}</h2>

          {sellerApps.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-muted-foreground">
              <p className="text-sm">No apps listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sellerApps.map((app) => (
                <Link key={app.id} href={`/marketplace/${app.id}`}>
                  <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[#1D9E75]/40 hover:shadow-[0_0_28px_rgba(29,158,117,0.12)] hover:-translate-y-0.5 cursor-pointer">
                    {/* Placeholder screenshot */}
                    <div className="aspect-video w-full bg-[#111] flex items-center justify-center">
                      <span className="text-xs text-muted-foreground/30">{app.name}</span>
                    </div>

                    <div className="p-5">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-white">{app.name}</h3>
                        <Badge variant="secondary" className="text-[11px] shrink-0">
                          {app.category}
                        </Badge>
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {app.tagline}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {app.techStack.slice(0, 2).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                          {app.techStack.length > 2 && (
                            <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] text-muted-foreground">
                              +{app.techStack.length - 2}
                            </span>
                          )}
                        </div>
                        <span className="shrink-0 text-lg font-bold text-[#1D9E75]">
                          ${app.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
