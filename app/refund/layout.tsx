export const metadata = {
  title: "Refund & Cancellation Policy – Jogaad India",
  description:
    "View Jogaad India’s refund and cancellation policies for all services including IT work, cleaning, maintenance, legal services, childcare, and more.",
  keywords: [
    "Jogaad India refund policy",
    "cancellation policy",
    "service refund rules",
    "booking cancellation India"
  ],
  openGraph: {
    title: "Refund Policy – Jogaad India",
    description:
      "Understand our refund and cancellation process for all service bookings.",
    url: "https://jogaadindia.com/refund",
    type: "website",
    images: [
      {
        url: "/openlg.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Refund Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy – Jogaad India",
    description:
      "Learn about our transparent refund and cancellation terms.",
    images: "/openlg.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://jogaadindia.com/refund",
  },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}