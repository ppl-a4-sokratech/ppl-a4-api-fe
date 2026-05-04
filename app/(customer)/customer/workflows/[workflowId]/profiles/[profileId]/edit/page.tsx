"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProfile, updateProfile } from "@/lib/api/profiles";
import { BackLink } from "@/components/ui/BackLink";
import { ErrorCard, LoadingText } from "@/components/ui/FetchFeedback";
import ProfileForm from "@/components/profiles/ProfileForm";
import { useCustomerResource } from "@/lib/hooks/useCustomerResource";
import type { IdentityProfileRecipes } from "@/lib/types/api";

export default function EditProfilePage() {
  const router = useRouter();
  const { workflowId, profileId } = useParams<{ workflowId: string; profileId: string }>();
  const loadProfile = useCallback(
    (token: string) => getProfile(token, workflowId, profileId).then((res) => res.data),
    [workflowId, profileId]
  );
  const { state, token } = useCustomerResource(loadProfile);

  async function handleSubmit(payload: { name: string; recipes: IdentityProfileRecipes }) {
    if (!token) throw new Error("Not authenticated");
    await updateProfile(token, workflowId, profileId, payload);
    router.push(`/customer/workflows/${workflowId}/profiles/${profileId}`);
  }

  const errorMessage = state.status === "error" ? state.message : null;

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <BackLink href={`/customer/workflows/${workflowId}/profiles/${profileId}`}>
        Back to Profile
      </BackLink>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Edit Profile</h1>

      {errorMessage ? <ErrorCard message={errorMessage} /> : null}
      {state.status === "loading" && <LoadingText />}

      {state.status === "ready" && (
        <ProfileForm
          initialName={state.data.name}
          initialRecipes={state.data.recipes}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
