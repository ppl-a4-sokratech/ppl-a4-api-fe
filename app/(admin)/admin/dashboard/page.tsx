"use client";

import Link from "next/link";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminSession } from "@/lib/auth/session";

export default function AdminDashboardPage() {
  const session = useAdminSession();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-8 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Manage Sokratech customer accounts.
        </p>
      </div>

      <Card>
        <CardBody className="flex flex-col items-start gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Welcome back{session.user ? `, ${session.user.adminId}` : ""}
            </h2>
            <p className="text-sm text-slate-500">
              From here you can register new customer accounts that will use the
              Sokratech control plane.
            </p>
          </div>
          <Link href="/admin/customers/new">
            <Button>Register new customer</Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
