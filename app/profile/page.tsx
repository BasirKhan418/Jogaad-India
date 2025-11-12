"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLogOut, FiHome, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { logoutUser } from "@/actions/logout";
import { toast } from "sonner";
interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  img?: string;
  isImposedFine: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    //add profile update functionality with image upload and crop
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/v1/verify");
        const data = await response.json();

        if (!data.success) {
          router.push("/signin");
          return;
        }

        setUser(data.data);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    logoutUser().then(() => {
      router.push("/signin");
      toast.success("Logged out successfully!");
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
        
        <div className="text-center relative z-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#2B9EB3] border-r-[#F9A825] border-b-[#0A3D62] border-l-transparent mx-auto"></div>
          <p className="mt-6 text-[#0A3D62] font-medium text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
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
        
        <div className="text-center relative z-20 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/40">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold mb-4">{error || "User not found"}</p>
          <Link href="/signin" className="inline-block px-6 py-3 rounded-md bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white hover:shadow-lg transition-all font-medium">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
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
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Spotlight Effects */}
      <div className="hidden lg:block">
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(249, 168, 37, 0.10) 0, rgba(249, 168, 37, 0.05) 50%, rgba(249, 168, 37, 0) 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(43, 158, 179, 0.08) 0, rgba(43, 158, 179, 0.03) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(249, 168, 37, 0.07) 0, rgba(249, 168, 37, 0.03) 80%, transparent 100%)"
          translateY={-300}
          width={600}
          height={1400}
          duration={8}
          xOffset={120}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#2B9EB3]/30 to-[#0A3D62]/20 rounded-full blur-3xl z-10 animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-[#F9A825]/30 to-[#2B9EB3]/20 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-[#0A3D62]/20 to-[#F9A825]/20 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-5xl w-full mx-auto relative z-20">
        <div className="bg-white/90 backdrop-blur-md relative border border-white/40 w-full h-auto rounded-3xl p-8 shadow-2xl">
          {/* Header Section with Avatar */}
          <div className="w-full mb-8">
            <div className="flex flex-col items-center text-center">
                {/* Large Avatar */}
                <div className="relative mb-6">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#2B9EB3] via-[#F9A825] to-[#0A3D62] p-1 shadow-xl">
                    <div className="h-full w-full rounded-full bg-white/95 flex items-center justify-center">
                      <span className="text-5xl font-bold bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] bg-clip-text text-transparent">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    {user.isImposedFine ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white shadow-lg">
                        <FiAlertCircle className="w-3 h-3" />
                        Fine Imposed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg">
                        <FiCheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Name and Title */}
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] bg-clip-text text-transparent mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 font-medium">{user.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

          {/* Profile Information Grid */}
          <div className="w-full mb-8">
              <h2 className="text-2xl font-bold text-[#0A3D62] mb-6 text-center">
                Profile Information
              </h2>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="group p-5 rounded-xl bg-gradient-to-br from-[#2B9EB3]/5 to-[#0A3D62]/5 border border-[#2B9EB3]/20 hover:border-[#2B9EB3]/40 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] text-white">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Full Name
                  </label>
                </div>
                <p className="text-lg text-[#0A3D62] font-bold ml-11">
                  {user.name}
                </p>
              </div>

              {/* Email Address */}
              <div className="group p-5 rounded-xl bg-gradient-to-br from-[#F9A825]/5 to-[#2B9EB3]/5 border border-[#F9A825]/20 hover:border-[#F9A825]/40 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#F9A825] to-[#2B9EB3] text-white">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Email Address
                  </label>
                </div>
                <p className="text-lg text-[#0A3D62] font-bold ml-11 break-all">
                  {user.email}
                </p>
              </div>

              {/* Phone Number */}
              <div className="group p-5 rounded-xl bg-gradient-to-br from-[#0A3D62]/5 to-[#F9A825]/5 border border-[#0A3D62]/20 hover:border-[#0A3D62]/40 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#0A3D62] to-[#F9A825] text-white">
                    <FiPhone className="w-4 h-4" />
                  </div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Phone Number
                  </label>
                </div>
                <p className="text-lg text-[#0A3D62] font-bold ml-11">
                  {user.phone || "Not provided"}
                </p>
              </div>

              {/* Address */}
              <div className="group p-5 rounded-xl bg-gradient-to-br from-[#2B9EB3]/5 to-[#F9A825]/5 border border-[#2B9EB3]/20 hover:border-[#2B9EB3]/40 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#2B9EB3] to-[#F9A825] text-white">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Address
                  </label>
                </div>
                <p className="text-lg text-[#0A3D62] font-bold ml-11">
                  {user.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              href="/"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <FiHome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Go to Home
            </Link>
            <button
              onClick={handleLogout}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-red-500 text-red-600 font-semibold hover:bg-red-50 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <FiLogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
