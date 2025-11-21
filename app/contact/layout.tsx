export const metadata = {
  title: "Contact Us – Jogaad India | Reach Our Support Team",
  description:
    "Need help with booking, services, or inquiries? Contact Jogaad India for support across IT, cleaning, maintenance, childcare, legal, and more.",
  keywords: [
    "Jogaad India contact",
    "contact service provider",
    "customer support India",
    "service booking help",
    "IT services contact",
    "home maintenance support"
  ],
  openGraph: {
    title: "Contact Jogaad India",
    description:
      "Reach out to our support team for any service inquiries, bookings, or assistance.",
    url: "https://jogaadindia.com/contact",
    type: "website",
    images: [
      {
        url: "/openlg.png",
        width: 1200,
        height: 630,
        alt: "Contact Jogaad India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Jogaad India",
    description: "We're here to help with all your service needs.",
    images: "/openlg.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://jogaadindia.com/contact",
  },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
