"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCustomerSession, clearCustomerSession } from "@/lib/auth/session";
import { getProfile, updateProfile } from "@/lib/api/profiles";
import { Card, CardBody } from "@/components/ui/card";
import ProfileForm from "@/components/profiles/ProfileForm";
import { ApiError, type WorkflowProfileRecord, type IdentityProfileRecipes } from "@/lib/types/api";

type FetchState =
  | { status: "loading" }
  | { status: "ready"; data: WorkflowProfileRecord }
  | { status: "error"; message: string };

export default function EditProfilePage() {
  const router = useRouter();
  const { workflowId, profileId } = useParams<{ workflowId: string; profileId: string }>();
  const session = useCustomerSession();
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    if (!session.ready || !session.token) return;
    const ctrl = new AbortController();
    const { token } = session;
    getProfile(token, workflowId, profileId)
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
  }, [session, workflowId, profileId, router]);

  async function handleSubmit(payload: { name: string; recipes: IdentityProfileRecipes }) {
    if (!session.token) throw new Error("Not authenticated");
    await updateProfile(session.token, workflowId, profileId, payload);
    router.push(`/customer/workflows/${workflowId}/profiles/${profileId}`);
  }

  const errorMessage = state.status === "error" ? state.message : null;

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

      {errorMessage ? (
        <Card className="mb-6 border-red-200 bg-red-50/50">
          <CardBody>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </CardBody>
        </Card>
      ) : null}

      {state.status === "loading" && <p className="text-sm text-slate-500">Loading…</p>}

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
