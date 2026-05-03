"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { customerLogin } from "@/lib/api/customer";
import { ApiError } from "@/lib/types/api";
import { persistCustomerSession, readCustomerSession } from "@/lib/auth/session";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CustomerLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (readCustomerSession()) {
      router.replace(
        from && from.startsWith("/customer") ? from : "/customer/dashboard"
      );
    }
  }, [router, from]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const session = await customerLogin({
        username: username.trim(),
        password,
      });
      persistCustomerSession(session);
      router.replace(
        from && from.startsWith("/customer") ? from : "/customer/dashboard"
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to fetch");
      }
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
        Are you an admin?{" "}
        <Link
          href="/admin/login"
          className="font-medium text-brand-700 hover:underline"
        >
          Sign in here
        </Link>
      </p>
    </form>
  );
}

export default function CustomerLoginPage() {
  return (
    <AuthShell title="Sign in to your account">
      <Suspense
        fallback={
          <div className="h-32 animate-pulse rounded-lg bg-slate-100" />
        }
      >
        <CustomerLoginForm />
      </Suspense>
    </AuthShell>
  );
}
