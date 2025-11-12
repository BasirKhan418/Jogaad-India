"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { 
  IconMail, 
  IconLock, 
  IconEye, 
  IconEyeOff, 
  IconArrowLeft,
  IconLoader2,
  IconShield
} from "@tabler/icons-react";
import { useAdminSignin } from "@/utils/admin/useAdminSignin";

export default function AdminSigninPage() {
  const router = useRouter();
  const {
    loading,
    error,
    success,
    step,
    email,
    otp,
    validationErrors,
    setEmail,
    setOtp,
    clearMessages,
    sendOtp,
    verifyOtp,
    goBackToEmail,
    validateForm
  } = useAdminSignin();

  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isVerified) {
      router.push('/admin/dashboard');
    }
  }, [isVerified, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (step === 'email') {
      await sendOtp();
    } else {
      const adminData = await verifyOtp();
      if (adminData) {
        setIsVerified(true);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      validateForm();
    }, 300);
    return () => clearTimeout(timer);
  }, [email, otp, step, validateForm]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/40 to-white/30 backdrop-blur-sm z-10" />
      
      {/* Dot Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Floating Brand Colors */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-[#F9A825]/20 to-[#2B9EB3]/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-[#2B9EB3]/15 to-[#0A3D62]/15 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <Toaster 
        position="top-center"
        richColors
        closeButton
        duration={4000}
      />
      
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full mb-6 shadow-lg"
            >
              <IconShield className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-[#0A3D62] mb-3">Jogaad Admin</h1>
            <p className="text-[#0A3D62]/70 text-lg">
              {step === 'email' ? 'Secure Admin Access Portal' : 'Verify your identity'}
            </p>
          </div>

          {/* Main Card */}
          <motion.div
            layout
            className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/40 ring-1 ring-[#F9A825]/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* Email Step */}
                {step === 'email' && (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <label 
                        htmlFor="email" 
                        className="block text-sm font-semibold text-[#0A3D62] mb-3"
                      >
                        Admin Email Address
                      </label>
                      <div className="relative">
                        <IconMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2B9EB3]" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full pl-12 pr-4 py-4 bg-white/70 border-2 rounded-2xl text-[#0A3D62] placeholder-[#0A3D62]/50 focus:outline-none focus:ring-2 focus:ring-[#F9A825] focus:border-[#F9A825] transition-all ${
                            validationErrors.email 
                              ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                              : 'border-white/40 hover:border-[#2B9EB3]/50'
                          }`}
                          placeholder="admin@jogaad.com"
                          required
                          disabled={loading}
                        />
                      </div>
                      {validationErrors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500 font-medium"
                        >
                          {validationErrors.email}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* OTP Step */}
                {step === 'otp' && (
                  <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Email Display */}
                    <div className="p-4 bg-gradient-to-r from-[#F9A825]/20 to-[#2B9EB3]/20 rounded-xl border border-[#F9A825]/30">
                      <p className="text-sm text-[#0A3D62] font-medium">
                        OTP sent to: <span className="font-bold">{email}</span>
                      </p>
                    </div>

                    <div>
                      <label 
                        htmlFor="otp" 
                        className="block text-sm font-semibold text-[#0A3D62] mb-3"
                      >
                        Enter 6-Digit OTP
                      </label>
                      <div className="relative">
                        <IconLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#2B9EB3]" />
                        <input
                          id="otp"
                          type={showOtp ? "text" : "password"}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className={`w-full pl-12 pr-14 py-4 bg-white/70 border-2 rounded-2xl text-[#0A3D62] placeholder-[#0A3D62]/50 focus:outline-none focus:ring-2 focus:ring-[#F9A825] focus:border-[#F9A825] transition-all ${
                            validationErrors.otp 
                              ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                              : 'border-white/40 hover:border-[#2B9EB3]/50'
                          }`}
                          placeholder="123456"
                          maxLength={6}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowOtp(!showOtp)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#2B9EB3] hover:text-[#F9A825] transition-colors"
                        >
                          {showOtp ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                        </button>
                      </div>
                      {validationErrors.otp && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500 font-medium"
                        >
                          {validationErrors.otp}
                        </motion.p>
                      )}
                    </div>

                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={goBackToEmail}
                      disabled={loading}
                      className="flex items-center space-x-2 text-[#2B9EB3] hover:text-[#F9A825] transition-colors disabled:opacity-50 font-medium"
                    >
                      <IconArrowLeft className="w-4 h-4" />
                      <span className="text-sm">Change email address</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <p className="text-sm text-green-600 font-medium">{success}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-[#F9A825] via-[#2B9EB3] to-[#0A3D62] text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-[#F9A825]/25 focus:outline-none focus:ring-2 focus:ring-[#F9A825] focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <IconLoader2 className="w-5 h-5 animate-spin" />
                    <span>
                      {step === 'email' ? 'Sending OTP...' : 'Verifying...'}
                    </span>
                  </span>
                ) : (
                  step === 'email' ? 'Send OTP Code' : 'Verify & Access Dashboard'
                )}
              </motion.button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-[#0A3D62]/60">
                Secure admin access • Protected by OTP verification
              </p>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#0A3D62]/50">
              © 2025 Jogaad India. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}