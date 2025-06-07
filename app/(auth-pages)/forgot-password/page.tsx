import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
          {/* Agay Logo */}
          <div className="mb-4">
            <Image
              src="/nlcs-logo.png"
              alt="Agay Logo"
              width={64}
              height={64}
              className="rounded"
            />
          </div>
          <h1 className="text-2xl font-medium text-center">Reset Password</h1>
          <p className="text-sm text-gray-500 mt-2">
            Remembered your password?{" "}
            <Link className="text-blue-600 hover:underline" href="/sign-in">
              Login
            </Link>
          </p>
        </div>

        <form className="flex flex-col">
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
                type="email"
                pattern="^[\w-.]+@([\w-]+\.)+[\w-]{2,}$"
                title="Please enter a valid email address"
                autoComplete="email"
              />
            </div>

            <div className="mt-4">
              <SubmitButton
                formAction={forgotPasswordAction}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Reset Password
              </SubmitButton>
            </div>

            <FormMessage message={searchParams} />
            <SmtpMessage />
          </div>
        </form>
      </div>
    </div>
  );
}
