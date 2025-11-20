import type { Metadata } from "next";

export const metadata = {
  title: "Your Dashboard – Jogaad India | Manage Bookings & Services",
  description:
    "Access your Jogaad India User Dashboard to manage bookings, track service status, view payments, update your profile, and explore A-Z services including IT, cleaning, childcare, legal, maintenance, and more.",
  keywords: [
    "Jogaad India user dashboard",
    "service booking dashboard",
    "user account panel",
    "track service bookings",
    "manage service history",
    "user portal Jogaad India",
    "customer dashboard India"
  ],
  openGraph: {
    title: "User Dashboard – Jogaad India",
    description:
      "Manage your bookings, track service progress, view payment history, and update personal details—all from your centralized user dashboard.",
    url: "https://jogaadindia.com/user/dashboard",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India User Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "User Dashboard – Jogaad India",
    description:
      "View and manage your service bookings, history, payments, reviews, and account settings.",
    images: "/opengl.png",
  },
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://jogaadindia.com/user/dashboard",
  },
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
