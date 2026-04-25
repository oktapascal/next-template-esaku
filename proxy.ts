/**
 * @fileoverview Proxy untuk mengatur akses halaman.
 * @location proxy.ts
 * @description Memeriksa cookie untuk autentikasi.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isSessionCookieValid } from "@/src/app/services/authCookies";
import { SESSION_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/src/app/services/authService";

const PUBLIC_PATHS = ["/login", "/register"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((route) => pathname.startsWith(route));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const refreshCookie = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const sessionCookie = accessCookie ?? refreshCookie;
  const isAuthenticated = await isSessionCookieValid(sessionCookie);

  if (isPublicPath(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
