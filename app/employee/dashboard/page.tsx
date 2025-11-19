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
import { useEmployeeNavigation } from "@/utils/employee/useEmployeeNavigation";
import { useEmployeeData, useEmployeeLogout, useEmployeeSidebar } from "@/utils/employee/useEmployeeHooks";
import { 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  IndianRupee,
  CheckCircle,
  Clock,
  Star,
  Users,
  ShoppingBag,
  Loader2,
  PlayCircle,
  History
} from "lucide-react";

interface JobStats {
  total: number;
  pending: number;
  inProgress: number;
  started: number;
  completed: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const { employeeData, loading, error } = useEmployeeData();
  const { handleLogout } = useEmployeeLogout();
  const { open, setOpen } = useEmployeeSidebar();
  const { links } = useEmployeeNavigation();
  const [jobStats, setJobStats] = useState<JobStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    started: 0,
    completed: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
    completionRate: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  // Fetch job statistics
  useEffect(() => {
    if (employeeData) {
      fetchJobStats();
    }
  }, [employeeData]);

  const fetchJobStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch analytics data
      const analyticsResponse = await fetch("/api/v1/emp/analytics", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const analyticsData = await analyticsResponse.json();

      if (analyticsData.success && analyticsData.data) {
        const data = analyticsData.data;
        
        setJobStats({
          total: data.totalBookings || 0,
          pending: data.pendings || 0,
          inProgress: 0, // Will be calculated from bookings
          started: 0, // Will be calculated from bookings
          completed: data.completedBookings || 0,
          totalEarnings: data.totalEarnings || 0,
          averageRating: data.averageRating || 0,
          totalReviews: data.totalReviews || 0,
          completionRate: data.completionRate || 0,
        });

        // Get recent bookings
        if (data.recentData && data.recentData.length > 0) {
          setRecentBookings(data.recentData.slice(0, 3));
        }
      }

      // Fetch all bookings for more detailed stats
      const bookingsResponse = await fetch("/api/v1/emp/bookings", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const bookingsData = await bookingsResponse.json();

      if (bookingsData.success && bookingsData.bookings) {
        const bookings = bookingsData.bookings;
        const inProgressCount = bookings.filter((b: any) => 
          b.status === "confirmed" || b.status === "in-progress"
        ).length;
        const startedCount = bookings.filter((b: any) => b.status === "started").length;

        setJobStats(prev => ({
          ...prev,
          inProgress: inProgressCount,
          started: startedCount,
        }));
      }

    } catch (error) {
      console.error("Error fetching job stats:", error);
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
                {employeeData && (
                  <SidebarLink
                    link={{
                      label: employeeData.name || employeeData.email,
                      href: "/employee/profile",
                      icon: <EmployeeAvatar employeeData={employeeData} />,
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
          <WelcomeHeader employeeName={employeeData?.name} />

          {/* Job Insights */}
          <JobInsights stats={jobStats} loading={statsLoading} />

          {/* Recent Bookings */}
          <RecentBookings bookings={recentBookings} loading={statsLoading} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Performance Summary */}
          <PerformanceSummary stats={jobStats} loading={statsLoading} />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav links={links} currentPath="/employee/dashboard" />
    </div>
  );
}

/**
 * Loading Screen Component
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
 * Error Screen Component
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
          onClick={() => router.push('/employee/login')}
          className="bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

/**
 * Welcome Header Component
 */
const WelcomeHeader = ({ employeeName }: { employeeName?: string }) => (
  <div className="mb-8">
    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-2">
      Welcome back, {employeeName?.split(' ')[0] || 'Service Provider'}!
    </h1>
    <p className="text-slate-600">Track your jobs and earnings</p>
  </div>
);

/**
 * Job Insights Component - Shows real job statistics
 */
const JobInsights = ({ stats, loading }: { stats: JobStats; loading: boolean }) => {
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
        <h2 className="text-xl font-bold text-[#0A3D62]">Job Insights</h2>
        <Link 
          href="/employee/bookings"
          className="text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-medium flex items-center gap-1"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {/* Total Jobs */}
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
          <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Total Jobs</h3>
          <p className="text-2xl md:text-3xl font-bold text-[#0A3D62]">{stats.total}</p>
        </motion.div>

        {/* Pending Jobs */}
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

        {/* In Progress */}
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
          <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">In Progress</h3>
          <p className="text-2xl md:text-3xl font-bold text-blue-700">{stats.inProgress}</p>
        </motion.div>

        {/* Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-4 md:p-5 border border-green-500/20 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500 rounded-xl">
              <PlayCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Started</h3>
          <p className="text-2xl md:text-3xl font-bold text-green-700">{stats.started}</p>
        </motion.div>

        {/* Completed Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-2xl p-4 md:p-5 border border-emerald-500/20 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-500 rounded-xl">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Completed</h3>
          <p className="text-2xl md:text-3xl font-bold text-emerald-700">{stats.completed}</p>
        </motion.div>
      </div>

      {/* Additional Stats Bar */}
      {stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-200"
        >
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-slate-600">Completion Rate:</span>
              <span className="font-bold text-[#0A3D62]">{stats.completionRate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-slate-600">Average Rating:</span>
              <span className="font-bold text-[#0A3D62]">{stats.averageRating.toFixed(1)} ⭐</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-slate-600">Total Reviews:</span>
              <span className="font-bold text-[#0A3D62]">{stats.totalReviews}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/**
 * Recent Bookings Component
 */
const RecentBookings = ({ bookings, loading }: { bookings: any[]; loading: boolean }) => {
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
        <h2 className="text-xl font-bold text-[#0A3D62]">Recent Jobs</h2>
        <Link 
          href="/employee/bookings"
          className="text-sm text-[#2B9EB3] hover:text-[#0A3D62] font-medium"
        >
          View All →
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
          <Briefcase className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#0A3D62] mb-2">No recent jobs</h3>
          <p className="text-slate-600">Your recent job requests will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-all hover:border-[#2B9EB3]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0A3D62] mb-1">
                    {booking.categoryid?.categoryName || "Service"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {new Date(booking.bookingDate).toLocaleDateString('en-IN', { 
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  booking.status === "completed" && "bg-green-100 text-green-700",
                  booking.status === "pending" && "bg-yellow-100 text-yellow-700",
                  booking.status === "confirmed" && "bg-blue-100 text-blue-700",
                  booking.status === "in-progress" && "bg-blue-100 text-blue-700",
                  booking.status === "started" && "bg-green-100 text-green-700"
                )}>
                  {booking.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Amount:</span>
                <span className="text-lg font-bold text-[#2B9EB3]">₹{booking.intialamount}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Quick Actions Component
 */
const QuickActions = () => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-[#0A3D62] mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <Link
        href="/employee/bookings"
        className="bg-white rounded-xl p-6 border border-slate-200 hover:border-[#2B9EB3] hover:shadow-lg transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-[#2B9EB3]">
            View Jobs
          </span>
        </div>
      </Link>

      <Link
        href="/employee/profile"
        className="bg-white rounded-xl p-6 border border-slate-200 hover:border-[#2B9EB3] hover:shadow-lg transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">
            My Profile
          </span>
        </div>
      </Link>

      <Link
        href="/employee/bookings?tab=prev"
        className="bg-white rounded-xl p-6 border border-slate-200 hover:border-[#2B9EB3] hover:shadow-lg transition-all group"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <History className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-green-600">
            History
          </span>
        </div>
      </Link>
    </div>
  </div>
);

/**
 * Performance Summary Component
 */
const PerformanceSummary = ({ stats, loading }: { stats: JobStats; loading: boolean }) => {
  if (loading) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-[#2B9EB3]/5 to-[#0A3D62]/5 rounded-2xl p-6 border border-[#2B9EB3]/20">
      <h2 className="text-xl font-bold text-[#0A3D62] mb-4">Performance Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm text-slate-600 font-medium">Average Rating</span>
          </div>
          <p className="text-3xl font-bold text-[#0A3D62]">{stats.averageRating.toFixed(1)}</p>
          <p className="text-xs text-slate-500 mt-1">Based on {stats.totalReviews} reviews</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-slate-600 font-medium">Completion Rate</span>
          </div>
          <p className="text-3xl font-bold text-[#0A3D62]">{stats.completionRate}%</p>
          <p className="text-xs text-slate-500 mt-1">{stats.completed} of {stats.total} jobs</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <IndianRupee className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-slate-600 font-medium">Total Earned</span>
          </div>
          <p className="text-3xl font-bold text-[#0A3D62]">₹{stats.totalEarnings.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">From completed jobs</p>
        </div>
      </div>
    </div>
  );
};

// Logo Components
const Logo = () => (
  <Link
    href="/employee/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India Logo" 
      className="h-8 w-auto"
    />
  </Link>
);

const LogoIcon = () => (
  <Link
    href="/employee/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India" 
      className="h-8 w-8 object-contain"
    />
  </Link>
);

// Employee Avatar Component
const EmployeeAvatar = ({ employeeData }: { employeeData: any }) => (
  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center overflow-hidden relative">
    {employeeData.img && employeeData.img.trim() !== "" ? (
      <img
        src={employeeData.img}
        alt={employeeData.name}
        className="h-7 w-7 rounded-full object-cover absolute inset-0"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    ) : null}
    <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
      {getUserInitials(employeeData.name || employeeData.email || "E")}
    </span>
  </div>
);

// Mobile Bottom Navigation Component
const MobileBottomNav = ({ links, currentPath }: { links: any[], currentPath: string }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-neutral-800 shadow-[0_-4px_24px_rgba(0,0,0,0.3)] pb-safe">
      <nav className="flex items-center justify-around px-4 py-2">
        {links.map((link, idx) => {
          const isActive = currentPath === link.href;
          return (
            <Link
              key={idx}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 px-2 py-2 rounded-xl transition-all duration-300 min-w-[70px] relative",
                isActive 
                  ? "" 
                  : "hover:bg-neutral-800/50"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full" />
              )}
              
              <div className={cn(
                "flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 relative",
                isActive 
                  ? "bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] shadow-lg shadow-[#2B9EB3]/30" 
                  : "bg-neutral-800/50"
              )}>
                {React.cloneElement(link.icon, {
                  className: cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isActive ? "text-white" : "text-neutral-400"
                  )
                })}
              </div>
              <span className={cn(
                "text-[11px] font-semibold transition-all duration-300 tracking-tight",
                isActive 
                  ? "text-white" 
                  : "text-neutral-400"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};


