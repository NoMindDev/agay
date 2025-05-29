"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

import { SubmitButton } from "@/components/submit-button";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { toast } from "sonner";

export default function Login() {
  const [message, setMessage] = useState<Message | null>(null);
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await signInAction(formData);
    if ("success" in result) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error("Login failed", {
        description: result.error || "Invalid credentials",
      });
      setMessage(result);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 relative mb-4">
            <Image
              src="/nlcs-logo.png"
              alt="NLCS Logo"
              fill
              className="rounded object-cover"
            />
          </div>
          <h1 className="text-2xl font-medium text-center">Login to NLCS</h1>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                name="email"
                id="email"
                placeholder="you@example.com"
                required
                className="p-3 border rounded-md w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Link
                  className="text-xs text-foreground hover:underline"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Your password"
                required
                className="p-3 border rounded-md w-full"
              />
            </div>

            {message && <FormMessage message={message} />}

            <div className="mt-4">
              <SubmitButton
                pendingText="Logging In..."
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Login
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
