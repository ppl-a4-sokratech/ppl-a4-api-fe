import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = ({
  label,
  hint,
  error,
  id,
  className = "",
  ...rest
}: InputProps) => {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        {...rest}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
          label ? "placeholder:text-slate-400" : "placeholder:text-slate-500"
        } ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-slate-200 focus:border-brand-500 focus:ring-brand-100"
        } ${className}`}
      />
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
};
