import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  footer?: React.ReactNode; // For progress bars or streak indicators
  className?: string;
}

export function StatsCard({ title, value, icon, footer, className }: StatsCardProps) {
  return (
    <Card className={cn("shadow-sm border-slate-100", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-violet-600 mb-4">{value}</div>
        {footer}
      </CardContent>
    </Card>
  );
}

export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("shadow-sm border-slate-100", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded-md" /> {/* Icon */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-9 w-16 mb-4" /> {/* Value */}
    
        {/* Footer line often has something small if existing, else empty */}
      </CardContent>
    </Card>
  )
}