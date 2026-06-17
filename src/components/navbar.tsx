"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Gamepad2, History, Search, LayoutDashboard, Menu, MessageCircle, HelpCircle, ShieldCheck, User, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginModal } from "@/components/auth/login-modal";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchValue(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    
    if (pathname !== "/") {
      router.push(`/?${params.toString()}`);
    } else {
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    if (!searchParams.get("q")) {
      setSearchValue("");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {isSearchOpen ? (
            <div className="flex w-full items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeSearch}
                className="shrink-0 text-muted-foreground"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  placeholder="Search games or services..."
                  className="h-10 w-full rounded-full border-border bg-muted/50 pl-10 pr-10 focus-visible:ring-primary"
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full hover:bg-transparent"
                    onClick={() => handleSearch("")}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 shrink-0">
                <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_15px_rgba(242,255,0,0.3)]">
                  <span className="font-headline text-lg md:text-xl font-bold text-primary-foreground">S</span>
                </div>
                <span className="font-headline text-lg md:text-xl font-black tracking-tighter text-foreground">STS Pedia</span>
              </Link>

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
                <div className="hidden lg:flex relative group">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Search games..." 
                    className="h-9 w-48 xl:w-64 rounded-full bg-muted/50 pl-10 border-border focus-visible:ring-primary"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                
                <div className="hidden sm:block">
                  <ThemeToggle />
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden rounded-xl border border-border bg-card/50"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                <Button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden sm:flex rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90 px-6"
                >
                  Login
                </Button>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl lg:hidden border-border bg-card/50">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-background border-border p-0 flex flex-col w-full sm:max-w-none">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Navigation Menu</SheetTitle>
                    </SheetHeader>
                    
                    <div className="h-16 px-6 border-b border-border bg-card/30 flex items-center shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-headline font-black text-xl text-primary-foreground shadow-lg shadow-primary/20">S</div>
                        <div>
                          <h3 className="font-headline font-black text-base tracking-tight leading-none">STS Pedia</h3>
                          <p className="text-[9px] text-muted-foreground font-bold mt-1">Fast & Secure Hub</p>
                        </div>
                      </div>
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="p-4 space-y-8">
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

                        <div>
                          <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 mb-3 px-2">Preferences</p>
                          <div className="px-2 py-1">
                             <div className="flex items-center justify-between">
                                <span className="text-sm font-bold">Display Theme</span>
                                <ThemeToggle />
                             </div>
                          </div>
                        </div>

                        <Separator className="opacity-40" />

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

                    <div className="p-6 border-t border-border mt-auto bg-muted/10">
                      <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <p className="text-[10px] font-black text-muted-foreground">Certified & secure payment gateway</p>
                      </div>
                      <Button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black text-sm"
                      >
                        Sign in
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </nav>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onOpenChange={setIsLoginModalOpen} 
      />
    </>
  );
}
