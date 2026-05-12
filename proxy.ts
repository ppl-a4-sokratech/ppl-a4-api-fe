import { NextResponse, type NextRequest } from "next/server";

const ADMIN_TOKEN_COOKIE = "admin_token";
const CUSTOMER_TOKEN_COOKIE = "customer_token";

const buildCsp = (nonce: string) => {
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval'`
      : `script-src 'self' 'nonce-${nonce}'`;

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' https://*.ingest.us.sentry.io https://*.sentry.io",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
};

export const proxy = (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const isAdminProtected =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  if (isAdminProtected) {
    const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      const redirect = NextResponse.redirect(url);
      redirect.headers.set("Content-Security-Policy", csp);
      return redirect;
    }
  }

  const isCustomerProtected =
    pathname.startsWith("/customer") && !pathname.startsWith("/customer/login");
  if (isCustomerProtected) {
    const token = req.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/customer/login";
      url.searchParams.set("from", pathname);
      const redirect = NextResponse.redirect(url);
      redirect.headers.set("Content-Security-Policy", csp);
      return redirect;
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);
  return response;
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
