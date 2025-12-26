import { getAvailableRewards, getRewardsData } from "@/actions/rewards";
import { EarnTabContent } from "@/components/features/rewards/EarnTabContent";
import { RedeemTabContent } from "@/components/features/rewards/RedeemTabContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";

export default async function RewardsPage() {
  // Execute data fetching and minimum loading delay in parallel to ensure a smooth UI transition
  const [[profile, rewards]] = await Promise.all([
     Promise.all([getRewardsData(), getAvailableRewards()]),
     new Promise(resolve => setTimeout(resolve, 2500)) 
  ]);

  return (
    <div className="flex h-full">
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <Tabs defaultValue="earn" className="w-full">
                <TabsList className="bg-transparent p-0 border-b border-slate-100 justify-start rounded-none h-auto gap-2">
                    <TabsTrigger 
                        value="earn"
                        className="rounded-b-xs border-b-2 border-transparent data-[state=active]:border-b-[#7E22CE] data-[state=active]:bg-purple-50 hover:bg-purple-50 data-[state=active]:text-[#7E22CE] text-md px-3 py-3 text-slate-500 font-medium"
                    >
                        Earn Points
                    </TabsTrigger>
                    <TabsTrigger 
                        value="redeem"
                        className="rounded-b-xs border-b-2 border-transparent data-[state=active]:border-b-[#7E22CE] data-[state=active]:bg-purple-50 hover:bg-purple-50 data-[state=active]:text-[#7E22CE] text-md px-3 py-3 text-slate-500 font-medium"
                    >
                        Redeem Rewards
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="earn">
                    <EarnTabContent profile={profile} />
                </TabsContent>

                <TabsContent value="redeem">
                   <RedeemTabContent profile={profile} rewards={rewards} />
                </TabsContent>
            </Tabs>

        </div>
      </main>
    </div>
  );
}