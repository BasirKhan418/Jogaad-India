"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const footerLinks = {
  pages: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  socials: [
    { icon: FaFacebookF, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61583383065934' },
    { icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/jogaadindia25/' },
    { icon: FaTwitter, label: 'Twitter', href: 'https://x.com/jogaadindia' },
    { icon: FaLinkedinIn, label: 'LinkedIn', href: 'http://www.linkedin.com/in/jogaad-india-40833a357' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  account: [
    { label: 'Sign Up', href: '/signup' },
    { label: 'Login', href: '/signin' },
  ]
};

export const Footer: React.FC = () => {
  return (
    <footer className="relative isolate overflow-hidden bg-[#0A2A3A] text-gray-300">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <Image src="/logo.png" alt="Jogaad India" width={200} height={170} className="drop-shadow-md" />
              </div>
              <span className="sr-only">Jogaad India</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Jogaad India delivers reliable A to Z doorstep services across Odisha with 1000+ vetted professionals and rapid 45‑minute response.
            </p>
            <div className="flex items-center gap-3">
              {footerLinks.socials.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-[#0A3D62]/40 hover:bg-[#2B9EB3] text-gray-200 hover:text-white flex items-center justify-center transition-colors duration-300 shadow-sm border border-white/5"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pages */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide text-white/90">Pages</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.pages.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide text-white/90">Socials</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.socials.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="hover:text-white transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-wide text-white/90">Legal</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.legal.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide text-white/90">Account</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.account.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Staff Login Buttons */}
            <div className="pt-2 space-y-2">
              <Link 
                href="/admin/signin"
                className="block w-full px-4 py-2 text-xs font-medium text-center text-white bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-lg hover:from-[#0A3D62] hover:to-[#2B9EB3] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Admin Login
              </Link>
              <Link 
                href="/employee/login"
                className="block w-full px-4 py-2 text-xs font-medium text-center text-white bg-gradient-to-r from-[#F9A825] to-[#F57C00] rounded-lg hover:from-[#F57C00] hover:to-[#F9A825] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Employee Login
              </Link>
              <Link 
                href="/field-executive/login"
                className="block w-full px-4 py-2 text-xs font-medium text-center text-white bg-gradient-to-r from-[#10B981] to-[#059669] rounded-lg hover:from-[#059669] hover:to-[#10B981] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Field Executive Login
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} Jogaad India All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F9A825] animate-pulse" />
            <span className="font-medium text-gray-300">Reliable • Fast • Odisha</span>
          </p>
        </div>
      </div>

      {/* Giant faded text below footer content - responsive */}
      <div className="relative pointer-events-none select-none overflow-hidden py-8 sm:py-12">
        <h2 className="text-center text-[25vw] sm:text-[12vw] md:text-[10vw] lg:text-[10vw] xl:text-[10vw] leading-none font-black tracking-tighter text-[#0A3D62]/30">
          Jogaad India
        </h2>
      </div>
    </footer>
  );
};
