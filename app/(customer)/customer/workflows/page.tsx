"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCustomerSession, clearCustomerSession } from "@/lib/auth/session";
import { listWorkflows, deleteWorkflow } from "@/lib/api/workflows";
import { Card, CardBody } from "@/components/ui/card";
import WorkflowList from "@/components/workflows/WorkflowList";
import { ApiError, type WorkflowRecord } from "@/lib/types/api";

type FetchState =
  | { status: "loading" }
  | { status: "ready"; data: WorkflowRecord[] }
  | { status: "error"; message: string };

export default function WorkflowsPage() {
  const router = useRouter();
  const session = useCustomerSession();
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    if (!session.ready || !session.token) return;
    const ctrl = new AbortController();
    const { token } = session;
    listWorkflows(token)
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
          setState({ status: "error", message: "Failed to load" });
        }
      });
    return () => ctrl.abort();
  }, [session, router]);

  function handleDeleted(id: string) {
    if (state.status !== "ready") return;
    setState({ status: "ready", data: state.data.filter((w) => w.id !== id) });
  }

  const workflows = state.status === "ready" ? state.data : [];
  const loading = state.status === "loading";
  const errorMessage = state.status === "error" ? state.message : null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Workflows</h1>
          <p className="text-sm text-slate-500">Manage your detection workflows.</p>
        </div>
        <Link
          href="/customer/workflows/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus size={15} />
          New Workflow
        </Link>
      </div>

      {errorMessage ? (
        <Card className="border-red-200 bg-red-50/50">
          <CardBody>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </CardBody>
        </Card>
      ) : null}

      {loading && <p className="text-sm text-slate-500">Loading…</p>}

      {!loading && !errorMessage && workflows.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-sm text-slate-500">No workflows yet. Create your first one.</p>
          </CardBody>
        </Card>
      )}

      {!loading && !errorMessage && workflows.length > 0 && (
        <WorkflowList
          workflows={workflows}
          onDeleted={handleDeleted}
          onDelete={async (id) => {
            if (!session.token) throw new Error("Not authenticated");
            await deleteWorkflow(session.token, id);
          }}
        />
      )}
    </div>
  );
}
