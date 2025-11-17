import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard - Jogaad India",
  description: "User dashboard for Jogaad India",
};

export default function UserLayout({
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
