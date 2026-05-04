"use client";

import { useCallback } from "react";
import { Plus } from "lucide-react";
import { listWorkflows, deleteWorkflow } from "@/lib/api/workflows";
import { Card, CardBody } from "@/components/ui/card";
import { ActionLink } from "@/components/ui/ActionLink";
import { ErrorCard, LoadingText } from "@/components/ui/FetchFeedback";
import WorkflowList from "@/components/workflows/WorkflowList";
import { useCustomerResource } from "@/lib/hooks/useCustomerResource";

export default function WorkflowsPage() {
  const loadWorkflows = useCallback(
    (token: string) => listWorkflows(token).then((res) => res.data),
    []
  );
  const { state, reload, token } = useCustomerResource(loadWorkflows);

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
        <ActionLink href="/customer/workflows/new" icon={<Plus size={15} />} variant="primary">
          New Workflow
        </ActionLink>
      </div>

      {errorMessage ? <ErrorCard message={errorMessage} /> : null}
      {loading && <LoadingText />}

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
          onDeleted={reload}
          onDelete={async (id) => {
            if (!token) throw new Error("Not authenticated");
            await deleteWorkflow(token, id);
          }}
        />
      )}
    </div>
  );
}
