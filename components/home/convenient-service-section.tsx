"use client";

import React from "react";
import { motion } from "framer-motion";
import { CometCard } from "@/components/ui/comet-card";

const ChooseServiceIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="8" width="40" height="48" rx="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 8V6C20 4.89543 20.8954 4 22 4H42C43.1046 4 44 4.89543 44 6V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="12" r="2" fill="currentColor"/>
    <path d="M20 22H44M20 30H44M20 38H36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M44 44L48 48M52 52L48 48M48 48L52 44M48 48L44 52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const ScheduleIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="14" width="44" height="44" rx="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 24H54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M20 10V18M44 10V18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="20" cy="34" r="2" fill="currentColor"/>
    <circle cx="32" cy="34" r="2" fill="currentColor"/>
    <circle cx="44" cy="34" r="2" fill="currentColor"/>
    <path d="M18 44L22 48L28 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="38" cy="46" r="2" fill="currentColor"/>
  </svg>
);

const PlaceOrderIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="20" width="48" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 30H56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="16" y="38" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2.5"/>
    <circle cx="44" cy="43" r="4" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M42 43L43 44L46 41" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 20V16C20 13.7909 21.7909 12 24 12H40C42.2091 12 44 13.7909 44 16V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="15" r="2" fill="currentColor"/>
  </svg>
);

interface ServiceStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const serviceSteps: ServiceStep[] = [
  {
    id: 1,
    title: "Choose Your Service",
    description: "Pick the service you are looking for- from the website or the app.",
    icon: ChooseServiceIcon,
    gradient: "from-[#F9A825] to-[#FF9800]"
  },
  {
    id: 2,
    title: "Pick Your Schedule",
    description: "Pick the service you are looking for- from the website or the app.",
    icon: ScheduleIcon,
    gradient: "from-[#2B9EB3] to-[#1B7A8F]"
  },
  {
    id: 3,
    title: "Place The Order",
    description: "Pick the service you are looking for- from the website or the app.",
    icon: PlaceOrderIcon,
    gradient: "from-[#FF6B6B] to-[#FF4757]"
  }
];

export function ConvenientServiceSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-slate-50 to-blue-50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#F9A825]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2B9EB3]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Animated Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(10, 61, 98) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(10, 61, 98) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0A3D62] mb-4">
            Convenient Service
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </motion.div>

        {/* Service Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {serviceSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <CometCard className="h-full">
                  <div className="relative h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                    {/* Step Number Badge - Background */}
                    <div className={`absolute top-6 left-6 text-[120px] sm:text-[140px] font-bold leading-none select-none z-0 transition-all duration-500 text-gray-100 group-hover:bg-gradient-to-br group-hover:${step.gradient} group-hover:bg-clip-text group-hover:text-transparent group-hover:scale-110`}>
                      {step.id}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full min-h-[320px] sm:min-h-[360px]">
                      {/* Icon Container */}
                      <div className="mb-6 sm:mb-8 flex justify-center">
                        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 flex flex-col items-center text-center">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#0A3D62] mb-3 sm:mb-4 group-hover:text-[#2B9EB3] transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xs">
                          {step.description}
                        </p>
                      </div>

                      {/* Bottom Accent Line */}
                      <div className="mt-6">
                        <div className={`h-1 w-16 bg-gradient-to-r ${step.gradient} rounded-full mx-auto transform group-hover:w-24 transition-all duration-300`} />
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                  </div>
                </CometCard>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B9EB3]"></span>
            </span>
            <span className="text-sm font-semibold text-[#0A3D62]">Quick & Easy Process</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
