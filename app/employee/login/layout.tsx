export const metadata = {
  title: "Service Provider Login – Jogaad India | Login for Engineers & Professionals",
  description:
    "Log in to your Jogaad India service provider account. Designed for IT experts, service engineers, technicians, cleaners, electricians, plumbers, legal advisors, childcare professionals, caterers, and all service partners.",
  keywords: [
    "Jogaad India service provider login",
    "login for service engineers",
    "technician login",
    "IT professional login",
    "service partner login",
    "provider portal Jogaad India",
    "vendor login India",
    "cleaning staff login",
    "electrician login",
    "plumber login",
    "service worker login"
  ],
  openGraph: {
    title: "Service Provider Login – Jogaad India",
    description:
      "Secure login for IT professionals, service engineers, technicians, maintenance experts, childcare workers, and all Jogaad India service partners.",
    url: "https://jogaadindia.com/employee/login",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Service Provider Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Service Provider Login – Jogaad India",
    description:
      "Log in to manage service requests, job assignments, schedules, and earnings.",
    images: "/opengl.png",
  },
  robots: "noindex, follow",
  alternates: {
    canonical: "https://jogaadindia.com/employee/login",
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