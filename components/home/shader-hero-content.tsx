"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { FiArrowRight } from "react-icons/fi"
import { LayoutGridDemo } from "@/components/home/layout-grid-demo"
import { LayoutTextFlip } from "@/components/ui/layout-text-flip"
import { Cover } from "@/components/ui/cover"
import { Button as MovingBorderButton } from "@/components/ui/moving-border"
import Link from "next/link"

function ShaderHeroContent() {
  return (
    <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 pt-24 pb-16 sm:py-20 md:py-24 lg:py-32">
      <div className="flex flex-col xl:grid xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 xl:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-10"
          style={{ willChange: 'opacity, transform' }}
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-[#2B9EB3]/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#2B9EB3] animate-pulse" />
            <span className="text-xs font-medium text-[#0A3D62]">24/7 Available • All Odisha</span>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <LayoutTextFlip
                text="Professional"
                words={["Doorstep", "Quality", "Reliable", "Fast"]}
                duration={2500}
              />
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A3D62] leading-[1.1]">
                Services
              </h2>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] bg-clip-text text-transparent leading-[1.1]">
                Anywhere in Odisha
              </div>
            </div>
            
            <div className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl pt-2">
              From cities to villages, <Cover>skilled professionals</Cover> deliver 
              essential services across every block and panchayat with guaranteed 
              <span className="font-semibold text-[#2B9EB3]"> quick response time</span>.
            </div>
          </div>

          {/* Elegant Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 py-4 sm:py-6 border-t border-b border-gray-400/60">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#0A3D62] to-[#1B7A8F] bg-clip-text text-transparent">Expert</div>
              <div className="text-xs sm:text-sm text-gray-600">Professionals</div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#2B9EB3] to-[#3BB4CF] bg-clip-text text-transparent">Fast</div>
              <div className="text-xs sm:text-sm text-gray-600">Response</div>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#F9A825] to-[#FF9800] bg-clip-text text-transparent">A-Z</div>
              <div className="text-xs sm:text-sm text-gray-600">Services</div>
            </div>
          </div>

          {/* Premium CTA */}
          <div className="flex items-center gap-4 pt-2">
            <Link href="/signin" className="w-full sm:w-auto">
              <MovingBorderButton
                borderRadius="1rem"
                containerClassName="w-full sm:w-auto h-auto"
                borderClassName="bg-[radial-gradient(#F9A825_40%,#FFD700_60%)] opacity-100"
                duration={3000}
                className="bg-[#0A3D62] text-white font-semibold border-slate-800/50 hover:bg-[#0A3D62]/90 px-8 py-3 flex items-center justify-center gap-2 group"
              >
                Get Started Today
                <FiArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </MovingBorderButton>
            </Link>
          </div>

          {/* Trust Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-5 h-5 text-[#F9A825]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Trusted service across Odisha</span>
          </div>
        </motion.div>

        {/* Right Side - Stylish Image Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
          style={{ willChange: 'opacity' }}
        >
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#F9A825]/20 to-[#2B9EB3]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-[#2B9EB3]/20 to-[#0A3D62]/20 rounded-full blur-3xl" />
          
          {/* Image Grid Container */}
          <div className="relative rounded-[2rem] overflow-hidden h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px]">
            {/* Outer frame with sophisticated border */}
            <div className="absolute inset-0 rounded-[2rem] p-[2px] bg-gradient-to-br from-[#F9A825]/40 via-[#2B9EB3]/40 to-[#0A3D62]/40" 
              style={{
                boxShadow: '0 20px 60px -15px rgba(10, 61, 98, 0.3), 0 10px 30px -10px rgba(43, 158, 179, 0.2)'
              }}>
              <div className="h-full w-full rounded-[2rem] bg-white/90 backdrop-blur-lg overflow-hidden relative">
                {/* Inner subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-[#2B9EB3]/5" />
                <div className="relative h-full w-full">
                  <LayoutGridDemo />
                </div>
              </div>
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-[#F9A825] rounded-tl-xl opacity-60" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-[#2B9EB3] rounded-br-xl opacity-60" />
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 px-3 sm:px-6 py-2 sm:py-3 bg-white rounded-full shadow-xl border border-gray-100 flex items-center gap-2 sm:gap-3 max-w-[280px] sm:max-w-none">
            <div className="flex -space-x-1 sm:-space-x-2">
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br from-[#F9A825] to-[#FF9800] ring-2 ring-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop" 
                  alt="Service Professional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br from-[#2B9EB3] to-[#3BB4CF] ring-2 ring-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&h=100&fit=crop" 
                  alt="Happy Customer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br from-[#0A3D62] to-[#1B7A8F] ring-2 ring-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
                  alt="Service Expert"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-bold text-[#0A3D62]">Quality Service</div>
              <div className="text-xs text-gray-500">5★ Rated</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default memo(ShaderHeroContent)
