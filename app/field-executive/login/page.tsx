"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useFieldExecLogin } from "@/utils/fieldexecutive/useFieldExecLogin";
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Shield, 
  CheckCircle2, 
  MapPin, 
  AlertCircle 
} from "lucide-react";

/**
 * Field Executive Login Page
 * Two-step authentication: Email → OTP verification
 * Follows DRY and SRP principles with custom hook for business logic
 */
export default function FieldExecLoginPage() {
  const {
    step,
    loading,
    error,
    success,
    email,
    otp,
    setStep,
    setEmail,
    setOtp,
    handleSendOtp,
    handleValidateOtp,
    handleResendOtp,
  } = useFieldExecLogin();

  /**
   * Handle email submission (Step 1)
   */
  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSendOtp(email);
  };

  /**
   * Handle OTP submission (Step 2)
   */
  const handleSubmitOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleValidateOtp(email, otp);
  };

  /**
   * Handle resend OTP button click
   */
  const handleResendOTPClick = async () => {
    await handleResendOtp(email);
  };

  /**
   * Handle change email button click
   */
  const handleChangeEmail = () => {
    setStep("email");
    setOtp("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
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
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/40 to-slate-50/30 backdrop-blur-sm z-10" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-10 -left-32 w-80 h-80 bg-gradient-to-br from-[#2B9EB3]/25 to-[#0A3D62]/15 rounded-full blur-3xl z-10 animate-pulse"></div>
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-gradient-to-tl from-[#F9A825]/25 to-[#2B9EB3]/15 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-[#0A3D62]/15 to-[#F9A825]/15 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-10 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }} />
      
      {/* Main Card */}
      <div className="relative z-20 mx-auto w-full max-w-md">
        <div className="bg-white/85 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-2xl shadow-[#0A3D62]/10 relative overflow-hidden">
          {/* Inner Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-[#2B9EB3]/5 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Logo Section */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#2B9EB3]/20 to-[#F9A825]/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src="/logo.png"
                  alt="Jogaad India Logo"
                  width={140}
                  height={70}
                  className="h-14 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
            
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] p-3 rounded-2xl shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-3">
                Field Executive Login
              </h1>
              <p className="text-slate-600 text-sm">
                {step === 'email' ? 'Enter your email to receive OTP' : 'Enter the OTP sent to your email'}
              </p>
            </div>

            {/* Step 1: Email Input Form */}
            {step === 'email' && (
              <form onSubmit={handleSubmitEmail} className="space-y-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="email" 
                    className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-[#2B9EB3]" />
                    Work Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      placeholder="fieldexec@company.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                      className={cn(
                        "h-12 px-4 rounded-xl border-2 transition-all duration-300",
                        "focus:border-[#2B9EB3] focus:ring-2 focus:ring-[#2B9EB3]/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "placeholder:text-slate-400",
                        error ? "border-red-300" : "border-slate-200"
                      )}
                    />
                    {error && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className={cn(
                    "w-full h-12 rounded-xl font-semibold text-white",
                    "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62]",
                    "hover:from-[#0A3D62] hover:to-[#2B9EB3]",
                    "transition-all duration-300 shadow-lg hover:shadow-xl",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center gap-2 group"
                  )}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification Form */}
            {step === 'otp' && (
              <form onSubmit={handleSubmitOTP} className="space-y-6">
                {/* Email Display */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      <Mail className="w-4 h-4 text-[#2B9EB3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-0.5">OTP sent to</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    disabled={loading}
                    className="text-[#2B9EB3] hover:text-[#0A3D62] text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Change
                  </button>
                </div>

                {/* OTP Input */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="otp" 
                    className="text-sm font-semibold text-slate-700 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-[#2B9EB3]" />
                    Enter OTP
                  </Label>
                  <div className="relative">
                    <Input
                      id="otp"
                      placeholder="000000"
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                      }}
                      disabled={loading}
                      required
                      maxLength={6}
                      className={cn(
                        "h-14 px-4 rounded-xl border-2 transition-all duration-300",
                        "text-center text-2xl font-semibold tracking-widest",
                        "focus:border-[#2B9EB3] focus:ring-2 focus:ring-[#2B9EB3]/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "placeholder:text-slate-300 placeholder:tracking-widest",
                        error ? "border-red-300" : "border-slate-200"
                      )}
                    />
                    {error && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className={cn(
                    "w-full h-12 rounded-xl font-semibold text-white",
                    "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62]",
                    "hover:from-[#0A3D62] hover:to-[#2B9EB3]",
                    "transition-all duration-300 shadow-lg hover:shadow-xl",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center gap-2 group"
                  )}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Login</span>
                      <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>

                {/* Resend OTP Button */}
                <button
                  type="button"
                  onClick={handleResendOTPClick}
                  disabled={loading}
                  className={cn(
                    "w-full h-11 rounded-xl font-medium",
                    "bg-slate-50 hover:bg-slate-100 text-slate-700",
                    "border-2 border-slate-200 hover:border-slate-300",
                    "transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Resend OTP</span>
                </button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleChangeEmail}
                  disabled={loading}
                  className="w-full text-slate-600 hover:text-[#2B9EB3] text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Email</span>
                </button>
              </form>
            )}

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center space-y-3">
                <p className="text-sm text-slate-600">
                  Need help?{' '}
                  <Link 
                    href="/contact" 
                    className="font-semibold text-[#2B9EB3] hover:text-[#0A3D62] transition-colors"
                  >
                    Contact Support
                  </Link>
                </p>
                <p className="text-xs text-slate-500">
                  By logging in, you agree to our{' '}
                  <Link href="/terms" className="text-[#2B9EB3] hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#2B9EB3] hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
