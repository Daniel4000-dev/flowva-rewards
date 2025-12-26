import { getUserSession } from "@/actions/auth";
import { getUserNotifications } from "@/actions/notifications";
import { getRewardsData } from "@/actions/rewards";
import { AppSidebar } from "@/components/features/layout/AppSidebar";
import { DashboardHeader } from "@/components/features/layout/DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, notifications] = await Promise.all([
    getRewardsData(),
    getUserNotifications()
  ]);
  if (!user) {
    redirect("/signin");
  }

  const response = await getUserSession();
    if(!response?.user) {
      redirect("/signin");
    }

  return (
    <SidebarProvider>
      <div className="flex h-full w-full bg-slate-50/50">
        <AppSidebar user={user} />
        <div className="flex-1 flex flex-col w-full lg:pl-64 transition-all bg-slate-50">
            {/* 2. Global Fixed Header */}
            <DashboardHeader user={user} notifications={notifications} />

            {/* 3. Page Content */}
            <main className="flex-1 w-full overflow-y-auto p-4 lg:p-8">
               <div className="max-w-7xl mx-auto bg-slate-50">
                  {children}
               </div>
            </main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}