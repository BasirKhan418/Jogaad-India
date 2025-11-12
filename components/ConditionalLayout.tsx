"use client";

import { usePathname } from "next/navigation";
import { NavbarDemo } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show navbar and footer on admin routes
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <NavbarDemo />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}
