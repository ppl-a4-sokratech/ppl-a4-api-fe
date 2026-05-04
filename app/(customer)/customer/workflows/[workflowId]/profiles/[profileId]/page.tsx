"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Pencil } from "lucide-react";
import { useCustomerSession, clearCustomerSession } from "@/lib/auth/session";
import { getProfile } from "@/lib/api/profiles";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { ApiError, type WorkflowProfileRecord } from "@/lib/types/api";

type FetchState =
  | { status: "loading" }
  | { status: "ready"; data: WorkflowProfileRecord }
  | { status: "error"; message: string };

function RecipeGroup({
  title,
  enabled,
  fields,
}: {
  title: string;
  enabled: boolean;
  fields: Record<string, boolean>;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">{title}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              enabled ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-wrap gap-2">
          {Object.entries(fields).map(([key, val]) => (
            <span
              key={key}
              className={`rounded-full border px-2 py-0.5 text-xs ${
                val ? "border-slate-300 bg-slate-50 text-slate-700" : "border-slate-200 text-slate-400"
              }`}
            >
              {val ? "✓" : "✗"} {key}
            </span>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default function ProfileDetailPage() {
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

  const profile = state.status === "ready" ? state.data : null;
  const loading = state.status === "loading";
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

      {errorMessage ? (
        <Card className="border-red-200 bg-red-50/50">
          <CardBody>
            <p className="text-sm text-red-700">{errorMessage}</p>
          </CardBody>
        </Card>
      ) : null}

      {loading && <p className="text-sm text-slate-500">Loading…</p>}

      {profile ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">{profile.name}</h1>
            <Link
              href={`/customer/workflows/${workflowId}/profiles/${profileId}/edit`}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil size={14} />
              Edit
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {(() => {
              const { behavioral, fingerprint, detection } = profile.recipes;
              const { enabled: _eb, ...bFields } = behavioral;
              const { enabled: _ef, ...fFields } = fingerprint;
              const { enabled: _ed, ...dFields } = detection;
              void _eb; void _ef; void _ed;
              return (
                <>
                  <RecipeGroup title="Behavioral" enabled={behavioral.enabled} fields={bFields} />
                  <RecipeGroup title="Fingerprint" enabled={fingerprint.enabled} fields={fFields} />
                  <RecipeGroup title="Detection" enabled={detection.enabled} fields={dFields} />
                </>
              );
            })()}
          </div>
        </>
      ) : null}
    </div>
  );
}
