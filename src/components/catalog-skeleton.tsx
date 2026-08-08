"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CatalogSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12 md:space-y-20">
      {/* Populer Skeleton */}
      <div className="animate-in fade-in duration-500">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[70px] md:h-[90px] rounded-2xl border border-border bg-card/50 flex items-center p-3 md:py-3 md:px-5 gap-3 md:gap-5">
              <Skeleton className="h-12 w-12 md:h-20 md:w-20 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-3 md:h-4 w-2/3" />
                <Skeleton className="h-2 md:h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TopUp Skeleton */}
      <div className="animate-in fade-in duration-1000">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="flex flex-col rounded-sm border border-border bg-card/50 overflow-hidden h-full">
              <Skeleton className="aspect-square w-full" />
              <div className="p-2 md:p-3 space-y-2">
                <Skeleton className="h-1.5 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
