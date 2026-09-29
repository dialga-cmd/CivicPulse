import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { COMPLAINT_STATUSES, type ComplaintStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Body {
  status?: string;
  initiative?: string;
  adminEmail?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Body;

  // Authorize via the server session, not the client-supplied email.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const isAdmin = await checkAdmin(supabase, user.email);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const status = body.status as ComplaintStatus;
  if (!COMPLAINT_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const initiative =
    typeof body.initiative === "string" ? body.initiative.trim() : "";

  const { error } = await supabase
    .from("complaints")
    .update({
      status,
      initiative: initiative || null,
      handled_by: user.email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update complaint:", error);
    return NextResponse.json(
      { error: "Failed to update the complaint." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

async function checkAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("admin_emails")
    .select("email")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return !!data;
}
