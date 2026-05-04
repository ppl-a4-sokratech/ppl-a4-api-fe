import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type BackLinkProps = Readonly<{
  href: string;
  children: React.ReactNode;
}>;

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
    >
      <ChevronLeft size={14} />
      {children}
    </Link>
  );
}
