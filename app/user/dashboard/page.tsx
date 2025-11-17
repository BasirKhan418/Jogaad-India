"use client";

import React, { useEffect, useState } from "react";
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
  CheckCircle,
  XCircle,
  Loader2,
  IndianRupee,
} from "lucide-react";

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  totalSpent: number;
}


export default function UserDashboard() {
  const router = useRouter();
  const { userData, loading, error } = useUserData();
  const { handleLogout } = useUserLogout();
  const { open, setOpen } = useUserSidebar();
  const { links } = useUserNavigation();
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  // Fetch booking statistics
  useEffect(() => {
    if (userData) {
      fetchBookingStats();
    }
  }, [userData]);

  const fetchBookingStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch("/api/v1/user/booking", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success && data.data) {
        const bookings = data.data;
        
        // Calculate statistics
        const stats = {
          total: bookings.length,
          pending: bookings.filter((b: any) => b.status === "pending").length,
          confirmed: bookings.filter((b: any) => 
            b.status === "confirmed" || 
            b.status === "in-progress" || 
            b.status === "started"
          ).length,
          completed: bookings.filter((b: any) => b.status === "completed").length,
          cancelled: bookings.filter((b: any) => b.status === "cancelled").length,
          totalSpent: bookings
            .filter((b: any) => b.status === "completed")
            .reduce((sum: number, b: any) => sum + (b.bookingAmount || b.intialamount || 0), 0),
        };

        setBookingStats(stats);
        
        // Get recent bookings (last 3)
        const recent = bookings
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        setRecentBookings(recent);
      }
    } catch (error) {
      console.error("Error fetching booking stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

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

          {/* Booking Insights */}
          <BookingInsights stats={bookingStats} loading={statsLoading} />

          {/* Recent Bookings */}
          <RecentBookings bookings={recentBookings} loading={statsLoading} />

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
 * Booking Insights Component - Shows real booking statistics
 */
const BookingInsights = ({ stats, loading }: { stats: BookingStats; loading: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#2B9EB3]" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#0A3D62]">Booking Insights</h2>
        <Link 
          href="/user/bookings"
          className="text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-medium flex items-center gap-1"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Total Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#2B9EB3]/10 to-[#0A3D62]/10 rounded-2xl p-4 md:p-5 border border-[#2B9EB3]/20 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-xl">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Total Bookings</h3>
          <p className="text-2xl md:text-3xl font-bold text-[#0A3D62]">{stats.total}</p>
        </motion.div>

        {/* Pending Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-2xl p-4 md:p-5 border border-yellow-500/20 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-yellow-500 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Pending</h3>
          <p className="text-2xl md:text-3xl font-bold text-yellow-700">{stats.pending}</p>
        </motion.div>

        {/* Active Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-4 md:p-5 border border-blue-500/20 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Active</h3>
          <p className="text-2xl md:text-3xl font-bold text-blue-700">{stats.confirmed}</p>
        </motion.div>

        {/* Completed Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-4 md:p-5 border border-green-500/20 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500 rounded-xl">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Completed</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-700">{stats.completed}</p>
        </motion.div>

        {/* Total Spent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-4 md:p-5 border border-purple-500/20 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-500 rounded-xl">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Total Spent</h3>
          <p className="text-xl md:text-2xl font-bold text-purple-700">₹{stats.totalSpent}</p>
        </motion.div>
      </div>

      {/* Additional Stats Bar */}
      {stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-200"
        >
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-600">Success Rate:</span>
              <span className="font-bold text-[#0A3D62]">
                {Math.round((stats.completed / stats.total) * 100)}%
              </span>
            </div>
            {stats.cancelled > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-slate-600">Cancelled:</span>
                <span className="font-bold text-red-600">{stats.cancelled}</span>
              </div>
            )}
            {stats.completed > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-slate-600">Avg. Spent:</span>
                <span className="font-bold text-purple-700">
                  ₹{Math.round(stats.totalSpent / stats.completed)}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

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
 * Recent Bookings Component - Shows latest bookings
 */
const RecentBookings = ({ bookings, loading }: { bookings: any[]; loading: boolean }) => {
  if (loading) {
    return null;
  }

  if (bookings.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "confirmed":
      case "in-progress":
      case "started":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "refunded":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress";
      case "started":
        return "Started";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#0A3D62]">Recent Bookings</h2>
        <Link 
          href="/user/bookings"
          className="text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-medium flex items-center gap-1"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-md border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-[#0A3D62] text-sm md:text-base line-clamp-1">
                  {booking.categoryid?.categoryName || "Service"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                {getStatusLabel(booking.status)}
              </span>
            </div>

            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-[#2B9EB3]" />
                <span className="truncate">
                  {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <IndianRupee className="w-4 h-4 text-[#2B9EB3]" />
                <span className="font-semibold text-[#0A3D62]">
                  ₹{booking.bookingAmount || booking.intialamount}
                </span>
              </div>

              {booking.employeeid && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-4 h-4 text-[#2B9EB3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="truncate">{booking.employeeid.name}</span>
                </div>
              )}
            </div>

            <Link
              href={`/user/bookings`}
              className="mt-3 w-full inline-flex items-center justify-center gap-1 text-sm font-medium text-[#2B9EB3] hover:text-[#0A3D62] transition-colors"
            >
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/**
 * Quick Actions Component - Follows SRP
 */
const QuickActions = () => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
    <h2 className="text-xl font-bold text-[#0A3D62] mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link
        href="/user/bookings/new"
        className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl hover:shadow-md transition-shadow border border-green-500/30 hover:-translate-y-1 duration-200"
      >
        <div className="p-2 bg-green-600 rounded-lg">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-[#0A3D62]">Book Service</p>
          <p className="text-xs text-slate-600">Create new booking</p>
        </div>
      </Link>

      <Link
        href="/user/bookings/new"
        className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#2B9EB3]/5 to-[#0A3D62]/5 rounded-xl hover:shadow-md transition-shadow border border-[#2B9EB3]/20 hover:-translate-y-1 duration-200"
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
        className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#F9A825]/5 to-[#2B9EB3]/5 rounded-xl hover:shadow-md transition-shadow border border-[#F9A825]/20 hover:-translate-y-1 duration-200"
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
        className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-xl hover:shadow-md transition-shadow border border-purple-500/20 hover:-translate-y-1 duration-200"
      >
        <div className="p-2 bg-purple-600 rounded-lg">
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
