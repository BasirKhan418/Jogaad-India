export const metadata = {
  title: "Blog – Jogaad India | Tips, Guides & Service Insights",
  description:
    "Explore expert tips on home services, software development, legal guidance, childcare, maintenance, landscaping, and more at Jogaad India Blog.",
  keywords: [
    "Jogaad India blog",
    "service tips India",
    "home maintenance blog",
    "IT service insights",
    "legal service articles",
    "childcare blog",
    "cleaning & repair guides"
  ],
  openGraph: {
    title: "Jogaad India Blog – Service Guides & Expert Advice",
    description:
      "Your source for expert insights on A-Z services: IT, home care, legal, childcare, and more.",
    url: "https://jogaadindia.com/blog",
    type: "article",
    images: [
      {
        url: "/openlg.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jogaad India Blog",
    description:
      "Learn from industry experts across IT, maintenance, home care, legal, and more.",
    images: "/openlg.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://jogaadindia.com/blog",
  },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
