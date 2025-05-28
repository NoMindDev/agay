// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   // The `/auth/callback` route is required for the server-side auth flow implemented
//   // by the SSR package. It exchanges an auth code for the user's session.
//   // https://supabase.com/docs/guides/auth/server-side/nextjs

//   const requestUrl = new URL(request.url);
//   console.log("requestUrl", requestUrl);
//   const code = requestUrl.searchParams.get("code");
//   console.log("code", code);
//   const origin = requestUrl.origin;
//   const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
//   console.log("redirectTo,redirectTo");

//   if (code) {
//     const supabase = await createClient();
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   if (redirectTo) {
//     return NextResponse.redirect(`${origin}${redirectTo}`);
//   }

//   // URL to redirect to after sign up process completes
//   return NextResponse.redirect(`${origin}/protected`);
// }

import { type EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  console.log("In side the Forgot Password Get API");

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    console.log("Response from Verify OTP: ", data);
    if (!error) {
      const access_token = data.session?.access_token;
      const refresh_token = data.session?.refresh_token;

      if (!access_token || !refresh_token) {
        // Handle the error, e.g., redirect to error page or throw
        redirectTo.pathname = "/auth/auth-code-error";
        return NextResponse.redirect(redirectTo);
      }

      const response = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      console.log("Response from setSession: ", response);

      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = "/auth/auth-code-error";
  return NextResponse.redirect(redirectTo);
}
