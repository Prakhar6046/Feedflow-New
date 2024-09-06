import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";

// 1. Specify protected route patterns
const protectedRoutePattern = /^\/$|^\/dashboard($|\/.*)/;
const publicRoutes = ["/auth/login", "/auth/signup"];

export default async function middleware(req: NextRequest, res: NextResponse) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutePattern.test(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = getCookie("auth-token", { res, req });
  const session = cookie;

  // 4. Redirect to /auth/login if the user is not authenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && session && !path.startsWith("/dashboard/organisation")) {
    return NextResponse.redirect(
      new URL("/dashboard/organisation", req.nextUrl)
    );
  }

  // 6. Allow access to the route
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
