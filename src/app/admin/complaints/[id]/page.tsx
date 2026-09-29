import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { getAdminSession } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/AdminComplaintList";
import { ComplaintActionForm } from "@/components/admin/ComplaintActionForm";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getAdminSession();
  if (!session.signedIn) redirect("/admin");
  if (!session.isAdmin) redirect("/admin");

  const supabase = await createClient();
  const { data: complaint } = await supabase
    .from("complaints")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!complaint) notFound();

  return (
    <div className="container-app py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to complaints
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {complaint.category}
              </h1>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Submitted {formatDateTime(complaint.created_at)}
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </dt>
                <dd className="mt-1 text-slate-900">{complaint.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Reported by
                </dt>
                <dd className="mt-1 text-slate-900">{complaint.name}</dd>
                <dd className="text-sm text-slate-500">{complaint.email}</dd>
                {complaint.phone && (
                  <dd className="text-sm text-slate-500">{complaint.phone}</dd>
                )}
              </div>
            </dl>

            <div className="mt-6">
              <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Description
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-slate-800">
                {complaint.description}
              </p>
            </div>

            {complaint.initiative && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h2 className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                  Initiative taken
                </h2>
                <p className="mt-2 text-emerald-900">
                  {complaint.initiative}
                </p>
                {complaint.handled_by && (
                  <p className="mt-2 text-sm text-emerald-700">
                    — {complaint.handled_by}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Lock className="h-4 w-4 text-slate-400" /> Update &amp; take action
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Set a status and record the initiative taken on this complaint.
          </p>
          <div className="mt-4">
            <ComplaintActionForm
              complaintId={complaint.id}
              currentStatus={complaint.status}
              adminEmail={session.email ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
