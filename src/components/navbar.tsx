import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/forgex-logo-v2.png"
              alt="ForgeX"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link
              href="/marketplace"
              className="transition-colors hover:text-foreground"
            >
              Marketplace
            </Link>
            <Link
              href="/hunters"
              className="transition-colors hover:text-foreground"
            >
              Hunters
            </Link>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Sign in
        </Button>
      </div>
    </nav>
  );
}
