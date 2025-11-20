import type { Metadata } from "next";

export const metadata:Metadata = {
  title: "Service Provider Dashboard – Jogaad India | Manage Jobs & Earnings",
  description:
    "Access your Service Provider Dashboard on Jogaad India. Manage assigned tasks, track job progress, update service status, view schedules, and monitor earnings in real time.",
  keywords: [
    "Jogaad India employee dashboard",
    "service provider control panel",
    "technician dashboard",
    "IT service provider dashboard",
    "field engineer panel",
    "job management dashboard",
    "service partner tools"
  ],
  openGraph: {
    title: "Service Provider Dashboard – Jogaad India",
    description:
      "A complete dashboard for service partners to manage job assignments, update service statuses, view daily schedules, and track earnings.",
    url: "https://jogaadindia.com/employee/dashboard",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Service Provider Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Service Provider Dashboard – Jogaad India",
    description:
      "Manage your tasks, schedules, updates, and earnings from one centralized provider panel.",
    images: "/opengl.png",
  },
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://jogaadindia.com/employee/dashboard",
  },
};


export default function EmployeeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      {children}
    </>
  );
}
