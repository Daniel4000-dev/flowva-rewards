"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { resetPassword } from "@/actions/auth";
import { APP_ROUTES } from "@/config/routes";
import { toast } from "sonner";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const code = searchParams.get("code");

    // 1. Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!code) {
      setError("Invalid or missing reset code.");
      setLoading(false);
      return;
    }

    // 2. Server Action
    const result = await resetPassword(formData, code);

    if (result.status === "success") {
      toast.success("Password Updated", { description: "You can now log in with your new password." });
      router.push(APP_ROUTES.SIGNIN || "/signin");
    } else {
      setError(result.status);
    }

    setLoading(false);
  };

  return (
    <div className="w-full">
      {/* Header with Lock Icon */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-16 w-16 bg-violet-50 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-violet-600" />
        </div>
        <h1 className="text-2xl font-bold text-[#6D28D9] mb-2">Reset Your Password</h1>
        <p className="text-gray-500 text-sm">Enter a new password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* New Password Field */}
        <div>
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
        <div>
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
          className="w-full bg-[#8B5CF6] hover:bg-violet-700 text-white font-semibold py-3.5 rounded-full transition-all shadow-md shadow-violet-200 disabled:opacity-70 flex items-center justify-center mt-2"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Reset Password"}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link 
          href={APP_ROUTES.SIGNIN || "/signin"} 
          className="text-[#8B5CF6] font-semibold hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;