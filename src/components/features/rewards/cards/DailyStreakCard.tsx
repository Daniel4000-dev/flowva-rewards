"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DailyStreakCardProps {
  streak: number;
  isClaimed: boolean;
  isLoading: boolean;
  onClaim: () => void;
}

export function DailyStreakCard({ streak, isClaimed, isLoading, onClaim }: DailyStreakCardProps) {
  
  // 1. Get current day index relative to Monday (Mon=0, Tue=1 ... Sun=6)
  // JS getDay() returns 0 for Sunday, 1 for Monday. 
  // Formula: (day + 6) % 7 shifts Sunday (0) to 6, and Monday (1) to 0.
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="bg-[#F8FAFC] rounded-2xl border border-slate-100 flex flex-col shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:ease-out rounded-2xl hover:shadow-lg">
      <div className="flex p-4 items-center gap-2 text-slate-700 font-semibold mb-5 bg-slate-100">
        <div className="bg-blue-100 rounded-lg text-blue-500">
          <span className="text-xs">📅</span>
        </div>
        Daily Streak
      </div>

      <div className="flex-1 px-4">
        <h3 className="text-4xl font-bold text-[#7E22CE] mb-4">
          {streak} <span className="text-4xl text-[#7E22CE]">day</span>
        </h3>

        {/* Day Circles */}
        <div className="flex justify-between gap-1 mb-4">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
            
            const isToday = i === todayIndex; 
            
            const lastActiveIndex = isClaimed ? todayIndex : todayIndex - 1;
            const startActiveIndex = lastActiveIndex - streak + 1;
            const isPartOfStreak = i >= startActiveIndex && i <= lastActiveIndex; 

            return (
              <div
                key={i}
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isToday
                    ? cn(
                        "bg-white border-2 border-[#7E22CE] text-[#7E22CE] shadow-sm scale-110",
                        // Keep purple bg if today implies it's claimed/active
                         isPartOfStreak && "bg-purple-100"
                    )
                    : isPartOfStreak 
                        ? "bg-purple-100 text-purple-400" // Active Streak Days
                        : "bg-slate-200 text-slate-500" // Inactive / Future Days
                )}
              >
                {day}
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-slate-500 font-medium">
          Check in daily to earn +5 points
        </p>
      </div>

      <div className="p-4 mb-18">
      {isClaimed ? (
        <Button disabled className="w-full bg-slate-400 text-white font-semibold py-6 rounded-full">
          <Zap className="mr-2 h-4 w-4" /> Claimed Today
        </Button>
      ) : (
        <Button
          onClick={onClaim}
          disabled={isLoading}
          className="w-full bg-[#7E22CE] hover:bg-purple-800 text-white font-semibold py-6 rounded-full shadow-lg shadow-purple-200"
        >
          <Zap className="mr-2 h-4 w-4" fill="currentColor" /> Claim Today&apos;s Points
        </Button>
      )}
      </div>
    </div>
  );
}

export function DailyStreakCardSkeleton() {
  return (
    <div className="bg-[#F8FAFC] rounded-2xl border border-slate-100 flex flex-col shadow-sm h-full">
      <div className="flex p-4 items-center gap-2 mb-5 bg-slate-100">
        <Skeleton className="h-6 w-6 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex-1 px-4">
        <Skeleton className="h-10 w-32 mb-4" />

        {/* Day Circles */}
        <div className="flex justify-between gap-1 mb-4">
            {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-9 rounded-full" />
            ))}
        </div>
        <Skeleton className="h-3 w-full mx-auto" />
      </div>

      <div className="p-4 mb-18">
        <Skeleton className="h-14 w-full rounded-full" />
      </div>
    </div>
  )
}