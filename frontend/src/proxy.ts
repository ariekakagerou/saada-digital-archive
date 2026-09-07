import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route Guard Proxy — SAADA
 * Semua halaman kecuali yang di-whitelist akan redirect ke /login
 * jika tidak ada sesi user yang valid di cookie/header.
 */

// Halaman yang boleh diakses TANPA login
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/contact-it",
  "/terms",
  "/privacy",
  "/check",
  "/",          // splash screen
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Cek apakah route ini boleh diakses publik
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  console.log(`[Proxy Log] pathname: ${pathname}, isPublic: ${isPublic}`);

  // Lewati semua static file dan Next.js internal route
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isPublic) {
    return NextResponse.next();
  }

  // Cek token dari cookie (lebih aman dari localStorage)
  const token = request.cookies.get("saada_token")?.value;

  // Fallback: cek dari custom header (opsional, untuk kompatibilitas)
  const authHeader = request.headers.get("x-saada-auth");

  if (!token && !authHeader) {
    // Redirect ke login jika tidak ada sesi
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // simpan tujuan semula
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Jalankan proxy di semua route kecuali static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
