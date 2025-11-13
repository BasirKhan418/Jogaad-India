"use client";
import React from 'react';
import { FaGooglePlay, FaApple, FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'sonner';

const features = [
  "Book services in seconds",
  "Real-time service tracking",
  "Secure payment options",
  "24/7 customer support"
];

export const AppDownloadSection = () => {
  const handleGooglePlay = () => {
    toast.success('Coming Soon!', {
      description: 'Google Play Store version will be available soon. Stay tuned!',
      duration: 4000,
    });
  };

  const handleAppStore = () => {
    toast.success('Coming Soon!', {
      description: 'App Store version will be available soon. Stay tuned!',
      duration: 4000,
    });
  };

  return (
    <section className="relative py-12 sm:py-14 lg:py-16 bg-gradient-to-br from-[#0A3D62] via-[#0B4870] to-[#0A3D62] overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#2B9EB3 1px, transparent 1px), linear-gradient(90deg, #2B9EB3 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Gradient Orbs */}
        <div className="absolute top-10 left-[10%] w-72 h-72 bg-gradient-to-r from-[#2B9EB3]/20 to-[#F9A825]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-[10%] w-64 h-64 bg-gradient-to-r from-[#F9A825]/15 to-[#2B9EB3]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-end">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-4 sm:space-y-5 order-2 lg:order-1 pb-4 sm:pb-6 lg:pb-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#F9A825]/20 to-[#2B9EB3]/20 border border-[#F9A825]/30 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F9A825] rounded-full animate-pulse"></div>
              <span className="text-[0.65rem] sm:text-xs md:text-sm font-semibold text-[#F9A825] uppercase tracking-wider">Mobile App</span>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2 sm:mb-3">
                Experience Jogaad India
                <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] bg-clip-text text-transparent">
                  On The Go
                </span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                Download our app for seamless service booking, real-time tracking, and exclusive mobile-only offers.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-2.5 text-white/90">
                  <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-[#F9A825] to-[#2B9EB3] flex items-center justify-center">
                    <FaCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm md:text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              {/* Google Play */}
              <button
                onClick={handleGooglePlay}
                className="group relative flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 bg-white hover:bg-gray-50 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#2B9EB3]/0 via-[#2B9EB3]/5 to-[#2B9EB3]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#34A853] to-[#4285F4] rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaGooglePlay className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                
                <div className="relative text-left">
                  <div className="text-[0.65rem] sm:text-xs text-gray-600 font-medium uppercase tracking-wide">Get it on</div>
                  <div className="text-sm sm:text-base font-bold text-[#0A3D62]">Google Play</div>
                </div>
              </button>

              {/* App Store */}
              <button
                onClick={handleAppStore}
                className="group relative flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 bg-white hover:bg-gray-50 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#F9A825]/0 via-[#F9A825]/5 to-[#F9A825]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#555555] to-[#000000] rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaApple className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                
                <div className="relative text-left">
                  <div className="text-[0.65rem] sm:text-xs text-gray-600 font-medium uppercase tracking-wide">Download on the</div>
                  <div className="text-sm sm:text-base font-bold text-[#0A3D62]">App Store</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Side - Phone Mockups */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end h-full">
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[580px] h-full">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B9EB3]/30 via-[#F9A825]/20 to-[#2B9EB3]/30 blur-3xl rounded-full scale-110 opacity-60"></div>

              {/* Phone Container - aligned to bottom */}
              <div className="relative z-10 sm:mt-0 mt-0 lg:mt-20 h-full min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px] flex items-end justify-center pb-0">
                {/* Back Phone (Left) */}
                <div className="hidden md:block absolute left-0 sm:left-2 lg:left-6 bottom-0 transform hover:scale-105 transition-transform duration-300">
                  <div className="relative">
                    <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-[#2B9EB3]/40 to-transparent rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl"></div>
                    <Image
                      src="/app-1.jpg"
                      alt="App Service Detail"
                      width={280}
                      height={600}
                      className="relative w-[150px] ml-12 sm:w-[170px] md:w-[200px] lg:w-[230px] h-auto rounded-2xl sm:rounded-3xl shadow-2xl ring-1 sm:ring-2 ring-white/10"
                      priority
                    />
                  </div>
                </div>

                {/* Front Phone (Right) */}
                <div className="md:absolute md:right-0 sm:md:right-2 lg:md:right-6 bottom-0 transform hover:scale-105 transition-transform duration-300">
                  <div className="relative">
                    <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-[#F9A825]/40 to-transparent rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl"></div>
                    <Image
                      src="/app-2.jpg"
                      alt="App Home Screen"
                      width={300}
                      height={640}
                      className="relative w-[160px] sm:w-[180px] md:w-[220px] lg:w-[260px] h-auto rounded-2xl sm:rounded-3xl shadow-2xl ring-1 sm:ring-2 ring-white/10"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
