"use client";

import React, { memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IconBuildingHospital, IconBriefcase, IconCalendarEvent, IconBuilding, IconHome, IconSchool } from "@tabler/icons-react";

interface CoreService {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; stroke?: number }>;
  highlights: string[];
  image: string;
  gradient: string;
}

const coreServices: CoreService[] = [
  {
    title: "Medical Services",
    description: "Comprehensive healthcare solutions including ambulance services, medical equipment, and healthcare professionals across Odisha.",
    icon: IconBuildingHospital,
    highlights: ["24/7 Emergency", "Trained Staff", "All Districts"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2400&auto=format&fit=crop",
    gradient: "from-teal-500 to-cyan-600"
  },
  {
    title: "Facility Management",
    description: "Professional facility management services for commercial and residential properties with trained staff.",
    icon: IconBriefcase,
    highlights: ["Property Care", "Expert Team", "24/7 Support"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2400&auto=format&fit=crop",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    title: "Event Management",
    description: "End-to-end event planning and execution services for corporate events, weddings, and social gatherings.",
    icon: IconCalendarEvent,
    highlights: ["Full Planning", "Professional", "Memorable"],
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2400&auto=format&fit=crop",
    gradient: "from-blue-600 to-indigo-700"
  },
  {
    title: "Infrastructure Development",
    description: "Construction and infrastructure development services with skilled engineers and construction workers.",
    icon: IconBuilding,
    highlights: ["Quality Build", "Expert Engineers", "Timely Delivery"],
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2400&auto=format&fit=crop",
    gradient: "from-teal-500 to-cyan-600"
  },
  {
    title: "Real Estate",
    description: "Trusted real estate consulting and property management services throughout Odisha.",
    icon: IconHome,
    highlights: ["Property Experts", "Trusted Service", "Best Deals"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2400&auto=format&fit=crop",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    title: "Education Services",
    description: "Educational consultancy and support services for colleges, universities, and training institutions.",
    icon: IconSchool,
    highlights: ["Expert Guidance", "Career Support", "Top Institutions"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2400&auto=format&fit=crop",
    gradient: "from-blue-600 to-indigo-700"
  }
];

export const CoreAreaSection = memo(function CoreAreaSection() {
  const router = useRouter();

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ willChange: 'contents' }}>
      {/* Background with elegant gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
      
      {/* Subtle decorative elements */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-[#2B9EB3]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#F9A825]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3]" />
            <span className="text-sm font-semibold text-gray-700">Our Expertise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#0A3D62] mb-5 leading-tight">
            Core Service Areas
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Delivering excellence across multiple sectors with professional expertise and unwavering commitment to quality
          </p>
        </div>

        {/* Services Grid - Bento Box Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {coreServices.map((service, index) => {
            const IconComponent = service.icon;
            const isLarge = index === 0 || index === 5;
            
            return (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-3xl bg-white transition-all duration-500 hover:-translate-y-1 cursor-pointer ${
                  isLarge ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
                onClick={() => router.push('/coming-soon')}
                style={{
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Background Image with Overlay */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <div className="absolute inset-0">
                    <Image 
                      src={service.image} 
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      quality={75}
                    />
                  </div>
                  
                  {/* Sophisticated gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${service.gradient} opacity-80 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-90`} />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

                  {/* Icon - Top Left */}
                  <div className="absolute top-5 left-5">
                    <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <IconComponent 
                        className="w-6 h-6 sm:w-7 sm:h-7 text-gray-800"
                        stroke={2}
                      />
                    </div>
                  </div>

                  {/* Title and Description - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    {/* Highlight Pills */}
                    <div className="flex flex-wrap gap-2">
                      {service.highlights.map((highlight, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 text-xs font-medium bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Clean White */}
                <div className="p-5 sm:p-6 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      Explore Service
                    </span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#2B9EB3] transition-colors duration-300">
                      <svg 
                        className="w-4 h-4 text-gray-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-gray-200 transition-all duration-300" />
              </div>
            );
          })}
        </div>

      
    
      </div>
    </section>
  );
});
