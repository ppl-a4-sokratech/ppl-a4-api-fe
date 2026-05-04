import { Card, CardBody } from "@/components/ui/card";

export default function WorkflowsPlaceholderPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Workflow</h1>
        <p className="text-sm text-slate-500">Manage your workflows.</p>
      </div>
      <Card>
        <CardBody>
          <p className="text-sm text-slate-500">
            Workflow management is coming soon.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
