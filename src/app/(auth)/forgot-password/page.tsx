import ForgotPassword from "@/components/features/auth/ForgotPassword";
import React from "react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#8B5CF6] p-4">
      {/* Card Container */}
      <section className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl p-6 md:p-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#6D28D9] mb-2">Reset Password</h1>
          <p className="text-gray-500 text-sm">Enter your email to receive a reset link</p>
        </div>
        
        <ForgotPassword />
      </section>
    </div>
  );
}