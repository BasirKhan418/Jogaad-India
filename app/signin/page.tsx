"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/v1/user/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }
      toast.success("OTP sent to your email!");
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
      const response = await fetch("/api/v1/user/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      setSuccess("Login successful!");
      router.push("/");
      toast.success("Logged in successfully!");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/v1/user/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to resend OTP");
        setLoading(false);
        return;
      }

      setSuccess("OTP resent successfully!");
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
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {step === "email" 
            ? "Sign in to your Jogaad India account" 
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

        {step === "email" ? (
          <form className="my-8" onSubmit={handleSubmitEmail}>
            <LabelInputContainer className="mb-6">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="john@example.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />
            </LabelInputContainer>

            <button
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] font-medium text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP →"}
              <BottomGradient />
            </button>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-[#2B9EB3]/30 to-transparent" />

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#2B9EB3] hover:text-[#0A3D62] font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        ) : (
          <form className="my-8" onSubmit={handleSubmitOTP}>
            <div className="mb-4 p-3 rounded-md bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/30">
              <p className="text-sm text-[#0A3D62]">
                OTP sent to: <span className="font-semibold">{email}</span>
              </p>
            </div>

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
              {loading ? "Verifying..." : "Verify & Sign In"}
              <BottomGradient />
            </button>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                className="text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-semibold hover:underline"
              >
                ← Change email
              </button>
              
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-semibold hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
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
