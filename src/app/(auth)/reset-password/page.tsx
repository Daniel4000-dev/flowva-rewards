import ResetPassword from "@/components/features/auth/ResetPassword";
import React, { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#8B5CF6]">
      {/* Card Container */}
      <section className="bg-white w-full max-w-[425px] rounded-lg p-6 animate-in fade-in zoom-in duration-300">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPassword />
        </Suspense>
      </section>
    </div>
  );
}