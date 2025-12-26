"use client";

import { usePathname } from "next/navigation";
import { NotificationsPopover } from "./NotificationsPopover";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"; // Mobile Menu
import { Menu } from "lucide-react";
import { useMemo, useState } from "react";
import { NotificationMessage } from "./NotificationMessage";
import SidebarContent from "../sidebar/SidebarContent";
import { SIDEBAR_ITEMS } from "@/config/routes";
import { Notification, User } from "@/types";

export function DashboardHeader({ user, notifications }: { user: User, notifications: Notification[] }) {
  const pathname = usePathname();

  const { currentTitle, subText } = useMemo(() => {
    const activeItem = [...SIDEBAR_ITEMS]
      .sort((a, b) => b.url.length - a.url.length)
      .find(
        (item) => pathname === item.url || pathname.startsWith(`${item.url}/`)
      );

    return {
      currentTitle: activeItem ? activeItem.title : "Dashboard",
      subText: activeItem?.subText || "",
    };
  }, [pathname]);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  return (
    <>
      <header className="min-h-[5rem] py-4 bg-slate-50 sticky top-0 z-30 w-full px-4 lg:px-8">
        {/* Main Layout Container */}
        <div className="max-w-7xl mx-auto flex flex-col justify-center h-full">
          
          {/* Top Row: Menu, Title, and Notifications */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {/* Mobile Hamburger */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2 -ml-2 text-slate-600">
                      <Menu />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-64">
                    <SidebarContent user={user} />
                  </SheetContent>
                </Sheet>
              </div>

              <h1 className="text-xl md:text-2xl text-slate-900 tracking-tight">
                {currentTitle}
              </h1>
            </div>

            {/* Right Side: Notifications */}
            <div className="flex items-center">
              <NotificationsPopover
                initialNotifications={notifications}
                onSelectNotification={(item) => setSelectedNotification(item)}
              />
            </div>
          </div>

          {/* Bottom Row: Subtext */}
          {subText && (
            <div className="mt-1">
              <p className="text-sm md:text-base text-slate-500 max-w-2xl">
                {subText}
              </p>
            </div>
          )}
        </div>
      </header>

      {selectedNotification && (
        <>
          <div
            className="fixed inset-0 bg-black/5 z-40"
            onClick={() => setSelectedNotification(null)}
          />
          <NotificationMessage
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
          />
        </>
      )}
    </>
  );
}