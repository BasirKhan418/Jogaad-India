import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Provider Dashboard - Jogaad India",
  description: "Service Provider dashboard for Jogaad India",
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
