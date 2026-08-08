"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { SearchX, LayoutGrid, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CATALOG_ITEMS = [
  // Flash Sale
  { 
    id: "ff-fs", 
    name: "Free Fire", 
    type: "Garena", 
    category: "Game",
    imageId: "ff", 
    tag: "Flash Sale",
    discount: "50%",
    originalPrice: "Rp 20.000",
    salePrice: "Rp 10.000"
  },
  { 
    id: "mlbb-fs", 
    name: "Mobile Legends", 
    type: "Moonton", 
    category: "Game",
    imageId: "mlbb", 
    tag: "Flash Sale",
    discount: "30%",
    originalPrice: "Rp 50.000",
    salePrice: "Rp 35.000"
  },
  { 
    id: "valorant-fs", 
    name: "Valorant Points", 
    type: "Riot Games", 
    category: "Game",
    imageId: "valorant", 
    tag: "Flash Sale",
    discount: "20%",
    originalPrice: "Rp 125.000",
    salePrice: "Rp 100.000"
  },
  { 
    id: "pubgm-fs", 
    name: "PUBG Mobile", 
    type: "Level Infinite", 
    category: "Game",
    imageId: "pubgm", 
    tag: "Flash Sale",
    discount: "40%",
    originalPrice: "Rp 80.000",
    salePrice: "Rp 48.000"
  },
  { 
    id: "genshin-fs", 
    name: "Genshin Impact", 
    type: "HoYoverse", 
    category: "Game",
    imageId: "genshin", 
    tag: "Flash Sale",
    discount: "15%",
    originalPrice: "Rp 160.000",
    salePrice: "Rp 136.000"
  },
  { 
    id: "steam-fs", 
    name: "Steam Wallet", 
    type: "Valve", 
    category: "Voucher",
    imageId: "steam", 
    tag: "Flash Sale",
    discount: "25%",
    originalPrice: "Rp 100.000",
    salePrice: "Rp 75.000"
  },
  // Populer
  { id: "mlbb-p", name: "Mobile Legends", type: "Moonton", category: "Game", imageId: "mlbb", tag: "Populer" },
  { id: "pubgm-p", name: "PUBG Mobile", type: "Level Infinite", category: "Game", imageId: "pubgm", tag: "Populer" },
  { id: "genshin-p", name: "Genshin Impact", type: "HoYoverse", category: "Game", imageId: "genshin", tag: "Populer" },
  { id: "valorant-p", name: "Valorant", type: "Riot Games", category: "Game", imageId: "valorant", tag: "Populer" },
  
  // TopUp Section (General Items)
  { id: "mlbb", name: "Mobile Legends", type: "Moonton", category: "Game", imageId: "mlbb", tag: "" },
  { id: "pubgm", name: "PUBG Mobile", type: "Level Infinite", category: "Game", imageId: "pubgm", tag: "" },
  { id: "genshin", name: "Genshin Impact", type: "HoYoverse", category: "Game", imageId: "genshin", tag: "" },
  { id: "valorant", name: "Valorant", type: "Game", category: "Game", imageId: "valorant", tag: "New" },
  { id: "ff", name: "Free Fire", type: "Garena", category: "Game", imageId: "ff", tag: "" },
  { id: "steam", name: "Steam Wallet", type: "Voucher", category: "Voucher", imageId: "steam", tag: "" },
  { id: "telco", name: "Pulsa Reguler", type: "Service", category: "Pulsa", imageId: "telco", tag: "" },
  { id: "data", name: "Paket Data", type: "Service", category: "Pulsa", imageId: "data", tag: "" },
  { id: "dana", name: "DANA", type: "E-Wallet", category: "E-Wallet", imageId: "telco", tag: "" },
  { id: "ovo", name: "OVO", type: "E-Wallet", category: "E-Wallet", imageId: "telco", tag: "" },
  { id: "gopay", name: "GoPay", type: "E-Wallet", category: "E-Wallet", imageId: "telco", tag: "" },
  { id: "pln", name: "Token Listrik", type: "PLN", category: "Listrik", imageId: "data", tag: "" },
];

const CATEGORIES = ["Semua", "Game", "Voucher", "E-Wallet", "Listrik", "Pulsa"];

