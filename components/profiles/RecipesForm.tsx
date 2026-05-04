'use client';

import { Activity, Fingerprint, Radar } from 'lucide-react';
import type { IdentityProfileRecipes } from '@/lib/types/api';

type RecipesBehavioral = IdentityProfileRecipes['behavioral'];
type RecipesFingerprint = IdentityProfileRecipes['fingerprint'];
type RecipesDetection = IdentityProfileRecipes['detection'];
import ErrorText from '@/components/ui/ErrorText';

interface RecipesFormProps {
  value: IdentityProfileRecipes;
  onChange: (value: IdentityProfileRecipes) => void;
  fieldErrors?: Record<string, string>;
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-[#0a2540]' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function BooleanField({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 accent-[#0a2540]"
      />
      <span className="text-sm capitalize text-slate-700">{label}</span>
    </label>
  );
}

function RecipeSection({
  title,
  icon: Icon,
  enabled,
  enabledError,
  onEnabledChange,
  children,
}: {
  title: string;
  icon: typeof Activity;
  enabled: boolean;
  enabledError?: string;
  onEnabledChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
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

  return (
    <div className="flex flex-col gap-4">
      <RecipeSection
        title="Behavioral"
        icon={Activity}
        enabled={value.behavioral.enabled}
        enabledError={fieldErrors['recipes.behavioral.enabled']}
        onEnabledChange={(v) => updateBehavioral('enabled', v)}
      >
        {BEHAVIORAL_FIELDS.map((field) => (
          <div key={field}>
            <BooleanField
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
        enabledError={fieldErrors['recipes.fingerprint.enabled']}
        onEnabledChange={(v) => updateFingerprint('enabled', v)}
      >
        {FINGERPRINT_FIELDS.map((field) => (
          <div key={field}>
            <BooleanField
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
        enabledError={fieldErrors['recipes.detection.enabled']}
        onEnabledChange={(v) => updateDetection('enabled', v)}
      >
        {DETECTION_FIELDS.map((field) => (
          <div key={field}>
            <BooleanField
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
