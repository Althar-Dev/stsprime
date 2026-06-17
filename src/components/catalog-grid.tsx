"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { SearchX, Zap, Flame, LayoutGrid } from "lucide-react";
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

  const SectionHeader = ({ title, icon: Icon, subtitle }: { title: string, icon: any, subtitle?: string }) => (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-headline text-xl md:text-2xl font-black tracking-tight">{title}</h2>
          {subtitle && <p className="text-[10px] md:text-xs text-muted-foreground font-bold">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const ItemGrid = ({ items, aspect = "aspect-square" }: { items: typeof CATALOG_ITEMS, aspect?: string }) => (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
      {items.map((item) => {
        const image = PlaceHolderImages.find((img) => img.id === item.imageId);
        return (
          <Link
            key={item.id}
            href={`/topup/${item.id}`}
            className={cn("group bento-card p-0 transition-all active:scale-95", aspect)}
          >
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={image?.imageUrl || ""}
                alt={item.name}
                width={400}
                height={400}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={image?.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
              
              {item.tag && (
                <Badge className="absolute left-1.5 top-1.5 bg-primary/90 text-primary-foreground text-[8px] md:text-[9px] font-black tracking-tighter border-none px-1.5 py-0.5 shadow-lg">
                  {item.tag}
                </Badge>
              )}

              <div className="absolute bottom-0 left-0 w-full p-2 md:p-4">
                <p className="text-[7px] md:text-[9px] tracking-tight text-accent font-black">
                  {item.type}
                </p>
                <h3 className="line-clamp-1 text-[10px] md:text-sm font-black">
                  {item.name}
                </h3>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

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
            icon={Zap} 
            subtitle="Limited time offers with massive discounts."
          />
          <ItemGrid items={flashSaleItems} aspect="aspect-[9/16]" />
        </div>
      )}

      {/* Populer Section */}
      {populerItems.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SectionHeader 
            title="Populer" 
            icon={Flame} 
            subtitle="Most loved and frequently used by the community."
          />
          <ItemGrid items={populerItems} aspect="aspect-[16/9]" />
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
          <ItemGrid items={topUpItems} aspect="aspect-square" />
        </div>
      )}
    </section>
  );
}