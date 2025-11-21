export const metadata = {
  title: "Terms & Conditions – Jogaad India",
  description:
    "Read the Terms & Conditions for using Jogaad India's A-Z services including IT, maintenance, home care, legal, childcare, and more.",
  keywords: [
    "Jogaad India terms and conditions",
    "service terms India",
    "user agreement",
    "service usage policy"
  ],
  openGraph: {
    title: "Terms & Conditions – Jogaad India",
    description:
      "Understand the rules, responsibilities, and legal terms for using our platform.",
    url: "https://jogaadindia.com/terms",
    type: "website",
    images: [
      {
        url: "/openlg.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Terms & Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions – Jogaad India",
    description: "Read our platform usage guidelines and legal terms.",
    images: "/openlg.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://jogaadindia.com/terms",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}