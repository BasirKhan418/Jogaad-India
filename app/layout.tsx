import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import MaintenancePage from "@/components/down/down";
import { Preloader } from "@/components/ui/preloader";
import { Toaster } from "sonner";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { getAuthSession } from "@/utils/auth/getAuthSession";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jogaad India – A-Z Services for Everyone | Software to Home Services",
  description:
    "Jogaad India provides A-Z services across India — software development, home cleaning, maintenance, legal help, childcare, landscaping, catering, IT services, retail setup, and more.",
  keywords: [
    "Jogaad India",
    "A-Z services platform",
    "home services India",
    "software development services",
    "cleaning services India",
    "legal services India",
    "IT services India",
    "landscaping services",
    "childcare services",
    "retail setup services",
    "maintenance and repair services",
    "book services online India"
  ],
  openGraph: {
    title: "Jogaad India – A-Z Services at Your Fingertips",
    description:
      "From software to cleaning, legal, childcare, landscaping, and more — Jogaad India brings all services under one platform.",
    url: "https://jogaadindia.com",
    type: "website",
    images: [
      {
        url: "/openlg.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India – A-Z Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jogaad India – One Platform. Every Service.",
    description:
      "Your one-stop solution for all services: IT, home maintenance, legal, childcare, landscaping, retail, and more.",
    images: "/openlg.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://jogaadindia.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialAuth = await getAuthSession();
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased`}
        style={{ overflowX: 'hidden' }}
      >   
        <Toaster position="top-right" richColors />
        <Preloader />
        {/* <ConditionalLayout initialAuth={initialAuth}>
          
          {children}
        </ConditionalLayout> */}
        <MaintenancePage />

      </body>
    </html>
  );
}
