export const metadata = {
  title: "Create Account – Jogaad India | Sign Up & Book A-Z Services",
  description:
    "Create your Jogaad India account to book services across IT, software development, home cleaning, childcare, maintenance, legal services, landscaping, catering, and more. Fast & secure registration.",
  keywords: [
    "Jogaad India sign up",
    "Jogaad India create account",
    "register Jogaad India",
    "user registration",
    "service booking signup",
    "sign up to book services"
  ],
  openGraph: {
    title: "Create Your Account – Jogaad India",
    description:
      "Register now to book trusted professionals for all services — software, legal, childcare, cleaning, catering, landscaping, and more.",
    url: "https://jogaadindia.com/signup",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Sign Up",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up – Jogaad India",
    description:
      "Join Jogaad India and start booking A-Z services instantly.",
    images: "/opengl.png",
  },
  robots: "noindex, follow",
  alternates: {
    canonical: "https://jogaadindia.com/signup",
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
