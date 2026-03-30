import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <span className="font-semibold text-foreground">ForgeX</span>
        <div className="flex gap-6">
          <Link href="/marketplace" className="transition-colors hover:text-foreground">
            Marketplace
          </Link>
          <Link href="/hunters" className="transition-colors hover:text-foreground">
            Hunters
          </Link>
        </div>
        <span>&copy; 2026 ForgeX</span>
      </div>
    </footer>
  );
}
