"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSignup } from "@/utils/auth";
import Image from "next/image";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Shield, 
  CheckCircle2,
  UserPlus
} from "lucide-react";

export default function SignUpPage() {
  const {
    step,
    loading,
    error,
    success,
    formData,
    otp,
    setOtp,
    handleInputChange,
    sendOtp,
    submitSignup,
    goBackToDetails
  } = useSignup();

  const handleSubmitDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendOtp();
  };

  const handleSubmitOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitSignup();
  };

  const isFormValid = formData.name && formData.email;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 relative overflow-hidden">
      {/* Enhanced Background Image with better overlay */}
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
      
      {/* Main Card with improved styling - wider for better navbar clearance */}
      <div className="relative z-20 mx-auto w-full max-w-2xl">
        {/* Card with enhanced shadow and border - wider layout */}
        <div className="bg-white/85 backdrop-blur-lg rounded-3xl p-6 border border-white/60 shadow-2xl shadow-[#0A3D62]/10 relative overflow-hidden">
          {/* Subtle inner glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-[#2B9EB3]/5 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Enhanced Logo Section - smaller */}
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#2B9EB3]/20 to-[#F9A825]/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src="/logo.png"
                  alt="Jogaad India Logo"
                  width={120}
                  height={60}
                  className="h-10 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
            
            {/* Enhanced Header Section - more compact */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-2">
                {step === "details" ? "Create Your Account" : "Verify Your Email"}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step === "details" 
                  ? "Join Jogaad India and start your journey with us" 
                  : "We've sent a verification code to your email"}
              </p>
            </div>

            {/* Progress Indicator - smaller */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  step === "details" ? "bg-[#2B9EB3] ring-3 ring-[#2B9EB3]/20" : "bg-[#2B9EB3]"
                )} />
                <div className={cn(
                  "h-0.5 w-12 transition-all duration-300",
                  step === "otp" ? "bg-[#2B9EB3]" : "bg-gray-200"
                )} />
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  step === "otp" ? "bg-[#2B9EB3] ring-3 ring-[#2B9EB3]/20" : "bg-gray-200"
                )} />
              </div>
            </div>

            {/* Enhanced Error/Success Messages - more compact */}
            {error && (
              <div className="mb-3 p-3 rounded-xl bg-red-50/80 border border-red-200/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/40 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2B9EB3]" />
                  <p className="text-sm text-[#0A3D62] font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Enhanced Form Sections - horizontal layout to reduce height */}
            {step === "details" ? (
              <form onSubmit={handleSubmitDetails} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabelInputContainer>
                    <Label htmlFor="name" className="text-[#0A3D62] font-semibold flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-10 pl-4 pr-4 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 backdrop-blur-sm transition-all duration-300 text-[#0A3D62] placeholder:text-gray-400"
                      />
                    </div>
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="email" className="text-[#0A3D62] font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        placeholder="Enter your email address"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-10 pl-4 pr-4 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 backdrop-blur-sm transition-all duration-300 text-[#0A3D62] placeholder:text-gray-400"
                      />
                    </div>
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="phone" className="text-[#0A3D62] font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-10 pl-4 pr-4 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 backdrop-blur-sm transition-all duration-300 text-[#0A3D62] placeholder:text-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Optional</p>
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="address" className="text-[#0A3D62] font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="address"
                        placeholder="Enter your address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="h-10 pl-4 pr-4 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 backdrop-blur-sm transition-all duration-300 text-[#0A3D62] placeholder:text-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Optional</p>
                  </LabelInputContainer>
                </div>

                <EnhancedButton
                  type="submit"
                  disabled={loading || !isFormValid}
                  loading={loading}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="mt-4"
                >
                  {loading ? "Sending verification..." : "Continue to Verification"}
                </EnhancedButton>

                {/* Enhanced Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gradient-to-r from-transparent via-[#2B9EB3]/30 to-transparent"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/60 text-gray-500 rounded-full">or</span>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    href="/signin" 
                    className="text-[#2B9EB3] hover:text-[#0A3D62] font-semibold hover:underline transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    Sign in here
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSubmitOTP} className="space-y-4">
                {/* Enhanced Email Display - more compact and centered */}
                <div className="max-w-md mx-auto p-3 rounded-xl bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#2B9EB3]/20">
                      <Mail className="w-4 h-4 text-[#2B9EB3]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#0A3D62]">Code sent to:</p>
                      <p className="text-sm text-[#2B9EB3] font-semibold">{formData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  <LabelInputContainer>
                    <Label htmlFor="otp" className="text-[#0A3D62] font-semibold flex items-center justify-center gap-2">
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
                        className="h-10 pl-4 pr-4 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 backdrop-blur-sm transition-all duration-300 text-center text-lg font-mono tracking-widest text-[#0A3D62]"
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Enter the 6-digit code from your email
                    </p>
                  </LabelInputContainer>
                </div>

                <EnhancedButton
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  loading={loading}
                  icon={<UserPlus className="w-4 h-4" />}
                >
                  {loading ? "Creating account..." : "Create My Account"}
                </EnhancedButton>

                {/* Enhanced Back Button */}
                <div className="pt-4 border-t border-gray-200/40">
                  <button
                    type="button"
                    onClick={goBackToDetails}
                    className="flex items-center justify-center gap-2 w-full text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-semibold transition-colors duration-200 group py-2"
                  >
                    <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                    Back to account details
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
        "group/btn relative flex items-center justify-center gap-2 h-10 w-full rounded-xl",
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
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};