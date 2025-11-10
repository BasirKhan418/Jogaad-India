"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const [otp, setOtp] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setError("");
  };

  const handleSubmitDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // First, generate OTP
      const otpResponse = await fetch("/api/v1/user/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, isSignup: true }),
      });

      const otpData = await otpResponse.json();

      if (!otpData.success) {
        setError(otpData.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      setSuccess("OTP sent to your email!");
      setStep("otp");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Create user account first
      const createUserResponse = await fetch("/api/v1/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
        }),
      });

      const userData = await createUserResponse.json();

      if (!userData.success) {
        setError(userData.message || "Failed to create account");
        setLoading(false);
        return;
      }

      // Then verify OTP (this will set the authentication cookie)
      const verifyResponse = await fetch("/api/v1/user/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        setError(verifyData.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully!");
      setTimeout(() => {
        // Force a hard reload to update authentication state
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xs z-10" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-gradient-to-br from-[#2B9EB3]/30 to-[#0A3D62]/20 rounded-full blur-3xl z-10 animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-[#F9A825]/30 to-[#2B9EB3]/20 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-[#0A3D62]/20 to-[#F9A825]/20 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="relative z-20 shadow-2xl mx-auto w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-md p-8 border border-white/40">
        <h2 className="text-2xl font-bold text-[#0A3D62]">
          Create Your Account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {step === "details" 
            ? "Sign up to get started with Jogaad India" 
            : "Enter the OTP sent to your email"}
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-md bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/30">
            <p className="text-sm text-[#0A3D62] font-medium">{success}</p>
          </div>
        )}

        {step === "details" ? (
          <form className="my-8" onSubmit={handleSubmitDetails}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="john@example.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                placeholder="+91 1234567890"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-6">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                placeholder="Your address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] font-medium text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Continue →"}
              <BottomGradient />
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-[#2B9EB3] hover:text-[#0A3D62] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        ) : (
          <form className="my-8" onSubmit={handleSubmitOTP}>
            <LabelInputContainer className="mb-6">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                placeholder="123456"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError("");
                }}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Check your email for the 6-digit code
              </p>
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] font-medium text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
              <BottomGradient />
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("details");
                setOtp("");
                setError("");
                setSuccess("");
              }}
              className="mt-4 text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-semibold hover:underline w-full text-center"
            >
              ← Back to details
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-[#F9A825] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-[#2B9EB3] to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

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
