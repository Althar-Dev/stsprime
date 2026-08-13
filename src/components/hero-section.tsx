
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const db = useFirestore();

  // Ambil seluruh koleksi banner untuk menghindari masalah indeks komposit di client
  const bannersRef = React.useMemo(() => {
    if (!db) return null;
    return collection(db, "banners");
  }, [db]);

  const { data: rawBanners, loading } = useCollection<any>(bannersRef);

  // Lakukan pemfilteran dan pengurutan di sisi klien
  const banners = React.useMemo(() => {
    return rawBanners
      .filter((banner) => banner.status === "Active")
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [rawBanners]);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, banners]);

  // Tampilan Loading
  if (loading) {
    return (
      <section className="w-full overflow-hidden py-6 md:py-10 flex flex-col items-center">
        <div className="container max-w-screen-2xl px-4">
          <Skeleton className="aspect-[860/310] w-full max-w-[860px] mx-auto rounded-xl md:rounded-2xl" />
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-1.5 w-6 rounded-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Jika tidak ada banner, jangan tampilkan apa-apa
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden py-6 md:py-10 flex flex-col items-center">
      <div className="relative w-full max-w-screen-2xl">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            loop: true,
            align: "center",
            duration: 40,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {banners.map((banner, index) => {
              const isActive = current === index;
              
              return (
                <CarouselItem 
                  key={banner.id} 
                  className="pl-2 md:pl-4 basis-full md:basis-[85%] lg:basis-[860px]"
                >
                  <Link href={banner.link || "#"} className="block">
                    <div 
                      className={cn(
                        "relative aspect-[860/310] w-full bg-card rounded-xl md:rounded-2xl overflow-hidden border transition-all duration-500 ease-out will-change-transform",
                        isActive 
                          ? "border-primary/60 z-20 scale-100 opacity-100" 
                          : "border-white/5 z-10 scale-100 md:scale-[0.92] opacity-100 md:opacity-50"
                      )}
                    >
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title || "Hero Banner"}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        unoptimized={banner.imageUrl.includes('cdn.stspoint.id') || banner.imageUrl.includes('r2.dev')}
                        sizes="(max-width: 860px) 100vw, 860px"
                      />
                      
                      <div className={cn(
                        "absolute inset-0 bg-black/40 transition-opacity duration-500 hidden md:block pointer-events-none",
                        isActive ? "opacity-0" : "opacity-100"
                      )} />
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-2 mt-6 md:mt-8">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1 md:h-1.5 rounded-full transition-all duration-300 ease-out",
              current === index 
                ? "bg-primary w-6 md:w-8" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1 md:w-1.5"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
