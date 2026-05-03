import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-app px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
        404
      </p>
      <h1 className="text-3xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-slate-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/customer/login"
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Customer login
        </Link>
        <Link
          href="/admin/login"
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Admin login
        </Link>
      </div>
    </div>
  );
}
