"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCustomerSession } from "@/lib/auth/session";
import { createProfile } from "@/lib/api/profiles";
import ProfileForm from "@/components/profiles/ProfileForm";
import type { IdentityProfileRecipes } from "@/lib/types/api";

export default function NewProfilePage() {
  const router = useRouter();
  const { workflowId } = useParams<{ workflowId: string }>();
  const session = useCustomerSession();

  async function handleSubmit(payload: { name: string; recipes: IdentityProfileRecipes }) {
    if (!session.token) throw new Error("Not authenticated");
    await createProfile(session.token, workflowId, payload);
    router.push(`/customer/workflows/${workflowId}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link
        href={`/customer/workflows/${workflowId}`}
        className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft size={14} />
        Back to Workflow
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">New Profile</h1>
      <ProfileForm onSubmit={handleSubmit} submitLabel="Create Profile" />
    </div>
  );
}
