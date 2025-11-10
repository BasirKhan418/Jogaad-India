"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cover } from "@/components/ui/cover";
import { SparklesCore } from "@/components/ui/sparkles";
import { MdLocationOn, MdWork, MdPeople, MdTrendingUp, MdBusiness, MdGroups } from "react-icons/md";
import { FaNetworkWired } from "react-icons/fa";

const companyHighlights = [
  {
    icon: MdLocationOn,
    title: "Headquarters: Bhubaneswar, Odisha, with branch offices across the state.",
    color: "from-[#F9A825] to-[#FF9800]"
  },
  {
    icon: MdWork,
    title: "Service Divisions: Specializing in Construction & Maintenance.",
    color: "from-[#2B9EB3] to-[#1B7A8F]"
  },
  {
    icon: MdTrendingUp,
    title: "Nationwide Expansion: Aiming for operations across Pan-Bharat by setting up offices and deploying staff.",
    color: "from-[#0A3D62] to-[#1B7A8F]"
  },
  {
    icon: MdBusiness,
    title: "Operational Strength: Functions through own establishments and skilled resources from various fields.",
    color: "from-[#F9A825] to-[#FF9800]"
  },
  {
    icon: FaNetworkWired,
    title: "Branch Network: Presence in 30 districts across Odisha.",
    color: "from-[#2B9EB3] to-[#1B7A8F]"
  },
  {
    icon: MdPeople,
    title: "Client Base: Serving 1,000+ clients across Odisha.",
    color: "from-[#0A3D62] to-[#1B7A8F]"
  },
  {
    icon: MdGroups,
    title: "Workforce Deployment: Deploying 660+ candidates across various industries annually.",
    color: "from-[#F9A825] to-[#FF9800]"
  }
];

export function CompanyInfoSection() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#F9A825]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2B9EB3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0A3D62]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Animated Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(10, 61, 98) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(10, 61, 98) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Top Image - Team Meeting */}
              <div className="col-span-2 relative h-[280px] sm:h-[320px] rounded-2xl overflow-hidden shadow-2xl group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2400&auto=format&fit=crop)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">Team Collaboration</h3>
                </div>
              </div>

              {/* Bottom Left - Woman with Laptop */}
              <div className="relative h-[220px] sm:h-[260px] rounded-2xl overflow-hidden shadow-xl group">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B9EB3]/80 via-[#2B9EB3]/20 to-transparent" />
              </div>

              {/* Bottom Right - Jogaad Logo Placeholder */}
              <div className="relative h-[220px] sm:h-[260px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#0A3D62] via-[#2B9EB3] to-[#F9A825] flex items-center justify-center group hover:scale-105 transition-transform duration-300">
                <div className="text-center p-6">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-2xl mb-2" style={{ fontFamily: 'cursive' }}>
                    Jogaad
                  </h2>
                  <p className="text-2xl sm:text-3xl font-semibold text-white/90 drop-shadow-lg" style={{ fontFamily: 'cursive' }}>
                    India
                  </p>
                </div>
                {/* Sparkles Effect */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <SparklesCore
                    id="logo-sparkles"
                    background="transparent"
                    minSize={0.4}
                    maxSize={1}
                    particleDensity={30}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#F9A825]/30 to-[#FF9800]/30 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#2B9EB3]/30 to-[#1B7A8F]/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F9A825] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F9A825]"></span>
              </span>
              <span className="text-sm font-bold text-[#0A3D62] tracking-wider">ABOUT COMPANY</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] leading-tight">
              JOGAAD INDIA <Cover>(M/S DK CORPORATE SERVICE)</Cover>
            </h1>

            {/* Subtitle */}
            <h3 className="text-xl sm:text-2xl font-bold text-[#2B9EB3]">
              Get Your A to Z Services in Your Hand!
            </h3>

            {/* Description */}
            <p className="text-base text-gray-700 leading-relaxed">
              We are a premier and rapidly growing service provider originating from Odisha, 
              committed to expanding across Bharat within a defined timeframe. As a licensed, 
              registered, and recognized service provider by the Government of Odisha, we aim to 
              establish a strong presence <span className="font-semibold text-[#0A3D62]">Pan-Bharat</span>.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 gap-3 pt-4">
              {companyHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${highlight.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">
                      {highlight.title}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
