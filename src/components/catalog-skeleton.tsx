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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[70px] md:h-[90px] rounded-2xl border border-border bg-card/50 flex items-center p-3 md:p-4 gap-3 md:gap-5">
              <Skeleton className="h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-3 md:h-4 w-2/3" />
                <Skeleton className="h-2 md:h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale Skeleton */}
      <div className="animate-in fade-in duration-700">
        <div className="flex items-end justify-between mb-2">
          <Skeleton className="h-12 w-32 md:w-40 rounded-t-2xl" />
          <Skeleton className="h-10 w-40 md:w-48 rounded-xl mb-2" />
        </div>
        <div className="border border-border rounded-2xl rounded-tl-none p-5 md:p-8 h-[300px] flex gap-4 overflow-hidden bg-card/30">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shrink-0 w-[140px] md:w-[180px] h-full rounded-2xl border border-border bg-card/50 flex flex-col overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-3 flex-1 flex flex-col">
                <div className="space-y-2">
                  <Skeleton className="h-2 w-12" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="mt-auto space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-2 w-10" />
                </div>
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
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {[...Array(16)].map((_, i) => (
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