function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setDate(now.getDate() + (7 - now.getDay()));
      target.setHours(23, 59, 59, 999);
      
      const diff = target.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  const TimeUnit = ({ label, value, showSeparator = true }: { label: string, value: string, showSeparator?: boolean }) => (
    <div className="flex items-center gap-1 md:gap-1.5">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center px-1.5 md:px-2 py-1 rounded bg-background border border-primary/20 text-primary font-black text-[10px] md:text-xs min-w-[24px] md:min-w-[30px]">
          {value}
        </div>
        <span className="text-[6px] md:text-[8px] text-muted-foreground font-black tracking-tighter mt-0.5">{label}</span>
      </div>
      {showSeparator && <span className="text-primary font-black text-[10px] md:text-xs mb-3">:</span>}
    </div>
  );

  return (
    <div className="flex items-center gap-1 md:gap-1.5 bg-card/90 p-1.5 md:p-2 rounded-xl border border-primary/30 backdrop-blur-md">
      <TimeUnit label="Day" value={format(timeLeft.days)} />
      <TimeUnit label="Hrs" value={format(timeLeft.hours)} />
      <TimeUnit label="Min" value={format(timeLeft.minutes)} />
      <TimeUnit label="Sec" value={format(timeLeft.seconds)} showSeparator={false} />
    </div>
  );
}

