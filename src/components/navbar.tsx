
"use client";

import Link from "next/link";
import { Gamepad2, History, Search, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_15px_rgba(139,113,249,0.5)]">
            <span className="font-headline text-xl font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-headline text-xl font-bold tracking-tighter text-foreground">STS PEDIA</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <Gamepad2 className="h-4 w-4" />
              Games
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <History className="h-4 w-4" />
              History
            </Button>
          </Link>
          <Link href="/status">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <LayoutDashboard className="h-4 w-4" />
              Track
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full md:hidden">
            <Search className="h-4 w-4" />
          </Button>
          <div className="hidden h-9 items-center rounded-full bg-muted/50 px-4 py-2 text-sm text-muted-foreground md:flex">
            <Search className="mr-2 h-4 w-4" />
            <span>Search games...</span>
            <span className="ml-4 text-[10px] font-mono opacity-50">CTRL+K</span>
          </div>
          <Button className="rounded-full bg-primary font-medium text-primary-foreground hover:bg-primary/90">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
