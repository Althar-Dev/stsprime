
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function HeroSection() {
  const bannerIds = ["banner-1", "banner-2", "banner-3", "banner-4", "banner-5"];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="relative group">
        <Carousel
          opts={{
            loop: true,
          }}
          className="w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl"
        >
          <CarouselContent>
            {bannerIds.map((id, index) => {
              const image = PlaceHolderImages.find((img) => img.id === id);
              if (!image) return null;
              
              return (
                <CarouselItem key={id}>
                  <div className="relative aspect-[16/9] w-full bg-card">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/40 backdrop-blur-xl border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-black hover:border-primary z-20" />
          <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/40 backdrop-blur-xl border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-black hover:border-primary z-20" />
        </Carousel>
      </div>
    </section>
  );
}