export function CatalogGrid() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [activeTab, setActiveTab] = useState("Semua");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredItems = CATALOG_ITEMS.filter((item) => 
    item.name.toLowerCase().includes(query) || 
    item.type.toLowerCase().includes(query)
  );

  const flashSaleItems = filteredItems.filter(item => item.tag === "Flash Sale");
  const populerItems = filteredItems.filter(item => item.tag === "Populer");
  const topUpItems = filteredItems.filter(item => 
    item.tag !== "Flash Sale" && 
    item.tag !== "Populer" &&
    (activeTab === "Semua" || item.category === activeTab)
  );

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    subtitle, 
    rightElement 
  }: { 
    title: string, 
    icon: any, 
    subtitle?: string,
    rightElement?: React.ReactNode
  }) => {
    const isImagePath = typeof Icon === 'string';
    return (
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isImagePath ? (
            <div className="flex h-10 w-10 items-center justify-center">
              <img src={Icon} alt={title} className="h-10 w-10 object-contain" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <h2 className="font-headline text-xl md:text-2xl font-black tracking-tight">{title}</h2>
            {subtitle && <p className="text-[10px] md:text-xs text-muted-foreground font-bold">{subtitle}</p>}
          </div>
        </div>
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>
    );
  };

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-24 w-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-black mb-2 tracking-tight">No results for "{query}"</h3>
        <p className="text-sm text-muted-foreground max-w-xs font-bold">
          Try searching for a different game title or service type.
        </p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8 space-y-12 md:space-y-20">
      {/* Populer Section */}
      {populerItems.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SectionHeader 
            title="Populer" 
            icon="/img/fire.gif" 
            subtitle="Paling banyak dicari dan dimainkan oleh komunitas."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {populerItems.map((item) => {
              const image = PlaceHolderImages.find((img) => img.id === item.imageId);
              return (
                <Link
                  key={item.id}
                  href={`/topup/${item.imageId}`}
                  className="group relative flex items-center gap-3 md:gap-5 p-3 md:p-4 bg-card bg-dots-pattern border border-border rounded-2xl transition-all hover:scale-[1.02] hover:bg-muted/50 hover:border-primary/30 active:scale-95 shadow-xl"
                >
                  <div className="relative h-12 w-12 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-xl md:rounded-2xl z-10">
                    <Image
                      src={image?.imageUrl || ""}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={image?.imageHint}
                    />
                  </div>
                  <div className="flex flex-col justify-center z-10 min-w-0">
                    <h3 className="text-xs md:text-base lg:text-lg font-black tracking-tight text-card-foreground leading-tight mb-0.5 md:mb-1 group-hover:text-primary transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-[8px] md:text-sm font-bold text-muted-foreground opacity-80 tracking-wide truncate">
                      {item.type}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Flash Sale Section */}
      {flashSaleItems.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative">
            <div className="flex flex-col">
              <div className="flex items-end justify-between relative z-10">
                <div className="inline-flex items-center gap-3 bg-card border-t border-l border-r border-border px-4 md:px-6 py-3 md:py-4 rounded-t-2xl w-fit shadow-sm">
                  <img src="/img/bolt.gif" alt="Flash Sale" className="h-6 w-6 object-contain" />
                  <h2 className="font-headline text-lg md:text-xl font-black tracking-tight">Flash Sale</h2>
                </div>
                <div className="mb-2 mr-2 md:mr-4">
                  <FlashSaleTimer />
                </div>
              </div>

              <div className="relative overflow-hidden border border-border rounded-2xl rounded-tl-none p-5 md:p-8 -mt-px min-h-[300px]">
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/img/fsale.webp" 
                    alt="Flash Sale Background" 
                    fill 
                    className="object-cover opacity-70" 
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-[10px] md:text-xs text-white font-black tracking-wider drop-shadow-md">
                      Limited time offers with massive discounts.
                    </p>
                  </div>

                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x flash-sale-scrollbar">
                    {flashSaleItems.map((item) => {
                      const image = PlaceHolderImages.find((img) => img.id === item.imageId);
                      return (
                        <Link
                          key={item.id}
                          href={`/topup/${item.imageId}`}
                          className="group shrink-0 w-[140px] md:w-[180px] bento-card p-0 transition-all hover:scale-105 hover:z-20 active:scale-95 flex flex-col aspect-[9/16] overflow-hidden border-primary/10 hover:border-primary/50 snap-start bg-card/40 backdrop-blur-md"
                        >
                          <div className="relative aspect-square w-full shrink-0 overflow-hidden">
                            <Image
                              src={image?.imageUrl || ""}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              data-ai-hint={image?.imageHint}
                            />
                            <div className="absolute top-0 left-0 bg-accent text-accent-foreground font-black text-[9px] md:text-[10px] px-2 py-1 rounded-br-lg shadow-lg z-10">
                              -{item.discount}
                            </div>
                            <div className="absolute bottom-1 right-2">
                               <Zap className="h-3 w-3 text-primary fill-primary animate-pulse" />
                            </div>
                          </div>
                          <div className="p-2.5 flex flex-col justify-between flex-1 min-w-0">
                            <div>
                              <p className="text-[8px] md:text-[9px] tracking-[0.1em] text-accent font-black mb-0.5">
                                {item.type}
                              </p>
                              <h3 className="line-clamp-1 text-[11px] md:text-sm font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                            </div>
                            <div className="mt-2">
                              <p className="text-[10px] md:text-[12px] font-black text-primary leading-none">
                                {item.salePrice}
                              </p>
                              <p className="text-[8px] md:text-[9px] text-muted-foreground line-through font-bold mt-0.5 opacity-60">
                                {item.originalPrice}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TopUp Section */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <SectionHeader 
          title="TopUp" 
          icon={LayoutGrid} 
          subtitle="Browse all available game and digital services."
        />
        
        {/* Category Filter Tabs with Navigation Arrows */}
        <div className="mb-8 relative flex items-center gap-2">
          {/* Scroll Left Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="shrink-0 h-10 w-10 rounded-full border border-border bg-background shadow-sm z-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Transparent Container with Scrollable List */}
          <div 
            ref={scrollContainerRef}
            className="flex-grow overflow-x-auto scrollbar-none flex items-center gap-2 py-1 px-1 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={cn(
                    "whitespace-nowrap px-6 py-2.5 text-xs font-black rounded-xl transition-all duration-200 border border-transparent",
                    activeTab === cat 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scroll Right Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="shrink-0 h-10 w-10 rounded-full border border-border bg-background shadow-sm z-10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {topUpItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {topUpItems.map((item) => {
              const image = PlaceHolderImages.find((img) => img.id === item.imageId);
              return (
                <Link
                  key={item.id}
                  href={`/topup/${item.imageId}`}
                  className="group bento-card !rounded-sm p-0 transition-all active:scale-95 flex flex-col overflow-hidden hover:scale-[1.03] hover:shadow-lg hover:rotate-2 h-full"
                >
                  <div className="relative aspect-square w-full overflow-hidden shrink-0">
                    <Image
                      src={image?.imageUrl || ""}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={image?.imageHint}
                    />
                    {item.tag && (
                      <Badge className="absolute left-1.5 top-1.5 bg-primary text-primary-foreground text-[8px] md:text-[9px] font-black tracking-tighter border-none px-1.5 py-0.5 shadow-lg">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                  <div className="p-2 md:p-3 flex flex-col justify-center flex-1 bg-card/30">
                    <p className="text-[7px] md:text-[10px] tracking-tight text-accent font-black truncate mb-0.5">
                      {item.type}
                    </p>
                    <h3 className="line-clamp-1 text-[10px] md:text-base font-black text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchX className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
            <p className="text-sm text-muted-foreground font-bold">No items found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
