import React from 'react'
import { CareersSection } from '@/components/careers/careers-section'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Careers – Join Jogaad India | Build Your Future With Us",
  description:
    "Explore exciting career opportunities at Jogaad India. Join our dynamic team and help revolutionize service delivery across India. View open positions and apply today.",
  keywords: [
    "Jogaad India careers",
    "jobs at Jogaad India",
    "career opportunities",
    "join our team",
    "work with us",
    "Jogaad India jobs"
  ],
  openGraph: {
    title: "Careers – Join Jogaad India",
    description:
      "Explore career opportunities and join a team that's transforming service delivery across India.",
    url: "https://jogaadindia.com/careers",
    type: "website",
    images: [
      {
        url: "/opengl.png",
        width: 1200,
        height: 630,
        alt: "Jogaad India Careers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers – Join Jogaad India",
    description:
      "Build your career with Jogaad India and be part of our mission.",
    images: ["/opengl.png"],
  },
  alternates: {
    canonical: "https://jogaadindia.com/careers",
  },
};

export default function CareersPage() {
  return (
    <CareersSection />
  )
}
