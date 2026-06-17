
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { SearchX, LayoutGrid, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const CATALOG_ITEMS = [
  // Flash Sale
  { 
    id: "ff", 
    name: "Free Fire", 
    type: "Game", 
    imageId: "ff", 
    tag: "Flash Sale",
    discount: "50%",
    originalPrice: "Rp 20.000",
    salePrice: "Rp 10.000"
  },
  // Populer
  { id: "mlbb", name: "Mobile Legends", type: "Game", imageId: "mlbb", tag: "Populer" },
  { id: "pubgm", name: "PUBG Mobile", type: "Game", imageId: "pubgm", tag: "Populer" },
  { id: "genshin", name: "Genshin Impact", type: "Game", imageId: "genshin", tag: "Populer" },
  // Others (TopUp)
  { id: "valorant", name: "Valorant", type: "Game", imageId: "valorant", tag: "New" },
  { id: "steam", name: "Steam Wallet", type: "Voucher", imageId: "steam", tag: "" },
  { id: "telco", name: "Phone Credit", type: "Service", imageId: "telco", tag: "" },
  { id: "data", name: "Internet Data", type: "Service", imageId: "data", tag: "" },
];

function FlashSaleTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      // Set target to end of current week for visible "Days"
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
        <div className="flex items-center justify-center px-1.5 md:px-2 py-1 rounded bg-background border border-primary/20 text-primary font-black text-[10px] md:text-xs min-w-[24px] md:min-w-[30px] shadow-[0_0_10px_rgba(242,255,0,0.1)]">
          {value}
        </div>
        <span className="text-[6px] md:text-[8px] text-muted-foreground font-black tracking-tighter mt-0.5 uppercase">{label}</span>
      </div>
      {showSeparator && <span className="text-primary font-black text-[10px] md:text-xs mb-3 animate-pulse">:</span>}
    </div>
  );

  return (
    <div className="flex items-center gap-1 md:gap-1.5 bg-card/90 p-1.5 md:p-2 rounded-xl border border-primary/30 backdrop-blur-md shadow-xl shadow-primary/5">
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

  const filteredItems = CATALOG_ITEMS.filter((item) => 
    item.name.toLowerCase().includes(query) || 
    item.type.toLowerCase().includes(query)
  );

  const flashSaleItems = filteredItems.filter(item => item.tag === "Flash Sale");
  const populerItems = filteredItems.filter(item => item.tag === "Populer");
  const topUpItems = filteredItems.filter(item => item.tag !== "Flash Sale" && item.tag !== "Populer");

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
            subtitle="Most loved and frequently used by the community."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {populerItems.map((item) => {
              const image = PlaceHolderImages.find((img) => img.id === item.imageId);
              return (
                <Link
                  key={item.id}
                  href={`/topup/${item.id}`}
                  className="group bento-card p-0 transition-all active:scale-95 flex flex-row aspect-[16/6] overflow-hidden"
                >
                  <div className="relative aspect-square h-full shrink-0 overflow-hidden border-r border-border/10">
                    <Image
                      src={image?.imageUrl || ""}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={image?.imageHint}
                    />
                  </div>
                  <div className="p-3 md:p-4 flex flex-col justify-center flex-1 min-w-0 bg-card/40">
                    <p className="text-[8px] md:text-[10px] tracking-[0.15em] text-accent font-black uppercase mb-1">
                      {item.type}
                    </p>
                    <h3 className="line-clamp-1 text-[12px] md:text-base font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Flash Sale Section */}
      {flashSaleItems.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative group">
            {/* Protruding Timer */}
            <div className="absolute -top-6 right-4 md:right-8 z-20">
              <FlashSaleTimer />
            </div>

            <div className="flex flex-col">
              {/* Folder Tab Header */}
              <div className="inline-flex items-center gap-3 bg-card border-t border-l border-r border-border px-6 py-4 rounded-t-2xl w-fit relative z-10 shadow-sm">
                <img src="/img/bolt.gif" alt="Flash Sale" className="h-6 w-6 object-contain" />
                <h2 className="font-headline text-lg md:text-xl font-black tracking-tight">Flash Sale</h2>
              </div>

              {/* Main Card Body */}
              <div className="relative overflow-hidden border border-border bg-card/40 backdrop-blur-sm rounded-2xl rounded-tl-none p-5 md:p-8">
                {/* Ambient Background Glow */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="mb-6">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wider">
                    Limited time offers with massive discounts.
                  </p>
                </div>

                <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide relative z-10">
                  {flashSaleItems.map((item) => {
                    const image = PlaceHolderImages.find((img) => img.id === item.imageId);
                    return (
                      <Link
                        key={item.id}
                        href={`/topup/${item.id}`}
                        className="group shrink-0 w-[140px] md:w-[180px] bento-card p-0 transition-all active:scale-95 flex flex-col aspect-[9/16] overflow-hidden border-primary/10 hover:border-primary/50 snap-start bg-card/40"
                      >
                        <div className="relative aspect-square w-full shrink-0 overflow-hidden">
                          <Image
                            src={image?.imageUrl || ""}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            data-ai-hint={image?.imageHint}
                          />
                          {/* Discount Badge */}
                          <div className="absolute top-0 left-0 bg-accent text-accent-foreground font-black text-[9px] md:text-[10px] px-2 py-1 rounded-br-lg shadow-lg z-10">
                            -{item.discount}
                          </div>
                          {/* Urgency Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute bottom-1 right-2">
                             <Zap className="h-3 w-3 text-primary fill-primary animate-pulse" />
                          </div>
                        </div>
                        <div className="p-2.5 flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <p className="text-[8px] md:text-[9px] tracking-[0.1em] text-accent font-black uppercase mb-0.5">
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
      )}

      {/* TopUp Section */}
      {topUpItems.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <SectionHeader 
            title="TopUp" 
            icon={LayoutGrid} 
            subtitle="Browse all available game and digital services."
          />
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {topUpItems.map((item) => {
              const image = PlaceHolderImages.find((img) => img.id === item.imageId);
              return (
                <Link
                  key={item.id}
                  href={`/topup/${item.id}`}
                  className="group bento-card p-0 transition-all active:scale-95 aspect-square relative overflow-hidden"
                >
                  <Image
                    src={image?.imageUrl || ""}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={image?.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-90" />
                  
                  {item.tag && (
                    <Badge className="absolute left-1.5 top-1.5 bg-primary/90 text-primary-foreground text-[8px] md:text-[9px] font-black tracking-tighter border-none px-1.5 py-0.5 shadow-lg">
                      {item.tag}
                    </Badge>
                  )}

                  <div className="absolute bottom-0 left-0 w-full p-2 md:p-3">
                    <p className="text-[7px] md:text-[9px] tracking-tight text-accent font-black truncate">
                      {item.type}
                    </p>
                    <h3 className="line-clamp-1 text-[10px] md:text-sm font-black text-foreground">
                      {item.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
