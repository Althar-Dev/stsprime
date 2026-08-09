import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";

export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg opacity-60" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl opacity-60" />
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-12">
        {/* User Card Skeleton */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="bento-card p-6 flex flex-col items-center text-center h-full bg-card/30 backdrop-blur-sm space-y-4">
            <Skeleton className="h-24 w-24 rounded-full border-2 border-primary/20" />
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-md opacity-60" />
            <Skeleton className="h-6 w-28 rounded-full opacity-80" />
          </div>
        </div>

        {/* Coin Balance Card Skeleton */}
        <div className="md:col-span-7 lg:col-span-8">
          <div className="bento-card p-6 flex flex-col justify-between h-full bg-card/30 backdrop-blur-sm space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded-md opacity-60" />
                <Skeleton className="h-7 w-44 rounded-xl" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full border border-primary/20" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-10 w-36 rounded-xl" />
              <div className="pt-4 border-t border-border/40 flex justify-between items-center">
                <Skeleton className="h-4 w-64 rounded-md opacity-60" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table Skeleton */}
        <div className="md:col-span-12">
          <div className="bento-card p-6 bg-card/30 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-xl opacity-60" />
            </div>
            <div className="space-y-3 pt-2">
              <Skeleton className="h-12 w-full rounded-xl opacity-40" />
              <Skeleton className="h-12 w-full rounded-xl opacity-30" />
              <Skeleton className="h-12 w-full rounded-xl opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
