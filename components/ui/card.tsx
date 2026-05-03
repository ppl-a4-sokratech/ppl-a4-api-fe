import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const Card = ({ className = "", children, ...rest }: CardProps) => (
  <div
    {...rest}
    className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = "", children }: CardProps) => (
  <div className={`border-b border-slate-100 px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ className = "", children }: CardProps) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);
