import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Executive Dashboard - Jogaad India",
  description: "Field executive dashboard for Jogaad India",
};

export default function FieldExecutiveLayout({
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
