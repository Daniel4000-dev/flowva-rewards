import { Lock, Gift, Banknote, CreditCard, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Reward } from "@/types";

interface RewardCardProps {
  reward: Reward;
  userBalance: number;
  onRedeem: (reward: Reward) => void;
}

export function RewardCard({ reward, userBalance, onRedeem }: RewardCardProps) {
  // Logic: Status Determination
  const isComingSoon = !reward.is_active;
  const isLocked = !isComingSoon && userBalance < reward.cost;
  const canRedeem = !isComingSoon && !isLocked;

  // Logic: Icon Mapping based on reward title/type
  const getIcon = () => {
    if (reward.type === "course") return <BookOpen className="h-6 w-6 text-purple-500" />;
    if (reward.title.includes("Transfer") || reward.title.includes("PayPal")) return <Banknote className="h-6 w-6 text-green-600" />;
    if (reward.title.includes("Visa")) return <CreditCard className="h-6 w-6 text-blue-600" />;
    return <Gift className="h-6 w-6 text-pink-500" />;
  };

  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center h-full transition-all duration-300 hover:shadow-2xl",
      canRedeem ? "hover:-translate-y-2 hover:shadow-md cursor-pointer" : "cursor-default",
      !canRedeem && "greyscale opacity-60 pointer-events-none select-none"
      )}>
      {/* 1. Icon Circle */}
      <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
        {getIcon()}
      </div>

      {/* 2. Content */}
      <h3 className="font-bold text-slate-900 mb-2 text-lg">{reward.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
        {reward.description}
      </p>

      {/* 3. Cost & Action - Pushed to bottom */}
      <div className="mt-auto w-full space-y-4">
        <div className="flex items-center justify-center gap-1 font-bold text-[#7E22CE]">
           {/* Star Icon */}
           <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
           </svg>
           <span className="text-sm">{reward.cost} pts</span>
        </div>

        <Button 
          className={cn(
            "w-full py-6 rounded-md font-bold transition-all",
            canRedeem 
                ? "bg-[#7E22CE] hover:bg-purple-800 text-white shadow-lg shadow-purple-200" 
                : "bg-sky-700 text-slate-200 hover:bg-slate-200 cursor-not-allowed shadow-none"
          )}
          disabled={!canRedeem}
          onClick={() => onRedeem(reward)}
        >
          {isComingSoon ? "Coming Soon" : isLocked ? "Locked" : "Redeem"}
        </Button>
      </div>
    </div>
  );
}

export function RewardCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center h-full">
      {/* 1. Icon Circle */}
      <Skeleton className="h-14 w-14 rounded-xl mb-4" />

      {/* 2. Content */}
      <Skeleton className="h-6 w-3/4 mb-2" /> 
      <div className="w-full space-y-1 mb-4 flex flex-col items-center">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      {/* 3. Cost & Action */}
      <div className="mt-auto w-full space-y-4 flex flex-col items-center">
         <div className="flex items-center gap-1">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-12" />
         </div>
         <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}