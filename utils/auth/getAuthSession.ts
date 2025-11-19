import { cookies } from "next/headers";

export type SessionUser = {
  name: string;
  email: string;
  img?: string;
  phone?: string;
  type: "admin" | "user" | "employee" | "field-exec";
  isSuperAdmin?: boolean;
};

export type AuthSession = {
  isAuthenticated: boolean;
  user: SessionUser | null;
};

export async function getAuthSession(): Promise<AuthSession> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const res = await fetch(`/api/v1/getdata`, {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
      },
      // credentials are inferred when cookie header is present
    });

    const data = await res.json();
    if (data?.success && data?.data) {
      const u = data.data;
      return {
        isAuthenticated: true,
        user: {
          name: u.name,
          email: u.email,
          img: u.img,
          phone: u.phone,
          type: u.type,
          isSuperAdmin: u.isSuperAdmin ?? false,
        },
      };
    }
  } catch {
    // ignore and fall through
  }

  return { isAuthenticated: false, user: null };
}
