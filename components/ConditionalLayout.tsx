"use client";

import { usePathname } from "next/navigation";
import { NavbarDemo } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAdminRoute = pathname?.startsWith("/admin");
  const isEmployeeRoute = pathname?.startsWith("/employee");
  const isFieldExecRoute = pathname?.startsWith("/field-executive");
  const isUserRoute = pathname?.startsWith("/user");

  return (
    <>
      {!isAdminRoute && !isEmployeeRoute && !isFieldExecRoute && !isUserRoute && <NavbarDemo />}
      {children}
      {!isAdminRoute && !isEmployeeRoute && !isFieldExecRoute && !isUserRoute && <Footer />}
    </>
  );
}
