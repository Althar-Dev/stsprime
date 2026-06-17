"use client";

import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

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
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-headline text-3xl font-bold md:text-4xl">Available Services</h2>
          <p className="mt-2 text-muted-foreground">Select your favorite game or service to start top-up.</p>
        </div>
        <Link href="/catalog" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {CATALOG_ITEMS.map((item) => {
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
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                
                {item.tag && (
                  <Badge className="absolute left-2 top-2 bg-primary/90 text-[10px] font-bold">
                    {item.tag}
                  </Badge>
                )}

                <div className="absolute bottom-0 left-0 w-full p-4">
                  <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
                    {item.type}
                  </p>
                  <h3 className="line-clamp-1 text-sm font-bold md:text-base">
                    {item.name}
                  </h3>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                  <span className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg">
                    TOP UP NOW
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
