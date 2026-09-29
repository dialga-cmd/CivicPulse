import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function appOrigin(request: NextRequest): string {
  // Prefer an explicitly configured public site URL so we never bounce users
  // back to a localhost/loopback origin after authentication.
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";
  const origin = appOrigin(request);

  console.log("[auth/callback] incoming url:", request.url);
  console.log("[auth/callback] resolved origin:", origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to the admin page with an error flag.
  return NextResponse.redirect(`${origin}/admin?error=auth`);
}
