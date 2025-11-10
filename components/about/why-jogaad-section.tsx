"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cover } from "@/components/ui/cover";
import { FiCheckCircle } from "react-icons/fi";
import { MdPeople, MdLocationOn } from "react-icons/md";

const whyPoints = [
  "We have established a reputation of extensive hands-on experience.",
  "We strongly believe that value can be achieved without compromising quality.",
  "We exceed our clients and candidate's expectations.",
  "We are backed by Pre-screened and strong Online Data bank of hundred+ professionals across the network.",
  "We have a track record of Service Provide.",
  "We provide accurate, effective, reliable and transparent services to both sides.",
  "We deliver flexible MBA, HR services to meet the needs of our clients.",
  "Good exposure in handling Mass Recruitment / can provide candidates with required quality in given minimum."
];

export function WhyJogaadSection() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(10, 61, 98) 2px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 order-2 lg:order-1"
          >
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B9EB3]"></span>
              </span>
              <span className="text-sm font-bold text-[#0A3D62] tracking-wider">WHY JOGAAD INDIA ?</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] leading-tight">
              Jogaad India – Get Your <Cover>A to Z Services</Cover> in Your Hand!
            </h2>

            {/* Main Focus Text */}
            <div className="bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border-l-4 border-[#F9A825] p-4 rounded-r-lg">
              <p className="text-base text-gray-800 leading-relaxed italic">
                The Main focus is to Reduce the Unemployment from Society that nobody can tell to 
                anyone that why you are unemployment like 'Bekar'. We understand that how Service 
                will Provide is to hire the "Right Skills".
              </p>
            </div>

            {/* Points List */}
            <div className="space-y-3 pt-4">
              {whyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <FiCheckCircle className="w-5 h-5 text-[#2B9EB3] group-hover:text-[#F9A825] transition-colors duration-300" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1 group-hover:text-gray-900 transition-colors duration-300">
                    {point}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Large A to Z Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-12 overflow-hidden group hover:shadow-3xl transition-all duration-500">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgb(249, 168, 37) 2px, transparent 0)`,
                      backgroundSize: '40px 40px'
                    }}
                  />
                </div>

                {/* A to Z Text - Stylized */}
                <div className="relative text-center space-y-4">
                  <div className="text-[120px] sm:text-[160px] lg:text-[200px] font-black leading-none">
                    <span className="bg-gradient-to-br from-[#FF6B35] via-[#F9A825] to-[#FF9800] bg-clip-text text-transparent drop-shadow-2xl inline-block transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      A
                    </span>
                    <span className="text-[80px] sm:text-[100px] lg:text-[120px] mx-2 sm:mx-4 text-[#2B9EB3] inline-block transform group-hover:scale-110 transition-transform duration-500">
                      TO
                    </span>
                    <span className="bg-gradient-to-br from-[#FF6B35] via-[#F9A825] to-[#FF9800] bg-clip-text text-transparent drop-shadow-2xl inline-block transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      Z
                    </span>
                  </div>
                  
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FF6B35] tracking-wider uppercase group-hover:tracking-widest transition-all duration-500">
                    SERVICES
                  </div>

                  {/* Decorative Lines */}
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="h-1 w-16 bg-gradient-to-r from-transparent to-[#F9A825] rounded-full"></div>
                    <div className="w-3 h-3 rounded-full bg-[#F9A825]"></div>
                    <div className="h-1 w-16 bg-gradient-to-l from-transparent to-[#F9A825] rounded-full"></div>
                  </div>
                </div>

                {/* Animated Corner Accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#F9A825] rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#2B9EB3] rounded-br-3xl"></div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#F9A825]/20 to-[#FF9800]/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-[#2B9EB3]/20 to-[#1B7A8F]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              {/* Small Accent Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 left-8 bg-white rounded-xl shadow-xl p-4 border-2 border-[#F9A825]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F9A825] to-[#FF9800] flex items-center justify-center">
                    <MdPeople className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#0A3D62]">1000+</div>
                    <div className="text-xs text-gray-600">Professionals</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="absolute -top-6 right-8 bg-white rounded-xl shadow-xl p-4 border-2 border-[#2B9EB3]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2B9EB3] to-[#1B7A8F] flex items-center justify-center">
                    <MdLocationOn className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#0A3D62]">30+</div>
                    <div className="text-xs text-gray-600">Districts</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
