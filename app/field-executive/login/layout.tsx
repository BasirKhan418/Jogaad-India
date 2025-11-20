export const metadata = {
  title: "Employee Login – Jogaad India | Secure Access for Field Executives",
  description:
    "Log in to your Jogaad India employee account to manage job assignments, service updates, bookings, and daily tasks. Secure employee access for field executives and service providers.",
  keywords: [
    "Jogaad India employee login",
    "employee portal login",
    "Jogaad India staff login",
    "field executive login",
    "service provider login",
    "technician login"
  ],
  openGraph: {
    title: "Employee Login – Jogaad India",
    description:
      "Access your employee dashboard to manage service tasks, bookings, status updates, and schedules.",
    url: "https://jogaadindia.com/field-executive/login",
    type: "website",
    images: [
      {
        url: "/employee-login-og.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Employee Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Login – Jogaad India",
    description: "Secure login for technicians, staff, and field executives.",
    images: "/opengl.png",
  },
  robots: "noindex, follow",
  alternates: {
    canonical: "https://jogaadindia.com/field-executive/login",
  },
};
export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (    <html lang="en">
      <body>{children}</body>
    </html>
  );
}