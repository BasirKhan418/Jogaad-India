import type { Metadata } from "next";

export const metadata = {
  title: "Employee Dashboard – Jogaad India | Manage Jobs & Earnings",
  description:
    "Access your Employee Dashboard on Jogaad India. View assigned jobs, update service status, track daily tasks, manage schedules, and monitor your earnings securely.",
  keywords: [
    "Jogaad India employee dashboard",
    "service engineer dashboard",
    "technician panel",
    "employee job management",
    "field executive dashboard",
    "worker dashboard India"
  ],
  openGraph: {
    title: "Employee Dashboard – Jogaad India",
    description:
      "Manage all your assigned jobs, service updates, schedules, and earnings in one unified employee workspace.",
    url: "https://jogaadindia.com/field-executive/dashboard",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Employee Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Dashboard – Jogaad India",
    description:
      "Track bookings, manage service jobs, update statuses, and view your earnings.",
    images: "/opengl.png",
  },
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://jogaadindia.com/field-executive/dashboard",
  },
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
