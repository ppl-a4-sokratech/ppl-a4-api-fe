"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setupCustomer } from "@/lib/api/admin";
import { ApiError, type CustomerRecord } from "@/lib/types/api";
import { useAdminSession } from "@/lib/auth/session";

export default function NewCustomerPage() {
  const session = useAdminSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [created, setCreated] = useState<CustomerRecord | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsernameError(null);
    setPasswordError(null);
    setGeneralError(null);
    setCreated(null);

    if (!username.trim()) {
      setUsernameError("Username is required.");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (!session.token) {
      setGeneralError("Your admin session expired. Please sign in again.");
      return;
    }

    setSubmitting(true);
    try {
      const customer = await setupCustomer(session.token, {
        username: username.trim(),
        password,
      });
      setCreated(customer);
      setUsername("");
      setPassword("");
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = err.message;
        if (/username already exists/i.test(msg)) {
          setUsernameError(msg);
        } else if (/password/i.test(msg)) {
          setPasswordError(msg);
        } else if (err.status === 401) {
          setGeneralError("Your admin session expired. Please sign in again.");
        } else {
          setGeneralError(msg);
        }
      } else {
        setGeneralError("Failed to fetch");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Register Customer
          </h1>
          <p className="text-sm text-slate-500">
            Create a new customer account for the Sokratech control plane.
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-slate-900">
            Customer credentials
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="username"
              label="Username"
              placeholder="e.g. acme"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameError ?? undefined}
              hint="Will be stored lower-cased."
              required
            />
            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError ?? undefined}
              required
              minLength={8}
            />
            {generalError ? (
              <p className="text-sm text-red-600">{generalError}</p>
            ) : null}
            <div className="flex items-center gap-3">
              <Button type="submit" loading={submitting}>
                Create customer
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setUsername("");
                  setPassword("");
                  setUsernameError(null);
                  setPasswordError(null);
                  setGeneralError(null);
                  setCreated(null);
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {created ? (
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardBody>
            <h3 className="text-sm font-semibold text-emerald-900">
              Customer created successfully
            </h3>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Customer ID</dt>
                <dd className="font-medium text-slate-900">
                  {created.customerId}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Username</dt>
                <dd className="font-medium text-slate-900">
                  {created.username}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Created at</dt>
                <dd className="font-medium text-slate-900">
                  {new Date(created.createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
