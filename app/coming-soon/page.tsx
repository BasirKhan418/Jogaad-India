"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Mail, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ComingSoonPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#2B9EB3]/5 to-[#F9A825]/10 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#2B9EB3]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#F9A825]/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2B9EB3]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => router.back()}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 group z-10"
      >
        <ArrowLeft className="w-4 h-4 text-gray-700 group-hover:text-[#2B9EB3] transition-colors duration-300" />
        <span className="text-sm font-medium text-gray-700 group-hover:text-[#2B9EB3] transition-colors duration-300">
          Back
        </span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Icon with Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
          className="mb-8 sm:mb-12 flex justify-center"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#2B9EB3] to-[#F9A825] rounded-full blur-xl opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative bg-gradient-to-br from-[#2B9EB3] to-[#1B7A8F] p-6 sm:p-8 rounded-3xl shadow-2xl">
              <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
            Coming{" "}
            <span className="bg-gradient-to-r from-[#2B9EB3] to-[#F9A825] bg-clip-text text-transparent">
              Soon
            </span>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
        >
          We're working hard to bring you this amazing service. Stay tuned for
          something spectacular!
        </motion.p>

        {/* Email Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-md mx-auto px-4"
        >
          {!isSubscribed ? (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-full border-2 border-gray-200 focus:border-[#2B9EB3] focus:outline-none transition-colors duration-300 text-sm sm:text-base"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (email) {
                    setIsSubscribed(true);
                    setTimeout(() => setIsSubscribed(false), 3000);
                  }
                }}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#2B9EB3] to-[#1B7A8F] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Notify Me</span>
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-50 border-2 border-green-200 rounded-full py-4 px-6 text-green-700 font-semibold flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm sm:text-base">Thanks! We'll notify you!</span>
            </motion.div>
          )}
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-4"
        >
          {[
            {
              icon: "🚀",
              title: "Fast & Reliable",
              description: "Quick service delivery",
            },
            {
              icon: "✨",
              title: "Quality Service",
              description: "Verified professionals",
            },
            {
              icon: "💯",
              title: "Affordable",
              description: "Best prices guaranteed",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-[#2B9EB3]/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1 text-base sm:text-lg">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
