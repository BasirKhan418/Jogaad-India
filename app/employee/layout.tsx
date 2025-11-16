import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee Dashboard - Jogaad India",
  description: "Employee dashboard for Jogaad India",
};

export default function EmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
