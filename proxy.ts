import { NextResponse, type NextRequest } from "next/server";

const ADMIN_TOKEN_COOKIE = "admin_token";
const CUSTOMER_TOKEN_COOKIE = "customer_token";

export const proxy = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login") || pathname.startsWith("/customer/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/customer")) {
    const token = req.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/customer/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"],
};
