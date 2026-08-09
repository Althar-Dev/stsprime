import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow container mx-auto px-3 sm:px-5 py-4 sm:py-7 max-w-6xl space-y-5 sm:space-y-6 animate-in fade-in duration-300">
        {/* HEADER SKELETON */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 rounded-full opacity-80" />
          <Skeleton className="h-8 sm:h-9 w-60 sm:w-72 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-md rounded-md opacity-60" />
        </div>

        {/* MAIN LAYOUT GRID SKELETON */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-12 items-start">
          {/* LEFT SIDE: STATS & FAVORITE GAME */}
          <div className="lg:col-span-4 space-y-3.5 sm:space-y-4">
            {/* Stats Card Skeleton */}
            <div className="bento-card p-4 sm:p-5 border-border/50 bg-card/30 rounded-xl sm:rounded-2xl space-y-3">
              <Skeleton className="h-4 w-32 rounded-md" />
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <Skeleton className="h-14 sm:h-16 rounded-xl bg-muted/40" />
                <Skeleton className="h-14 sm:h-16 rounded-xl bg-muted/40" />
              </div>
            </div>

            {/* Favorite Game Card Skeleton */}
            <div className="bento-card p-4 sm:p-5 border-border/50 bg-card/30 rounded-xl sm:rounded-2xl space-y-3">
              <Skeleton className="h-4 w-28 rounded-md" />
              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border/40 bg-muted/20">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-24 rounded" />
                  <Skeleton className="h-3 w-16 rounded opacity-60" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SEARCH & TRANSACTIONS LIST */}
          <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
            {/* Search & Filter Bar Skeleton */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              <Skeleton className="h-9 sm:h-10 flex-grow rounded-lg sm:rounded-xl" />
              <div className="flex gap-1.5 shrink-0">
                <Skeleton className="h-9 w-16 rounded-lg sm:rounded-xl" />
                <Skeleton className="h-9 w-16 rounded-lg sm:rounded-xl" />
              </div>
            </div>

            {/* Transaction Cards Skeletons */}
            <div className="space-y-2.5 sm:space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bento-card p-3.5 sm:p-4 border-border/50 bg-card/30 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                >
                  {/* Left Info Skeleton */}
                  <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                    <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shrink-0 border border-primary/10" />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-36 sm:w-48 rounded" />
                        <Skeleton className="h-4 w-12 rounded-md" />
                      </div>
                      <Skeleton className="h-3 w-40 sm:w-56 rounded opacity-60" />
                    </div>
                  </div>

                  {/* Right Price & Button Skeleton */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <div className="space-y-1 text-left sm:text-right">
                      <Skeleton className="h-2.5 w-16 rounded opacity-60" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <Skeleton className="h-8 sm:h-9 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
