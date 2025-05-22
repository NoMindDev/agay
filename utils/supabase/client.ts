import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export async function readUserSession() {
  const supabase = await createClient();
  const sessionResult = await supabase.auth.getSession();
  return { data: { session: sessionResult.data.session } };
}
