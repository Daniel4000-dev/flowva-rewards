import { LucideIcon } from "lucide-react";

interface PlaceholderProps {
  title: string;
  icon: LucideIcon;
}

export function Placeholder({ title, icon: Icon }: PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in zoom-in duration-300">
      <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 max-w-sm mt-2">
          This module is part of the broader Flowva ecosystem but is outside the scope of this specific technical assessment.
        </p>
      </div>
    </div>
  );
}