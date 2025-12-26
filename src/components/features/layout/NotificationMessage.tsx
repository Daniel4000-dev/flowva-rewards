"use client";

import { X, Mail } from "lucide-react";

import { Notification } from "@/types";

interface NotificationMessageProps {
  notification: Notification | null;
  onClose: () => void;
}

export function NotificationMessage({ notification, onClose }: NotificationMessageProps) {
  if (!notification) return null;

  return (
    // Fixed position to ensure it floats above everything, including the popover.
    // No dark backdrop, just the card centered.
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xl animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-100 p-6 relative">
        
        {/* Close 'X' Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header Section */}
        <div className="flex items-center gap-3 mb-4">
           {/* Envelope Icon */}
           <div className="h-8 w-8 text-slate-700 flex items-center justify-center">
               <Mail size={24} strokeWidth={2} />
           </div>
           {/* Title */}
           <h3 className="text-lg font-bold text-slate-900">{notification.title}</h3>
        </div>

        {/* Body Text */}
        <div className="pl-0 md:pl-11">
            <p className="text-sm text-slate-600 leading-relaxed">
                {notification.message}
            </p>
        </div>
      </div>
    </div>
  );
}