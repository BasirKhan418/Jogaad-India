"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconLogout,
  IconDashboard,
  IconUsers,
  IconCategory,
  IconCurrencyDollar,
  IconChartBar,
  IconUser,
  IconSettings,
} from "@tabler/icons-react";
import { AdminData } from "@/utils/admin/adminAuthService";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAdminNavigation, NavigationLink } from "@/utils/admin/useAdminNavigation";
import { useAdminData, useAdminLogout, useAdminSidebar } from "@/utils/admin/useAdminHooks";
import { useDashboardStats } from "@/utils/admin/useDashboardStats";

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { adminData, loading, error } = useAdminData();
  const { handleLogout } = useAdminLogout();
  const { open, setOpen } = useAdminSidebar();
  const { links, logoutLink } = useAdminNavigation();

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
          <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#0A3D62] font-semibold">Loading admin panel...</p>
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
            onClick={() => router.push('/admin/signin')}
            className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden md:flex-row", "h-screen")}>
      <Toaster position="top-right" richColors />
      
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
              {adminData && (
                <SidebarLink
                  link={{
                    label: adminData.name || adminData.email,
                    href: "/admin/profile",
                    icon: (
                      <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] flex items-center justify-center overflow-hidden relative">
                        {adminData.img && adminData.img.trim() !== "" ? (
                          <img
                            src={adminData.img}
                            alt={adminData.name}
                            className="h-7 w-7 rounded-full object-cover absolute inset-0"
                            onError={(e) => {
                              // Hide the image on error so initials show
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
                          {getUserInitials(adminData.name || adminData.email || "AD")}
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
      
      <Dashboard adminData={adminData} />
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="#"
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
      href="#"
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

// Dashboard component
const Dashboard = ({ adminData }: { adminData: AdminData | null }) => {
  const { stats, loading: statsLoading, error: statsError, refetch } = useDashboardStats();

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            Welcome back, {adminData?.name || "Admin"}!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatCard 
            title="Total Employees" 
            value={statsLoading ? "..." : (stats?.employees.total.toString() || "0")}
            subtitle={statsLoading ? "Loading..." : `${stats?.employees.active || 0} active`}
            icon={<IconUsers className="h-6 w-6" />}
            gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
          />
          <DashboardStatCard 
            title="Field Executives" 
            value={statsLoading ? "..." : (stats?.fieldExecutives.total.toString() || "0")}
            subtitle={statsLoading ? "Loading..." : `${stats?.fieldExecutives.active || 0} active`}
            icon={<IconCategory className="h-6 w-6" />}
            gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
          />
          <DashboardStatCard 
            title="Categories" 
            value={statsLoading ? "..." : (stats?.categories.total.toString() || "0")}
            subtitle={statsLoading ? "Loading..." : `${stats?.categories.service || 0} service types`}
            icon={<IconChartBar className="h-6 w-6" />}
            gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
          />
          <DashboardStatCard 
            title="Employee Fee" 
            value={statsLoading ? "..." : `₹${stats?.fees.employeeFee || 0}`}
            subtitle={statsLoading ? "Loading..." : "Current rate"}
            icon={<IconCurrencyDollar className="h-6 w-6" />}
            gradient="from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
          />
        </div>

        {/* Detailed Stats */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Employee Overview */}
            <DashboardContentCard title="Employee Overview">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Employees</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">{stats.employees.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Active</span>
                  <span className="font-semibold text-green-600">{stats.employees.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Inactive</span>
                  <span className="font-semibold text-red-600">{stats.employees.inactive}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Paid</span>
                  <span className="font-semibold text-blue-600">{stats.employees.paid}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Pending Payment</span>
                  <span className="font-semibold text-orange-600">{stats.employees.pending}</span>
                </div>
              </div>
            </DashboardContentCard>

            {/* Field Executive Overview */}
            <DashboardContentCard title="Field Executive Overview">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Field Executives</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">{stats.fieldExecutives.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Active</span>
                  <span className="font-semibold text-green-600">{stats.fieldExecutives.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Inactive</span>
                  <span className="font-semibold text-red-600">{stats.fieldExecutives.inactive}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">Categories</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">{stats.categories.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">User Fee</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">₹{stats.fees.userFee}</span>
                </div>
              </div>
            </DashboardContentCard>
          </div>
        )}

        {/* Loading State */}
        {statsLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <DashboardContentCard title="Loading...">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-24"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-12"></div>
                  </div>
                ))}
              </div>
            </DashboardContentCard>
            <DashboardContentCard title="Loading...">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-32"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse w-8"></div>
                  </div>
                ))}
              </div>
            </DashboardContentCard>
          </div>
        )}

        {/* Error State */}
        {statsError && (
          <div className="mt-6">
            <DashboardContentCard title="Error">
              <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400 mb-4">{statsError}</p>
                <button
                  onClick={refetch}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </DashboardContentCard>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardStatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient 
}: { 
  title: string; 
  value: string; 
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: string;
}) => {
  return (
    <div className={cn(
      "rounded-lg p-6 border border-neutral-200 dark:border-neutral-700",
      "bg-gradient-to-br",
      gradient || "from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900"
    )}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{title}</p>
        {icon && (
          <div className="text-neutral-500 dark:text-neutral-400">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{value}</p>
      {subtitle && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
};

const DashboardContentCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-6 border border-neutral-200 dark:border-neutral-700">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">{title}</h3>
      {children}
    </div>
  );
};