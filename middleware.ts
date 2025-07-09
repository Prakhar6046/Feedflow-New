import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutePattern = /^\/dashboard($|\/.*)/;
const publicRoutes = ["/auth/login", "/auth/signup"];

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = protectedRoutePattern.test(path);
  const isPublic = publicRoutes.includes(path);

  const refreshToken = cookies().get("refresh-token")?.value;

  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isPublic && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard/organisation", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
