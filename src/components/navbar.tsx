"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Gamepad2, Search, LayoutDashboard, Menu, MessageCircle, HelpCircle, ShieldCheck, User, X, ChevronLeft, LogOut, Settings, Trophy, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginModal } from "@/components/auth/login-modal";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useUser, useAuth, useFirestore } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SearchInput({ isMobile, closeSearch }: { isMobile?: boolean, closeSearch?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  useEffect(() => {
    setSearchValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchAction = (value: string) => {
    setSearchValue(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    
    const queryString = params.toString();
    const newPath = queryString ? `/?${queryString}` : '/';

    if (pathname !== "/") {
      router.push(newPath);
    } else {
      router.replace(newPath, { scroll: false });
    }
  };

  if (isMobile) {
    return (
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
            placeholder="Cari game atau layanan..."
            className="h-10 w-full rounded-full border-border bg-muted/50 pl-10 pr-10 focus-visible:ring-primary font-bold"
            value={searchValue}
            onChange={(e) => handleSearchAction(e.target.value)}
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full hover:bg-transparent"
              onClick={() => handleSearchAction("")}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex relative group">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input 
        placeholder="Cari game..." 
        className="h-9 w-48 xl:w-64 rounded-full bg-muted/50 pl-10 border-border focus-visible:ring-primary font-bold"
        value={searchValue}
        onChange={(e) => handleSearchAction(e.target.value)}
      />
    </div>
  );
}

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !db) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        }
      } catch (error) {
        // Fail silently
      }
    }
    fetchProfile();
  }, [user, db]);

  const profileBg = profileData?.profileBg || "bg-muted/30";
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";
  
  const displayPhotoURL = profileData?.photoURL || (profileData?.dev ? "/img/ava/dev.png" : (user?.photoURL || ""));

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col">
          <div className="flex h-16 items-center justify-between">
            {isSearchOpen ? (
              <Suspense fallback={<div className="h-10 w-full bg-muted rounded-full animate-pulse" />}>
                <SearchInput isMobile closeSearch={() => setIsSearchOpen(false)} />
              </Suspense>
            ) : (
              <>
                <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 shrink-0">
                  <Logo className="h-9 w-9 md:h-10 md:w-10" />
                  <div className="flex flex-col">
                    <span className="font-headline text-lg md:text-xl font-black tracking-tighter text-foreground leading-none">STS Pedia</span>
                    <span className="text-[10px] md:text-xs font-bold text-muted-foreground tracking-tight">from StarVale</span>
                  </div>
                </Link>

                <div className="hidden items-center gap-1 lg:flex">
                  <Link href="/">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground font-bold">
                      <Gamepad2 className="h-4 w-4" />
                      Topup
                    </Button>
                  </Link>
                  <Link href="/status">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground font-bold">
                      <Search className="h-4 w-4" />
                      Cek Transaksi
                    </Button>
                  </Link>
                  <Link href="/leaderboard">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground font-bold">
                      <Trophy className="h-4 w-4" />
                      Leaderboard
                    </Button>
                  </Link>
                  <Link href="/benefit">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground font-bold">
                      <Gift className="h-4 w-4" />
                      Benefit
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                  <Suspense fallback={<div className="hidden lg:block h-9 w-48 bg-muted rounded-full animate-pulse" />}>
                    <SearchInput />
                  </Suspense>
                  
                  <div className="hidden lg:block">
                    <ThemeToggle />
                  </div>
                  
                  {user ? (
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="flex items-center gap-2 md:gap-1.5 px-3 md:px-2.5 py-1.5 md:py-1 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer group">
                        <img src="/img/coin.png" alt="STS Coin" className="h-6 w-6 md:h-5 md:w-5 object-contain group-hover:scale-110 transition-transform" />
                        <span className="text-sm md:text-sm font-black text-primary">0</span>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className={cn(
                            "relative h-10 w-10 md:h-11 md:w-11 rounded-full flex items-center justify-center p-0.5 transition-all duration-300",
                            profileBg
                          )}>
                            <Avatar className="h-full w-full border border-background">
                              <AvatarImage src={displayPhotoURL} alt={user.email || "User"} />
                              <AvatarFallback className="bg-muted text-muted-foreground font-black">
                                {userInitial}
                              </AvatarFallback>
                            </Avatar>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 rounded-xl border-border" align="end" forceMount>
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-black leading-none">{user.displayName || "Gamer"}</p>
                              <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer font-bold gap-2" asChild>
                            <Link href="/dashboard" className="flex items-center w-full">
                              <LayoutDashboard className="h-4 w-4" /> Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer font-bold gap-2" asChild>
                            <Link href="/dashboard/settings" className="flex items-center w-full">
                              <Settings className="h-4 w-4" /> Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer font-bold gap-2 text-destructive focus:text-destructive" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" /> Keluar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="hidden sm:flex rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90 px-6"
                    >
                      Login
                    </Button>
                  )}

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-xl lg:hidden border-border bg-card/50">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-background border-border p-0 flex flex-col w-full sm:max-w-none">
                      <SheetHeader className="sr-only">
                        <SheetTitle>Menu Navigasi</SheetTitle>
                      </SheetHeader>
                      
                      <div className="h-16 px-6 border-b border-border bg-card/30 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                          <Logo className="h-10 w-10" />
                          <div>
                            <h3 className="font-headline font-black text-base tracking-tight leading-none">STS Pedia</h3>
                            <p className="text-[9px] text-muted-foreground font-bold mt-1">from StarVale</p>
                          </div>
                        </div>
                      </div>

                      <ScrollArea className="flex-1">
                        <div className="p-4 space-y-8">
                          <div>
                            <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 mb-3 px-2">Navigasi</p>
                            <div className="space-y-1">
                              <Link href="/">
                                <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                  <Gamepad2 className="h-5 w-5" /> Topup
                                </Button>
                              </Link>
                              <Link href="/status">
                                <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                  <Search className="h-5 w-5" /> Cek Transaksi
                                </Button>
                              </Link>
                              <Link href="/leaderboard">
                                <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                  <Trophy className="h-5 w-5" /> Leaderboard
                                </Button>
                              </Link>
                              <Link href="/benefit">
                                <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                  <Gift className="h-5 w-5" /> Benefit
                                </Button>
                              </Link>
                            </div>
                          </div>

                          <Separator className="opacity-40" />

                          <div>
                            <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 mb-3 px-2">Dukungan & Akun</p>
                            <div className="space-y-1">
                              {user && (
                                <>
                                  <Link href="/dashboard">
                                    <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                      <LayoutDashboard className="h-5 w-5" /> Dashboard
                                    </Button>
                                  </Link>
                                  <Link href="/dashboard/settings">
                                    <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                      <Settings className="h-5 w-5" /> Settings
                                    </Button>
                                  </Link>
                                </>
                              )}
                              <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                <MessageCircle className="h-5 w-5" /> Hubungi Dukungan
                              </Button>
                              <Button variant="ghost" className="w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                <HelpCircle className="h-5 w-5" /> Pusat Bantuan
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>

                      <div className="p-6 border-t border-border mt-auto bg-muted/10">
                        {user && (
                          <div className="mb-4 p-4 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <img src="/img/coin.png" alt="STS Coin" className="h-6 w-6 md:h-8 md:w-8 object-contain" />
                              <span className="text-xs font-black">STS Coin</span>
                            </div>
                            <span className="text-sm font-black text-primary">0</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          <p className="text-[10px] font-black text-muted-foreground">Gerbang pembayaran bersertifikat & aman</p>
                        </div>
                        {user ? (
                          <Button 
                            onClick={handleLogout}
                            variant="outline"
                            className="w-full h-11 rounded-xl border-destructive text-destructive font-black text-sm hover:bg-destructive/10"
                          >
                            <LogOut className="h-4 w-4 mr-2" /> Keluar
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => setIsLoginModalOpen(true)}
                            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black text-sm"
                          >
                            Masuk
                          </Button>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            )}
          </div>

          {!isSearchOpen && (
            <div className="lg:hidden pb-4 pt-1 animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-2">
              <div 
                onClick={() => setIsSearchOpen(true)}
                className="relative group cursor-pointer flex-1"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="h-10 w-full rounded-full border border-border bg-muted/40 pl-10 flex items-center text-sm font-bold text-muted-foreground">
                  Cari game atau layanan...
                </div>
              </div>
              <ThemeToggle />
            </div>
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