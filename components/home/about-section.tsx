"use client";

import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
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

export function AboutSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Gradient Orbs matching website theme */}
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
          backgroundSize: '80px 80px',
          animation: 'gridMove 20s linear infinite'
        }}
      />

      {/* Floating Dots */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(249, 168, 37) 2px, transparent 0)`,
          backgroundSize: '60px 60px',
          animation: 'floatDots 15s ease-in-out infinite'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 w-full"
          >
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B9EB3]"></span>
              </span>
              <span className="text-sm font-bold text-[#0A3D62] tracking-wider"> ABOUT</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] leading-tight">
              "Jogaad India – Your <Cover>One-Stop Solution!</Cover>"
            </h2>

            {/* Description */}
            <div className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Our Professional Website Setup service offers a <Cover>comprehensive</Cover>, fixed-price package designed.
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <div className="relative p-4 h-full rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Gradient Border Effect */}
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className="relative flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${highlight.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-[#0A3D62] mb-1.5 group-hover:text-[#2B9EB3] transition-colors duration-300 leading-tight">
                            {highlight.title}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
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
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <Link href="/about">
                <Button
                  borderRadius="1.25rem"
                  containerClassName="h-14 w-48 hover:scale-105 transition-transform duration-300"
                  borderClassName="h-20 w-20 bg-[radial-gradient(#F9A825_40%,transparent_60%)] opacity-[0.9]"
                  duration={4000}
                  className="bg-gradient-to-br from-[#3BB4CF] to-[#1B7A8F] border-[#F9A825]/30 text-white font-semibold text-base hover:shadow-2xl hover:shadow-[#F9A825]/20 hover:from-[#45C4E0] hover:to-[#2B9EB3] transition-all duration-300 group"
                >
                  <span className="flex items-center gap-2">
                    More Details
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image with Interactive Hover - Redesigned for Better Responsiveness */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full"
          >
            <div className="relative w-full h-full max-w-lg mx-auto lg:mx-0">
              {/* Main Interactive Image Card - Full Width & Responsive */}
              <div className="relative w-full h-[380px] sm:h-[450px] md:h-[500px] lg:ml-32 lg:h-[550px] rounded-2xl overflow-hidden shadow-2xl group">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2400&auto=format&fit=crop)'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="space-y-2 transform group-hover:translate-y-[-8px] transition-transform duration-500"
                  >
                    <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">Jogaad India</h3>
                    <p className="text-white/90 text-sm sm:text-base drop-shadow-md max-w-md">
                      Your trusted service partner across Odisha
                    </p>
                  </motion.div>
                </div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#F9A825]/50 transition-all duration-500" />
              </div>

              {/* Floating Stats Card - Positioned Over Image */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 lg:-mb-20 lg:ml-112 z-10"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#F9A825]/20 w-[240px] sm:w-[260px] md:w-[280px] hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#F9A825] to-[#FF9800] flex items-center justify-center shadow-lg">
                        <HiOfficeBuilding className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#0A3D62] mb-0.5">Jogaad India</h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">1000+ Professionals</p>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/50 grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-[#2B9EB3]">45 Min</div>
                      <div className="text-xs text-gray-600">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-bold text-[#F9A825]">100%</div>
                      <div className="text-xs text-gray-600">Reliable</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Decorative Elements */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#F9A825]/30 to-[#FF9800]/30 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#2B9EB3]/30 to-[#1B7A8F]/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/4 -left-8 w-40 h-40 bg-gradient-to-br from-[#0A3D62]/20 to-[#2B9EB3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
              
              {/* Sparkles Effect */}
              <div className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl overflow-hidden">
                <SparklesCore
                  id="about-sparkles"
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={30}
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
}
