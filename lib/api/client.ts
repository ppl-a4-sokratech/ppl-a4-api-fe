import * as Sentry from "@sentry/nextjs";
import { ApiError, type ApiErrorBody } from "../types/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

const portalFromPath = (path: string): "admin" | "customer" | "public" => {
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/customer")) return "customer";
  return "public";
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const method = options.method ?? "GET";
  const portal = portalFromPath(path);

  return Sentry.startSpan(
    {
      name: `${method} ${path}`,
      op: "http.client",
      attributes: {
        "http.method": method,
        "api.path": path,
        "api.portal": portal,
        "api.authenticated": !!options.token,
      },
    },
    async (span) => {
      const headers: Record<string, string> = {
        Accept: "application/json",
        ...options.headers,
      };

      if (options.body !== undefined) {
        headers["Content-Type"] = "application/json";
      }

      if (options.token) {
        headers.Authorization = `Bearer ${options.token}`;
      }

      let response: Response;
      try {
        response = await fetch(`${API_BASE_URL}${path}`, {
          method,
          headers,
          body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
          signal: options.signal,
        });
      } catch {
        span.setStatus({ code: 2, message: "network_error" });
        Sentry.withScope((scope) => {
          scope.setTag("api.portal", portal);
          scope.setTag("api.path", path);
          scope.setTag("http.method", method);
          scope.setTag("error.type", "network");
          Sentry.captureException(new ApiError(0, null, "Failed to fetch"));
        });
        throw new ApiError(0, null, "Failed to fetch");
      }

      span.setAttribute("http.status_code", response.status);

      if (response.status === 204) {
        return undefined as T;
      }

      const text = await response.text();
      let parsed: unknown = null;
      if (text) {
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = null;
        }
      }

      if (!response.ok) {
        const errorBody = (parsed ?? null) as ApiErrorBody | null;
        const nestedMessage = (parsed as { error?: { message?: string } } | null)
          ?.error?.message;
        const rawError = errorBody?.error;
        const message = (() => {
          if (typeof rawError !== "string") return nestedMessage ?? `Request failed with status ${response.status}`;
          try {
            const zodErrors = JSON.parse(rawError);
            if (Array.isArray(zodErrors) && zodErrors.length > 0 && typeof zodErrors[0].message === "string") {
              return zodErrors[0].message;
            }
          } catch { /* not JSON, use as-is */ }
          return rawError;
        })();
        const apiError = new ApiError(response.status, errorBody, message);

        span.setStatus({ code: 2, message: "api_error" });
        Sentry.withScope((scope) => {
          scope.setTag("api.portal", portal);
          scope.setTag("api.path", path);
          scope.setTag("http.method", method);
          scope.setTag("http.status_code", String(response.status));
          scope.setTag("error.type", "api");
          Sentry.captureException(apiError);
        });

        throw apiError;
      }

      return parsed as T;
    }
  );
};
