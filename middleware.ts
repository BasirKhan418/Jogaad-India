import { NextRequest, NextResponse } from "next/server";

function decodeJwtType(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // atob is available in Edge runtime
    // @ts-ignore
    const json = JSON.parse(atob(payload));
    return json?.type || null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Only gate login routes
  const loginRoutes: Record<string, string> = {
    "/signin": "user",
    "/admin/signin": "admin",
    "/employee/login": "employee",
    "/field-executive/login": "field-exec",
  };

  const matched = Object.entries(loginRoutes).find(([route]) => pathname.startsWith(route));
  if (!matched) return NextResponse.next();

  const [, requiredRole] = matched;

  if (!token) return NextResponse.next();

  const currentRole = decodeJwtType(token);
  if (!currentRole) return NextResponse.next();

  // Same role trying to login again: send to dashboard
  if (currentRole === requiredRole) {
    const url = req.nextUrl.clone();
    let dash = "/user/dashboard";
    if (currentRole === "admin") dash = "/admin/dashboard";
    else if (currentRole === "employee") dash = "/employee/dashboard";
    else if (currentRole === "field-exec") dash = "/field-executive/dashboard";
    url.pathname = dash;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Different role: ask user to logout on landing page
  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("logout_required", "1");
  url.searchParams.set("currentRole", currentRole);
  url.searchParams.set("targetRole", requiredRole);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/signin",
    "/admin/signin",
    "/employee/login",
    "/field-executive/login",
  ],
};
