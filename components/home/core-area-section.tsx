"use client";

import React, { useRef } from "react";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { IconMapPin, IconStarFilled } from "@tabler/icons-react";

interface CoreService {
  title: string;
  location: string;
  rating: number;
  image: string;
}

const coreServices: CoreService[] = [
  {
    title: "Medical Services",
    location: "India",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2400&auto=format&fit=crop"
  },
  {
    title: "Facility Management",
    location: "India",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2400&auto=format&fit=crop"
  },
  {
    title: "Event Management",
    location: "India",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2400&auto=format&fit=crop"
  },
  {
    title: "Infrastructure Development",
    location: "India",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2400&auto=format&fit=crop"
  },
  {
    title: "Real Estate",
    location: "India",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2400&auto=format&fit=crop"
  },
  {
    title: "Colleges & Universities",
    location: "India",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2400&auto=format&fit=crop"
  }
];

export function CoreAreaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const card5Ref = useRef<HTMLDivElement>(null);
  const card6Ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#F9A825]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2B9EB3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0A3D62]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

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
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(43, 158, 179) 2px, transparent 0)`,
          backgroundSize: '60px 60px',
          animation: 'floatDots 15s ease-in-out infinite'
        }}
      />

      {/* Animated Beams connecting cards */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={card1Ref}
          toRef={card2Ref}
          curvature={20}
          pathColor="rgb(43, 158, 179)"
          pathWidth={3}
          pathOpacity={0.3}
          gradientStartColor="#F9A825"
          gradientStopColor="#2B9EB3"
          duration={5}
          delay={0}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={card2Ref}
          toRef={card3Ref}
          curvature={-20}
          pathColor="rgb(43, 158, 179)"
          pathWidth={3}
          pathOpacity={0.3}
          gradientStartColor="#2B9EB3"
          gradientStopColor="#F9A825"
          duration={6}
          delay={0.5}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={card4Ref}
          toRef={card5Ref}
          curvature={20}
          pathColor="rgb(249, 168, 37)"
          pathWidth={3}
          pathOpacity={0.3}
          gradientStartColor="#F9A825"
          gradientStopColor="#0A3D62"
          duration={5.5}
          delay={1}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={card5Ref}
          toRef={card6Ref}
          curvature={-20}
          pathColor="rgb(249, 168, 37)"
          pathWidth={3}
          pathOpacity={0.3}
          gradientStartColor="#0A3D62"
          gradientStopColor="#2B9EB3"
          duration={6}
          delay={1.5}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={card1Ref}
          toRef={card4Ref}
          curvature={-30}
          pathColor="rgb(10, 61, 98)"
          pathWidth={3}
          pathOpacity={0.25}
          gradientStartColor="#2B9EB3"
          gradientStopColor="#F9A825"
          duration={7}
          delay={2}
          reverse
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={card3Ref}
          toRef={card6Ref}
          curvature={30}
          pathColor="rgb(10, 61, 98)"
          pathWidth={3}
          pathOpacity={0.25}
          gradientStartColor="#F9A825"
          gradientStopColor="#2B9EB3"
          duration={7}
          delay={2.5}
          reverse
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A3D62] mb-4">
            Core Area of <span className="bg-gradient-to-r from-[#F9A825] to-[#FF9800] bg-clip-text text-transparent">Service</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions across multiple sectors
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {coreServices.map((service, index) => {
            const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref, card5Ref, card6Ref];
            return (
              <div 
                key={index}
                ref={cardRefs[index]}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
              {/* Decorative Corner Accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#F9A825] rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#2B9EB3] rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#2B9EB3] rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#F9A825] rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F9A825]/20 via-[#2B9EB3]/20 to-[#0A3D62]/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              
              <DirectionAwareHover
                imageUrl={service.image}
                className="w-full h-[280px] sm:h-[320px] md:h-[360px] rounded-2xl ring-1 ring-white/50 shadow-lg group-hover:shadow-2xl group-hover:shadow-[#2B9EB3]/20 transition-all duration-300 overflow-hidden"
                imageClassName="object-cover group-hover:scale-105 transition-transform duration-500"
              >
                <div className="space-y-3 relative z-10">
                  {/* Service Number Badge */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#F9A825] to-[#FF9800] text-white font-bold text-sm shadow-lg mb-2">
                    {index + 1}
                  </div>
                  
                  <h3 className="font-bold text-xl sm:text-2xl text-white drop-shadow-2xl">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-sm flex-wrap">
                    <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 shadow-lg">
                      <IconMapPin className="w-4 h-4 text-white drop-shadow" stroke={2.5} />
                      <span className="text-white font-semibold drop-shadow">{service.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#F9A825] to-[#FF9800] backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                      <IconStarFilled className="w-4 h-4 text-white drop-shadow" />
                      <span className="text-white font-bold drop-shadow">{service.rating}</span>
                    </div>
                  </div>
                  
                  {/* Bottom Accent Line */}
                  <div className="h-1 w-16 bg-gradient-to-r from-[#F9A825] to-transparent rounded-full mt-2" />
                </div>
              </DirectionAwareHover>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
