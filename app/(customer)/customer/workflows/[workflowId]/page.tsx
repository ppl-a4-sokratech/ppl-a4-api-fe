"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Pencil, Plus } from "lucide-react";
import { useCustomerSession } from "@/lib/auth/session";
import { getWorkflow } from "@/lib/api/workflows";
import { deleteProfile } from "@/lib/api/profiles";
import ProfileList from "@/components/profiles/ProfileList";
import type { WorkflowRecord } from "@/lib/types/api";

export default function WorkflowDetailPage() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const session = useCustomerSession();
  const [workflow, setWorkflow] = useState<WorkflowRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!session.token || !session.user) return;
    setLoading(true);
    try {
      const res = await getWorkflow(session.token, session.user.customerId, workflowId);
      setWorkflow(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session.ready) void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.ready, session.token, workflowId]);

  return (
    <div className="mx-auto max-w-5xl px-8 py-8">
      <Link
        href="/customer/workflows"
        className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft size={14} />
        Back to Workflows
      </Link>

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {workflow && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{workflow.name}</h1>
              <p className="text-sm text-slate-500">{workflow.type} · {workflow.status}</p>
            </div>
            <Link
              href={`/customer/workflows/${workflowId}/edit`}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil size={14} />
              Edit
            </Link>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">Profiles</h2>
            <Link
              href={`/customer/workflows/${workflowId}/profiles/new`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Plus size={14} />
              New Profile
            </Link>
          </div>

          <ProfileList
            workflowId={workflowId}
            profiles={workflow.profiles ?? []}
            onDeleted={load}
            onDelete={async (profileId) => {
              if (!session.token || !session.user) throw new Error("Not authenticated");
              await deleteProfile(session.token, session.user.customerId, workflowId, profileId);
            }}
          />
        </>
      )}
    </div>
  );
}
