import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { IdentityProfileRecipes } from "@/lib/types/api";

const BEHAVIORAL_FIELDS = ['touch', 'drag', 'scroll', 'lifecycle', 'input', 'sensor'] as const;
const FINGERPRINT_FIELDS = ['audio', 'canvas', 'graphics', 'fonts', 'device', 'screen'] as const;
const DETECTION_FIELDS = ['emulator', 'webDriver'] as const;

type RecipeGroupProps = Readonly<{
  title: string;
  enabled: boolean;
  fields: readonly string[];
  values: Record<string, boolean>;
}>;

function RecipeGroup({ title, enabled, fields, values }: RecipeGroupProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800">{title}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              enabled ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-wrap gap-2">
          {fields.map((key) => (
            <span
              key={key}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                values[key]
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-500 ring-1 ring-slate-300"
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  values[key] ? "bg-white/70" : "bg-slate-300"
                }`}
              />
              {key}
            </span>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export function ProfileRecipeSummary({ recipes }: Readonly<{ recipes: IdentityProfileRecipes }>) {
  const groups = [
    { title: "Behavioral", value: recipes.behavioral, fields: BEHAVIORAL_FIELDS },
    { title: "Fingerprint", value: recipes.fingerprint, fields: FINGERPRINT_FIELDS },
    { title: "Detection", value: recipes.detection, fields: DETECTION_FIELDS },
  ];

  return (
    <div className="flex flex-col gap-4">
      {groups.map(({ title, value, fields }) => (
        <RecipeGroup
          key={title}
          title={title}
          enabled={value.enabled}
          fields={fields}
          values={value}
        />
      ))}
    </div>
  );
}
