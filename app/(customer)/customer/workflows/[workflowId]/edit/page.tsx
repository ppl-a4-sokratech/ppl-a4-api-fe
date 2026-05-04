"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCustomerSession } from "@/lib/auth/session";
import { getWorkflow, updateWorkflow } from "@/lib/api/workflows";
import WorkflowForm from "@/components/workflows/WorkflowForm";

export default function EditWorkflowPage() {
  const router = useRouter();
  const { workflowId } = useParams<{ workflowId: string }>();
  const session = useCustomerSession();
  const [initialName, setInitialName] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session.ready || !session.token || !session.user) return;
    const { token, user } = session;
    (async () => {
      try {
        const res = await getWorkflow(token, user.customerId, workflowId);
        setInitialName(res.data.name);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
  }, [session.ready, session.token, workflowId]);

  async function handleSubmit(name: string) {
    if (!session.token || !session.user) throw new Error("Not authenticated");
    await updateWorkflow(session.token, session.user.customerId, workflowId, name);
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
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Edit Workflow</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {initialName !== null && (
        <WorkflowForm initialName={initialName} onSubmit={handleSubmit} submitLabel="Save Changes" />
      )}
    </div>
  );
}
