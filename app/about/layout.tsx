export const metadata = {
  title: "About Us – Jogaad India | India’s A-Z Multi-Service Platform",
  description:
    "Learn about Jogaad India, an all-in-one platform offering services from home cleaning to software development, legal support, childcare, landscaping, and more.",
  keywords: [
    "About Jogaad India",
    "A-Z service platform India",
    "Jogaad India mission",
    "service provider marketplace",
    "full-service platform India"
  ],
  openGraph: {
    title: "About Jogaad India – A-Z Service Ecosystem",
    description:
      "Know our mission to simplify access to every service — technology, home care, legal, financial, childcare, and maintenance.",
    url: "https://jogaadindia.com/about",
    type: "website",
    images: [
      {
        url: "/openlg.png",
        width: 1200,
        height: 630,
        alt: "About Jogaad India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Jogaad India",
    description:
      "Discover our journey to build India’s most versatile service marketplace.",
    images: "/openlg.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://jogaadindia.com/about",
  },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}