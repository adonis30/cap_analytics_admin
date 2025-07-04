import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// i18n middleware instance
const intlMiddleware = createMiddleware(routing);

// Routes to protect
const protectedRoutes = ["/dashboard", "/admin", "/profile"];
const publicRoutes = ["/login", "/signup"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Extract the locale (e.g., /en/dashboard -> locale = en)
  const segments = pathname.split("/");
  const locale = segments[1];
  const pathWithoutLocale = "/" + segments.slice(2).join("/");

  const isProtected = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  const isPublic = publicRoutes.includes(pathWithoutLocale);

  if (isProtected && !token) {
    if (!isPublic) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
