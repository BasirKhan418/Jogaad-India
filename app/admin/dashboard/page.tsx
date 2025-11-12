"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconUsers,
  IconCategory,
  IconCurrencyDollar,
  IconChartBar,
  IconLogout,
  IconDashboard,
  IconShield,
  IconUser
} from "@tabler/icons-react";
import { getAdminData, logoutAdmin, AdminData } from "@/utils/admin/adminAuthService";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Navigation links for sidebar
  const links = [
    {
      label: "Dashboard",
      href: "#dashboard",
      icon: <IconDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Users",
      href: "#users",
      icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Categories",
      href: "#categories", 
      icon: <IconCategory className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Fees",
      href: "#fees",
      icon: <IconCurrencyDollar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Analytics",
      href: "#analytics",
      icon: <IconChartBar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/admin/profile",
      icon: <IconUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  // Fetch admin data on mount
  useEffect(() => {
    const fetchAdminData = async (retryCount = 0) => {
      try {
        setError('');
        const result = await getAdminData();
        if (result.success && result.data) {
          setAdminData(result.data);
        } else {
          // Retry once after a short delay to handle timing issues
          if (retryCount < 1) {
            setTimeout(() => {
              fetchAdminData(retryCount + 1);
            }, 1000);
            return;
          }
          
          setError(result.message || 'Failed to load admin data');
          
          // Add a delay before redirecting to handle timing issues with fresh logins
          setTimeout(() => {
            router.push('/admin/signin');
          }, 2000);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        
        // Retry once after a short delay to handle timing issues
        if (retryCount < 1) {
          setTimeout(() => {
            fetchAdminData(retryCount + 1);
          }, 1000);
          return;
        }
        
        console.error('Failed to fetch admin data:', error);
        setError('Network error occurred');
        
        // Add a delay before redirecting to handle timing issues with fresh logins
        setTimeout(() => {
          router.push('/admin/signin');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const result = await logoutAdmin();
      if (result.success) {
        toast.success('Logged out successfully');
        router.push('/admin/signin');
      } else {
        console.error('Logout failed:', result.message);
        toast.error('Logout failed');
        router.push('/admin/signin');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout error occurred');
      router.push('/admin/signin');
    }
  };

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
                      <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                        {adminData.img ? (
                          <img
                            src={adminData.img}
                            alt={adminData.name}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                        ) : (
                          adminData.name
                            ? adminData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "AD"
                        )}
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
          <DashboardStatCard title="Total Users" value="0" />
          <DashboardStatCard title="Categories" value="0" />
          <DashboardStatCard title="Total Revenue" value="₹0" />
          <DashboardStatCard title="Active Services" value="0" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <DashboardContentCard title="Recent Activity">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              No recent activity to display.
            </p>
          </DashboardContentCard>
          <DashboardContentCard title="Quick Actions">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Select an action from the sidebar to get started.
            </p>
          </DashboardContentCard>
        </div>
      </div>
    </div>
  );
};

const DashboardStatCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 p-6 border border-neutral-200 dark:border-neutral-700">
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{value}</p>
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