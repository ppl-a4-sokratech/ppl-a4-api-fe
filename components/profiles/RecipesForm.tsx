'use client';

import { Activity, Fingerprint, Radar } from 'lucide-react';
import type { IdentityProfileRecipes } from '@/lib/types/api';
import ErrorText from '@/components/ui/ErrorText';

type RecipesBehavioral = IdentityProfileRecipes['behavioral'];
type RecipesFingerprint = IdentityProfileRecipes['fingerprint'];
type RecipesDetection = IdentityProfileRecipes['detection'];

type RecipesFormProps = Readonly<{
  value: IdentityProfileRecipes;
  onChange: (value: IdentityProfileRecipes) => void;
  fieldErrors?: Record<string, string>;
}>;

type ToggleProps = Readonly<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}>;

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a2540] ${checked ? 'bg-[#0a2540]' : 'bg-slate-300'}`}
      >
        <span
          className={`inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </button>
      <span className="select-none text-sm text-slate-700">{label}</span>
    </div>
  );
}

type BooleanFieldProps = Readonly<{
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}>;

function BooleanField({ id, checked, onChange, label }: BooleanFieldProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 accent-[#0a2540]"
      />
      <span className="text-sm capitalize text-slate-700">{label}</span>
    </label>
  );
}

type RecipeSectionProps = Readonly<{
  title: string;
  icon: typeof Activity;
  enabled: boolean;
  allSelected: boolean;
  enabledError?: string;
  onEnabledChange: (value: boolean) => void;
  onSelectAll: (select: boolean) => void;
  children: React.ReactNode;
}>;

function RecipeSection({
  title,
  icon: Icon,
  enabled,
  allSelected,
  enabledError,
  onEnabledChange,
  onSelectAll,
  children,
}: RecipeSectionProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-orange-600 shadow-sm ring-1 ring-orange-100">
            <Icon size={16} />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        <Toggle checked={enabled} onChange={onEnabledChange} label="Enabled" />
      </div>
      <div className="px-4 py-4">
        <ErrorText message={enabledError} />
        {enabled ? (
          <>
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => onSelectAll(!allSelected)}
                className="text-xs font-medium text-[#0a2540] hover:underline"
              >
                {allSelected ? 'Clear all' : 'Select all'}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
          </>
        ) : (
          <p className="text-sm text-slate-500">Enable this group to configure its signals.</p>
        )}
      </div>
    </div>
  );
}

const BEHAVIORAL_FIELDS: (keyof Omit<RecipesBehavioral, 'enabled'>)[] = [
  'touch', 'drag', 'scroll', 'lifecycle', 'input', 'sensor',
];
const FINGERPRINT_FIELDS: (keyof Omit<RecipesFingerprint, 'enabled'>)[] = [
  'audio', 'canvas', 'graphics', 'fonts', 'device', 'screen',
];
const DETECTION_FIELDS: (keyof Omit<RecipesDetection, 'enabled'>)[] = [
  'emulator', 'webDriver',
];

function allTrue<T extends Record<string, boolean>>(obj: T, keys: (keyof T)[]) {
  return keys.every((k) => obj[k]);
}

export default function RecipesForm({ value, onChange, fieldErrors = {} }: RecipesFormProps) {
  function updateBehavioral<K extends keyof RecipesBehavioral>(key: K, val: RecipesBehavioral[K]) {
    onChange({ ...value, behavioral: { ...value.behavioral, [key]: val } });
  }
  function updateFingerprint<K extends keyof RecipesFingerprint>(key: K, val: RecipesFingerprint[K]) {
    onChange({ ...value, fingerprint: { ...value.fingerprint, [key]: val } });
  }
  function updateDetection<K extends keyof RecipesDetection>(key: K, val: RecipesDetection[K]) {
    onChange({ ...value, detection: { ...value.detection, [key]: val } });
  }

  function selectAllBehavioral(select: boolean) {
    const patch = Object.fromEntries(BEHAVIORAL_FIELDS.map((f) => [f, select])) as Omit<RecipesBehavioral, 'enabled'>;
    onChange({ ...value, behavioral: { ...value.behavioral, ...patch } });
  }
  function selectAllFingerprint(select: boolean) {
    const patch = Object.fromEntries(FINGERPRINT_FIELDS.map((f) => [f, select])) as Omit<RecipesFingerprint, 'enabled'>;
    onChange({ ...value, fingerprint: { ...value.fingerprint, ...patch } });
  }
  function selectAllDetection(select: boolean) {
    const patch = Object.fromEntries(DETECTION_FIELDS.map((f) => [f, select])) as Omit<RecipesDetection, 'enabled'>;
    onChange({ ...value, detection: { ...value.detection, ...patch } });
  }

  return (
    <div className="flex flex-col gap-4">
      <RecipeSection
        title="Behavioral"
        icon={Activity}
        enabled={value.behavioral.enabled}
        allSelected={allTrue(value.behavioral, BEHAVIORAL_FIELDS)}
        enabledError={fieldErrors['recipes.behavioral.enabled']}
        onEnabledChange={(v) => updateBehavioral('enabled', v)}
        onSelectAll={selectAllBehavioral}
      >
        {BEHAVIORAL_FIELDS.map((field) => (
          <div key={field}>
            <BooleanField
              id={`behavioral-${field}`}
              label={field}
              checked={value.behavioral[field]}
              onChange={(v) => updateBehavioral(field, v)}
            />
            <ErrorText message={fieldErrors[`recipes.behavioral.${field}`]} />
          </div>
        ))}
      </RecipeSection>

      <RecipeSection
        title="Fingerprint"
        icon={Fingerprint}
        enabled={value.fingerprint.enabled}
        allSelected={allTrue(value.fingerprint, FINGERPRINT_FIELDS)}
        enabledError={fieldErrors['recipes.fingerprint.enabled']}
        onEnabledChange={(v) => updateFingerprint('enabled', v)}
        onSelectAll={selectAllFingerprint}
      >
        {FINGERPRINT_FIELDS.map((field) => (
          <div key={field}>
            <BooleanField
              id={`fingerprint-${field}`}
              label={field}
              checked={value.fingerprint[field]}
              onChange={(v) => updateFingerprint(field, v)}
            />
            <ErrorText message={fieldErrors[`recipes.fingerprint.${field}`]} />
          </div>
        ))}
      </RecipeSection>

      <RecipeSection
        title="Detection"
        icon={Radar}
        enabled={value.detection.enabled}
        allSelected={allTrue(value.detection, DETECTION_FIELDS)}
        enabledError={fieldErrors['recipes.detection.enabled']}
        onEnabledChange={(v) => updateDetection('enabled', v)}
        onSelectAll={selectAllDetection}
      >
        {DETECTION_FIELDS.map((field) => (
          <div key={field}>
            <BooleanField
              id={`detection-${field}`}
              label={field}
              checked={value.detection[field]}
              onChange={(v) => updateDetection(field, v)}
            />
            <ErrorText message={fieldErrors[`recipes.detection.${field}`]} />
          </div>
        ))}
      </RecipeSection>
    </div>
  );
}
