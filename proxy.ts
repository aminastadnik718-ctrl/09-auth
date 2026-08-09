import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];

const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken");
  const refreshToken = cookieStore.get("refreshToken");

  let isAuthenticated = Boolean(accessToken);

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      if (sessionResponse.data.success) {
        isAuthenticated = true;

        const response = NextResponse.next();

        const setCookie = sessionResponse.headers["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookie of cookieArray) {
            response.headers.append("set-cookie", cookie);
          }
        }

        if (isPublicRoute) {
          return NextResponse.redirect(
            new URL("/", request.url),
          );
        }

        return response;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url),
    );
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(
      new URL("/", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
  ],
};