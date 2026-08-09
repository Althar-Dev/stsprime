"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CatalogSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      {/* Flash Sale Skeleton */}
      <div className="animate-in fade-in duration-700">
        <div className="flex flex-col">
          {/* Tab Header Bar Skeleton */}
          <div className="flex items-end justify-between relative z-10">
            <div className="inline-flex items-center gap-3 bg-card/90 border-t border-l border-r border-border px-5 md:px-7 py-3 md:py-4 rounded-t-2xl w-fit shadow-sm">
              <Skeleton className="h-6 w-6 md:h-7 md:w-7 rounded-lg" />
              <Skeleton className="h-6 w-28 md:w-36 rounded-md" />
            </div>
            <div className="mb-2 mr-2 md:mr-4">
              <Skeleton className="h-10 w-36 md:w-48 rounded-2xl" />
            </div>
          </div>

          {/* Main Container Skeleton */}
          <div className="relative overflow-hidden border border-border rounded-2xl rounded-tl-none p-3.5 sm:p-5 md:p-8 -mt-px min-h-[300px] bg-card/40">
            <Skeleton className="h-3 w-64 mb-6 rounded-md" />
            <div className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 pb-3 pt-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="shrink-0 w-[130px] sm:w-[155px] md:w-[190px] rounded-xl sm:rounded-2xl border border-border bg-card/60 overflow-hidden flex flex-col justify-between">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-3 space-y-3">
                    <Skeleton className="h-2.5 w-12" />
                    <Skeleton className="h-4 w-24" />
                    <div className="space-y-2 pt-2 border-t border-border/30">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Populer Skeleton */}
      <div className="animate-in fade-in duration-500">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 md:gap-5 p-2 md:py-2 md:px-2 bg-card/50 border border-border rounded-2xl">
              <Skeleton className="h-12 w-12 md:h-20 md:w-20 shrink-0 rounded-xl md:rounded-2xl" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-3.5 md:h-4 w-3/4" />
                <Skeleton className="h-2.5 md:h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TopUp Skeleton */}
      <div className="animate-in fade-in duration-1000">
        <div className="mb-8 flex items-center gap-2 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-xl shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {[...Array(12)].map((_, i) => (
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
