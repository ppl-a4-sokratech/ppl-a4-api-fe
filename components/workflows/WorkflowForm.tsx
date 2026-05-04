'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

type WorkflowFormProps = Readonly<{
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
  submitLabel: string;
}>;

export default function WorkflowForm({ initialName = '', onSubmit, submitLabel }: WorkflowFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const MIN = 3;
  const MAX = 160;
  const trimmed = name.trim();
  const charCount = trimmed.length;
  const tooShort = charCount > 0 && charCount < MIN;
  const tooLong = charCount > MAX;
  const inputInvalid = tooShort || tooLong;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const t = name.trim();
    if (t.length < MIN) { setError(`Name must be at least ${MIN} characters.`); return; }
    if (t.length > MAX) { setError(`Name must be at most ${MAX} characters.`); return; }
    setLoading(true);
    try {
      await onSubmit(t);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-orange-50 to-white px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">{submitLabel}</h2>
        <p className="mt-0.5 text-xs text-slate-500">Workflow names are shown in SDK config views.</p>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div>
          <label htmlFor="workflow-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Workflow Name <span className="text-red-500">*</span>
          </label>
          <input
            id="workflow-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="e.g. Checkout bot defense"
            maxLength={MAX}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
              inputInvalid
                ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:border-[#0a2540] focus:ring-[#0a2540]/20'
            }`}
          />
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div>
              {tooShort && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle size={12} />
                  Name must be at least {MIN} characters.
                </p>
              )}
              {error && !tooShort && (
                <p className="flex items-center gap-1 text-xs text-red-600">
                  <AlertTriangle size={12} />
                  {error}
                </p>
              )}
              {!tooShort && !error && (
                <p className="text-xs text-slate-500">{MIN}–{MAX} characters.</p>
              )}
            </div>
            <span className={`text-xs tabular-nums ${tooLong ? 'text-red-600 font-medium' : 'text-slate-400'}`}>
              {charCount}/{MAX}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
      <button
        type="submit"
        disabled={loading}
          className="flex items-center gap-2 rounded-md bg-[#0a2540] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0d2f4f] disabled:cursor-not-allowed disabled:opacity-60"
      >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Saving...' : submitLabel}
      </button>
      </div>
    </form>
  );
}
