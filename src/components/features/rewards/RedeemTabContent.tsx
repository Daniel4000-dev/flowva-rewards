"use client";

import { useState } from "react";
import { RewardCard } from "./RewardCard";
import { FilterPill } from "./FilterPill"; // <--- Import the new component
import type { User, Reward } from "@/types";
import { toast } from "sonner";

// Filter Types
type FilterType = "all" | "unlocked" | "locked" | "coming_soon";

interface RedeemTabContentProps {
  profile: User | null;
  rewards: Reward[];
}

export function RedeemTabContent({ profile, rewards }: RedeemTabContentProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const userPoints = profile?.points_balance || 0;

  // 1. Calculate Derived State for Filters
  const unlockedCount = rewards.filter(
    (r) => r.is_active && userPoints >= r.cost
  ).length;
  const lockedCount = rewards.filter(
    (r) => r.is_active && userPoints < r.cost
  ).length;
  const comingSoonCount = rewards.filter((r) => !r.is_active).length;
  const allCount = rewards.length;

  // 2. Filter the List
  const filteredRewards = rewards.filter((reward) => {
    if (activeFilter === "coming_soon") return !reward.is_active;
    if (activeFilter === "all") return true;

    const isLocked = userPoints < reward.cost;

    if (activeFilter === "locked") return reward.is_active && isLocked;
    if (activeFilter === "unlocked") return reward.is_active && !isLocked;

    return true;
  });

  // 3. Redeem Handler
  const handleRedeem = (reward: Reward) => {
    // Add your redeem server action call here later
    toast.success(`Redeeming ${reward.title}...`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Section Header */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-8 bg-[#7E22CE] rounded-full"></div>
          <h2 className="text-2xl font-bold text-slate-900">
            Redeem Your Points
          </h2>
        </div>

        {/* 2. Filter Tabs - Using the new Component */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100/50">
          <FilterPill
            label="All Rewards"
            count={allCount}
            isActive={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          />
          <FilterPill
            label="Unlocked"
            count={unlockedCount}
            isActive={activeFilter === "unlocked"}
            onClick={() => setActiveFilter("unlocked")}
          />
          <FilterPill
            label="Locked"
            count={lockedCount}
            isActive={activeFilter === "locked"}
            onClick={() => setActiveFilter("locked")}
          />
          <FilterPill
            label="Coming Soon"
            count={comingSoonCount}
            isActive={activeFilter === "coming_soon"}
            onClick={() => setActiveFilter("coming_soon")}
          />
        </div>
      </div>

      {/* 3. The Grid */}
      {filteredRewards.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          No rewards found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="transition-transform duration-300 hover:-translate-y-1 hover:ease-out rounded-2xl hover:shadow-md"
            >
              <RewardCard
                reward={reward}
                userBalance={userPoints}
                onRedeem={handleRedeem}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
