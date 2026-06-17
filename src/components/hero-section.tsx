
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function HeroSection() {
  const bannerIds = ["banner-1", "banner-2", "banner-3", "banner-4", "banner-5"];

  return (
    <section className="container mx-auto px-4 py-8 flex justify-center">
      <div className="relative group w-full max-w-[860px]">
        <Carousel
          opts={{
            loop: true,
          }}
          className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        >
          <CarouselContent>
            {bannerIds.map((id, index) => {
              const image = PlaceHolderImages.find((img) => img.id === id);
              if (!image) return null;
              
              return (
                <CarouselItem key={id}>
                  {/* Aspect ratio based on exactly 860x310px */}
                  <div className="relative aspect-[860/310] w-full bg-card">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 860px) 100vw, 860px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
