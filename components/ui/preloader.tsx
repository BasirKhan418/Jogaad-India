"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const pathname = usePathname();

  // Check if this is an employee or admin route
  const isEmployeeRoute = pathname?.startsWith("/employee");
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // Only show preloader on initial page load, not on route changes
    if (!isInitialLoad) {
      setIsLoading(false);
      return;
    }

    const LOADING_DURATION = 2500;

    const hideTimeout = setTimeout(() => {
      setIsLoading(false);
      setIsInitialLoad(false);
    }, LOADING_DURATION);

    return () => {
      clearTimeout(hideTimeout);
    };
  }, [isInitialLoad]);

  // Hide preloader on route change (client-side navigation)
  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(false);
    }
  }, [pathname, isInitialLoad]);

  // Don't show preloader on employee or admin routes at all
  if (isEmployeeRoute || isAdminRoute) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden"
        >
          {/* Animated background patterns */}
          <div className="absolute inset-0">
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-gray-50/50 to-gray-100/30" />
            
            {/* Subtle moving shapes */}
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
                opacity: [0.03, 0.06, 0.03],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#2B9EB3] to-[#F9A825] rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, 60, 0],
                scale: [1.2, 1, 1.2],
                opacity: [0.04, 0.08, 0.04],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-tl from-[#F9A825] to-[#2B9EB3] rounded-full blur-3xl"
            />
          </div>

          {/* Main content */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Elegant logo container */}
            <div className="relative mb-10">
              
              {/* Outer rotating ring - clockwise */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 -m-12"
              >
                <svg width="240" height="240" viewBox="0 0 240 240" className="w-full h-full">
                  <defs>
                    <linearGradient id="ringGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2B9EB3" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#F9A825" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2B9EB3" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <circle 
                    cx="120" 
                    cy="120" 
                    r="110" 
                    fill="none" 
                    stroke="url(#ringGradient1)" 
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                </svg>
              </motion.div>

              {/* Inner rotating ring - counter-clockwise */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 -m-8"
              >
                <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="ringGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F9A825" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#2B9EB3" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#F9A825" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  <circle 
                    cx="100" 
                    cy="100" 
                    r="90" 
                    fill="none" 
                    stroke="url(#ringGradient2)" 
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                </svg>
              </motion.div>

              {/* Subtle pulse effect */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-8 bg-gradient-to-br from-[#2B9EB3]/20 via-transparent to-[#F9A825]/20 rounded-full blur-2xl"
              />

              {/* Logo without box */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotate: 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                  delay: 0.2
                }}
                className="relative w-36 h-36 md:w-44 md:h-44"
              >
                <Image
                  src="/logo.png"
                  alt="Jogaad India"
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </motion.div>
            </div>

            {/* Brand name with sophisticated animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="inline-block bg-gradient-to-br from-[#F9A825] to-[#f39c12] bg-clip-text text-transparent"
                >
                  Jogaad
                </motion.span>
                <span className="text-gray-300 mx-2">•</span>
                <motion.span 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="inline-block bg-gradient-to-br from-[#2B9EB3] to-[#1e7a8f] bg-clip-text text-transparent"
                >
                  India
                </motion.span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="text-xs md:text-sm text-gray-400 tracking-wide uppercase font-light"
              >
                Customer Solution Is Our Satisfaction
              </motion.p>
            </motion.div>

            {/* Elegant loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#F9A825]" />
                  <motion.div
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#F9A825]"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
