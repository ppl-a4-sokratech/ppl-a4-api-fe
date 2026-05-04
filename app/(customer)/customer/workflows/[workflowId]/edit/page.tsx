"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCustomerSession, clearCustomerSession } from "@/lib/auth/session";
import { getWorkflow, updateWorkflow } from "@/lib/api/workflows";
import { ErrorCard, LoadingText } from "@/components/ui/FetchFeedback";
import WorkflowForm from "@/components/workflows/WorkflowForm";
import { ApiError } from "@/lib/types/api";

type FetchState =
  | { status: "loading" }
  | { status: "ready"; initialName: string }
  | { status: "error"; message: string };

export default function EditWorkflowPage() {
  const router = useRouter();
  const { workflowId } = useParams<{ workflowId: string }>();
  const session = useCustomerSession();
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    if (!session.ready || !session.token) return;
    const ctrl = new AbortController();
    const { token } = session;
    getWorkflow(token, workflowId)
      .then((res) => {
        if (ctrl.signal.aborted) return;
        setState({ status: "ready", initialName: res.data.name });
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
  }, [session, workflowId, router]);

  async function handleSubmit(name: string) {
    if (!session.token) throw new Error("Not authenticated");
    await updateWorkflow(session.token, workflowId, name);
    router.push(`/customer/workflows/${workflowId}`);
  }

  const errorMessage = state.status === "error" ? state.message : null;

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link
        href={`/customer/workflows/${workflowId}`}
        className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft size={14} />
        Back to Workflow
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Edit Workflow</h1>

      {errorMessage ? <ErrorCard message={errorMessage} /> : null}
      {state.status === "loading" && <LoadingText />}

      {state.status === "ready" && (
        <WorkflowForm
          initialName={state.initialName}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
