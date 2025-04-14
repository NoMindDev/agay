"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/form-message";
import { User, Loader2 } from "lucide-react";
import type { Message } from "@/components/form-message";

export default function SetupPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrors({});

    const fieldErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      fieldErrors.password = "Password is required";
    } else if (password.length < 8) {
      fieldErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      fieldErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      fieldErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    // Simulate successful password setup
    setMessage({ success: "Password set successfully! Redirecting..." });

    setTimeout(() => {
      router.push("/sign-in");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <h1 className="text-2xl font-medium text-center">Account Setup</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col gap-5">
            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="p-3 border rounded-md w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password 
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className="p-3 border rounded-md w-full"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" /> Setting...
                  </>
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>

            {/* Global Form Message */}
            {message && <FormMessage message={message} />}
          </div>
        </form>
      </div>
    </div>
  );
}
