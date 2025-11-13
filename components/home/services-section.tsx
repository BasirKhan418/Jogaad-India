"use client";

import React, { useEffect, useRef, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ManpowerIcon, 
  PlumbingIcon, 
  TravelIcon, 
  AstrologerIcon, 
  ArchitectureIcon 
} from "@/components/ui/service-icons";
import { ArrowRight } from "lucide-react";

interface Service {
  title: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  accentColorHover: string;
}

const services: Service[] = [
  {
    title: "Manpower Solutions",
    description: "Connect with verified professionals across various domains. Skilled workforce for all your project needs.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2400&auto=format&fit=crop",
    icon: ManpowerIcon,
    accentColor: "#2B9EB3",
    accentColorHover: "#1B7A8F"
  },
  {
    title: "Plumbing Service",
    description: "Expert plumbers at your doorstep for all repairs and installations. Fast, reliable, and professional service.",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=2400&auto=format&fit=crop",
    icon: PlumbingIcon,
    accentColor: "#F9A825",
    accentColorHover: "#F57C00"
  },
  {
    title: "Tours & Travels",
    description: "Explore Odisha with our premium travel services. Comfortable rides and unforgettable experiences.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2400&auto=format&fit=crop",
    icon: TravelIcon,
    accentColor: "#2B9EB3",
    accentColorHover: "#1B7A8F"
  },
  {
    title: "Astrologer",
    description: "Seek guidance from experienced astrologers. Find clarity, direction, and peace in your life's journey.",
    image: "https://images.unsplash.com/photo-1532153955177-f59af40d6472?q=80&w=2400&auto=format&fit=crop",
    icon: AstrologerIcon,
    accentColor: "#F9A825",
    accentColorHover: "#F57C00"
  },
  {
    title: "Architecture",
    description: "Professional architectural design and planning services. Transform your vision into stunning reality.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop",
    icon: ArchitectureIcon,
    accentColor: "#2B9EB3",
    accentColorHover: "#1B7A8F"
  }
];

export const ServicesSection = memo(function ServicesSection() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  const handleCardMouseEnter = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    isPausedRef.current = false;
    lastTimeRef.current = 0;
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.3; // Reduced speed for better performance

    const smoothScroll = (timestamp: number) => {
      if (!scrollContainer || isPausedRef.current) {
        animationFrameRef.current = requestAnimationFrame(smoothScroll);
        return;
      }

      // Calculate delta time for consistent speed across different frame rates
      if (lastTimeRef.current) {
        const deltaTime = timestamp - lastTimeRef.current;
        const adjustedSpeed = scrollSpeed * (deltaTime / 16); // Normalize to 60fps
        
        scrollAmount += adjustedSpeed;
        scrollContainer.scrollLeft = scrollAmount;

        // Reset scroll when reaching halfway (looping effect)
        const halfWidth = scrollContainer.scrollWidth / 2;
        if (scrollAmount >= halfWidth) {
          scrollAmount = 0;
          scrollContainer.scrollLeft = 0;
        }
      }

      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(smoothScroll);
    };

    // Start animation with delay to reduce initial load
    const timer = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(smoothScroll);
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section className="relative py-10 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Simplified Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-[#2B9EB3]/5 to-[#F9A825]/8 z-10" />
      
      {/* Glass Effect */}
      <div className="absolute inset-0 backdrop-blur-lg z-10" />
      
      {/* Grid Pattern - Removed other patterns for performance */}
      <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(43, 158, 179, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(43, 158, 179, 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-20 max-w-[1600px] mx-auto"  style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm mb-3">
            <span className="text-xs sm:text-sm font-semibold text-[#0A3D62]">What We Offer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] mb-3">
            Types of <span className="bg-gradient-to-r from-[#F9A825] to-[#FF9800] bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Professional services delivered to your doorstep across Odisha
          </p>
        </div>

        {/* Services Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 sm:gap-7 overflow-x-hidden overflow-y-visible py-8 pb-12 [&::-webkit-scrollbar]:hidden px-4 sm:px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Duplicate services array for infinite loop effect */}
          {[...services, ...services].map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="flex-shrink-0"
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
              >
                <div 
                  className="group relative w-[300px] sm:w-[340px] lg:w-[380px] cursor-pointer"
                  onClick={() => router.push('/coming-soon')}
                >
                  {/* Main Card */}
                  <div className="relative bg-white rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]"
                    style={{
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {/* Image Section with Overlay */}
                    <div className="relative h-[220px] sm:h-[240px] overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/60" />
                      
                      {/* Content Over Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 pb-6">
                        {/* Icon Badge */}
                        <div className="mb-3 inline-block">
                          <div 
                            className="p-2.5 sm:p-3 rounded-xl backdrop-blur-md transition-all duration-500 group-hover:scale-110"
                            style={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            <IconComponent 
                              className="w-6 h-6 sm:w-7 sm:h-7"
                              style={{ color: service.accentColor }}
                            />
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                          {service.title}
                        </h3>
                        
                        {/* Accent Bar */}
                        <div 
                          className="h-1 w-16 rounded-full transition-all duration-500 group-hover:w-24"
                          style={{
                            background: `linear-gradient(90deg, ${service.accentColor}, ${service.accentColorHover})`
                          }}
                        />
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="p-5 sm:p-6 bg-white">
                      <p className="text-gray-600 text-[13px] sm:text-sm leading-relaxed mb-4 line-clamp-3">
                        {service.description}
                      </p>
                      
                      {/* CTA */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span 
                          className="text-sm sm:text-[15px] font-semibold flex items-center gap-2 transition-all duration-300"
                          style={{ color: service.accentColor }}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                        </span>
                        
                        {/* Service Number Badge */}
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                          style={{
                            background: `${service.accentColor}15`,
                            color: service.accentColor
                          }}
                        >
                          {(index % 5) + 1}
                        </div>
                      </div>
                    </div>

                    {/* Hover Border Glow */}
                    <div 
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 2px ${service.accentColor}40`
                      }}
                    />
                  </div>

                  {/* Floating Corner Indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        background: service.accentColor,
                        boxShadow: `0 0 20px ${service.accentColor}80`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
