"use client";

import React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function UserBookingsPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
      <div className="relative z-20 text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#0A3D62] mb-2">My Bookings</h2>
        <p className="text-[#0A3D62]/70 mb-4">This feature is coming soon!</p>
        <Link 
          href="/user/dashboard"
          className="inline-block bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
