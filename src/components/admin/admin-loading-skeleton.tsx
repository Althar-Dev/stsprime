import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Cpu } from "lucide-react";

export default function AdminLoadingSkeleton() {
  return (
    <div className="container mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-300 w-full max-w-full min-w-0">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="space-y-2 min-w-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse" />
            </div>
            <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 rounded-xl" />
          </div>
          <Skeleton className="h-3.5 sm:h-4 w-64 sm:w-80 rounded-lg" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="h-9 sm:h-10 flex-1 sm:w-32 rounded-xl" />
          <Skeleton className="h-9 sm:h-10 flex-1 sm:w-36 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
            <CardContent className="p-3.5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl" />
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-6 sm:h-8 w-28 sm:w-36 rounded-lg" />
                <Skeleton className="h-2.5 w-16 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content & Sidebar Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {/* Main Table/Chart Bento Card Skeleton */}
        <Card className="lg:col-span-2 bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0 overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
            <div className="flex justify-between items-center">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-44 rounded-lg" />
                <Skeleton className="h-3 w-64 rounded" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-4 pb-2 border-b border-border/20">
                <Skeleton className="h-4 w-1/4 rounded" />
                <Skeleton className="h-4 w-1/4 rounded" />
                <Skeleton className="h-4 w-1/4 rounded" />
                <Skeleton className="h-4 w-1/4 rounded" />
              </div>
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-border/10 last:border-0">
                  <div className="flex items-center gap-3 w-1/3">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="space-y-1 w-full">
                      <Skeleton className="h-3.5 w-3/4 rounded" />
                      <Skeleton className="h-2.5 w-1/2 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-1/5 rounded" />
                  <Skeleton className="h-4 w-1/6 rounded" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Bento Card Skeleton */}
        <Card className="bento-card border-border/50 bg-card/30 backdrop-blur-sm min-w-0">
          <CardHeader className="p-4 sm:p-6 border-b border-border/30 bg-muted/10">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-background/50 border border-border/30 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-5 w-14 rounded-md" />
                </div>
                <Skeleton className="h-3 w-36 rounded" />
                <Skeleton className="h-2.5 w-20 rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
