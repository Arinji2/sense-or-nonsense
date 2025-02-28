import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
const UNPROTECTED_PATHS = ["/", "/credits"];

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/error") {
    const code = request.nextUrl.searchParams.get("code");
    const response = NextResponse.redirect(new URL("/", request.url));
    if (code === "0") {
      response.cookies.delete("guest-session");
    }
    return response;
  }

  if (!UNPROTECTED_PATHS.includes(request.nextUrl.pathname)) {
    const guestCookie = cookies().get("guest-session");
    const userCookie = cookies().get("user");

    if (!guestCookie && !userCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
