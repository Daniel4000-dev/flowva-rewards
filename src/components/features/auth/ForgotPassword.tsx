"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { forgotPassword } from "@/actions/auth";
import { APP_ROUTES } from "@/config/routes";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await forgotPassword(formData);

    if (result.status === "success") {
      // Success: Show toast notification
      toast.success("Reset Link Sent", {
        description: "Check your email for instructions to reset your password.",
      });
      // Optional: Clear form or redirect
    } else {
      // Error: Show error message
      setError(result.status || "An error occurred");
    }

    setLoading(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
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
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Reset Link"}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-4 text-center text-sm text-gray-500">
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

export default ForgotPassword;