"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const PasswordInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        name="password"
        aria-label="Password"
        type={show ? "text" : "password"}
        autoComplete="current-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Password"
        required
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Credentials = { username: string; password: string };

type LoginFormProps<TSession> = {
  loginApi: (input: Credentials) => Promise<TSession>;
  persistSession: (session: TSession) => void;
  hasExistingSession: () => unknown;
  scope: string;
  defaultRedirect: string;
  crossLink: { label: string; href: string; cta: string };
};

export function LoginForm<TSession>({
  loginApi,
  persistSession,
  hasExistingSession,
  scope,
  defaultRedirect,
  crossLink,
}: LoginFormProps<TSession>) {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from");
  const target = from && from.startsWith(scope) ? from : defaultRedirect;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasExistingSession()) {
      router.replace(target);
    }
  }, [router, target, hasExistingSession]);

  const portal = scope.replace(/^\//, "") || "public";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    setSubmitting(true);

    await Sentry.startSpan(
      {
        name: `auth.login.${portal}`,
        op: "auth.login",
        attributes: {
          "auth.portal": portal,
          "auth.username_provided": true,
        },
      },
      async (span) => {
        try {
          const session = await loginApi({
            username: username.trim(),
            password,
          });
          persistSession(session);

          Sentry.setUser({
            username: username.trim(),
            segment: portal,
          });
          Sentry.addBreadcrumb({
            category: "auth",
            message: `Login success (${portal})`,
            level: "info",
          });

          Sentry.getCurrentScope().setTag("auth.success", "true");
          router.replace(target);
        } catch (err) {
          const status = err instanceof ApiError ? err.status : 0;
          const message = err instanceof ApiError ? err.message : "Failed to fetch";

          Sentry.getCurrentScope().setTag("auth.success", "false");
          Sentry.getCurrentScope().setTag("auth.failure_status", String(status));

          Sentry.addBreadcrumb({
            category: "auth",
            message: `Login failed (${portal}): ${message}`,
            level: "warning",
            data: { status },
          });

          setError(message);
        } finally {
          setSubmitting(false);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        name="username"
        aria-label="Username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        autoFocus
      />
      <PasswordInput value={password} onChange={setPassword} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" loading={submitting} className="w-full">
        Sign in
      </Button>
      <p className="text-center text-xs text-slate-500">
        {crossLink.label}{" "}
        <Link
          href={crossLink.href}
          className="font-medium text-brand-700 hover:underline"
        >
          {crossLink.cta}
        </Link>
      </p>
    </form>
  );
}
