"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Share2, Star } from "lucide-react"; 
import { Button } from "@/components/ui/button";

// Logic
import { claimDailyStreak, checkStackStatus } from "@/actions/rewards";
import type { User, ModalType } from "@/types";

// Modals
import { StreakSuccessModal } from "./modals/StreakSuccessModal";
import { ReclaimFormModal } from "./modals/ReclaimFormModal";
import { StackEmptyModal } from "./modals/StackEmptyModal";

// Sub-Components
import { PointsBalanceCard } from "./cards/PointsBalanceCard";
import { DailyStreakCard } from "./cards/DailyStreakCard";
import { SpotlightCard } from "./cards/SpotlightCard";
import { ReferralSection } from "./ReferralSection";

export function EarnTabContent({ profile }: { profile: User | null }) {
  const [isPending, startTransition] = useTransition();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isClaimedToday, setIsClaimedToday] = useState(false);

  // --- NEW: Local State for Instant Updates ---
  // We initialize with server data, but allow local updates
  const [currentPoints, setCurrentPoints] = useState(profile?.points_balance || 0);
  const [currentStreak, setCurrentStreak] = useState(profile?.current_streak || 0);

  // --- Handlers ---
  const handleClaimStreak = () => {
    startTransition(async () => {
      const result = await claimDailyStreak();
      
      if (result.status === "success") {
        setIsClaimedToday(true);
        
        // --- UPDATE UI INSTANTLY ---
        setCurrentPoints((prev) => prev + (result.points || 5)); 
        setCurrentStreak((prev) => prev + 1);
        
        setActiveModal('STREAK_SUCCESS');
      } else {
        toast.error(result.message || "Something went wrong");
      }
    });
  };

  const handleSpotlightClick = () => {
    setActiveModal('RECLAIM_FORM');
  };

  // If you handle the Spotlight Claim inside the modal, pass a function like this to it:
  const onSpotlightClaimed = () => {
      setCurrentPoints(prev => prev + 50); // Add 50 points locally
      toast.success("Spotlight points added!");
  };

  const handleShareStack = () => {
    startTransition(async () => {
      const { hasStack } = await checkStackStatus();
      if (!hasStack) {
        setActiveModal('SHARE_STACK_EMPTY');
      } else {
        // If sharing awards points, update here too:
        // setCurrentPoints(prev => prev + 25);
        toast.success("Stack Shared!"); 
      }
    });
  };

  const copyReferral = () => {
    const link = `https://app.flowvahub.com/signup/?ref=${profile?.referral_code || 'bigb7760'}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="pt-4 space-y-8 animate-in fade-in duration-500">
      
      {/* --- MODALS --- */}
      <StreakSuccessModal 
        open={activeModal === 'STREAK_SUCCESS'} 
        onOpenChange={(open) => !open && setActiveModal(null)} 
      />
      {/* Pass onClaimSuccess if you want the form to update points too */}
      <ReclaimFormModal 
        open={activeModal === 'RECLAIM_FORM'} 
        onOpenChange={(open) => !open && setActiveModal(null)} 
      />
      <StackEmptyModal 
        open={activeModal === 'SHARE_STACK_EMPTY'} 
        onOpenChange={(open) => !open && setActiveModal(null)} 
      />

      {/* --- SECTION 1: JOURNEY --- */}
      <div>
         <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-[#7E22CE] rounded-full"></div>
            <h2 className="text-2xl font-medium text-slate-900">Your Rewards Journey</h2>
         </div>

         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* PASS DYNAMIC STATE HERE */}
            <PointsBalanceCard points={currentPoints} />
            
            <DailyStreakCard 
                streak={currentStreak}
                isClaimed={isClaimedToday}
                isLoading={isPending}
                onClaim={handleClaimStreak}
            />
            
            <SpotlightCard onClaim={handleSpotlightClick} />
         </div>
      </div>

      {/* --- SECTION 2: EARN MORE --- */}
      <div>
         <div className="bg-purple-600 w-1 h-8 rounded-full inline-block mr-2 align-middle"></div>
         <h2 className="text-2xl font-medium text-slate-900 inline-block align-middle">Earn More Points</h2>
         
         <div className="grid gap-4 md:grid-cols-3 mt-4">
            {/* Refer Card */}
            <div className="transition-transform duration-300 hover:-translate-y-1 hover:ease-out hover:border hover:border-[#7E22CE] rounded-2xl hover:shadow-lg">
            <div className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
               <div className="bg-white rounded-t-2xl p-4 flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg text-[#7E22CE]">
                     <Star size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Refer and win 10,000 points!</h3>
               </div>
               <p className="px-4 pb-2 text-sm text-slate-500 leading-relaxed">
                 Invite 3 friends by Nov 20 and earn a chance to be one of 5 winners of <span className="text-[#7E22CE] font-bold">10,000 points</span>.
                 Friends must complete onboarding to qualify.
               </p>
            </div>
            </div>

            {/* Share Stack Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex flex-col  transition-transform duration-300 hover:-translate-y-1 hover:ease-out hover:border hover:border-[#7E22CE] rounded-2xl hover:shadow-lg">
               <div className="bg-white p-4 rounded-t-2xl flex items-start justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg text-[#7E22CE]">
                         <Share2 size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Share Your Stack</h3>
                        <p className="text-[10px] text-slate-500">Earn +25 pts</p>
                      </div>
                   </div>
               </div>
               
               <div className="p-4 flex items-center justify-between mt-4">
                   <p className="text-sm text-slate-700 font-medium">Share your tool stack</p>
                   <Button 
                     onClick={handleShareStack}
                     variant="secondary" 
                     className="rounded-full bg-[#EDE9FE] text-[#7E22CE] hover:bg-purple-200 h-9 px-4 font-bold text-xs"
                   >
                      <Share2 size={14} className="mr-2"/> Share
                   </Button>
               </div>
            </div>
         </div>
      </div>

      {/* --- SECTION 3: REFERRAL --- */}
      <ReferralSection 
        referralCode={profile?.referral_code || 'bigb7760'} 
        onCopy={copyReferral} 
      />
    </div>
  );
}