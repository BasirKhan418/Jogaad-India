export const metadata = {
  title: "Cookies Policy – Jogaad India",
  description:
    "Read the Cookies Policy of Jogaad India to understand how we use cookies to enhance user experience, analyze platform performance, and provide secure and personalized services.",
  keywords: [
    "Jogaad India cookies policy",
    "cookies usage",
    "website cookies India",
    "service platform cookies",
    "data tracking policy",
    "privacy and cookies India"
  ],
  openGraph: {
    title: "Cookies Policy – Jogaad India",
    description:
      "Learn how Jogaad India uses cookies to ensure a secure, smooth, and personalized service experience.",
    url: "https://jogaadindia.com/cookies",
    type: "website",
    images: [
      {
        url: "/openlg.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Cookies Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookies Policy – Jogaad India",
    description:
      "Understand how cookies help us improve user experience and service quality.",
    images: "/openlg.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://jogaadindia.com/cookies",
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
