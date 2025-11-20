export const metadata = {
  title: "Our Services – Jogaad India | A-Z Services Across All Categories",
  description:
    "Explore all A-Z services offered by Jogaad India — from software development, IT services, legal services, childcare, cleaning, landscaping, catering, retail setup, maintenance, tailoring, public services, sports facilities, and more. Book trusted professionals anywhere in India.",
  keywords: [
    "Jogaad India services",
    "A-Z services India",
    "book services online India",
    "IT services India",
    "software development services",
    "home cleaning services India",
    "maintenance and repair services",
    "legal services India",
    "financial services India",
    "childcare services",
    "landscaping services India",
    "catering and event services",
    "retail service setup",
    "public services India",
    "sports facility construction",
    "custom tailoring services",
    "professional services marketplace",
    "service booking platform India"
  ],
  openGraph: {
    title: "Jogaad India – Complete A-Z Service Catalogue",
    description:
      "Browse Jogaad India's full list of services across IT, cleaning, maintenance, childcare, legal, financial, catering, landscaping, sports, retail, and more.",
    url: "https://jogaadindia.com/services",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jogaad India Services – Book Trusted Experts",
    description:
      "Find and book professionals for any service — software, legal, childcare, cleaning, catering, sports, retail, public services, and more.",
    images: "/opengl.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://jogaadindia.com/services",
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