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
  Users
} from "lucide-react";

export default function EmployeeDashboard() {
  const router = useRouter();
  const { employeeData, loading, error } = useEmployeeData();
  const { handleLogout } = useEmployeeLogout();
  const { open, setOpen } = useEmployeeSidebar();
  const { links } = useEmployeeNavigation();

  if (loading) {
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
        <div className="relative z-20 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#0A3D62] font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
  }

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden md:flex-row", "h-screen")}>
      <Toaster position="top-right" richColors />
      
      {/* Desktop Sidebar - Hidden on mobile */}
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
          
          {/* User Section */}
          <div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              {employeeData && (
                <SidebarLink
                  link={{
                    label: employeeData.name || employeeData.email,
                    href: "/employee/profile",
                    icon: (
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
                          {getUserInitials(employeeData.name || employeeData.email || "EMP")}
                        </span>
                      </div>
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
      
      <DashboardContent employeeData={employeeData} />

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <MobileBottomNav links={links} currentPath="/employee/dashboard" />
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="/employee/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India Logo" 
        className="h-8 w-auto"
      />
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="/employee/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India" 
        className="h-8 w-8 object-contain"
      />
    </a>
  );
};

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

// Dashboard Content Component
const DashboardContent = ({ employeeData }: { employeeData: any }) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-none md:rounded-tl-2xl border-0 md:border border-neutral-200 bg-white p-3 sm:p-6 md:p-10 pb-24 md:pb-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
            Welcome back, {employeeData?.name?.split(' ')[0] || "Service Provider"}!
            <span className="inline-block animate-wave">
              👋
            </span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Here's your performance overview for today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Jobs" 
            value="0" 
            icon={<Briefcase className="w-5 h-5" />}
            bgGradient="from-blue-500 to-blue-600"
          />
          <StatCard 
            title="Completed" 
            value="0" 
            icon={<CheckCircle className="w-5 h-5" />}
            bgGradient="from-green-500 to-green-600"
          />
          <StatCard 
            title="Pending" 
            value="0" 
            icon={<Clock className="w-5 h-5" />}
            bgGradient="from-yellow-500 to-yellow-600"
          />
          <StatCard 
            title="Total Earnings" 
            value="₹0" 
            icon={<IndianRupee className="w-5 h-5" />}
            bgGradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Recent Bookings */}
          <ContentCard title="Recent Bookings" icon={<Calendar className="w-5 h-5" />}>
            <div className="space-y-3">
              <EmptyState message="No recent bookings" />
            </div>
          </ContentCard>

          {/* Performance */}
          <ContentCard title="Performance Overview" icon={<TrendingUp className="w-5 h-5" />}>
            <div className="space-y-4">
              <PerformanceItem label="Rating" value="0.0" icon={<Star className="w-4 h-4 text-yellow-500" />} />
              <PerformanceItem label="Reviews" value="0" icon={<Users className="w-4 h-4 text-blue-500" />} />
              <PerformanceItem label="Completion Rate" value="0%" icon={<CheckCircle className="w-4 h-4 text-green-500" />} />
            </div>
          </ContentCard>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <ContentCard title="Quick Actions">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <QuickActionButton 
                label="Update Profile" 
                href="/employee/profile"
                icon="👤"
              />
              <QuickActionButton 
                label="View Schedule" 
                href="/employee/schedule"
                icon={<Calendar className="w-8 h-8" />}
              />
              <QuickActionButton 
                label="Check Earnings" 
                href="/employee/earnings"
                icon={<IndianRupee className="w-8 h-8" />}
              />
            </div>
          </ContentCard>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon, 
  bgGradient 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  bgGradient: string;
}) => {
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-800 p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{title}</p>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${bgGradient} text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">{value}</p>
    </div>
  );
};

const ContentCard = ({ 
  title, 
  children,
  icon 
}: { 
  title: string; 
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="text-neutral-700 dark:text-neutral-300">{icon}</div>}
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="text-center py-8">
      <p className="text-neutral-500 dark:text-neutral-400 text-sm">{message}</p>
    </div>
  );
};

const PerformanceItem = ({ 
  label, 
  value, 
  icon 
}: { 
  label: string; 
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
      </div>
      <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{value}</span>
    </div>
  );
};

const QuickActionButton = ({ 
  label, 
  href,
  icon 
}: { 
  label: string; 
  href: string;
  icon: React.ReactNode;
}) => {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-[#2B9EB3] hover:shadow-md transition-all group"
    >
      <div className="mb-2 group-hover:scale-110 transition-transform text-[#2B9EB3]">{icon}</div>
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-[#2B9EB3]">{label}</span>
    </a>
  );
};
