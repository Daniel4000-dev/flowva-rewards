import { Skeleton } from "@/components/ui/skeleton";
import { PointsBalanceCardSkeleton } from "@/components/features/rewards/cards/PointsBalanceCard";
import { DailyStreakCardSkeleton } from "@/components/features/rewards/cards/DailyStreakCard";
import { SpotlightCardSkeleton } from "@/components/features/rewards/cards/SpotlightCard";
import { LoadingSequencer } from "@/components/features/rewards/LoadingSequencer";

export default function RewardsLoading() {
  return (
    <div className="flex h-full">
      <main className="flex-1 w-full">
        <LoadingSequencer>
        <div className="max-w-7xl mx-auto">
          {/* Tabs Skeleton */}
          <div className="w-full mb-6">
             <div className="flex gap-2 border-b border-slate-100">
                <div className="px-4 py-3">
                   <Skeleton className="h-6 w-24" />
                </div>
                <div className="px-4 py-3">
                   <Skeleton className="h-6 w-32" />
                </div>
             </div>
          </div>

          {/* Content Skeleton (Simulating Earn Tab) */}
          <div className="space-y-8">
             
             {/* Section 1: Journey */}
             <div>
                <div className="flex items-center gap-2 mb-4">
                   <Skeleton className="w-1 h-8 rounded-full" />
                   <Skeleton className="h-8 w-64 rounded-md" />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                   <PointsBalanceCardSkeleton />
                   <DailyStreakCardSkeleton />
                   <SpotlightCardSkeleton />
                </div>
             </div>

             {/* Section 2: Earn More */}
             <div>
                <div className="flex items-center gap-2 mb-4">
                   <Skeleton className="w-1 h-8 rounded-full" />
                   <Skeleton className="h-8 w-48 rounded-md" />
                </div>
                
                <div className="grid gap-4 md:grid-cols-3 mt-4">
                   {/* Simulating the smaller cards in Earn More section */}
                   <Skeleton className="h-48 w-full rounded-2xl" />
                   <Skeleton className="h-48 w-full rounded-2xl" />
                   <Skeleton className="h-48 w-full rounded-2xl" />
                </div>
             </div>

             {/* Section 3: Referral Banner Skeleton */}
             <Skeleton className="h-32 w-full rounded-2xl" />

          </div>
        </div>
        </LoadingSequencer>
      </main>
    </div>
  );
}
