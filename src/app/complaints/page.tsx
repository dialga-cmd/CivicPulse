import Link from "next/link";
import {
  ClipboardList,
  Landmark,
  MapPin,
  MessageSquareText,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { type PublicComplaint } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function PublicComplaintsPage() {
  let complaints: PublicComplaint[] = [];
  let error: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error: err } = await supabase
      .from("complaints_public")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) throw err;
    complaints = (data ?? []) as unknown as PublicComplaint[];
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-app py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Landmark className="h-3.5 w-3.5" />
            Public register
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Reported complaints &amp; updates
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            A transparent, community-wide view of every issue reported to your
            local administration, along with its current status and any actions
            or comments from the authorities. Personal contact details are kept
            private.
          </p>
        </div>
      </section>

      <section className="container-app py-10">
        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-sm text-amber-800">
            {error}
          </div>
        ) : complaints.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-slate-500">
              No complaints have been registered yet. Be the first to report
              one.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Report a problem
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {complaints.map((c) => (
              <article
                key={c.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    <MapPin className="h-3.5 w-3.5" />
                    {c.location}
                  </span>
                  <StatusBadge status={c.status} />
                </div>

                <h3 className="mt-3 font-semibold text-slate-900">
                  {c.category}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">
                  {c.description}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  Reported on {formatDate(c.created_at)}
                </div>

                {c.initiative && (
                  <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <MessageSquareText className="h-3.5 w-3.5" />
                      Authority update
                    </p>
                    <p className="mt-1 text-sm text-emerald-900">
                      {c.initiative}
                    </p>
                    {c.handled_by && (
                      <p className="mt-1 text-xs text-emerald-700">
                        — {c.handled_by}
                      </p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
