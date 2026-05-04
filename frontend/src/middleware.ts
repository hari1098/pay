import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { Role } from "@/lib/enum/roles.enum";

const ADMIN_ROLES = [Role.SUPER_ADMIN, Role.EDITOR, Role.REVIEWER];

async function verifyJWT(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload;
  } catch (e) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const secret = process.env.JWT_SECRET!;

  if (req.nextUrl.pathname === "/logout") {
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("token");
    return response;
  }

  if (
    !token &&
    (req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/mgmt/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && req.nextUrl.pathname.startsWith("/search")) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/" && !token) {
    return NextResponse.next();
  }

  if (token) {
    const payload = await verifyJWT(token, secret);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("token");
      return response;
    }

    const role = payload.role as Role;
    const phoneVerified = payload.phone_verified as boolean;

    if (req.nextUrl.pathname === "/verify-otp") {
      return NextResponse.next();
    }

    if (
      !phoneVerified &&
      role !== Role.VIEWER &&
      (req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/search") ||
        req.nextUrl.pathname.startsWith("/mgmt/dashboard"))
    ) {
      return NextResponse.redirect(new URL("/verify-otp", req.url));
    }

    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/search", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/mgmt/dashboard")) {
      if (!ADMIN_ROLES.includes(role)) {
        if (role === Role.USER) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        } else if (role === Role.VIEWER) {
          return NextResponse.redirect(new URL("/search", req.url));
        } else {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }

    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (role !== Role.USER) {
        if (role === Role.VIEWER) {
          return NextResponse.redirect(new URL("/search", req.url));
        } else if (ADMIN_ROLES.includes(role)) {
          return NextResponse.redirect(new URL("/mgmt/dashboard", req.url));
        } else {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/mgmt/dashboard/:path*",
    "/dashboard/:path*",
    "/verify-otp",
    "/:path*",
  ],
};
