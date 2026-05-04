"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  HelpIcon,
  HomeIcon,
  WorkflowIcon,
} from "@/components/layout/nav-icons";
import { clearCustomerSession, useCustomerSession } from "@/lib/auth/session";

export default function CustomerAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useCustomerSession();

  useEffect(() => {
    if (session.ready && !session.token) {
      router.replace("/customer/login");
    }
  }, [session.ready, session.token, router]);

  const handleLogout = () => {
    clearCustomerSession();
    router.replace("/customer/login");
  };

  if (!session.ready || !session.token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-app text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <AppShell
      scope="Customer"
      userLabel={session.user?.username}
      onLogout={handleLogout}
      primaryNav={[
        {
          label: "Dashboard",
          href: "/customer/dashboard",
          icon: <HomeIcon />,
        },
        {
          label: "Workflow",
          href: "/customer/workflows",
          icon: <WorkflowIcon />,
        },
      ]}
      secondaryNav={[
        {
          label: "Support",
          href: "/customer/dashboard",
          icon: <HelpIcon />,
        },
      ]}
    >
      {children}
    </AppShell>
  );
}
