"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { SearchX, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const CATALOG_ITEMS = [
  // Flash Sale
  { id: "ff", name: "Free Fire", type: "Game", imageId: "ff", tag: "Flash Sale" },
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
      // Target: End of the week for demonstration of days
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

  return (
    <div className="flex items-center gap-1.5 ml-auto md:ml-0">
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary text-primary-foreground font-black text-[10px] md:text-xs shadow-[0_0_10px_rgba(242,255,0,0.3)]">
        <span>{format(timeLeft.days)}</span>
        <span className="animate-pulse">:</span>
        <span>{format(timeLeft.hours)}</span>
        <span className="animate-pulse">:</span>
        <span>{format(timeLeft.minutes)}</span>
        <span className="animate-pulse">:</span>
        <span>{format(timeLeft.seconds)}</span>
      </div>
      <span className="hidden sm:inline text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Ends in</span>
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
      <div className="mb-6 flex items-center justify-between">
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
        {rightElement && <div>{rightElement}</div>}
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
    <section className="container mx-auto px-4 py-8 space-y-12 md:space-y-16">
      {/* Flash Sale Section */}
      {flashSaleItems.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionHeader 
            title="Flash Sale" 
            icon="/img/bolt.gif" 
            subtitle="Limited time offers with massive discounts."
            rightElement={<FlashSaleTimer />}
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {flashSaleItems.map((item) => {
              const image = PlaceHolderImages.find((img) => img.id === item.imageId);
              return (
                <Link
                  key={item.id}
                  href={`/topup/${item.id}`}
                  className="group bento-card p-0 transition-all active:scale-95 flex flex-col aspect-[9/16] overflow-hidden"
                >
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden">
                    <Image
                      src={image?.imageUrl || ""}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={image?.imageHint}
                    />
                  </div>
                  <div className="p-2.5 flex flex-col justify-center flex-1 min-w-0 bg-card/40">
                    <p className="text-[8px] md:text-[9px] tracking-[0.1em] text-accent font-black uppercase mb-0.5">
                      {item.type}
                    </p>
                    <h3 className="line-clamp-2 text-[11px] md:text-sm font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Populer Section */}
      {populerItems.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SectionHeader 
            title="Populer" 
            icon="/img/fire.gif" 
            subtitle="Most loved and frequently used by the community."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                    <h3 className="line-clamp-2 text-[12px] md:text-base font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
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
