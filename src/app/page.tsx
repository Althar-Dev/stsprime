"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { CatalogGrid } from "@/components/catalog-grid";
import { CatalogSkeleton } from "@/components/catalog-skeleton";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-grow">
        <HeroSection />
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogGrid />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
