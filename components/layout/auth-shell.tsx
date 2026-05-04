import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export const AuthShell = ({ title, subtitle, children }: AuthShellProps) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <span className="text-xl font-semibold tracking-tight text-brand-900">
          Sokratech
        </span>
        <p className="text-sm font-medium text-slate-700">{title}</p>
        {subtitle ? (
          <p className="text-xs text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  </div>
);
