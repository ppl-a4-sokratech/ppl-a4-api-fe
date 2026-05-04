"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCustomerSession } from "@/lib/auth/session";
import { getProfile, updateProfile } from "@/lib/api/profiles";
import ProfileForm from "@/components/profiles/ProfileForm";
import type { WorkflowProfileRecord, IdentityProfileRecipes } from "@/lib/types/api";

export default function EditProfilePage() {
  const router = useRouter();
  const { workflowId, profileId } = useParams<{ workflowId: string; profileId: string }>();
  const session = useCustomerSession();
  const [profile, setProfile] = useState<WorkflowProfileRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session.ready || !session.token || !session.user) return;
    const { token, user } = session;
    (async () => {
      try {
        const res = await getProfile(token, user.customerId, workflowId, profileId);
        setProfile(res.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, [session.ready, session.token, workflowId, profileId]);

  async function handleSubmit(payload: { name: string; recipes: IdentityProfileRecipes }) {
    if (!session.token || !session.user) throw new Error("Not authenticated");
    await updateProfile(session.token, session.user.customerId, workflowId, profileId, payload);
    router.push(`/customer/workflows/${workflowId}/profiles/${profileId}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link
        href={`/customer/workflows/${workflowId}/profiles/${profileId}`}
        className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft size={14} />
        Back to Profile
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Edit Profile</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {profile && (
        <ProfileForm
          initialName={profile.name}
          initialRecipes={profile.recipes}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
