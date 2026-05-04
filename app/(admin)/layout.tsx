"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  HomeIcon,
  UsersIcon,
} from "@/components/layout/nav-icons";
import { clearAdminSession, useAdminSession } from "@/lib/auth/session";

export default function AdminAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useAdminSession();

  useEffect(() => {
    if (session.ready && !session.token) {
      router.replace("/admin/login");
    }
  }, [session.ready, session.token, router]);

  const handleLogout = () => {
    clearAdminSession();
    router.replace("/admin/login");
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
      scope="Admin"
      userLabel={session.user?.username}
      onLogout={handleLogout}
      primaryNav={[
        {
          label: "Dashboard",
          href: "/admin/dashboard",
          icon: <HomeIcon />,
        },
        {
          label: "Customers",
          href: "/admin/customers/new",
          icon: <UsersIcon />,
        },
      ]}
    >
      {children}
    </AppShell>
  );
}
