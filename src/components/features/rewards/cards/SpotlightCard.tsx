"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SpotlightCardProps {
  onClaim: () => void;
}

export function SpotlightCard({ onClaim }: SpotlightCardProps) {
  return (
    <div className="transition-transform duration-300 hover:-translate-y-1 hover:ease-out rounded-2xl hover:shadow-lg">
    <div className="border border-slate-100 rounded-2xl text-white flex flex-col justify-between relative overflow-hidden">
      <div className="p-4 bg-gradient-to-br from-[#7E22CE] via-[#8922ce] to-[#3B82F6]">
      {/* Background decoration */}
      <div className="absolute top-4 right-4">
        <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-2 w-2 bg-orange-400 rounded-full" />
            <div className="h-2 w-2 bg-blue-900 rounded-full" />
            <div className="h-2 w-2 bg-pink-400 rounded-full" />
          </div>
        </div>
      </div>

      <div className="">
        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block mb-3">
          Featured
        </div>
        <h3 className="text-xl font-bold mb-1">Top Tool Spotlight</h3>
        <h4 className="text-lg font-bold mb-4">Reclaim</h4>
      </div>
      </div>

      <div className="flex gap-2 p-4 text-slate-800 mb-4">
          <div className="flex items-start gap-2 font-bold text-sm">
            <span className="text-purple-600">📅</span>
          </div>
          <div>
          <p className="font-semibold -mt-1">Automate and Optimize Your Schedule</p>
          <p className="text-md text-slate-500 leading-relaxed">
            Reclaim.ai is an AI-powered calendar assistant that automatically schedules your tasks,
            meeting, and breaks to boost productivity. Free to try - earn Flowva Points when you sign up!
          </p>
          </div>
      </div>

      <div className="border border-t flex px-4 py-1 gap-3 relative z-10">
        <Button
          variant="secondary"
          className="rounded-full flex-1 bg-[#4F46E5] text-white border-none hover:bg-[#4338ca] h-9 text-xs font-bold"
        >
          <span className="mr-1">+</span> Sign up
        </Button>
        <Button
          onClick={onClaim}
          className="rounded-full bg-gradient-to-br from-[#7E22CE] to-[#D946EF] hover:bg-[#c026d3] text-white border-none h-9 text-xs font-bold"
        >
          <span className="mr-1">🎁</span> Claim 50 pts
        </Button>
      </div>
    </div>
    </div>
  );
}

export function SpotlightCardSkeleton() {
  return (
    <div className="border border-slate-100 rounded-2xl flex flex-col justify-between relative overflow-hidden bg-white h-full">
      <div className="p-4 bg-slate-100/50">
        <div className="absolute top-4 right-4">
             <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        <div className="">
            <Skeleton className="h-5 w-20 rounded-full mb-3" />
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-6 w-24 mb-4" />
        </div>
      </div>

      <div className="flex gap-2 p-4 mb-4">
          <Skeleton className="h-5 w-5 rounded-md" />
          <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
          </div>
      </div>

      <div className="border-t flex px-4 py-1 gap-3 p-3">
          <Skeleton className="h-9 flex-1 rounded-full" />
          <Skeleton className="h-9 flex-1 rounded-full" />
      </div>
    </div>
  )
}