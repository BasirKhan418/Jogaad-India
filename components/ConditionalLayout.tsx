"use client";

import { usePathname } from "next/navigation";
import { NavbarDemo } from "@/components/navbar";
import { Footer } from "@/components/footer";
import type { AuthSession } from "@/utils/auth/getAuthSession";
import { RoleConflictBanner } from "@/components/role-conflict-banner";

export function ConditionalLayout({ children, initialAuth }: { children: React.ReactNode; initialAuth?: AuthSession }) {
  const pathname = usePathname();
  
  const isAdminRoute = pathname?.startsWith("/admin");
  const isEmployeeRoute = pathname?.startsWith("/employee");
  const isFieldExecRoute = pathname?.startsWith("/field-executive");
  const isUserRoute = pathname?.startsWith("/user");

  return (
    <>
      {!isAdminRoute && !isEmployeeRoute && !isFieldExecRoute && !isUserRoute && <RoleConflictBanner />}
      {!isAdminRoute && !isEmployeeRoute && !isFieldExecRoute && !isUserRoute && <NavbarDemo initialAuth={initialAuth} />}
      {children}
      {!isAdminRoute && !isEmployeeRoute && !isFieldExecRoute && !isUserRoute && <Footer />}
    </>
  );
}
