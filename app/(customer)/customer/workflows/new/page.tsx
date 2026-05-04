"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCustomerSession } from "@/lib/auth/session";
import { createWorkflow } from "@/lib/api/workflows";
import WorkflowForm from "@/components/workflows/WorkflowForm";

export default function NewWorkflowPage() {
  const router = useRouter();
  const session = useCustomerSession();

  async function handleSubmit(name: string) {
    if (!session.token) throw new Error("Not authenticated");
    await createWorkflow(session.token, name);
    router.push("/customer/workflows");
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <Link
        href="/customer/workflows"
        className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft size={14} />
        Back to Workflows
      </Link>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">New Workflow</h1>
      <WorkflowForm onSubmit={handleSubmit} submitLabel="Create Workflow" />
    </div>
  );
}
