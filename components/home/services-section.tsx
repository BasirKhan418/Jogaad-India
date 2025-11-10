"use client";

import React, { useEffect, useRef } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { 
  ManpowerIcon, 
  PlumbingIcon, 
  TravelIcon, 
  AstrologerIcon, 
  ArchitectureIcon 
} from "@/components/ui/service-icons";

interface Service {
  title: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  bgGradient: string;
}

const services: Service[] = [
  {
    title: "Manpower Solutions",
    description: "Connect with verified professionals across various domains. Skilled workforce for all your project needs.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2400&auto=format&fit=crop",
    icon: ManpowerIcon,
    bgGradient: "from-pink-50 via-rose-50 to-pink-50"
  },
  {
    title: "Plumbing Service",
    description: "Expert plumbers at your doorstep for all repairs and installations. Fast, reliable, and professional service.",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=2400&auto=format&fit=crop",
    icon: PlumbingIcon,
    bgGradient: "from-rose-50 via-pink-50 to-rose-50"
  },
  {
    title: "Tours & Travels",
    description: "Explore Odisha with our premium travel services. Comfortable rides and unforgettable experiences.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2400&auto=format&fit=crop",
    icon: TravelIcon,
    bgGradient: "from-pink-50 via-rose-50 to-pink-50"
  },
  {
    title: "Astrologer",
    description: "Seek guidance from experienced astrologers. Find clarity, direction, and peace in your life's journey.",
    image: "https://images.unsplash.com/photo-1532153955177-f59af40d6472?q=80&w=2400&auto=format&fit=crop",
    icon: AstrologerIcon,
    bgGradient: "from-rose-50 via-pink-50 to-rose-50"
  },
  {
    title: "Architecture",
    description: "Professional architectural design and planning services. Transform your vision into stunning reality.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2400&auto=format&fit=crop",
    icon: ArchitectureIcon,
    bgGradient: "from-pink-50 via-rose-50 to-pink-50"
  }
];

