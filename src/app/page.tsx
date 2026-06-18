
"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { CatalogGrid } from "@/components/catalog-grid";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-grow">
        <HeroSection />
        <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-bold">Loading catalog...</div>}>
          <CatalogGrid />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
