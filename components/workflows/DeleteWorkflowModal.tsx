'use client';

import DeleteModal from '@/components/ui/DeleteModal';

type DeleteWorkflowModalProps = Readonly<{
  workflowName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}>;

export default function DeleteWorkflowModal({ workflowName, onConfirm, onCancel }: DeleteWorkflowModalProps) {
  return (
    <DeleteModal
      title="Delete Workflow?"
      description={<>Are you sure you want to delete <strong className="text-slate-900">{workflowName}</strong>?</>}
      confirmLabel="Delete Workflow"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
