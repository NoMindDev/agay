import { createClient } from "@/utils/supabase/server";

export async function readUserSession() {
  const supabase = await createClient();
  const sessionResult = await supabase.auth.getSession();
  return { data: { session: sessionResult.data.session } };
}
