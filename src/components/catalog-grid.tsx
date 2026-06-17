"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, SearchX } from "lucide-react";

const CATALOG_ITEMS = [
  { id: "mlbb", name: "Mobile Legends", type: "Game", imageId: "mlbb", tag: "Popular" },
  { id: "ff", name: "Free Fire", type: "Game", imageId: "ff", tag: "Flash Sale" },
  { id: "pubgm", name: "PUBG Mobile", type: "Game", imageId: "pubgm", tag: "Hot" },
  { id: "valorant", name: "Valorant", type: "Game", imageId: "valorant", tag: "New" },
  { id: "genshin", name: "Genshin Impact", type: "Game", imageId: "genshin", tag: "Hot" },
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

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 md:mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-headline text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">
            {query ? `Search results for "${query}"` : "Available Services"}
          </h2>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            {query ? `Found ${filteredItems.length} items matching your search.` : "Select your favorite game or service to start top-up."}
          </p>
        </div>
        {!query && (
          <Link href="/" className="flex items-center gap-1 text-xs md:text-sm font-bold text-primary hover:underline">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {filteredItems.map((item) => {
            const image = PlaceHolderImages.find((img) => img.id === item.imageId);
            return (
              <Link
                key={item.id}
                href={`/topup/${item.id}`}
                className="group bento-card aspect-square p-0"
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
                    <Badge className="absolute left-1.5 top-1.5 bg-primary/90 text-primary-foreground text-[8px] md:text-[10px] font-black tracking-tighter border-none px-1.5 py-0">
                      {item.tag}
                    </Badge>
                  )}

                  <div className="absolute bottom-0 left-0 w-full p-2 md:p-4">
                    <p className="text-[8px] md:text-[10px] tracking-tight text-accent font-black">
                      {item.type}
                    </p>
                    <h3 className="line-clamp-1 text-[10px] md:text-sm lg:text-base font-black">
                      {item.name}
                    </h3>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100 hidden sm:flex">
                    <span className="rounded-full bg-primary px-4 py-2 text-xs font-black text-primary-foreground shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Top Up Now
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
          <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-black mb-2">No matches found</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            We couldn&apos;t find any service matching &quot;{query}&quot;. Try using different keywords.
          </p>
        </div>
      )}
    </section>
  );
}
