import Link from "next/link";
import { MapPin } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            CivicPulse
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            Report a problem
          </Link>
          <Link href="/complaints" className="hover:text-slate-900">
            View complaints
          </Link>
          <Link href="/admin" className="hover:text-slate-900">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
