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
import { useFieldExecNavigation } from "@/utils/fieldexecutive/useFieldExecNavigation";
import { 
  useFieldExecData, 
  useFieldExecLogout, 
  useFieldExecSidebar 
} from "@/utils/fieldexecutive/useFieldExecHooks";
import { 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Target,
  CheckCircle,
  Clock,
  Users,
  Building2
} from "lucide-react";
import { FieldExecAnalyticsCard } from "@/components/field-executive/FieldExecAnalyticsCard";
import { FieldExecRecentEmployees } from "@/components/field-executive/FieldExecRecentEmployees";
import { useFieldExecAnalytics } from "@/utils/fieldexecutive/useFieldExecAnalytics";
import { TargetsModal } from "@/components/field-executive/TargetsModal";
import { EmployeesModal } from "@/components/field-executive/EmployeesModal";


export default function FieldExecutiveDashboard() {
  const router = useRouter();
  const { fieldExecData, loading, error } = useFieldExecData();
  const { analytics } = useFieldExecAnalytics();
  const { handleLogout } = useFieldExecLogout();
  const { open, setOpen } = useFieldExecSidebar();
  const { links } = useFieldExecNavigation();
  
  const [targetsModalOpen, setTargetsModalOpen] = React.useState(false);
  const [employeesModalOpen, setEmployeesModalOpen] = React.useState(false);

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
            onClick={() => router.push('/field-executive/login')}
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
            
            {/* User Section */}
            <div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                {fieldExecData && (
                  <SidebarLink
                    link={{
                      label: fieldExecData.name || fieldExecData.email,
                      href: "/field-executive/profile",
                      icon: (
                        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center overflow-hidden relative">
                          {fieldExecData.img && fieldExecData.img.trim() !== "" ? (
                            <img
                              src={fieldExecData.img}
                              alt={fieldExecData.name}
                              className="h-7 w-7 rounded-full object-cover absolute inset-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
                            {getUserInitials(fieldExecData.name || fieldExecData.email || "FE")}
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="p-4 md:p-8 pb-24 md:pb-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-2">
              Welcome back, {fieldExecData?.name?.split(' ')[0] || 'Field Executive'}!
            </h1>
            <p className="text-slate-600">Here's your field activity overview</p>
          </div>

          {/* Analytics Section */}
          <div className="mb-8">
            <FieldExecAnalyticsCard />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Area Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#F9A825]/10 to-[#2B9EB3]/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-[#F9A825]" />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">Assigned Block</h3>
              <p className="text-2xl font-bold text-[#0A3D62]">{fieldExecData?.block || 'Not Assigned'}</p>
              <p className="text-xs text-slate-500 mt-2">Pincode: {fieldExecData?.pincode || 'N/A'}</p>
            </motion.div>

            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">Account Status</h3>
              <p className="text-2xl font-bold text-[#0A3D62]">
                {fieldExecData?.isActive ? 'Active' : 'Inactive'}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Member since {new Date(fieldExecData?.createdAt || '').toLocaleDateString()}
              </p>
            </motion.div>

            {/* Activity Card - Dynamic from Analytics API */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">Employees Added</h3>
              <p className="text-3xl font-bold text-[#0A3D62]">{analytics?.currentTarget || 0}</p>
              <p className="text-xs text-slate-500 mt-2">This month</p>
            </motion.div>
          </div>

          {/* Recent Employees Section */}
          <div className="mb-8">
            <FieldExecRecentEmployees />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
            <h2 className="text-xl font-bold text-[#0A3D62] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/field-executive/profile"
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#2B9EB3]/5 to-[#0A3D62]/5 rounded-xl hover:shadow-md transition-shadow border border-[#2B9EB3]/20"
              >
                <div className="p-2 bg-[#2B9EB3] rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0A3D62]">Update Profile</p>
                  <p className="text-xs text-slate-600">Manage your information</p>
                </div>
              </Link>
              
              <button
                onClick={() => setTargetsModalOpen(true)}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#F9A825]/5 to-[#2B9EB3]/5 rounded-xl hover:shadow-md transition-shadow border border-[#F9A825]/20 text-left"
              >
                <div className="p-2 bg-[#F9A825] rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0A3D62]">View Targets</p>
                  <p className="text-xs text-slate-600">Check your goals</p>
                </div>
              </button>
              
              <button
                onClick={() => setEmployeesModalOpen(true)}
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-xl hover:shadow-md transition-shadow border border-green-500/20 text-left"
              >
                <div className="p-2 bg-green-600 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0A3D62]">Manage Employees</p>
                  <p className="text-xs text-slate-600">View employee list</p>
                </div>
              </button>
            </div>
          </div>

          {/* Modals */}
          <TargetsModal 
            open={targetsModalOpen} 
            onOpenChange={setTargetsModalOpen}
            fieldExecData={fieldExecData}
          />
          <EmployeesModal 
            open={employeesModalOpen} 
            onOpenChange={setEmployeesModalOpen}
          />

          {/* Profile Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-xl font-bold text-[#0A3D62] mb-4">Your Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#2B9EB3]/10 rounded-lg">
                  <Users className="w-5 h-5 text-[#2B9EB3]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Full Name</p>
                  <p className="font-semibold text-[#0A3D62]">{fieldExecData?.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#2B9EB3]/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#2B9EB3]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-semibold text-[#0A3D62]">{fieldExecData?.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#2B9EB3]/10 rounded-lg">
                  <Clock className="w-5 h-5 text-[#2B9EB3]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-semibold text-[#0A3D62]">{fieldExecData?.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#2B9EB3]/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-[#2B9EB3]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="font-semibold text-[#0A3D62]">{fieldExecData?.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <MobileBottomNav 
        links={links} 
        currentPath="/field-executive/dashboard"
      />
    </div>
  );
}

/* Logo Components */
export const Logo = () => {
  return (
    <Link
      href="/field-executive/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India Logo" 
        className="h-8 w-auto"
      />
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/field-executive/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India" 
        className="h-8 w-8 object-contain"
      />
    </Link>
  );
};

/* Mobile Bottom Navigation Component */
const MobileBottomNav = ({ 
  links, 
  currentPath
}: { 
  links: any[], 
  currentPath: string
}) => {
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
