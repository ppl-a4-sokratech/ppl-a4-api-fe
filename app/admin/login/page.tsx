"use client";

import { adminLogin } from "@/lib/api/admin";
import { persistAdminSession, readAdminSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";
import { LoginPageScaffold } from "@/components/auth/login-page-scaffold";

export default function AdminLoginPage() {
  return (
    <LoginPageScaffold title="Sign in to admin portal">
      <LoginForm
        loginApi={adminLogin}
        persistSession={persistAdminSession}
        hasExistingSession={readAdminSession}
        scope="/admin"
        defaultRedirect="/admin/dashboard"
        crossLink={{
          label: "Are you a customer?",
          href: "/customer/login",
          cta: "Sign in here",
        }}
      />
    </LoginPageScaffold>
  );
}
