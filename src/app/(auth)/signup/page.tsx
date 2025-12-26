import SignUpForm from "@/components/features/auth/SignUpForm";
import React from "react";

const SignUp = async () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#8B5CF6] p-4">
      <section className="bg-white w-full max-w-[500px] rounded-2xl shadow-xl p-6 md:p-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#6D28D9] mb-2">Create Your Account</h1>
          <p className="text-gray-500 text-sm">Sign up to manage your tools</p>
        </div>
        
        <SignUpForm />
      </section>
    </div>
  );
};

export default SignUp;