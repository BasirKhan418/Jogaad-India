"use client";

import React, { memo } from "react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/moving-border";
import { Cover } from "@/components/ui/cover";
import { RiTeamFill, RiUserStarFill } from "react-icons/ri";
import { IoMdTimer } from "react-icons/io";
import { MdVerified, MdLocationOn } from "react-icons/md";
import { FaNetworkWired } from "react-icons/fa";
import { HiOfficeBuilding } from "react-icons/hi";

const highlights = [
  {
    title: "Comprehensive Services",
    description: "Providing A to Z services for both rural and urban areas.",
    icon: RiUserStarFill,
    color: "from-[#F9A825] to-[#FF9800]"
  },
  {
    title: "Quick Response",
    description: "Services delivered within 45 minutes.",
    icon: IoMdTimer,
    color: "from-[#2B9EB3] to-[#1B7A8F]"
  },
  {
    title: "Experienced Team",
    description: "Over 1 year of expertise in the field.",
    icon: MdVerified,
    color: "from-[#0A3D62] to-[#1B7A8F]"
  },
  {
    title: "Large Workforce",
    description: "A skilled team of 1000+ professionals.",
    icon: RiTeamFill,
    color: "from-[#F9A825] to-[#FF9800]"
  },
  {
    title: "Wide Coverage",
    description: "Available in every block, panchayat, and district in Odisha.",
    icon: MdLocationOn,
    color: "from-[#2B9EB3] to-[#1B7A8F]"
  },
  {
    title: "Franchise Network",
    description: "Established franchises in all district headquarters.",
    icon: FaNetworkWired,
    color: "from-[#0A3D62] to-[#1B7A8F]"
  }
];

export const AboutSection = memo(function AboutSection() {
  return (
    <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50/30 to-slate-50 overflow-hidden">
      {/* Refined Gradient Orbs with better positioning */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-[#F9A825]/15 to-[#FF9800]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-bl from-[#2B9EB3]/15 to-[#1B7A8F]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#0A3D62]/5 to-transparent rounded-full blur-3xl" />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(10, 61, 98) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(10, 61, 98) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-3 sm:space-y-4 lg:space-y-5 w-full"
          >
            {/* Section Label */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-[#2B9EB3] to-[#F9A825]"></span>
              </div>
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent tracking-wide">WHO WE ARE</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A3D62] leading-tight">
              Jogaad India – Your{" "}
              <span className="relative inline-block">
                <Cover>One-Stop Solution</Cover>
              </span>
            </h2>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed font-medium">
                Empowering communities across Odisha with reliable, professional services delivered at your doorstep.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <div className="relative p-2.5 sm:p-3 h-full rounded-lg sm:rounded-xl bg-white backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5">
                      {/* Gradient Border Effect on Hover */}
                      <div className={`absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      <div className="relative flex items-start gap-2.5">
                        <div className="flex-shrink-0">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${highlight.color} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-[#0A3D62] mb-0.5 sm:mb-1 group-hover:text-[#2B9EB3] transition-colors duration-300 leading-tight">
                            {highlight.title}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-gray-600 leading-snug line-clamp-2">
                            {highlight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/about">
                <Button
                  borderRadius="1rem"
                  containerClassName="h-11 sm:h-12 w-40 sm:w-44 hover:scale-105 transition-transform duration-300"
                  borderClassName="h-20 w-20 bg-[radial-gradient(#F9A825_40%,transparent_60%)] opacity-90"
                  duration={3000}
                  className="bg-gradient-to-br from-[#2B9EB3] to-[#1B7A8F] border-none text-white font-bold text-sm shadow-lg hover:shadow-xl hover:shadow-[#2B9EB3]/30 hover:from-[#3BB4CF] hover:to-[#2B9EB3] transition-all duration-300 group"
                >
                  <span className="flex items-center gap-2">
                    Learn More
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image with Interactive Hover - Enhanced Design */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative w-full mt-6 lg:mt-0"
          >
            <div className="relative w-full h-full max-w-lg mx-auto lg:mx-0 lg:ml-8">
              {/* Main Interactive Image Card */}
              <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl group">
                {/* Background Image with Next.js Image */}
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2400&auto=format&fit=crop"
                  alt="Jogaad India Team"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  quality={75}
                />
                
                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D62]/90 via-[#0A3D62]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 sm:p-5 lg:p-6 flex flex-col justify-end z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="space-y-1.5 sm:space-y-2 transform group-hover:translate-y-[-6px] transition-transform duration-500"
                  >
                    <div className="inline-block px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-1">
                      <span className="text-[9px] sm:text-[10px] font-semibold text-white/90 tracking-wider">SERVING ODISHA</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-2xl">Jogaad India</h3>
                    <p className="text-white/90 text-xs sm:text-sm lg:text-base drop-shadow-md max-w-md leading-relaxed line-clamp-2">
                      Your trusted partner for comprehensive services across every district, block, and panchayat in Odisha.
                    </p>
                  </motion.div>
                </div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-[#F9A825]/40 transition-all duration-500" />
              </div>

              {/* Floating Stats Card - Premium Design */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 md:-top-5 md:-right-5 z-20"
              >
                <div className="bg-white backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl border border-gray-100 w-[200px] sm:w-[240px] md:w-[260px] hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#F9A825] to-[#FF9800] flex items-center justify-center shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform">
                        <div className="absolute inset-0 bg-white/20"></div>
                        <HiOfficeBuilding className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent">Jogaad India</h3>
                      <p className="text-[10px] sm:text-xs text-gray-600 font-semibold">1000+ Professionals</p>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="pt-2.5 sm:pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <div className="text-center p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-[#2B9EB3]/5 to-[#2B9EB3]/10">
                      <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] bg-clip-text text-transparent">45 Min</div>
                      <div className="text-[9px] sm:text-[10px] text-gray-600 font-medium">Response</div>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-[#F9A825]/5 to-[#F9A825]/10">
                      <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#F9A825] to-[#FF9800] bg-clip-text text-transparent">100%</div>
                      <div className="text-[9px] sm:text-[10px] text-gray-600 font-medium">Reliable</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Refined Decorative Elements - Hidden on Mobile */}
              <div className="hidden sm:block absolute -top-8 -right-8 w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-[#F9A825]/20 to-[#FF9800]/10 rounded-full blur-3xl" />
              <div className="hidden sm:block absolute -bottom-8 right-1/4 w-40 h-40 lg:w-48 lg:h-48 bg-gradient-to-bl from-[#2B9EB3]/20 to-[#1B7A8F]/10 rounded-full blur-3xl" />
              
              {/* Subtle Sparkles Effect - Hidden on Mobile for Performance */}
              <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none rounded-2xl sm:rounded-3xl overflow-hidden opacity-30">
                <SparklesCore
                  id="about-sparkles"
                  background="transparent"
                  minSize={0.3}
                  maxSize={0.8}
                  particleDensity={15}
                  className="w-full h-full"
                  particleColor="#F9A825"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
