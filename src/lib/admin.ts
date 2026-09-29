import { createClient } from "@/lib/supabase/server";

export interface AdminSession {
  isAdmin: boolean;
  email: string | null;
  userId: string | null;
  signedIn: boolean;
}

/**
 * Resolve the current session and whether the signed-in user is an authorized
 * admin. A user is an admin if their verified account email is listed in the
 * `admin_emails` table.
 */
export async function getAdminSession(): Promise<AdminSession> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signedIn = !!user;
  const email = user?.email ?? null;
  const userId = user?.id ?? null;

  let isAdmin = false;
  if (user?.email) {
    const { data } = await supabase
      .from("admin_emails")
      .select("email")
      .eq("email", user.email.toLowerCase())
      .maybeSingle();
    isAdmin = !!data;
  }

  return { isAdmin, email, userId, signedIn };
}
