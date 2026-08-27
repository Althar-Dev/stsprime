
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Gamepad2, Search, LayoutDashboard, Menu, MessageCircle, HelpCircle, ShieldCheck, User, X, ChevronLeft, LogOut, Settings, Gift } from "lucide-react";
import { AnimatedPodiumIcon } from "@/components/icons/animated-podium";
import { AnimatedCartIcon } from "@/components/icons/animated-cart";
import { AnimatedSearchTransactionIcon } from "@/components/icons/animated-search";
import { AnimatedBenefitIcon } from "@/components/icons/animated-benefit";
import { AnimatedArticleIcon } from "@/components/icons/animated-article";
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
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { SEARCH_ITEMS, SearchItem } from "@/lib/catalog-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="text-primary font-black">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

function SearchInput({ isMobile, closeSearch }: { isMobile?: boolean, closeSearch?: () => void }) {
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchValue.trim()
    ? SEARCH_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.type.toLowerCase().includes(searchValue.toLowerCase())
    )
    : [];

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    setIsDropdownOpen(true);
  };

  const handleItemSelect = () => {
    setSearchValue("");
    setIsDropdownOpen(false);
    closeSearch?.();
  };

  const DropdownResults = () => {
    if (!isDropdownOpen || !searchValue.trim()) return null;

    return (
      <div className="absolute top-full right-0 mt-2 z-50 bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.7)] overflow-hidden max-h-[420px] overflow-y-auto p-3 animate-in fade-in slide-in-from-top-2 duration-200 flash-sale-scrollbar w-[500px] sm:w-[560px]">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {searchResults.map((item) => {
              const image = PlaceHolderImages.find((img) => img.id === item.imageId);
              return (
                <Link
                  key={item.id}
                  href={`/topup/${item.imageId}`}
                  onClick={handleItemSelect}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group cursor-pointer"
                >
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-muted/30 border border-border/50">
                    <Image
                      src={image?.imageUrl || "/img/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                      data-ai-hint={image?.imageHint}
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h4 className="text-sm font-black text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      <HighlightText text={item.name} query={searchValue} />
                    </h4>
                    <p className="text-xs font-bold text-muted-foreground opacity-80 truncate">
                      <HighlightText text={item.type} query={searchValue} />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-6 px-4 text-center">
            <p className="text-xs font-black text-muted-foreground">
              Tidak ada hasil untuk "{searchValue}"
            </p>
          </div>
        )}
      </div>
    );
  };

  if (isMobile) {
    return (
      <div ref={containerRef} className="relative w-full">
        <div className="flex w-full items-center gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-right-2 duration-200 py-1">
          <Button
            size="icon"
            onClick={closeSearch}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25 border-none transition-all active:scale-95 flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground stroke-[2.5]" />
          </Button>
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-primary pointer-events-none" />
            <Input
              ref={inputRef}
              placeholder="Cari game atau layanan..."
              className="h-9 sm:h-10 w-full rounded-full border-primary/40 bg-muted/50 pl-8 sm:pl-10 pr-8 sm:pr-10 text-xs sm:text-sm font-bold focus-visible:ring-primary placeholder:text-xs sm:placeholder:text-sm transition-all"
              value={searchValue}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 sm:h-8 sm:w-8 -translate-y-1/2 rounded-full hover:bg-transparent"
                onClick={() => setSearchValue("")}
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground hover:text-primary" />
              </Button>
            )}
          </div>
        </div>
        <DropdownResults />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="hidden lg:block relative w-48 lg:w-56 xl:w-64 group">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none z-10" />
      <Input
        ref={inputRef}
        placeholder="Cari game..."
        className="h-10 w-full rounded-full bg-muted/50 border-border/80 focus-visible:ring-primary pl-10 pr-10 text-xs sm:text-sm font-bold transition-all duration-300 focus:bg-card focus:border-primary/50 shadow-sm"
        value={searchValue}
        onFocus={() => setIsDropdownOpen(true)}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full hover:bg-transparent z-10"
          onClick={() => setSearchValue("")}
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
      )}
      <DropdownResults />
    </div>
  );
}

