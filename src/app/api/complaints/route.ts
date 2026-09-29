import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { COMPLAINT_CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

interface SubmissionBody {
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  location?: string;
  description?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as SubmissionBody;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const category = typeof body.category === "string" ? body.category : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";

  if (!name || !email || !location || !description) {
    return NextResponse.json(
      { error: "Name, email, location and description are required." },
      { status: 400 },
    );
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (!COMPLAINT_CATEGORIES.includes(category as (typeof COMPLAINT_CATEGORIES)[number])) {
    return NextResponse.json(
      { error: "Please choose a valid category." },
      { status: 400 },
    );
  }

  if (description.length < 10) {
    return NextResponse.json(
      { error: "Please describe the issue in at least 10 characters." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.from("complaints").insert({
    name,
    email,
    phone: phone || null,
    category,
    location,
    description,
    status: "new",
  });

  if (error) {
    console.error("Failed to insert complaint:", error);
    return NextResponse.json(
      { error: "Something went wrong submitting your complaint. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
