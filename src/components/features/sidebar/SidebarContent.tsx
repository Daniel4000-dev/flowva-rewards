"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SIDEBAR_ITEMS } from "@/config/routes";
import NavLink from "./NavLink";
import { NavItem, User } from "@/types";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/actions/auth";
import { LogOut, LifeBuoy, MessageSquare } from "lucide-react";

// Generate user initials for avatar fallback
const getInitials = (name: string) => {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
};

export default function SidebarContent({ user }: { user: User | null }) {
  // Fallback values in case data is still loading or user is null
  const displayName = user?.full_name || "Guest User";
  const displayEmail = user?.email || "";
  const initials = getInitials(displayName);

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100">
      {/* 1. Logo */}
      <div className="px-6 py-4 pb-6 pl-8">
        <div className="flex items-center gap-2 text-[#7E22CE] font-bold text-2xl tracking-tight animate-in fade-in duration-500">
          <Image
            src="/assets/flowva_logo.png"
            alt="Flowva Logo"
            width={150}
            height={150}
            priority
          />
        </div>
      </div>

      {/* 2. Menu Items */}
      <nav className="flex-1 px-4 space-y-1">
        {SIDEBAR_ITEMS.map((item) => (
          <NavLink key={item.url} item={item as NavItem} />
        ))}
      </nav>

      {/* 3. User Footer */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors select-none outline-none">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={user?.avatar_url || ""} />
                  <AvatarFallback className="bg-purple-100 text-[#7E22CE] font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="text-sm font-bold text-slate-900 truncate max-w-[140px]">
                    {displayName}
                  </span>
                  <span className="text-xs text-slate-500 truncate max-w-[140px]">
                    {displayEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              side="top" 
              align="start" 
              sideOffset={10}
              className="w-50 p-2 rounded-xl shadow-xl border-slate-100/50 bg-white/95 backdrop-blur-sm"
            >
              <DropdownMenuLabel className="font-normal text-xs text-slate-400 px-3 py-2">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer font-medium p-3 rounded-lg focus:bg-purple-50 focus:text-purple-700">
                <MessageSquare className="mr-3 h-4 w-4 text-slate-400" />
                Feedback
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer font-medium p-3 rounded-lg focus:bg-purple-50 focus:text-purple-700">
                <LifeBuoy className="mr-3 h-4 w-4 text-slate-400" />
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem 
                className="cursor-pointer font-medium p-3 rounded-lg focus:text-red-700 focus:bg-red-50"
                onClick={() => signOut()}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Loading Skeleton / Login Prompt
          <div className="flex items-center gap-3 opacity-50 p-2">
            <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
              <div className="h-2 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
