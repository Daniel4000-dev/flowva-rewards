import ResetPassword from "@/components/features/auth/ResetPassword";
import React, { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#8B5CF6] p-4">
      {/* Card Container */}
      <section className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl p-6 md:p-10 animate-in fade-in zoom-in duration-300">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPassword />
        </Suspense>
      </section>
    </div>
  );
}