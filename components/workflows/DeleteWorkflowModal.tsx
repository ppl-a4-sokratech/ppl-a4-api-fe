'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

type DeleteWorkflowModalProps = Readonly<{
  workflowName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}>;

export default function DeleteWorkflowModal({
  workflowName,
  onConfirm,
  onCancel,
}: DeleteWorkflowModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    setLoading(true);
    setError('');
    try {
      await onConfirm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">Delete Workflow?</h2>
              <p className="mt-1 text-sm text-slate-600">
                Are you sure you want to delete <strong className="text-slate-900">{workflowName}</strong>?
              </p>
              <p className="mt-2 text-xs text-slate-500">This action cannot be undone.</p>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Deleting...' : 'Delete Workflow'}
          </button>
        </div>
      </div>
    </div>
  );
}
