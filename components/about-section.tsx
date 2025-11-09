"use client";

import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/moving-border";
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
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 w-full lg:col-span-2"
          >
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B9EB3]"></span>
              </span>
              <span className="text-sm font-bold text-[#0A3D62] tracking-wider">» ABOUT</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] leading-tight">
              "Jogaad India – Your One-Stop Service Solution!"
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Our Professional Website Setup service offers a comprehensive, fixed-price package designed.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative h-[120px]"
                  >
                    <div className="relative p-3 h-full rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-start">
                      {/* Gradient Border Effect */}
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className="relative flex items-start gap-2 h-full">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${highlight.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h4 className="text-xs font-bold text-[#0A3D62] mb-1 group-hover:text-[#2B9EB3] transition-colors duration-300 leading-tight line-clamp-2">
                            {highlight.title}
                          </h4>
                          <p className="text-[10px] text-gray-600 leading-tight flex-1 line-clamp-3">
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
            </motion.div>
          </motion.div>

          {/* Right Image with Interactive Hover */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative lg:sticky lg:top-24 w-full lg:col-span-3 flex justify-end"
          >
            <div className="relative w-full max-w-[400px] ml-auto">
              {/* Main Interactive Image Card */}
              <DirectionAwareHover
                imageUrl="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2400&auto=format&fit=crop"
                className="w-[1000px] h-[480px] sm:h-[540px] lg:h-[600px] rounded-2xl overflow-hidden"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Jogaad India</h3>
                  <p className="text-white/90 text-sm">
                    Your trusted service partner across Odisha
                  </p>
                </div>
              </DirectionAwareHover>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-[#F9A825]/20 w-[260px] sm:w-[280px]">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F9A825] to-[#FF9800] flex items-center justify-center shadow-lg">
                        <HiOfficeBuilding className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <div>
                      <h3 className="text-xl font-bold text-[#0A3D62] mb-0.5">Jogaad India</h3>
                      <p className="text-sm text-gray-600 font-medium">1000+ Professionals</p>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="mt-4 pt-4 border-t border-gray-200/50 grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#2B9EB3]">45 Min</div>
                      <div className="text-xs text-gray-600">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#F9A825]">100%</div>
                      <div className="text-xs text-gray-600">Reliable</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements matching website theme */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#F9A825]/20 to-[#FF9800]/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#2B9EB3]/20 to-[#1B7A8F]/20 rounded-full blur-2xl" />
            
            {/* Sparkles Effect */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
