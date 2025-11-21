export const metadata = {
  title: "Admin Login – Jogaad India | Secure Admin Access",
  description:
    "Access the Jogaad India admin portal. Secure login for authorized administrators to manage services, bookings, users, employees, and platform operations.",
  keywords: [
    "Jogaad India admin login",
    "admin portal login",
    "admin authentication",
    "Jogaad dashboard login",
    "admin secure access"
  ],
  openGraph: {
    title: "Admin Login – Jogaad India",
    description:
      "Secure portal login for Jogaad India administrators to manage platform operations.",
    url: "https://jogaadindia.com/admin/signin",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Admin Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Login – Jogaad India",
    description:
      "Authorized admin access to manage backend operations and service workflows.",
    images: "/opengl.png",
  },
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://jogaadindia.com/admin/signin",
  },
};
 export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}