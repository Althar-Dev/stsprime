"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none" />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <Skeleton className="h-6 w-40 mx-auto mb-4 rounded-full" />
          <Skeleton className="h-12 md:h-20 w-64 md:w-[500px] mx-auto mb-4" />
          <Skeleton className="h-4 w-48 md:w-96 mx-auto opacity-50" />
        </div>

        {/* Podium Skeleton */}
        <div className="flex items-end justify-center gap-1 md:gap-6 mb-20 md:mb-32 px-1 max-w-4xl mx-auto">
          {/* Rank 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="mb-4 flex flex-col items-center space-y-2">
              <Skeleton className="h-20 w-20 md:h-32 md:w-32 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="w-full h-16 md:h-40 rounded-t-xl" />
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center flex-1 relative -top-3 md:-top-4">
            <Skeleton className="h-8 w-8 mb-2 rounded-full" />
            <div className="mb-4 flex flex-col items-center space-y-2">
              <Skeleton className="h-24 w-24 md:h-40 md:w-40 rounded-full" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="w-full h-24 md:h-56 rounded-t-xl" />
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="mb-4 flex flex-col items-center space-y-2">
              <Skeleton className="h-16 w-16 md:h-28 md:w-28 rounded-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="w-full h-12 md:h-28 rounded-t-xl" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border/40 overflow-hidden">
              <div className="p-4 md:p-6 bg-muted/20 border-b border-border/40 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-6" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
