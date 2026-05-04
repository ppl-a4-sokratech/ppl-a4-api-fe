import { Suspense, type ReactNode } from "react";
import { AuthShell } from "@/components/layout/auth-shell";

type Props = {
  title: string;
  children: ReactNode;
};

export const LoginPageScaffold = ({ title, children }: Props) => (
  <AuthShell title={title}>
    <Suspense
      fallback={<div className="h-32 animate-pulse rounded-lg bg-slate-100" />}
    >
      {children}
    </Suspense>
  </AuthShell>
);
