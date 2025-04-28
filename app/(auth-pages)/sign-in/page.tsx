"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

import { SubmitButton } from "@/components/submit-button";
import { signInAction } from "@/app/actions";

// Dummy users
const dummyUsers = [
  {
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
  },
  {
    email: "user@gmail.com",
    password: "user123",
    role: "user",
  },
];

export default function Login() {
  const router = useRouter();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = dummyUsers.find(
      (u) =>
        u.email === formState.email.trim() &&
        u.password === formState.password.trim()
    );

    if (user) {
      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } else {
      setMessage("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          {/* NLCS Logo */}

          <div className="h-12 w-12 relative mb-4">
            <Image
              src="/nlcs-logo.png" // make sure logo.png is in the /public directory
              alt="NLCS Logo"
              fill
              className="rounded object-cover"
            />
          </div>

          <h1 className="text-2xl font-medium text-center">Login to NLCS</h1>
          <p className="text-sm text-foreground mt-2">
            Don't have an account?{" "}
            <Link className="text-blue-600 hover:underline" href="/sign-up">
              Sign up
            </Link>
          </p>
        </div>

        <form className="flex flex-col" onSubmit={handleLogin}>
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
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
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
                value={formState.password}
                onChange={(e) =>
                  setFormState({ ...formState, password: e.target.value })
                }
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            </div>
            {message && (
              <p className="text-sm text-red-500 text-center">{message}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

{
  /* <SubmitButton
  pendingText="Logging In..."
  formAction={signInAction}
  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
>
  Login
</SubmitButton>; */
}
