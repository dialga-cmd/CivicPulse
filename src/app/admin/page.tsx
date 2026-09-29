import { ShieldAlert, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { SignOutButton } from "@/components/SignOutButton";
import { AdminComplaintList } from "@/components/admin/AdminComplaintList";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: authError } = await searchParams;
  const session = await getAdminSession();

  if (!session.signedIn) {
    return (
      <div className="container-app flex justify-center py-20">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {authError && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Sign-in was not completed. Please try again.
            </p>
          )}
          <ShieldCheck className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with Google to access the citizen complaint dashboard.
          </p>
          <div className="mt-6">
            <GoogleSignInButton />
          </div>
        </div>
      </div>
    );
  }

  if (!session.isAdmin) {
    return (
      <div className="container-app flex justify-center py-20">
        <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Not authorized
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            The account <span className="font-medium">{session.email}</span> is
            not on the list of authorized administrators.
          </p>
          <div className="mt-6">
            <SignOutButton />
          </div>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: complaints, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="container-app py-20 text-center text-red-600">
        Failed to load complaints: {error.message}
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Citizen complaints
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Signed in as {session.email}
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-8">
        <AdminComplaintList complaints={complaints ?? []} />
      </div>
    </div>
  );
}
