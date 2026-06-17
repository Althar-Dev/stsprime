"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Zap, ShieldCheck, Clock } from "lucide-react";

export function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-banner");

  return (
    <section className="relative overflow-hidden pt-12">
      <div className="container mx-auto px-4">
        <div className="bento-card overflow-hidden border-none bg-primary/5 p-8 md:p-12 lg:p-16">
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                LIVE UPDATES: MLBB SEASON TOP-UP DISCOUNT UP TO 20%
              </div>
              <h1 className="font-headline text-4xl font-black leading-[1.1] md:text-6xl lg:text-7xl">
                The Fastest Way <br />
                <span className="text-primary">to Level Up Your Game.</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
                Secure, instant, and reliable top-ups for your favorite games and digital services. Power up in seconds.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="h-14 rounded-full bg-primary px-8 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  Explore Catalog
                </Button>
                <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-lg font-bold border-border bg-transparent hover:bg-muted">
                  How it works
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-8 pt-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium text-muted-foreground">Instant Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium text-muted-foreground">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium text-muted-foreground">24/7 Service</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative h-[450px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <Image
                  src={heroImage?.imageUrl || ""}
                  alt="STS Pedia Hero"
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage?.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-secondary/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
