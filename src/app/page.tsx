import { Megaphone, ShieldCheck, Timer, Users } from "lucide-react";
import { ComplaintForm } from "@/components/ComplaintForm";

const features = [
  {
    icon: Users,
    title: "Report quickly",
    text: "Tell us about road, water, power, sanitation or lighting issues in under a minute.",
  },
  {
    icon: ShieldCheck,
    title: "Official record",
    text: "Your complaint is stored as a formal record for your local administration.",
  },
  {
    icon: Timer,
    title: "Action taken",
    text: "Admins review and respond to each report and can mark it resolved.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-app grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Megaphone className="h-3.5 w-3.5" />
              Community Infrastructure Portal
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Report a problem in your neighbourhood
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Found a pothole, a broken streetlight, or a leaking pipe? File a
              formal complaint and let your local administration know — clearly,
              quickly and with an official record.
            </p>

            <div className="mt-8 space-y-4">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{f.title}</h3>
                    <p className="text-sm text-slate-600">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-1 text-xl font-semibold text-slate-900">
              File a complaint
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Fields marked with <span className="text-red-500">*</span> are
              required.
            </p>
            <ComplaintForm />
          </div>
        </div>
      </section>
    </div>
  );
}
