'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import type { IdentityProfileRecipes } from '@/lib/types/api';
import { parseZodError } from '@/lib/parseZodError';
import ErrorText from '@/components/ui/ErrorText';
import RecipesForm from './RecipesForm';

const DEFAULT_RECIPES: IdentityProfileRecipes = {
  behavioral: {
    enabled: false,
    touch: false,
    drag: false,
    scroll: false,
    lifecycle: false,
    input: false,
    sensor: false,
  },
  fingerprint: {
    enabled: false,
    audio: false,
    canvas: false,
    graphics: false,
    fonts: false,
    device: false,
    screen: false,
  },
  detection: {
    enabled: false,
    emulator: false,
    webDriver: false,
  },
};

interface SharedFailResponse {
  error: { name: 'ZodError'; message: string; errors?: { path: string[]; message: string }[] };
}

interface ProfileFormProps {
  initialName?: string;
  initialRecipes?: IdentityProfileRecipes;
  onSubmit: (payload: { name: string; recipes: IdentityProfileRecipes }) => Promise<void>;
  submitLabel: string;
}

export default function ProfileForm({
  initialName = '',
  initialRecipes = DEFAULT_RECIPES,
  onSubmit,
  submitLabel,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [recipes, setRecipes] = useState<IdentityProfileRecipes>(initialRecipes);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setRootError('');
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), recipes });
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'error' in err &&
        (err as SharedFailResponse).error?.name === 'ZodError'
      ) {
        setFieldErrors(parseZodError(err as SharedFailResponse));
      } else if (err instanceof Error) {
        setRootError(err.message);
      } else {
        setRootError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-gradient-to-r from-orange-50 to-white px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">{submitLabel}</h2>
        <p className="mt-0.5 text-xs text-slate-500">Configure profile recipes for this workflow.</p>
      </div>

      <div className="space-y-5 px-6 py-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Profile Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. High sensitivity"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/20"
          />
          <ErrorText message={fieldErrors['name']} />
          <p className="mt-1.5 text-xs text-slate-500">Use 1-100 characters.</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Recipes</h3>
          <RecipesForm value={recipes} onChange={setRecipes} fieldErrors={fieldErrors} />
        </div>

        {rootError && (
          <p className="flex items-center gap-1 text-sm text-red-600">
            <AlertTriangle size={14} />
            {rootError}
          </p>
        )}
        {fieldErrors['_root'] && <ErrorText message={fieldErrors['_root']} />}
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
