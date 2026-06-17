
"use client";

import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { CatalogGrid } from "@/components/catalog-grid";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <CatalogGrid />
        
        {/* Features Bento Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bento-card p-8 md:col-span-2">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold mb-4">Real-time Order Status</h3>
                <p className="text-muted-foreground mb-6">Track every second of your transaction with our dynamic dashboard. No more guessing when your credit will arrive.</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full border-4 border-secondary border-t-transparent animate-spin"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Processing Transaction...</p>
                    <p className="text-xs text-muted-foreground">Order ID: #STS-9821-X</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl"></div>
            </div>
            
            <div className="bento-card p-8 bg-primary/10 border-primary/20">
              <h3 className="text-2xl font-bold mb-4">Personal Ledger</h3>
              <p className="text-muted-foreground text-sm mb-6">Keep track of your spending habits and quickly re-order your favorite packs with a single tap.</p>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-background/50 rounded-xl border border-border flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div className="h-8 w-8 rounded bg-muted"></div>
                      <div className="text-xs">
                        <p className="font-bold">MLBB 86 Diamonds</p>
                        <p className="text-muted-foreground">24 Oct, 2023</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary">Repeat</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
