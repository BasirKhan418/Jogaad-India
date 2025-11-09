import React from 'react'
import { LayoutGridDemo } from '@/components/layout-grid-demo'
import DecorativeEdges from '@/components/ui/decorative-edges'
import { LayoutTextFlip } from '@/components/ui/layout-text-flip'
import { Cover } from '@/components/ui/cover'
import { Spotlight } from '@/components/ui/spotlight'
import { Button } from '@/components/ui/moving-border'
import { ServicesSection } from '@/components/services-section'
import { CoreAreaSection } from '@/components/core-area-section'
import { AboutSection } from '@/components/about-section'
import { ConvenientServiceSection } from '@/components/convenient-service-section'
import { RiTeamFill } from 'react-icons/ri'
import { IoMdTimer } from 'react-icons/io'
import { MdVerified } from 'react-icons/md'
import { FiArrowRight } from 'react-icons/fi'

const page = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-0">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xs z-10" />
        
        <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="hidden lg:block">
          <Spotlight
            gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(249, 168, 37, 0.10) 0, rgba(249, 168, 37, 0.05) 50%, rgba(249, 168, 37, 0) 80%)"
            gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(43, 158, 179, 0.08) 0, rgba(43, 158, 179, 0.03) 80%, transparent 100%)"
            gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(249, 168, 37, 0.07) 0, rgba(249, 168, 37, 0.03) 80%, transparent 100%)"
            translateY={-300}
            width={600}
            height={1400}
            duration={8}
            xOffset={120}
          />
        </div>

  {/* Decorative edges in corners (no top) */}
  <DecorativeEdges mode="corners" showTop={false} showBottom={true} />

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 lg:py-0">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 lg:items-center h-full">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left space-y-5 sm:space-y-6 lg:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#F9A825]/20 backdrop-blur-sm mx-auto lg:mx-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2B9EB3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2B9EB3]"></span>
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#0A3D62]">Available 24/7 across Odisha</span>
              </div>

              {/* First Text with Animation */}
              <div className="flex flex-col items-center lg:items-start justify-center">
                <LayoutTextFlip
                  text="Reliable Services "
                  words={["Anytime", "Anywhere", "Doorstep", "Fast"]}
                  duration={3000}
                />
              </div>
              
              <div className="space-y-3">
                <p className="text-sm sm:text-base md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
                  With <span className="font-bold text-[#0A3D62] bg-[#F9A825]/10 px-1.5 py-0.5 rounded">1 year of expertise</span>, our <span className="font-bold text-[#0A3D62]">1000+ professionals</span> deliver essential services across <span className="font-bold text-[#0A3D62]">Odisha</span>, covering every block and panchayat.
                </p>
                
                {/* Stats row */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F9A825] to-[#FF9800] flex items-center justify-center shadow-md">
                      <RiTeamFill className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-[#0A3D62]">1000+ Experts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3BB4CF] to-[#2B9EB3] flex items-center justify-center shadow-md">
                      <IoMdTimer className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-[#2B9EB3]">45 Min Response</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B7A8F] to-[#0A3D62] flex items-center justify-center shadow-md">
                      <MdVerified className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-[#0A3D62]">100% Reliable</span>
                  </div>
                </div>
              </div>

              {/* Second Text with Smooth Fade In */}
              <div className="pt-2 sm:pt-3 lg:pt-4 space-y-2 sm:space-y-3 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#0A3D62]">Fast & Reliable</span>
                  <span className="relative w-fit overflow-hidden rounded-md sm:rounded-lg border border-transparent bg-gradient-to-br from-[#F9A825]/5 via-[#2B9EB3]/10 to-[#0A3D62]/10 px-2 py-0.5 sm:px-2.5 sm:py-0.5 md:px-3 md:py-1 font-sans text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight text-[#2B9EB3] shadow-md ring-1 ring-[#F9A825]/15 backdrop-blur-sm">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#F9A825]/5 to-transparent pointer-events-none"></span>
                    <span className="relative">A to Z</span>
                  </span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#0A3D62]">Services</span>
                </div>
                
                <div className="text-xs sm:text-xs md:text-xs lg:text-sm text-gray-800 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
                  Jogaad India provides A to Z doorstep services across rural and urban areas, ensuring fast, reliable assistance within <span className="font-semibold text-[#2B9EB3]">45 minutes</span> with <Cover><span className="font-semibold text-[#F9A825]">1000+ skilled professionals</span></Cover> in Odisha.
                </div>
              </div>

              <div className="pt-2 sm:pt-4 flex justify-center lg:justify-start">
                <Button
                  borderRadius="1.25rem"
                  containerClassName="h-12 sm:h-14 w-36 sm:w-44 hover:scale-105 transition-transform duration-300"
                  borderClassName="h-20 w-20 bg-[radial-gradient(#F9A825_40%,transparent_60%)] opacity-[0.9]"
                  duration={4000}
                  className="bg-gradient-to-br from-[#3BB4CF] to-[#1B7A8F] border-[#F9A825]/30 text-white font-semibold text-sm sm:text-base hover:shadow-2xl hover:shadow-[#F9A825]/20 hover:from-[#45C4E0] hover:to-[#2B9EB3] transition-all duration-300 group"
                >
                  <span className="flex items-center gap-2">
                    Get Started
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>

            <div className="h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] mt-6 lg:mt-0">
              <LayoutGridDemo />
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
      
      <CoreAreaSection />
      
      <AboutSection />
      
      <ConvenientServiceSection />
    </div>
  )
}

export default page