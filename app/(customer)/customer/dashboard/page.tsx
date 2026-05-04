"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/card";
import { getCustomerSummary } from "@/lib/api/customer";
import { ApiError, type CustomerSummary } from "@/lib/types/api";
import {
  clearCustomerSession,
  useCustomerSession,
} from "@/lib/auth/session";

type FetchState =
  | { status: "loading" }
  | { status: "ready"; data: CustomerSummary }
  | { status: "error"; message: string };

export default function CustomerDashboardPage() {
  const router = useRouter();
  const session = useCustomerSession();
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    if (!session.ready || !session.token) return;
    const ctrl = new AbortController();
    const token = session.token;
    getCustomerSummary(token)
      .then((res) => {
        if (ctrl.signal.aborted) return;
        setState({ status: "ready", data: res.data });
      })
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        if (err instanceof ApiError) {
          if (err.status === 401) {
            clearCustomerSession();
            router.replace("/customer/login");
            return;
          }
          setState({ status: "error", message: err.message });
        } else {
          setState({ status: "error", message: "Failed to fetch" });
        }
      });
    return () => ctrl.abort();
  }, [session.ready, session.token, router]);

  const summary = state.status === "ready" ? state.data : null;
  const errorMessage = state.status === "error" ? state.message : null;
  const loading = state.status === "loading";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Home</h1>
        <p className="text-sm text-slate-500">
          Summary of your Sokratech account.
        </p>
      </div>

      {errorMessage ? (
        <Card className="border-red-200 bg-red-50/50">
          <CardBody>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </CardBody>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryStat
          label="Total Workflows"
          value={summary?.counts.workflows}
          loading={loading}
          href="/customer/workflows"
        />
        <SummaryStat
          label="Total Profiles"
          value={summary?.counts.profiles}
          loading={loading}
        />
      </div>

      <Card>
        <CardBody>
          <h2 className="text-base font-semibold text-slate-900">Account</h2>
          {loading ? (
            <p className="mt-2 text-sm text-slate-500">Loading...</p>
          ) : summary ? (
            <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Customer ID</dt>
                <dd className="font-medium text-slate-900">
                  {summary.customer.customerId}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Username</dt>
                <dd className="font-medium text-slate-900">
                  {summary.customer.username}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Created at</dt>
                <dd className="font-medium text-slate-900">
                  {new Date(summary.customer.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Updated at</dt>
                <dd className="font-medium text-slate-900">
                  {new Date(summary.customer.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}

type SummaryStatProps = {
  label: string;
  value: number | undefined;
  loading: boolean;
  href?: string;
};

const SummaryStat = ({ label, value, loading, href }: SummaryStatProps) => {
  const inner = (
    <Card className="transition-shadow hover:shadow-md">
      <CardBody>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">
          {loading ? "..." : (value ?? 0)}
        </p>
      </CardBody>
    </Card>
  );
  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
};
