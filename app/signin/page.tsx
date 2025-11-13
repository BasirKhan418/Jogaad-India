"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useSignin } from "@/utils/auth";
import { Mail, ArrowRight, ArrowLeft, RotateCcw, Shield, CheckCircle2 } from "lucide-react";

export default function SignInPage() {
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
    resetForm
  } = useSignin();

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSendOtp(email);
  };

  const handleSubmitOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleValidateOtp(email, otp);
  };

  const handleResendOTPClick = async () => {
    await handleResendOtp(email);
  };

  const handleChangeEmail = () => {
    setStep("email");
    setOtp("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Enhanced Background Overlay with better gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/40 to-slate-50/30 backdrop-blur-sm z-10" />
      
      {/* Improved Gradient Orbs with better positioning and animation */}
      <div className="absolute top-10 -left-32 w-80 h-80 bg-gradient-to-br from-[#2B9EB3]/25 to-[#0A3D62]/15 rounded-full blur-3xl z-10 animate-pulse"></div>
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-gradient-to-tl from-[#F9A825]/25 to-[#2B9EB3]/15 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-[#0A3D62]/15 to-[#F9A825]/15 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Enhanced background pattern with better visibility */}
      <div className="absolute inset-0 z-10 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
        backgroundSize: '50px 50px'
      }} />
      
      {/* Main Card with improved styling */}
      <div className="relative z-20 mx-auto w-full max-w-md">
        {/* Card with enhanced shadow and border */}
        <div className="bg-white/85 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-2xl shadow-[#0A3D62]/10 relative overflow-hidden">
          {/* Subtle inner glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-[#2B9EB3]/5 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Enhanced Logo Section */}
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
            
            {/* Enhanced Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-base leading-relaxed">
                {step === "email" 
                  ? "Sign in to your Jogaad India account to continue your journey" 
                  : "We've sent a verification code to your email"}
              </p>
            </div>

            {/* Enhanced Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50/80 border border-red-200/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/40 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2B9EB3]" />
                  <p className="text-sm text-[#0A3D62] font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Enhanced Form Sections */}
            {step === "email" ? (
              <form onSubmit={handleSubmitEmail} className="space-y-6">
                <LabelInputContainer>
                  <Label htmlFor="email" className="text-[#0A3D62] font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      placeholder="Enter your email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 backdrop-blur-sm transition-all duration-300 text-[#0A3D62] placeholder:text-gray-400"
                    />
                  </div>
                </LabelInputContainer>

                <EnhancedButton
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  {loading ? "Sending OTP..." : "Send Verification Code"}
                </EnhancedButton>

                {/* Enhanced Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gradient-to-r from-transparent via-[#2B9EB3]/30 to-transparent"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/60 text-gray-500 rounded-full">or</span>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link 
                    href="/signup" 
                    className="text-[#2B9EB3] hover:text-[#0A3D62] font-semibold hover:underline transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    Create one now
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSubmitOTP} className="space-y-6">
                {/* Enhanced Email Display */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#2B9EB3]/20">
                      <Mail className="w-4 h-4 text-[#2B9EB3]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0A3D62]">Verification code sent to:</p>
                      <p className="text-sm text-[#2B9EB3] font-semibold">{email}</p>
                    </div>
                  </div>
                </div>

                <LabelInputContainer>
                  <Label htmlFor="otp" className="text-[#0A3D62] font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="otp"
                      placeholder="Enter 6-digit code"
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      required
                      className="h-12 pl-4 pr-4 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 backdrop-blur-sm transition-all duration-300 text-center text-lg font-mono tracking-widest text-[#0A3D62]"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Enter the 6-digit code from your email
                  </p>
                </LabelInputContainer>

                <EnhancedButton
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  loading={loading}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </EnhancedButton>

                {/* Enhanced Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/40">
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="flex items-center gap-2 text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-semibold transition-colors duration-200 group"
                  >
                    <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                    Change email
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendOTPClick}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <RotateCcw className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    Resend code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Button Component
const EnhancedButton = ({ 
  children, 
  loading = false, 
  icon, 
  className = "", 
  ...props 
}: {
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button
      className={cn(
        "group/btn relative flex items-center justify-center gap-2 h-12 w-full rounded-xl",
        "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] font-semibold text-white",
        "shadow-lg hover:shadow-xl hover:shadow-[#2B9EB3]/25 transition-all duration-300",
        "transform hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2 relative z-10">
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : icon}
        {children}
      </span>
      <EnhancedBottomGradient />
    </button>
  );
};

// Enhanced Bottom Gradient Effect
const EnhancedBottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-[#F9A825] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-[#2B9EB3] to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

// Enhanced Label Input Container
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-3", className)}>
      {children}
    </div>
  );
};