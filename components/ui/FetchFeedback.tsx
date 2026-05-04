import { Card, CardBody } from '@/components/ui/card';

type ErrorCardProps = Readonly<{ message: string }>;

export function ErrorCard({ message }: ErrorCardProps) {
  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardBody>
        <p className="text-sm text-red-700">{message}</p>
      </CardBody>
    </Card>
  );
}

export function LoadingText() {
  return <p className="text-sm text-slate-500">Loading…</p>;
}
