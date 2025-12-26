"use client";

import { usePathname } from "next/navigation";
import SidebarContent from "../sidebar/SidebarContent";
import { User } from "@/types";

export function AppSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent user={user} />
      </aside>
    </>
  );
}