import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Jogaad India",
  description: "Admin dashboard for Jogaad India",
};

export default function AdminLayout({
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
