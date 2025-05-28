"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseAdmin } from "@/utils/supabase/admin";
import { readUserSession } from "@/utils/supabase/auth";
import { revalidatePath, unstable_noStore } from "next/cache";
import { MemberWithPermission } from "@/lib/type";
// Auth actions

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("Login Error: " + error.message);
    return { error: error.message }; // Return error message
  }

  return { success: "Login successful!" }; // Return success message
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// Member actions
export const createMember = async (data: {
  name: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "RESIGNED";
  email: string;
  password: string;
  confirm: string;
}) => {
  // Authorization
  const { data: userSession } = await readUserSession();
  if (userSession.session?.user.user_metadata.role !== "ADMIN") {
    return JSON.stringify({
      error: { message: "You are not allowed to do this!" },
    });
  }

  const supabase = await createSupabaseAdmin();

  // Create account
  const createResult = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      name: data.name,
      role: data.role,
    },
  });

  if (createResult.error?.message) {
    return JSON.stringify(createResult);
  } else {
    // Create member
    const memberResult = await supabase.from("member").insert({
      name: data.name,
      id: createResult.data.user?.id,
      email: data.email,
    });

    if (memberResult.error?.message) {
      return JSON.stringify(memberResult);
    } else {
      // Create permission
      const permissionResult = await supabase.from("permission").insert({
        role: data.role,
        member_id: createResult.data.user?.id,
        status: data.status,
      });
      revalidatePath("/dashboard/settings");
      return JSON.stringify(permissionResult);
    }
  }
};

export async function readMembers(): Promise<{
  data: MemberWithPermission[] | null;
  error: any;
}> {
  unstable_noStore();
  const supabase = await createSupabaseAdmin();
  return await supabase.from("permission").select("*, member(*)");
}

export const deleteMemberById = async (user_id: string) => {
  // Authorization // Admin Only
  const { data: userSession } = await readUserSession();
  if (userSession.session?.user.user_metadata.role !== "ADMIN") {
    return JSON.stringify({
      error: { message: "You are not allowed to do this!" },
    });
  }

  // delete account
  const supabase = await createSupabaseAdmin();
  const deleteResult = await supabase.auth.admin.deleteUser(user_id);

  if (deleteResult.error?.message) {
    return JSON.stringify(deleteResult);
  } else {
    const supabase = await createClient();
    const result = await supabase.from("member").delete().eq("id", user_id);
    revalidatePath("/dashboard/settings");
    return JSON.stringify(result);
  }
};

export const updateMemberBasicById = async (id: string, data: string) => {
  const supabaseAdmin = await createSupabaseAdmin();

  // Create account
  const updateResult = await supabaseAdmin.auth.admin.updateUserById(id, {
    user_metadata: { name: data },
  });

  if (updateResult.error?.message) {
    return JSON.stringify(updateResult);
  } else {
    const supabase = await createClient();
    const result = await supabase
      .from("member")
      .update({ name: data })
      .eq("id", id);
    revalidatePath("/dashboard/settings");
    return JSON.stringify(result);
  }
};

export const updateMemberAdvanceById = async (
  id: string,
  data: {
    role: "ADMIN" | "USER";
    status: "ACTIVE" | "RESIGNED";
  }
) => {
  // Authorization
  const { data: userSession } = await readUserSession();
  if (userSession.session?.user.user_metadata.role !== "ADMIN") {
    return JSON.stringify({
      error: { message: "You are not allowed to do this!" },
    });
  }

  const supabaseAdmin = await createSupabaseAdmin();

  // Create account
  const updateResult = await supabaseAdmin.auth.admin.updateUserById(id, {
    user_metadata: { role: data.role },
  });

  if (updateResult.error?.message) {
    return JSON.stringify(updateResult);
  } else {
    const supabase = await createClient();
    const result = await supabase
      .from("permission")
      .update(data)
      .eq("member_id", id);
    revalidatePath("/dashboard/settings");
    return JSON.stringify(result);
  }
};

export const updateMemberAccountById = async (
  id: string,
  data: { password: string | undefined; email: string }
) => {
  // Authorization
  const { data: userSession } = await readUserSession();
  if (userSession.session?.user.user_metadata.role !== "ADMIN") {
    return JSON.stringify({
      error: { message: "You are not allowed to do this!" },
    });
  }

  let updateObject: { email: string; password?: string } = {
    email: data.email,
  };

  if (data.password) {
    updateObject["password"] = data.password;
  }

  const supabaseAdmin = await createSupabaseAdmin();

  // Create account
  const updateResult = await supabaseAdmin.auth.admin.updateUserById(
    id,
    updateObject
  );

  if (updateResult.error?.message) {
    return JSON.stringify(updateResult);
  } else {
    const supabase = await createClient();
    const result = await supabase
      .from("member")
      .update({ email: data.email })
      .eq("id", id);

    revalidatePath("/dashboard/settings");
    return JSON.stringify(result);
  }
};
