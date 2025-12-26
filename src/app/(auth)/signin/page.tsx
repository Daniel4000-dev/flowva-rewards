import LoginForm from "@/components/features/auth/LoginForm";
import React from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#6D28D9] p-4">
      <section className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl p-6 md:p-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#6D28D9] mb-2">Log in to flowva</h1>
          <p className="text-gray-500 text-sm">Log in to receive personalized recommendations</p>
        </div>
        
        <LoginForm />
      </section>
    </div>
  );
}