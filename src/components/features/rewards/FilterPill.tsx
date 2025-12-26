"use client";

import { cn } from "@/lib/utils";

interface FilterPillProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function FilterPill({ label, count, isActive, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-3 rounded-lg text-md font-medium transition-all",
        isActive
          ? "rounded-b-xs border-b-2 border-[#7E22CE] bg-purple-50 hover:bg-purple-50 text-[#7E22CE]" // Active State (Light Purple)
          : "text-slate-500 hover:bg-slate-50" // Inactive State
      )}
    >
      {label}
      <span
        className={cn(
          "px-1.5 py-0.5 rounded-md text-[10px] font-bold",
          isActive ? "bg-purple-300 text-white" : "bg-slate-100 text-slate-300"
        )}
      >
        {count}
      </span>
    </button>
  );
}