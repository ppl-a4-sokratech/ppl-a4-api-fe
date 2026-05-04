"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import { getProfile } from "@/lib/api/profiles";
import { ActionLink } from "@/components/ui/ActionLink";
import { BackLink } from "@/components/ui/BackLink";
import { ErrorCard, LoadingText } from "@/components/ui/FetchFeedback";
import { ProfileRecipeSummary } from "@/components/profiles/ProfileRecipeSummary";
import { useCustomerResource } from "@/lib/hooks/useCustomerResource";

export default function ProfileDetailPage() {
  const { workflowId, profileId } = useParams<{ workflowId: string; profileId: string }>();
  const loadProfile = useCallback(
    (token: string) => getProfile(token, workflowId, profileId).then((res) => res.data),
    [workflowId, profileId]
  );
  const { state } = useCustomerResource(loadProfile);

  const profile = state.status === "ready" ? state.data : null;
  const loading = state.status === "loading";
  const errorMessage = state.status === "error" ? state.message : null;

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <BackLink href={`/customer/workflows/${workflowId}`}>Back to Workflow</BackLink>

      {errorMessage ? <ErrorCard message={errorMessage} /> : null}
      {loading && <LoadingText />}

      {profile ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">{profile.name}</h1>
            <ActionLink
              href={`/customer/workflows/${workflowId}/profiles/${profileId}/edit`}
              icon={<Pencil size={14} />}
            >
              Edit
            </ActionLink>
          </div>
          <ProfileRecipeSummary recipes={profile.recipes} />
        </>
      ) : null}
    </div>
  );
}
