import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const adminRoutes = ["/admin"];
const customerRoutes = ["/account", "/orders", "/wishlist", "/checkout"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isAdminRoute = adminRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isCustomerRoute = customerRoutes.some((route) => nextUrl.pathname.startsWith(route));

  if (isAdminRoute && session?.user && (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isCustomerRoute && !session?.user) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/orders/:path*", "/wishlist", "/checkout"]
};
