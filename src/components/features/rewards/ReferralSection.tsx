"use client";

import { Copy, Facebook, Linkedin, Users } from "lucide-react";

interface ReferralSectionProps {
  referralCode: string;
  onCopy: () => void;
}

export function ReferralSection({ referralCode, onCopy }: ReferralSectionProps) {
  return (
    <div>
       <div className="bg-purple-600 w-1 h-8 rounded-full inline-block mr-2 align-middle"></div>
        <h2 className="text-2xl font-medium text-slate-900 inline-block align-middle">
        Refer & Earn
      </h2>

      <div className="transition-transform duration-300 hover:-translate-y-1 hover:ease-out rounded-2xl hover:shadow-lg">
      <div className="bg-[#F8FAFC] border border-slate-100 rounded-t-2xl mt-6 shadow-sm">
        <div className="flex items-start gap-3 mb-8 bg-[#EFF6FF] p-4 rounded-t-xl">
          <Users size={24} className="text-[#7E22CE] mt-1" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Share Your Link</h3>
            <p className="text-xs text-slate-500">
              Invite friends and earn 25 points when they join!
            </p>
          </div>
        </div>

        <div className="flex justify-around text-center mb-10">
          <div>
            <div className="text-2xl font-bold text-[#7E22CE]">0</div>
            <div className="text-xs text-slate-500 font-medium">Referrals</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#7E22CE]">0</div>
            <div className="text-xs text-slate-500 font-medium">Points Earned</div>
          </div>
        </div>

        <div className="bg-[#FAFAFA] px-4 py-3 rounded-xl mb-8">
          <label className="text-[15px] text-slate-500 block mb-1 font-medium">
            Your personal referral link:
          </label>
          <div className="flex items-center justify-between border p-2 rounded-md bg-white border-slate-200">
            <span className="text-sm text-slate-600 truncate mr-2">
              {`https://app.flowvahub.com/signup/?ref=${referralCode}`}
            </span>
            <Copy
              onClick={onCopy}
              size={16}
              className="text-[#7E22CE] cursor-pointer hover:scale-110 transition-transform"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 p-4">
          <div className="h-10 w-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90">
            <Facebook size={20} />
          </div>
          <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90">
            <span className="font-bold text-lg">𝕏</span>
          </div>
          <div className="h-10 w-10 bg-[#0A66C2] rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90">
            <Linkedin size={20} />
          </div>
          <div className="h-10 w-10 bg-[#25D366] rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90">
            <div className="font-bold text-xs">WA</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}