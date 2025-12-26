"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Flame, Smile, MoreHorizontal, Trash2, Info, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Notification } from "@/types";
import { markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from "@/actions/notifications";

// Helper to map DB types to Icons
const getIcon = (type: string) => {
  switch (type) {
    case 'streak': return { icon: Flame, color: "bg-orange-100 text-orange-500" };
    case 'reward': return { icon: Gift, color: "bg-purple-100 text-purple-500" };
    case 'system': return { icon: Info, color: "bg-blue-100 text-blue-500" };
    default: return { icon: Smile, color: "bg-green-100 text-green-600" };
  }
};

interface NotificationsPopoverProps {
  initialNotifications: Notification[]; // <--- New Prop
  onSelectNotification?: (notification: Notification) => void;
}

export function NotificationsPopover({ initialNotifications, onSelectNotification }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false);
  
  // Use local state for optimistic UI updates
  const [notifications, setNotifications] = useState(initialNotifications);

  // Sync with server data if it changes (e.g. revalidation)
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Handlers using Server Actions
  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true }))); // Optimistic
    await markAllAsRead();
  };

  const handleDeleteAll = async () => {
    setNotifications([]); // Optimistic
    await deleteAllNotifications();
  };

  const handleDeleteOne = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id)); // Optimistic
    await deleteNotification(id);
  };

  const handleNotificationClick = async (item: Notification) => {
    // 1. Mark as read visually
    if (!item.is_read) {
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, is_read: true } : n));
        await markAsRead(item.id);
    }
    
    // 2. Open detail
    if (onSelectNotification) onSelectNotification(item);
    setOpen(false); 
  };

  // Helper to format "2d ago"
  const getTimeAgo = (dateStr: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
    return days === 0 ? "Today" : `${days}d ago`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center">
             <Bell className="h-5 w-5 text-slate-600" />
          </div>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              {unreadCount}
            </div>
          )}
        </div>
      </PopoverTrigger>
      
      <PopoverContent align="end" className="w-[400px] p-0 shadow-xl border-none rounded-xl overflow-hidden mr-4 z-50">
        <div className="bg-gradient-to-r from-[#7E22CE] to-[#A855F7] p-4 flex items-center justify-between text-white">
            <span className="font-bold text-sm">Notifications</span>
            <div className="flex gap-4 text-[10px] font-medium opacity-90">
                <button onClick={handleMarkAllRead} className="hover:underline">Mark all as read</button>
                <button onClick={handleDeleteAll} className="hover:underline">Delete All</button>
            </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto bg-white">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                    No new notifications
                </div>
            ) : (
                notifications.map((item) => {
                    const { icon: Icon, color } = getIcon(item.type);
                    return (
                        <div 
                            key={item.id} 
                            onClick={() => handleNotificationClick(item)}
                            className={cn(
                                "p-4 border-b border-slate-100 flex gap-3 group cursor-pointer transition-all relative",
                                !item.is_read
                                    ? "bg-[#F3E8FF]/40 border-l-[4px] border-l-[#7E22CE]" 
                                    : "bg-white border-l-[4px] border-l-transparent hover:bg-slate-50"
                            )}
                        >
                            <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0 mt-0.5", color)}>
                                <Icon size={18} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className={cn(
                                        "text-xs truncate pr-2",
                                        !item.is_read ? "font-bold text-slate-900" : "font-semibold text-slate-700"
                                    )}>
                                        {item.title}
                                    </h4>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <button className="text-slate-400 hover:text-slate-600 p-1 -mr-2 rounded-full hover:bg-slate-100 transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                            <DropdownMenuItem 
                                                onClick={(e) => handleDeleteOne(e, item.id)}
                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer gap-2"
                                            >
                                                <Trash2 size={14} />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-1">
                                    {item.message}
                                </p>
                                <span className="text-[10px] text-slate-400 font-medium">{getTimeAgo(item.created_at)}</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </PopoverContent>
    </Popover>
  );
}