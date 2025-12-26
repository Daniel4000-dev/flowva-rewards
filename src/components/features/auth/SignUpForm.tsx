"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { signUp } from "@/actions/auth";
import { APP_ROUTES } from "@/config/routes";
import { Loader2 } from "lucide-react";
import GoogleAuthButton from "./GoogleAuthButton";

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();
  
  // 1. Get the referral code from the URL
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await signUp(formData);

    if (result.status === "success") {
      router.push(APP_ROUTES.SIGNIN || "/signin");
    } else {
      setError(result.status);
    }

    setLoading(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* 2. Pass Referral Code Hidden Input */}
        <input 
          type="hidden" 
          name="referral_code" 
          value={referralCode || ""} 
        />

        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-[#8B5CF6] hover:bg-violet-700 text-white font-semibold py-3.5 rounded-full transition-all mt-2 shadow-md shadow-violet-200 disabled:opacity-70 flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign up Account"}
        </button>
      </form>

      {/* Separator */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-400 font-medium">or</span>
        </div>
      </div>

      <GoogleAuthButton text="Sign up with Google" />

      {/* Footer Link */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link 
          href={APP_ROUTES.SIGNIN || "/signin"} 
          className="text-[#8B5CF6] font-semibold hover:underline"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;