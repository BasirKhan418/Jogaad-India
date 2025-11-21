export const metadata = {
  title: "Privacy Policy – Jogaad India",
  description:
    "Read the Privacy Policy of Jogaad India to understand how we collect, use, and protect your information across our A-Z service platform.",
  keywords: [
    "Jogaad India privacy policy",
    "data protection India",
    "user privacy India",
    "service app privacy policy"
  ],
  openGraph: {
    title: "Privacy Policy – Jogaad India",
    description:
      "Learn how Jogaad India handles user data securely and responsibly.",
    url: "https://jogaadindia.com/privacy",
    type: "website",
    images: [
      {
        url: "/openlg.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy – Jogaad India",
    description: "Your privacy and data protection matter to us.",
    images: "/openlg.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://jogaadindia.com/privacy",
  },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}