function DesktopSlidingNav() {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const NAV_LINKS = [
    { href: "/", label: "Topup", icon: AnimatedCartIcon, anim: "" },
    { href: "/status", label: "Cek Transaksi", icon: AnimatedSearchTransactionIcon, anim: "" },
    { href: "/leaderboard", label: "Leaderboard", icon: AnimatedPodiumIcon, anim: "" },
    { href: "/benefit", label: "Benefit", icon: AnimatedBenefitIcon, anim: "" },
    { href: "/artikel", label: "Artikel", icon: AnimatedArticleIcon, anim: "" },
  ];

  const targetHref = hoveredHref ?? pathname;

  useEffect(() => {
    const updateUnderline = () => {
      if (!containerRef.current) return;
      const activeElement = containerRef.current.querySelector<HTMLElement>(`[data-href="${targetHref}"]`);
      if (activeElement) {
        setUnderlineStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
          opacity: 1,
        });
      } else {
        setUnderlineStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [targetHref, pathname]);

  return (
    <div
      ref={containerRef}
      onMouseLeave={() => setHoveredHref(null)}
      className="hidden items-center gap-1 xl:flex relative h-full py-2"
    >
      {/* Smooth Sliding Underline Bar (Follows Hover) */}
      <span
        className="absolute bottom-0 h-[2.5px] rounded-full bg-primary shadow-[0_0_12px_rgba(1,202,147,0.9)] transition-all duration-300 ease-out pointer-events-none z-10"
        style={{
          left: `${underlineStyle.left}px`,
          width: `${underlineStyle.width}px`,
          opacity: underlineStyle.opacity,
        }}
      />

      {NAV_LINKS.map((link) => {
        const Icon = link.icon;
        const isTargeted = targetHref === link.href;

        return (
          <Link key={link.href} href={link.href}>
            <div
              data-href={link.href}
              onMouseEnter={() => setHoveredHref(link.href)}
              className={cn(
                "group relative flex items-center gap-2 px-3 py-2 text-sm font-bold transition-colors cursor-pointer rounded-lg",
                isTargeted ? "text-primary font-black" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-all duration-300",
                  isTargeted ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary",
                  link.anim
                )}
              />
              <span>{link.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
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

  const displayPhotoURL = profileData?.photoURL || (profileData?.dev ? "/img/avas/dev.png" : (user?.photoURL || ""));
  const coinValue = profileData?.coins || 0;

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col">
          <div className="flex h-16 items-center justify-between gap-4">
            {isSearchOpen ? (
              <Suspense fallback={<div className="h-10 w-full bg-muted rounded-full animate-pulse" />}>
                <SearchInput isMobile closeSearch={() => setIsSearchOpen(false)} />
              </Suspense>
            ) : (
              <>
                <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                  <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 shrink-0">
                    <Logo className="h-16 w-32" />
                  </Link>

                  <DesktopSlidingNav />
                </div>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <Suspense fallback={<div className="hidden lg:block h-10 w-48 bg-muted/40 rounded-full animate-pulse" />}>
                    <SearchInput />
                  </Suspense>

                  <div className="hidden lg:block">
                    <ThemeToggle />
                  </div>

                  {user ? (
                    <div className="hidden lg:flex items-center gap-2 md:gap-3">
                      <div className="flex items-center gap-2 md:gap-1.5 px-3 md:px-2.5 py-1.5 md:py-1 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer group">
                        <img src="/img/coin.png" alt="STS Coin" className="h-6 w-6 md:h-5 md:w-5 object-contain group-hover:scale-110 transition-transform" />
                        <span className="text-sm md:text-sm font-black text-primary">
                          {coinValue.toLocaleString('id-ID')}
                        </span>
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
                              <div className="flex items-center gap-1.5">
                                <p
                                  className={cn("text-sm font-black leading-none", profileData?.nameColor || "text-foreground")}
                                  style={profileData?.fontFamily ? { fontFamily: profileData.fontFamily } : {}}
                                >
                                  {user.displayName || "Gamer"}
                                </p>
                                {profileData?.vip && (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <div className="shrink-0 cursor-pointer">
                                        <Image src="/img/badge/vip.png" alt="VIP" width={16} height={16} />
                                      </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2 bg-background border-border shadow-xl">
                                      <p className="text-[10px] font-black">VIP Member</p>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </div>
                              <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer font-bold gap-2 group" asChild>
                            <Link href="/dashboard" className="flex items-center w-full">
                              <LayoutDashboard className="h-4 w-4 transition-all group-hover:scale-125 animate-icon-pulse" /> Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer font-bold gap-2 group" asChild>
                            <Link href="/dashboard/settings" className="flex items-center w-full">
                              <Settings className="h-4 w-4 transition-all group-hover:scale-125 animate-icon-spin" /> Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer font-bold gap-2 text-destructive focus:text-destructive group" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 transition-all group-hover:scale-125 animate-icon-wiggle" /> Keluar
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

                  {/* Mobile Search Icon Button (to the left of Sidebar Menu) */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSearchOpen(true)}
                    className="group rounded-xl lg:hidden border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    aria-label="Cari"
                  >
                    <Search className="h-5 w-5 text-primary transition-all animate-icon-pulse" />
                  </Button>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="group rounded-xl lg:hidden border-border bg-card/50">
                        <Menu className="h-5 w-5 transition-all animate-icon-spin" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-background border-border p-0 flex flex-col w-full sm:max-w-none">
                      <SheetHeader className="sr-only">
                        <SheetTitle>Menu Navigasi</SheetTitle>
                      </SheetHeader>

                      <div className="h-16 px-6 border-b border-border bg-card/30 flex items-center justify-between shrink-0">
                        <Logo className="h-16 w-32" />
                      </div>

                      <ScrollArea className="flex-1">
                        <div className="p-4 space-y-8">
                          <div>
                            <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 mb-3 px-2">Navigasi</p>
                            <div className="space-y-1">
                              <Link href="/">
                                <Button variant="ghost" className="group w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                  <AnimatedCartIcon className="h-5 w-5" /> Topup
                                </Button>
                              </Link>
                              <Link href="/status">
                                <Button variant="ghost" className="group w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                  <AnimatedSearchTransactionIcon className="h-5 w-5" /> Cek Transaksi
                                </Button>
                              </Link>
                              <Link href="/leaderboard">
                                <Button variant="ghost" className="group w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                  <AnimatedPodiumIcon className="h-5 w-5" /> Leaderboard
                                </Button>
                              </Link>
                              <Link href="/benefit">
                                <Button variant="ghost" className="group w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                  <AnimatedBenefitIcon className="h-5 w-5" /> Benefit
                                </Button>
                              </Link>
                              <Link href="/artikel">
                                <Button variant="ghost" className="group w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                  <AnimatedArticleIcon className="h-5 w-5" /> Artikel
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
                                    <Button variant="ghost" className="group w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                      <LayoutDashboard className="h-5 w-5 transition-all animate-icon-pulse" /> Dashboard
                                    </Button>
                                  </Link>
                                  <Link href="/dashboard/settings">
                                    <Button variant="ghost" className="group w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                      <Settings className="h-5 w-5 transition-all animate-icon-spin" /> Settings
                                    </Button>
                                  </Link>
                                </>
                              )}
                              <Button variant="ghost" className="group w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                <MessageCircle className="h-5 w-5 transition-all animate-icon-bounce" /> Hubungi Dukungan
                              </Button>
                              <Button variant="ghost" className="group w-full justify-start gap-4 h-12 text-sm font-bold hover:bg-primary/10 hover:text-primary transition-all rounded-xl">
                                <HelpCircle className="h-5 w-5 transition-all animate-icon-pulse" /> Pusat Bantuan
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>

                      <div className="p-6 border-t border-border mt-auto bg-muted/10">
                        {user && (
                          <div className="mb-4 p-4 bg-card border border-border rounded-xl space-y-3 shadow-sm">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-background shrink-0">
                                <AvatarImage src={displayPhotoURL} alt={user.email || "User"} />
                                <AvatarFallback className="bg-muted text-muted-foreground font-black">
                                  {userInitial}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <p
                                    className={cn("text-sm font-black leading-none truncate", profileData?.nameColor || "text-foreground")}
                                    style={profileData?.fontFamily ? { fontFamily: profileData.fontFamily } : {}}
                                  >
                                    {user.displayName || "Gamer"}
                                  </p>
                                  {profileData?.vip && (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <div className="shrink-0 cursor-pointer">
                                          <Image src="/img/badge/vip.png" alt="VIP" width={16} height={16} />
                                        </div>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-2 bg-background border-border shadow-xl">
                                        <p className="text-[10px] font-black">VIP Member</p>
                                      </PopoverContent>
                                    </Popover>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                              </div>
                            </div>

                            <Separator className="opacity-40" />

                            <div className="flex items-center justify-between pt-0.5">
                              <div className="flex items-center gap-2">
                                <img src="/img/coin.png" alt="STS Coin" className="h-5 w-5 object-contain" />
                                <span className="text-xs font-black">STS Coin</span>
                              </div>
                              <span className="text-sm font-black text-primary">
                                {coinValue.toLocaleString('id-ID')}
                              </span>
                            </div>
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
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
      />
    </>
  );
}
