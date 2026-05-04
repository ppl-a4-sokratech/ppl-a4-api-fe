"use client";

import { customerLogin } from "@/lib/api/customer";
import {
  persistCustomerSession,
  readCustomerSession,
} from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";
import { LoginPageScaffold } from "@/components/auth/login-page-scaffold";

export default function CustomerLoginPage() {
  return (
    <LoginPageScaffold title="Sign in to your account">
      <LoginForm
        loginApi={customerLogin}
        persistSession={persistCustomerSession}
        hasExistingSession={readCustomerSession}
        scope="/customer"
        defaultRedirect="/customer/dashboard"
        crossLink={{
          label: "Are you an admin?",
          href: "/admin/login",
          cta: "Sign in here",
        }}
      />
    </LoginPageScaffold>
  );
}
