"use client";

import * as React from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const bannerIds = ["banner-1", "banner-2", "banner-3", "banner-4", "banner-5"];

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
  }, [api]);

  return (
    <section className="w-full overflow-hidden py-10 flex flex-col items-center">
      <div className="relative w-full max-w-screen-2xl">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            loop: true,
            align: "center",
            duration: 35, // Balanced smoothness
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {bannerIds.map((id, index) => {
              const image = PlaceHolderImages.find((img) => img.id === id);
              if (!image) return null;
              
              const isActive = current === index;
              
              return (
                <CarouselItem 
                  key={id} 
                  className="pl-4 basis-[85%] md:basis-[75%] lg:basis-[860px]"
                >
                  <div 
                    className={cn(
                      "relative aspect-[860/310] w-full bg-card rounded-2xl overflow-hidden border transition-all duration-500 ease-out will-change-transform",
                      isActive 
                        ? "border-primary/60 z-20 scale-100 opacity-100 shadow-2xl" 
                        : "border-white/5 z-10 scale-[0.9] opacity-40 shadow-none"
                    )}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 860px) 100vw, 860px"
                    />
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-0"
                    )} />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-2.5 mt-8">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 ease-out",
              current === index 
                ? "bg-primary w-8" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}