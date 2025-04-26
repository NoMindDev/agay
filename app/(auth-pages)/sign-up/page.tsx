"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/form-message";
import type { Message } from "@/components/form-message";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [message, setMessage] = useState<Message | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !confirmationCode) {
      setMessage({
        error: "Please fill in all fields",
      });
      return;
    }

    // Here you would typically call your API to verify the confirmation code
    // For now, we'll just simulate a successful verification
    setMessage({
      success: "Verification successful! Redirecting to password setup...",
    });

    // Redirect to password setup page after a short delay
    setTimeout(() => {
      router.push("/setup-password");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          {/* NLCS Logo */}
          <div className="mb-4">
            <Image
              src="/nlcs-logo.png"
              alt="NLCS Logo"
              width={64}
              height={64}
              className="rounded"
            />
          </div>
          <h1 className="text-2xl font-medium text-center">Register to NLCS</h1>
          <p className="text-sm text-gray-500 mt-2">
            Already have an account?{" "}
            <Link className="text-blue-600 hover:underline" href="/sign-in">
              Login
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gmail.com"
                required
                className="p-3 border rounded-md w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmationCode" className="text-gray-700">
                Confirmation Code
              </Label>
              <Input
                id="confirmationCode"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="AU123JLA9"
                required
                className="p-3 border rounded-md w-full"
              />
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Join
              </Button>
            </div>

            {message && <FormMessage message={message} />}
          </div>
        </form>
      </div>
    </div>
  );
}
{
  /* <div className="flex justify-start items-center h-screen">
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      <SmtpMessage />
      </form>
    </div> */
}
