"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Pencil, Plus } from "lucide-react";
import { useCustomerSession, clearCustomerSession } from "@/lib/auth/session";
import { getWorkflow } from "@/lib/api/workflows";
import { deleteProfile } from "@/lib/api/profiles";
import { Card, CardBody } from "@/components/ui/card";
import ProfileList from "@/components/profiles/ProfileList";
import { ApiError, type WorkflowRecord } from "@/lib/types/api";

type FetchState =
  | { status: "loading" }
  | { status: "ready"; data: WorkflowRecord }
  | { status: "error"; message: string };

export default function WorkflowDetailPage() {
  const router = useRouter();
  const { workflowId } = useParams<{ workflowId: string }>();
  const session = useCustomerSession();
  const [state, setState] = useState<FetchState>({ status: "loading" });

  const load = useCallback(() => {
    if (!session.token) return;
    const ctrl = new AbortController();
    setTimeout(() => setState({ status: "loading" }), 0);
    getWorkflow(session.token, workflowId)
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
  }, [session.token, workflowId, router]);

  useEffect(() => {
    if (!session.ready) return;
    return load();
  }, [session.ready, load]);

  const workflow = state.status === "ready" ? state.data : null;
  const loading = state.status === "loading";
  const errorMessage = state.status === "error" ? state.message : null;

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <Link
        href="/customer/workflows"
        className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft size={14} />
        Back to Workflows
      </Link>

      {errorMessage ? (
        <Card className="border-red-200 bg-red-50/50">
          <CardBody>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </CardBody>
        </Card>
      ) : null}

      {loading && <p className="text-sm text-slate-500">Loading…</p>}

      {workflow ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{workflow.name}</h1>
            </div>
            <Link
              href={`/customer/workflows/${workflowId}/edit`}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil size={14} />
              Edit
            </Link>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">Profiles</h2>
            <Link
              href={`/customer/workflows/${workflowId}/profiles/new`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Plus size={14} />
              New Profile
            </Link>
          </div>

          <ProfileList
            workflowId={workflowId}
            profiles={workflow.profiles ?? []}
            onDeleted={() => void load()}
            onDelete={async (profileId) => {
              if (!session.token) throw new Error("Not authenticated");
              await deleteProfile(session.token, workflowId, profileId);
            }}
          />
        </>
      ) : null}
    </div>
  );
}
