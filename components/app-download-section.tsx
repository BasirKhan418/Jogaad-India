"use client";
import React from 'react';
import { FaGooglePlay, FaApple } from 'react-icons/fa';
import Image from 'next/image';

export const AppDownloadSection = () => {
  return (
  <section className="relative pt-12 sm:pt-14 lg:pt-16 pb-20 sm:pb-24 lg:pb-28 mb-12 sm:mb-16 lg:mb-24 bg-gradient-to-br from-[#0A3D62] via-[#1B4A6F] to-[#0A3D62] overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(30deg, #2B9EB3 12%, transparent 12.5%, transparent 87%, #2B9EB3 87.5%, #2B9EB3),
            linear-gradient(150deg, #2B9EB3 12%, transparent 12.5%, transparent 87%, #2B9EB3 87.5%, #2B9EB3),
            linear-gradient(30deg, #2B9EB3 12%, transparent 12.5%, transparent 87%, #2B9EB3 87.5%, #2B9EB3),
            linear-gradient(150deg, #2B9EB3 12%, transparent 12.5%, transparent 87%, #2B9EB3 87.5%, #2B9EB3)`,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
        }} />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-10 left-5 w-24 h-24 sm:w-32 sm:h-32 bg-[#F9A825]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-32 h-32 sm:w-40 sm:h-40 bg-[#2B9EB3]/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left space-y-4 sm:space-y-5 order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B4FD9]/20 border border-[#5B4FD9]/30 backdrop-blur-sm">
              <span className="text-xs sm:text-sm font-semibold text-[#F9A825]">APP DOWNLOAD</span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
              Download Our App
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Consectetur adipisicing elit sed do eiusmod tempor incididunt utna labore etnalorare magna aliqua enim.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2">
              {/* Google Play Button */}
              <button
                onClick={() => alert('Coming soon on Google Play Store!')}
                className="group flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-3.5 bg-white hover:bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#34A853] to-[#4285F4] rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <FaGooglePlay className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-[0.65rem] sm:text-xs text-gray-600 font-medium">GET IT ON</div>
                  <div className="text-base sm:text-lg font-bold text-[#0A3D62]">Google Play</div>
                </div>
              </button>

              {/* App Store Button */}
              <button
                onClick={() => alert('Coming soon on App Store!')}
                className="group flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-3.5 bg-white hover:bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#555555] to-[#000000] rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <FaApple className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-[0.65rem] sm:text-xs text-gray-600 font-medium">Download on the</div>
                  <div className="text-base sm:text-lg font-bold text-[#0A3D62]">App Store</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[520px] sm:max-w-[600px] lg:max-w-[720px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B4FD9]/30 to-[#F9A825]/30 blur-3xl rounded-full scale-110"></div>

              <div className="relative z-10 h-[300px] sm:h-[340px]  lg:h-[300px] flex md:block items-end justify-center">
                <div className="hidden md:block absolute left-2 top-18 sm:left-6 bottom-0 ">
                  <Image
                    src="/app-1.jpg"
                    alt="Mobile App Service Detail"
                    width={280}
                    height={600}
                    className="w-[180px] sm:w-[210px] lg:w-[260px]  h-auto rounded-3xl shadow-2xl ring-1 ring-black/10"
                    priority
                  />
                </div>

                {/* Front phone */}
                <div className="md:absolute md:right-6 md:bottom-0 top-1 mx-auto">
                  <Image
                    src="/app-2.jpg"
                    alt="Mobile App Home Screen"
                    width={300}
                    height={640}
                    className="w-[190px] sm:w-[230px] lg:w-[290px] h-auto rounded-3xl shadow-2xl ring-1 ring-black/10"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
