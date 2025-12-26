"use client";

import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress"; // Ensure you have this shadcn component or use the div logic from before
import { Skeleton } from "@/components/ui/skeleton";

interface PointsBalanceCardProps {
  points: number;
}

export function PointsBalanceCard({ points }: PointsBalanceCardProps) {
  const progress = (points / 5000) * 100;

  return (
    <div className="bg-[#F8FAFC] rounded-2xl border border-slate-100 flex flex-col shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:ease-out hover:shadow-lg">
      <div className="flex p-4 items-center gap-2 text-slate-700 font-semibold mb-2 bg-slate-100">
        <div className="p-1.5 bg-purple-100 rounded-lg text-[#7E22CE]">
          <Star size={14} fill="currentColor" />
        </div>
        Points Balance
      </div>

      <div className="flex p-4 items-center justify-between mb-6 mr-4">
        <span className="text-4xl font-bold text-[#7E22CE]">{points}</span>
        <div className="h-10 w-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-300">
          <Star className="text-white fill-white" size={24} />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          <span>Progress to $5 Gift Card</span>
          <span>{points}/5000</span>
        </div>
        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-400/50 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">
          🚀 Just getting started — keep earning points!
        </p>
      </div>
    </div>
  );
}

export function PointsBalanceCardSkeleton() {
  return (
    <div className="bg-[#F8FAFC] rounded-2xl border border-slate-100 flex flex-col shadow-sm h-full">
      <div className="flex p-4 items-center gap-2 mb-2 bg-slate-100">
         <Skeleton className="h-6 w-6 rounded-lg" />
         <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex p-4 items-center justify-between mb-6 mr-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}