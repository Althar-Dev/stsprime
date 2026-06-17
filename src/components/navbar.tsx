"use client";

import Link from "next/link";
import { Gamepad2, History, Search, LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 shrink-0">
          <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_15px_rgba(242,255,0,0.3)]">
            <span className="font-headline text-lg md:text-xl font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-headline text-lg md:text-xl font-black tracking-tighter text-foreground">STS PEDIA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
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

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex h-9 items-center rounded-full bg-muted/50 px-4 py-2 text-sm text-muted-foreground lg:w-64">
            <Search className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">Search games...</span>
          </div>
          
          <Button className="rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90 px-4 md:px-6">
            Login
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl lg:hidden border-border bg-card/50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="font-headline font-black text-2xl text-primary">MENU</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                <Link href="/">
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-lg font-bold hover:bg-primary/10 hover:text-primary">
                    <Gamepad2 className="h-6 w-6" /> Games
                  </Button>
                </Link>
                <Link href="/history">
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-lg font-bold hover:bg-primary/10 hover:text-primary">
                    <History className="h-6 w-6" /> History
                  </Button>
                </Link>
                <Link href="/status">
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-lg font-bold hover:bg-primary/10 hover:text-primary">
                    <LayoutDashboard className="h-6 w-6" /> Track Order
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
