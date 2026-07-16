import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "iqrar_admin_session";
const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret-change-me-in-.env"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (!isAdminRoute && !isAdminApi) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  let valid = false;

  if (token) {
    try {
      await jwtVerify(token, secretKey);
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (valid) {
    // Already logged in and hitting /admin/login -> bounce to dashboard
    if (isLoginPage) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  // Not authenticated
  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
