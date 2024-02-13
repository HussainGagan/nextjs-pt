import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authOptions } from "./utils/authOptions";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (
    request.nextUrl.pathname === "/register" ||
    request.nextUrl.pathname === "/login"
  ) {
    if (token) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }

  // Match dynamic route for product edit
  const urlPath = request.nextUrl.pathname;
  const isProductEditPage =
    urlPath.startsWith("/products/") && urlPath.endsWith("/edit");

  if (urlPath === "/products/add" || isProductEditPage) {
    const message = "You need to sign in before accessing this page";
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?message=${message}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/register", "/login", "/products/add", "/products/:id/edit"],
};
