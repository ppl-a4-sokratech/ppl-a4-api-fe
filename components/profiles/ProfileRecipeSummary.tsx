import { Card, CardBody, CardHeader } from "@/components/ui/card";
import type { IdentityProfileRecipes } from "@/lib/types/api";

type RecipeFields = Record<string, boolean>;

type RecipeGroupProps = Readonly<{
  title: string;
  enabled: boolean;
  fields: RecipeFields;
}>;

function withoutEnabled(group: Record<string, boolean>) {
  return Object.fromEntries(
    Object.entries(group).filter(([key]) => key !== "enabled")
  ) as RecipeFields;
}

function RecipeGroup({ title, enabled, fields }: RecipeGroupProps) {
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
          {Object.entries(fields).map(([key, val]) => (
            <span
              key={key}
              className={`rounded-full border px-2 py-0.5 text-xs ${
                val
                  ? "border-slate-300 bg-slate-50 text-slate-700"
                  : "border-slate-200 text-slate-400"
              }`}
            >
              {val ? "✓" : "✗"} {key}
            </span>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export function ProfileRecipeSummary({ recipes }: { recipes: IdentityProfileRecipes }) {
  const groups = [
    { title: "Behavioral", value: recipes.behavioral },
    { title: "Fingerprint", value: recipes.fingerprint },
    { title: "Detection", value: recipes.detection },
  ];

  return (
    <div className="flex flex-col gap-4">
      {groups.map(({ title, value }) => (
        <RecipeGroup
          key={title}
          title={title}
          enabled={value.enabled}
          fields={withoutEnabled(value)}
        />
      ))}
    </div>
  );
}
