"use client";

import Link from "next/link";
import { Gamepad2, History, Search, LayoutDashboard, Menu, MessageCircle, HelpCircle, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 shrink-0">
          <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_15px_rgba(242,255,0,0.3)]">
            <span className="font-headline text-lg md:text-xl font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-headline text-lg md:text-xl font-black tracking-tighter text-foreground">STS Pedia</span>
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

          {/* Mobile Sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl lg:hidden border-border bg-card/50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border p-0 flex flex-col w-[300px] sm:w-[350px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              
              {/* Visual Header */}
              <div className="p-6 border-b border-border bg-card/30">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center font-headline font-black text-xl text-primary-foreground shadow-lg shadow-primary/20">S</div>
                  <div>
                    <h3 className="font-headline font-black text-lg tracking-tight">STS Pedia</h3>
                    <p className="text-[10px] text-muted-foreground font-bold">Fast & Secure Topup Hub</p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-8">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search services..." className="pl-10 h-11 bg-muted/30 border-border rounded-xl" />
                  </div>

                  {/* Main Menu */}
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 mb-3 px-2">Navigation</p>
                    <div className="space-y-1">
                      <Link href="/">
                        <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                          <Gamepad2 className="h-5 w-5" /> Games
                        </Button>
                      </Link>
                      <Link href="/history">
                        <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                          <History className="h-5 w-5" /> Transaction history
                        </Button>
                      </Link>
                      <Link href="/status">
                        <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                          <LayoutDashboard className="h-5 w-5" /> Track order
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <Separator className="opacity-40" />

                  {/* Account & Help */}
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 mb-3 px-2">Support & account</p>
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                        <User className="h-5 w-5" /> My profile
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                        <MessageCircle className="h-5 w-5" /> Contact support
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                        <HelpCircle className="h-5 w-5" /> Help center
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Footer Section */}
              <div className="p-6 border-t border-border mt-auto bg-muted/10">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <p className="text-[10px] font-black text-muted-foreground">Certified & secure payment gateway</p>
                </div>
                <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black text-sm">
                  Sign in
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}