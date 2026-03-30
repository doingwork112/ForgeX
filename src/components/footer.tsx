import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-base font-bold text-white tracking-tight">ForgeX</span>
            <span className="text-xs text-muted-foreground">The marketplace for ready-made apps.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/marketplace" className="transition-colors hover:text-white">
              Marketplace
            </Link>
            <Link href="/hunters" className="transition-colors hover:text-white">
              Hunters
            </Link>
            <Link href="/home" className="transition-colors hover:text-white">
              Home
            </Link>
          </div>

          <span className="text-xs text-muted-foreground">&copy; 2026 ForgeX. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
