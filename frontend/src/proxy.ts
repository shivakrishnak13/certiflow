import { NextResponse, type NextRequest } from "next/server";

import { routes } from "@/config/routes";
import { COOKIES } from "@/types";

const publicRoutes = [routes.auth.signIn, routes.auth.signUp];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has(COOKIES.TOKEN);
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(routes.auth.signIn, request.url));
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL(routes.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
