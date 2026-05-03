import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-600/60",
  secondary:
    "bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 disabled:opacity-60",
  ghost:
    "bg-transparent text-brand-700 hover:bg-brand-50 disabled:opacity-60",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/60",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
};

export const Button = ({
  variant = "primary",
  size = "md",
  loading,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) => (
  <button
    {...rest}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
  >
    {loading ? (
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    ) : null}
    {children}
  </button>
);
