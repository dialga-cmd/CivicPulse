import { type ComplaintStatus } from "@/lib/types";

const styles: Record<ComplaintStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  acknowledged: "bg-amber-50 text-amber-700 border-amber-200",
  in_progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const labels: Record<ComplaintStatus, string> = {
  new: "New",
  acknowledged: "Acknowledged",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
