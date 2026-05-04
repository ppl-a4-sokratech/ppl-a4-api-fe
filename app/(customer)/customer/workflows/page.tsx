"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCustomerSession } from "@/lib/auth/session";
import { listWorkflows, deleteWorkflow } from "@/lib/api/workflows";
import { Card, CardBody } from "@/components/ui/card";
import WorkflowList from "@/components/workflows/WorkflowList";
import type { WorkflowRecord } from "@/lib/types/api";

export default function WorkflowsPage() {
  const session = useCustomerSession();
  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session.ready || !session.token || !session.user) return;
    const { token, user } = session;
    (async () => {
      try {
        const res = await listWorkflows(token, user.customerId);
        setWorkflows(res.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [session.ready, session.token, session.user]);

  function handleDeleted(id: string) {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Workflows</h1>
          <p className="text-sm text-slate-500">Manage your detection workflows.</p>
        </div>
        <Link
          href="/customer/workflows/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus size={15} />
          New Workflow
        </Link>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && workflows.length === 0 && (
        <Card>
          <CardBody>
            <p className="text-sm text-slate-500">No workflows yet. Create your first one.</p>
          </CardBody>
        </Card>
      )}
      {!loading && !error && workflows.length > 0 && (
        <WorkflowList
          workflows={workflows}
          onDeleted={handleDeleted}
          onDelete={async (id) => {
            if (!session.token || !session.user) throw new Error("Not authenticated");
            await deleteWorkflow(session.token, session.user.customerId, id);
          }}
        />
      )}
    </div>
  );
}
