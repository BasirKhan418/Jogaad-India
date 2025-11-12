"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconSettings,
  IconUsers,
  IconCategory,
  IconCurrencyDollar,
  IconChartBar,
  IconLogout,
  IconDashboard,
  IconUser,
  IconPlus,
  IconList,
  IconTools,
  IconBuildingStore
} from "@tabler/icons-react";
import { AdminData } from "@/utils/admin/adminAuthService";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAdminNavigation } from "@/utils/admin/useAdminNavigation";
import { useAdminData, useAdminLogout, useAdminSidebar } from "@/utils/admin/useAdminHooks";

export default function CategoriesPage() {
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
      
      <CategoriesContent adminData={adminData} />
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

// Categories Content Component
const CategoriesContent = ({ adminData }: { adminData: AdminData | null }) => {
  const router = useRouter();
  
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="p-2 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 dark:hover:from-neutral-700 dark:hover:to-neutral-600 border border-neutral-200 dark:border-neutral-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <IconArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                  Categories Management
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Manage service and maintenance categories for your platform
                </p>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/admin/categories/add')}
              className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              <IconPlus className="h-5 w-5" />
              Add New Category
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Categories" 
            value="0" 
            icon={<IconCategory className="h-8 w-8 text-blue-500" />}
            gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            border="border-blue-200 dark:border-blue-700"
          />
          <StatsCard 
            title="Service Categories" 
            value="0" 
            icon={<IconBuildingStore className="h-8 w-8 text-green-500" />}
            gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            border="border-green-200 dark:border-green-700"
          />
          <StatsCard 
            title="Maintenance Categories" 
            value="0" 
            icon={<IconTools className="h-8 w-8 text-purple-500" />}
            gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            border="border-purple-200 dark:border-purple-700"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Add New Category */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/categories/add')}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconPlus className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-100 mb-2">Add New Category</h3>
                  <p className="text-green-600 dark:text-green-300 text-sm">Create a new service or maintenance category with pricing details</p>
                </div>
              </div>
            </motion.div>

            {/* View Service Categories */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.info('Service categories view coming soon')}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconBuildingStore className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-800 dark:text-blue-100 mb-2">Service Categories</h3>
                  <p className="text-blue-600 dark:text-blue-300 text-sm">View and manage all service-related categories and their pricing</p>
                </div>
              </div>
            </motion.div>

            {/* View Maintenance Categories */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.info('Maintenance categories view coming soon')}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 p-8 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconTools className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-800 dark:text-purple-100 mb-2">Maintenance Categories</h3>
                  <p className="text-purple-600 dark:text-purple-300 text-sm">View and manage all maintenance-related categories and pricing</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Recent Activity</h2>
          <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-8 border border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-700">
                <IconList className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">No Recent Activity</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md">
                  No recent category activity to display. Create your first category to get started and see activity here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  gradient, 
  border 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  gradient: string; 
  border: string; 
}) => {
  return (
    <div className={cn("rounded-xl p-6 border", gradient, border)}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{title}</div>
        {icon}
      </div>
      <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">{value}</div>
      <div className="text-xs text-neutral-500 dark:text-neutral-500">Connect to database to view stats</div>
    </div>
  );
};