"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  COMPLAINT_STATUSES,
  type ComplaintStatus,
} from "@/lib/types";

interface Props {
  complaintId: string;
  currentStatus: ComplaintStatus;
  adminEmail: string;
}

export function ComplaintActionForm({
  complaintId,
  currentStatus,
  adminEmail,
}: Props) {
  const [status, setStatus] = useState<ComplaintStatus>(currentStatus);
  const [initiative, setInitiative] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setDone(false);

    try {
      const res = await fetch(`/api/admin/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, initiative, adminEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update. Please try again.");
        return;
      }
      setDone(true);
      setInitiative("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="status" className="mb-1 block text-xs font-medium text-slate-600">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
          className={inputClass}
        >
          {COMPLAINT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="initiative" className="mb-1 block text-xs font-medium text-slate-600">
          Initiative taken
        </label>
        <textarea
          id="initiative"
          rows={3}
          value={initiative}
          onChange={(e) => setInitiative(e.target.value)}
          className={inputClass}
          placeholder='e.g. "Dispatched a road crew to patch the pothole; ETA 48 hours."'
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {done && (
        <p className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> Updated successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Saving…
          </>
        ) : (
          "Save changes"
        )}
      </button>
    </form>
  );
}
