"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearCustomerSession, useCustomerSession } from "@/lib/auth/session";
import { ApiError } from "@/lib/types/api";

export type ResourceState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; message: string };

export function useCustomerResource<T>(fetcher: (token: string) => Promise<T>) {
  const router = useRouter();
  const session = useCustomerSession();
  const abortRef = useRef<AbortController | null>(null);
  const [state, setState] = useState<ResourceState<T>>({ status: "loading" });

  const handleFailure = useCallback(
    (err: unknown, ctrl: AbortController) => {
      if (ctrl.signal.aborted) return;
      if (err instanceof ApiError) {
        if (err.status === 401) {
          clearCustomerSession();
          router.replace("/customer/login");
          return;
        }
        setState({ status: "error", message: err.message });
        return;
      }
      setState({ status: "error", message: "Failed to load" });
    },
    [router]
  );

  const startRequest = useCallback(
    (token: string, ctrl: AbortController) => {
      fetcher(token)
        .then((data) => {
          if (!ctrl.signal.aborted) setState({ status: "ready", data });
        })
        .catch((err: unknown) => handleFailure(err, ctrl));
    },
    [fetcher, handleFailure]
  );

  useEffect(() => {
    if (!session.ready || !session.token) return;
    abortRef.current?.abort();

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    startRequest(session.token, ctrl);

    return () => abortRef.current?.abort();
  }, [session.ready, session.token, startRequest]);

  const reload = useCallback(() => {
    if (!session.ready || !session.token) return;
    abortRef.current?.abort();

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState({ status: "loading" });
    startRequest(session.token, ctrl);
  }, [session.ready, session.token, startRequest]);

  return { state, reload, token: session.token };
}
