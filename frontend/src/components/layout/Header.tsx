import Link from "next/link";
import { Search, Gamepad2 } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Home", href: "/" },
];

/** Site header with logo, nav, and search placeholder. */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search (placeholder) */}
        <div className="hidden sm:flex items-center rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground">
          <Search className="mr-2 h-4 w-4" />
          <span>Search games...</span>
          <kbd className="ml-8 hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground lg:inline-block">
            Ctrl+K
          </kbd>
        </div>

        {/* Mobile search icon */}
        <button className="inline-flex sm:hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
