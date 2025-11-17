"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { IconLogout } from "@tabler/icons-react";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useUserNavigation } from "@/utils/user/useUserNavigation";
import { 
  useUserData, 
  useUserLogout, 
  useUserSidebar 
} from "@/utils/user/useUserHooks";
import { MobileBottomNav } from "@/components/user/MobileBottomNav";
import { UserStatsCard } from "@/components/user/UserStatsCard";
import { 
  Calendar,
  ShoppingBag,
  Settings,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react";

/**
 * User Dashboard Component
 * Follows DRY and SRP principles
 */
export default function UserDashboard() {
  const router = useRouter();
  const { userData, loading, error } = useUserData();
  const { handleLogout } = useUserLogout();
  const { open, setOpen } = useUserSidebar();
  const { links } = useUserNavigation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden md:flex-row", "h-screen")}>
      <Toaster position="top-right" richColors />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            
            <div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                {userData && (
                  <SidebarLink
                    link={{
                      label: userData.name || userData.email,
                      href: "/user/profile",
                      icon: (
                        <UserAvatar userData={userData} />
                      ),
                    }}
                  />
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full py-2 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors mt-2"
                >
                  <IconLogout className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />
                  <motion.span
                    animate={{
                      display: open ? "inline-block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="text-sm text-neutral-700 dark:text-neutral-200"
                  >
                    Logout
                  </motion.span>
                </button>
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="p-4 md:p-8 pb-24 md:pb-8">
          {/* Welcome Header */}
          <WelcomeHeader userName={userData?.name} />

          {/* Stats Cards */}
          <UserStatsCard userData={userData} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Profile Information */}
          <ProfileInfo userData={userData} />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        links={links} 
        currentPath="/user/dashboard"
      />
    </div>
  );
}

/**
 * Loading Screen Component - Follows SRP
 */
const LoadingScreen = () => (
  <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
    <div 
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
    <div className="relative z-20 text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
      <p className="text-[#0A3D62] font-semibold">Loading dashboard...</p>
    </div>
  </div>
);

/**
 * Error Screen Component - Follows SRP
 */
const ErrorScreen = ({ error }: { error: string }) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
      <div className="relative z-20 text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#0A3D62] mb-2">Access Error</h2>
        <p className="text-[#0A3D62]/70 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/signin')}
          className="bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

/**
 * Welcome Header Component - Follows SRP
 */
const WelcomeHeader = ({ userName }: { userName?: string }) => (
  <div className="mb-8">
    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-2">
      Welcome back, {userName?.split(' ')[0] || 'User'}!
    </h1>
    <p className="text-slate-600">Manage your bookings and services</p>
  </div>
);

/**
 * User Avatar Component - Follows SRP
 */
const UserAvatar = ({ userData }: { userData: any }) => (
  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center overflow-hidden relative">
    {userData.img && userData.img.trim() !== "" ? (
      <img
        src={userData.img}
        alt={userData.name}
        className="h-7 w-7 rounded-full object-cover absolute inset-0"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    ) : null}
    <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
      {getUserInitials(userData.name || userData.email || "U")}
    </span>
  </div>
);

/**
 * Quick Actions Component - Follows SRP
 */
const QuickActions = () => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
    <h2 className="text-xl font-bold text-[#0A3D62] mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Link
        href="/services"
        className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#2B9EB3]/5 to-[#0A3D62]/5 rounded-xl hover:shadow-md transition-shadow border border-[#2B9EB3]/20"
      >
        <div className="p-2 bg-[#2B9EB3] rounded-lg">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-[#0A3D62]">Browse Services</p>
          <p className="text-xs text-slate-600">Explore available services</p>
        </div>
      </Link>
      
      <Link
        href="/user/bookings"
        className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#F9A825]/5 to-[#2B9EB3]/5 rounded-xl hover:shadow-md transition-shadow border border-[#F9A825]/20"
      >
        <div className="p-2 bg-[#F9A825] rounded-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-[#0A3D62]">My Bookings</p>
          <p className="text-xs text-slate-600">View your bookings</p>
        </div>
      </Link>
      
      <Link
        href="/user/profile"
        className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-xl hover:shadow-md transition-shadow border border-green-500/20"
      >
        <div className="p-2 bg-green-600 rounded-lg">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-[#0A3D62]">Update Profile</p>
          <p className="text-xs text-slate-600">Manage your account</p>
        </div>
      </Link>
    </div>
  </div>
);

/**
 * Profile Info Component - Follows SRP
 */
const ProfileInfo = ({ userData }: { userData: any }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
    <h2 className="text-xl font-bold text-[#0A3D62] mb-4">Your Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoItem
        icon={<MapPin className="w-5 h-5 text-[#2B9EB3]" />}
        label="Full Name"
        value={userData?.name}
      />
      <InfoItem
        icon={<MapPin className="w-5 h-5 text-[#2B9EB3]" />}
        label="Email"
        value={userData?.email}
      />
      <InfoItem
        icon={<Clock className="w-5 h-5 text-[#2B9EB3]" />}
        label="Phone"
        value={userData?.phone}
      />
      <InfoItem
        icon={<TrendingUp className="w-5 h-5 text-[#2B9EB3]" />}
        label="Address"
        value={userData?.address || 'Not provided'}
      />
    </div>
  </div>
);

/**
 * Info Item Component - Follows DRY principle
 */
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-[#2B9EB3]/10 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-[#0A3D62]">{value || 'N/A'}</p>
    </div>
  </div>
);

/* Logo Components - Follows DRY */
export const Logo = () => (
  <Link
    href="/user/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India Logo" 
      className="h-8 w-auto"
    />
  </Link>
);

export const LogoIcon = () => (
  <Link
    href="/user/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India" 
      className="h-8 w-8 object-contain"
    />
  </Link>
);
