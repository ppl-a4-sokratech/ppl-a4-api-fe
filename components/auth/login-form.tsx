"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const session = await loginApi({
        username: username.trim(),
        password,
      });
      persistSession(session);
      router.replace(target);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to fetch");
    } finally {
      setSubmitting(false);
    }
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
      <Input
        name="password"
        aria-label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
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
