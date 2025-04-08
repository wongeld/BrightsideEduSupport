import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    const authCookie = request.cookies.get("brightside_auth")?.value;

    if (!authCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Optional: You can verify token signature and expiration here too
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
