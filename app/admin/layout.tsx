import type { Metadata } from "next";

export const metadata = {
  title: "Admin Dashboard – Jogaad India | Platform Management Console",
  description:
    "Jogaad India Admin Dashboard: Manage bookings, services, categories, employees, customers, payments, analytics, and platform operations from a single unified panel.",
  keywords: [
    "Jogaad India admin dashboard",
    "admin panel",
    "service management dashboard",
    "platform management",
    "admin home page"
  ],
  openGraph: {
    title: "Admin Dashboard – Jogaad India",
    description:
      "The official admin panel to manage all operations — services, bookings, employees, payments, and analytics.",
    url: "https://jogaadindia.com/admin",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Admin Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Dashboard – Jogaad India",
    description:
      "Access administrative tools and manage everything in one place.",
    images: "/opengl.png",
  },
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://jogaadindia.com/admin",
  },
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
