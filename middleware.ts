import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";

// 1. Specify protected and public routes
const protectedRoutes = ["/", "/dashboard", "/dashboard/organisation"];
const publicRoutes = ["/auth/login", "/auth/signup"];

export default async function middleware(req: NextRequest, res: NextResponse) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = getCookie("auth-token", { res, req });
  const session = cookie;

  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  // 6. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session &&
    !req.nextUrl.pathname.startsWith("/dashboard/organisation")
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/organisation", req.nextUrl)
    );
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
