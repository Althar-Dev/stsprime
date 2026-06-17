
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
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="w-full overflow-hidden py-8 flex flex-col items-center">
      <div className="relative group w-full max-w-screen-2xl px-4 md:px-0">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            loop: true,
            align: "center",
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
                  className="pl-4 basis-full md:basis-[70%] lg:basis-[860px] transition-all duration-500 ease-in-out"
                  style={{
                    opacity: isActive ? 1 : 0.4,
                    transform: isActive ? "scale(1)" : "scale(0.9)",
                    zIndex: isActive ? 20 : 10,
                  }}
                >
                  <div className="relative aspect-[860/310] w-full bg-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
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

      {/* Pagination Dots */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              current === index 
                ? "bg-primary w-6 shadow-[0_0_8px_rgba(242,255,0,0.5)]" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
