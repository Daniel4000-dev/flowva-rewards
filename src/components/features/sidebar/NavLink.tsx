import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentType } from "react";

export default function NavLink({ item, isMobile = false }: { item: NavItem, isMobile?: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === item.url;
    return (
      <Link
        href={item.url}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
          isActive
            ? "bg-[#F3E8FF] text-[#7E22CE]" // Matches the light purple active state
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <item.icon size={20} className={cn(isActive ? "text-[#7E22CE]" : "text-slate-500")} />
        {item.title}
      </Link>
    );
};