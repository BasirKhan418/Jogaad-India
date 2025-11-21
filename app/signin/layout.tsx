export const metadata = {
  title: "Sign In – Jogaad India | Access Your Account Securely",
  description:
    "Sign in to your Jogaad India account to book A-Z services including IT, home cleaning, childcare, legal, landscaping, catering, maintenance, and more. Secure & fast login.",
  keywords: [
    "Jogaad India sign in",
    "login Jogaad India",
    "account login",
    "user authentication",
    "service booking login",
    "sign in to book services"
  ],
  openGraph: {
    title: "Sign In – Jogaad India",
    description:
      "Securely log in to book services across IT, cleaning, legal, childcare, maintenance, catering, and many more.",
    url: "https://jogaadindia.com/signin",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Sign In",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In – Jogaad India",
    description:
      "Access your account and manage your service bookings effortlessly.",
    images: "/opengl.png",
  },
  robots: "noindex, follow",
  alternates: {
    canonical: "https://jogaadindia.com/signin",
  },
};
export default async function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}