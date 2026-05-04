import Link from "next/link";

type ActionLinkProps = Readonly<{
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "primary" | "outline";
}>;

const styles = {
  primary:
    "inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white transition-colors hover:bg-brand-700",
  outline:
    "flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50",
};

export function ActionLink({
  href,
  icon,
  children,
  variant = "outline",
}: ActionLinkProps) {
  return (
    <Link href={href} className={styles[variant]}>
      {icon}
      {children}
    </Link>
  );
}
