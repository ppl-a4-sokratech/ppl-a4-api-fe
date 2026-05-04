"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getWorkflow, updateWorkflow } from "@/lib/api/workflows";
import { BackLink } from "@/components/ui/BackLink";
import { ErrorCard, LoadingText } from "@/components/ui/FetchFeedback";
import WorkflowForm from "@/components/workflows/WorkflowForm";
import { useCustomerResource } from "@/lib/hooks/useCustomerResource";

export default function EditWorkflowPage() {
  const router = useRouter();
  const { workflowId } = useParams<{ workflowId: string }>();
  const loadWorkflowName = useCallback(
    (token: string) => getWorkflow(token, workflowId).then((res) => res.data.name),
    [workflowId]
  );
  const { state, token } = useCustomerResource(loadWorkflowName);

  async function handleSubmit(name: string) {
    if (!token) throw new Error("Not authenticated");
    await updateWorkflow(token, workflowId, name);
    router.push(`/customer/workflows/${workflowId}`);
  }

  const errorMessage = state.status === "error" ? state.message : null;

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <BackLink href={`/customer/workflows/${workflowId}`}>Back to Workflow</BackLink>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Edit Workflow</h1>

      {errorMessage ? <ErrorCard message={errorMessage} /> : null}
      {state.status === "loading" && <LoadingText />}

      {state.status === "ready" && (
        <WorkflowForm
          initialName={state.data}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