export function ServicesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5; // Pixels per frame (reduced for smoother motion)

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

    // Start animation
    animationFrameRef.current = requestAnimationFrame(smoothScroll);

    // Pause on hover
    const handleMouseEnter = () => {
      isPausedRef.current = true;
    };

    const handleMouseLeave = () => {
      isPausedRef.current = false;
      lastTimeRef.current = 0; // Reset time to avoid jump
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
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
      
      {/* Multi-layered Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-[#2B9EB3]/8 to-[#F9A825]/12 z-10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#F9A825]/8 via-white/50 to-[#2B9EB3]/15 z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent z-10" />
      
      {/* Glass Effect */}
      <div className="absolute inset-0 backdrop-blur-xl z-10" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 z-10 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(43, 158, 179, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(43, 158, 179, 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Dot Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-[0.05]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(249, 168, 37) 1.5px, transparent 0)`,
        backgroundSize: '50px 50px',
        backgroundPosition: '0 0, 25px 25px'
      }} />
      
      {/* Diagonal Lines Pattern */}
      <div className="absolute inset-0 z-10 opacity-[0.02]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, rgba(10, 61, 98, 0.5) 0px, rgba(10, 61, 98, 0.5) 1px, transparent 1px, transparent 12px)`,
      }} />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-[#2B9EB3]/20 to-[#3BB4CF]/10 rounded-full blur-3xl animate-pulse z-10" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-[#F9A825]/20 to-[#FF9800]/10 rounded-full blur-3xl animate-pulse z-10" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#2B9EB3]/5 via-white/5 to-[#F9A825]/5 rounded-full blur-3xl animate-pulse z-10" style={{ animationDelay: '0.75s' }} />

      <div className="relative z-20 max-w-[1600px] mx-auto">
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
          className="flex gap-4 sm:gap-6 overflow-x-hidden overflow-y-visible py-8 pb-8 [&::-webkit-scrollbar]:hidden px-2 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Duplicate services array for infinite loop effect */}
          {[...services, ...services].map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="flex-shrink-0 py-2 px-3">
                <CometCard 
                  rotateDepth={8} 
                  translateDepth={8}
                  className="w-[280px] sm:w-[340px] md:w-[380px] lg:w-[420px]"
                >
                  <div 
                    className={`relative group w-full h-[380px] sm:h-[400px] rounded-2xl p-5 sm:p-6 border-2 border-white/90 flex flex-col overflow-hidden shadow-xl shadow-gray-300/30 hover:shadow-2xl hover:shadow-[#2B9EB3]/30 hover:border-[#2B9EB3]/50 transition-all duration-500`}
                    style={{
                      transformStyle: "preserve-3d",
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 50%, rgba(255, 255, 255, 0.95) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Dot Pattern Background */}
                    <div 
                      className="absolute inset-0 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-300 z-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(43, 158, 179) 1.5px, transparent 0)`,
                        backgroundSize: '20px 20px'
                      }}
                    />
                    
                    {/* Diagonal Lines Pattern */}
                    <div 
                      className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-300 z-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(45deg, rgba(249, 168, 37, 0.5) 0px, rgba(249, 168, 37, 0.5) 1px, transparent 1px, transparent 10px)`,
                      }}
                    />
                    
                    {/* Grid Pattern */}
                    <div 
                      className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-300 z-0"
                      style={{
                        backgroundImage: `linear-gradient(rgba(43, 158, 179, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(43, 158, 179, 0.4) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px'
                      }}
                    />
                    
                    {/* Decorative corner elements */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#F9A825]/20 rounded-tl-2xl group-hover:border-[#F9A825]/40 transition-all duration-300 z-10" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#2B9EB3]/20 rounded-br-2xl group-hover:border-[#2B9EB3]/40 transition-all duration-300 z-10" />
                    
                    {/* Circular pattern accent - top right */}
                    <div 
                      className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.06] group-hover:opacity-[0.10] transition-opacity duration-300 z-0"
                      style={{
                        background: `radial-gradient(circle, rgba(43, 158, 179, 0.3) 0%, transparent 70%)`
                      }}
                    />
                    
                    {/* Circular pattern accent - bottom left */}
                    <div 
                      className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-[0.06] group-hover:opacity-[0.10] transition-opacity duration-300 z-0"
                      style={{
                        background: `radial-gradient(circle, rgba(249, 168, 37, 0.3) 0%, transparent 70%)`
                      }}
                    />
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2B9EB3]/0 via-transparent to-[#F9A825]/0 group-hover:from-[#2B9EB3]/5 group-hover:to-[#F9A825]/5 transition-all duration-500 rounded-2xl pointer-events-none" />
                    
                    {/* Icon */}
                    <div className="mb-3 sm:mb-4 flex-shrink-0 relative z-10">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#2B9EB3] to-[#1B7A8F] shadow-lg flex items-center justify-center border-2 border-[#2B9EB3]/20 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#2B9EB3]/30 group-hover:rotate-6 transition-all duration-300 relative overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <IconComponent className="w-9 h-9 sm:w-11 sm:h-11 text-white relative z-10" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A3D62] mb-2 sm:mb-3 flex-shrink-0 relative z-10 group-hover:text-[#2B9EB3] transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Decorative line */}
                    <div className="w-12 h-1 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full mb-2 sm:mb-3 group-hover:w-20 transition-all duration-300" />

                    {/* Description */}
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3 flex-shrink-0 relative z-10">
                      {service.description}
                    </p>

                    {/* Image */}
                    <div className="w-full mt-auto flex-shrink-0 relative z-10">
                      <div className="relative overflow-hidden rounded-xl group-hover:shadow-lg transition-all duration-300">
                        <img
                          src={service.image}
                          height="400"
                          width="400"
                          className="h-32 sm:h-36 w-full object-cover rounded-xl group-hover:scale-110 transition-all duration-500"
                          alt={service.title}
                        />
                        {/* Image overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D62]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </CometCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
