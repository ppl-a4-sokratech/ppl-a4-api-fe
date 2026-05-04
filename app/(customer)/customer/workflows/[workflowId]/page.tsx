"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { getWorkflow } from "@/lib/api/workflows";
import { deleteProfile } from "@/lib/api/profiles";
import { ActionLink } from "@/components/ui/ActionLink";
import { BackLink } from "@/components/ui/BackLink";
import { ErrorCard, LoadingText } from "@/components/ui/FetchFeedback";
import ProfileList from "@/components/profiles/ProfileList";
import { useCustomerResource } from "@/lib/hooks/useCustomerResource";

export default function WorkflowDetailPage() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const loadWorkflow = useCallback(
    (token: string) => getWorkflow(token, workflowId).then((res) => res.data),
    [workflowId]
  );
  const { state, reload, token } = useCustomerResource(loadWorkflow);

  const workflow = state.status === "ready" ? state.data : null;
  const loading = state.status === "loading";
  const errorMessage = state.status === "error" ? state.message : null;

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <BackLink href="/customer/workflows">Back to Workflows</BackLink>

      {errorMessage ? <ErrorCard message={errorMessage} /> : null}
      {loading && <LoadingText />}

      {workflow ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{workflow.name}</h1>
              <p className="mt-1 font-mono text-xs text-slate-400">{workflowId}</p>
            </div>
            <ActionLink href={`/customer/workflows/${workflowId}/edit`} icon={<Pencil size={14} />}>
              Edit
            </ActionLink>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">Profiles</h2>
            <ActionLink
              href={`/customer/workflows/${workflowId}/profiles/new`}
              icon={<Plus size={14} />}
              variant="primary"
            >
              New Profile
            </ActionLink>
          </div>

          <ProfileList
            workflowId={workflowId}
            profiles={workflow.profiles ?? []}
            onDeleted={reload}
            onDelete={async (profileId) => {
              if (!token) throw new Error("Not authenticated");
              await deleteProfile(token, workflowId, profileId);
            }}
          />
        </>
      ) : null}
    </div>
  );
}
