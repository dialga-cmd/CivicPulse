import Link from "next/link";
import { Inbox } from "lucide-react";
import { type Complaint } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export { StatusBadge };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AdminComplaintList({
  complaints,
}: {
  complaints: Complaint[];
}) {
  if (complaints.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <Inbox className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-3 text-slate-500">
          No complaints yet. New citizen reports will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Reported by</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {formatDate(c.created_at)}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {c.category}
                </td>
                <td className="px-4 py-3 text-slate-600">{c.location}</td>
                <td className="px-4 py-3 text-slate-600">
                  {c.name}
                  <span className="block text-xs text-slate-400">
                    {c.email}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/complaints/${c.id}`}
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
