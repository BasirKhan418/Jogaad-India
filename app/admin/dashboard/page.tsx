"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
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
  IconShield
} from "@tabler/icons-react";
import { getAdminData, logoutAdmin, AdminData } from "@/utils/admin/adminAuthService";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => (
  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
    <h2 className="text-xl font-semibold text-[#0A3D62] mb-4">{title}</h2>
    {children}
  </div>
);

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}> = ({ title, value, icon, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-[#F9A825]/10 via-[#2B9EB3]/10 to-[#0A3D62]/10 p-6 rounded-xl border border-[#F9A825]/20 backdrop-blur-sm shadow-lg"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="text-[#2B9EB3]">{icon}</div>
      {trend && (
        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">{trend}</span>
      )}
    </div>
    <h3 className="text-sm text-[#0A3D62]/70 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-[#0A3D62]">{value}</p>
  </motion.div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Navigation links for sidebar
  const links = [
    {
      label: "Dashboard",
      href: "#dashboard",
      icon: <IconDashboard className="text-[#0A3D62] h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveSection('dashboard')
    },
    {
      label: "Users",
      href: "#users",
      icon: <IconUsers className="text-[#0A3D62] h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveSection('users')
    },
    {
      label: "Categories",
      href: "#categories", 
      icon: <IconCategory className="text-[#0A3D62] h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveSection('categories')
    },
    {
      label: "Fees",
      href: "#fees",
      icon: <IconCurrencyDollar className="text-[#0A3D62] h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveSection('fees')
    },
    {
      label: "Analytics",
      href: "#analytics",
      icon: <IconChartBar className="text-[#0A3D62] h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveSection('analytics')
    },
    {
      label: "Settings",
      href: "#settings",
      icon: <IconSettings className="text-[#0A3D62] h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveSection('settings')
    },
  ];

  // Fetch admin data on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setError('');
        const result = await getAdminData();
        if (result.success && result.data) {
          setAdminData(result.data);
        } else {
          setError(result.message || 'Failed to load admin data');
          // Redirect to signin if not authenticated
          router.push('/admin/signin');
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setError('Network error occurred');
        router.push('/admin/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await logoutAdmin();
      if (result.success) {
        toast.success('Logged out successfully');
        router.push('/admin/signin');
      } else {
        console.error('Logout failed:', result.message);
        toast.error('Logout failed');
        // Still redirect to signin even if logout API fails
        router.push('/admin/signin');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout error occurred');
      // Still redirect to signin even if there's an error
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
      
      {/* Dot Pattern */}
      <div className="absolute inset-0 z-10 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <Toaster position="top-right" richColors />
      
      <div className="relative z-20 flex">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink 
                    key={idx} 
                    link={{
                      ...link,
                      href: link.href,
                      onClick: link.onClick
                    }} 
                  />
                ))}
              </div>
            </div>
            
            {/* User Section */}
            <div>
              {adminData && (
                <SidebarLink
                  link={{
                    label: adminData.name || adminData.email,
                    href: "#profile",
                    icon: <IconUserBolt className="text-[#0A3D62] h-5 w-5 flex-shrink-0" />
                  }}
                />
              )}
              <SidebarLink
                link={{
                  label: "Logout",
                  href: "#logout",
                  icon: <IconLogout className="text-red-500 h-5 w-5 flex-shrink-0" />,
                  onClick: handleLogout
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-[#0A3D62] mb-2">
                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                  </h1>
                  <p className="text-[#0A3D62]/70 text-lg">
                    Welcome back, {adminData?.name || adminData?.email}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#0A3D62]/60 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span>Last login: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

          {/* Content based on active section */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {activeSection === 'dashboard' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Users"
                    value="1,234"
                    icon={<IconUsers className="w-6 h-6" />}
                    trend="+12%"
                  />
                  <StatCard
                    title="Categories"
                    value="45"
                    icon={<IconCategory className="w-6 h-6" />}
                    trend="+5%"
                  />
                  <StatCard
                    title="Revenue"
                    value="₹45,678"
                    icon={<IconCurrencyDollar className="w-6 h-6" />}
                    trend="+23%"
                  />
                  <StatCard
                    title="Active Services"
                    value="89"
                    icon={<IconChartBar className="w-6 h-6" />}
                    trend="+8%"
                  />
                </div>

                {/* Dashboard Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DashboardSection title="Recent Activity">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-white/20">
                        <span className="text-[#0A3D62]">New user registration</span>
                        <span className="text-xs text-[#0A3D62]/60">2 mins ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-white/20">
                        <span className="text-[#0A3D62]">Category updated</span>
                        <span className="text-xs text-[#0A3D62]/60">1 hour ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-white/20">
                        <span className="text-[#0A3D62]">Fee structure modified</span>
                        <span className="text-xs text-[#0A3D62]/60">3 hours ago</span>
                      </div>
                    </div>
                  </DashboardSection>

                  <DashboardSection title="System Status">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[#0A3D62]">API Status</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-full">
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#0A3D62]">Database</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-full">
                          Healthy
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#0A3D62]">Email Service</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  </DashboardSection>
                </div>
              </>
            )}

            {activeSection === 'users' && (
              <DashboardSection title="User Management">
                <div className="text-[#0A3D62]/80">
                  <p>User management features will be implemented here.</p>
                  <p className="mt-2">This section will include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>User list with search and filtering</li>
                    <li>User details and profile management</li>
                    <li>User activity monitoring</li>
                    <li>Account status management</li>
                  </ul>
                </div>
              </DashboardSection>
            )}

            {activeSection === 'categories' && (
              <DashboardSection title="Category Management">
                <div className="text-[#0A3D62]/80">
                  <p>Category management interface will be built here.</p>
                  <p className="mt-2">Features include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Create, edit, and delete categories</li>
                    <li>Category hierarchy management</li>
                    <li>Service category assignments</li>
                    <li>Category analytics</li>
                  </ul>
                </div>
              </DashboardSection>
            )}

            {activeSection === 'fees' && (
              <DashboardSection title="Fee Management">
                <div className="text-[#0A3D62]/80">
                  <p>Fee structure management will be implemented here.</p>
                  <p className="mt-2">This will include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Service fee configuration</li>
                    <li>Commission structure management</li>
                    <li>Payment method settings</li>
                    <li>Fee analytics and reporting</li>
                  </ul>
                </div>
              </DashboardSection>
            )}

            {activeSection === 'analytics' && (
              <DashboardSection title="Analytics & Reports">
                <div className="text-[#0A3D62]/80">
                  <p>Comprehensive analytics dashboard coming soon.</p>
                  <p className="mt-2">Will feature:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Revenue analytics</li>
                    <li>User engagement metrics</li>
                    <li>Service performance tracking</li>
                    <li>Custom report generation</li>
                  </ul>
                </div>
              </DashboardSection>
            )}

            {activeSection === 'settings' && (
              <DashboardSection title="System Settings">
                <div className="text-[#0A3D62]/80">
                  <p>System configuration panel will be available here.</p>
                  <p className="mt-2">Settings will include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Application configuration</li>
                    <li>Email template management</li>
                    <li>Security settings</li>
                    <li>Integration configurations</li>
                  </ul>
                </div>
              </DashboardSection>
            )}
          </motion.div>
        </div>
      </div>
    </div>
    </div>
  );
}

const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-[#0A3D62] py-1 relative z-20">
      <div className="w-8 h-8 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-lg flex items-center justify-center">
        <IconShield className="h-5 w-5 text-white" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-[#0A3D62] whitespace-pre"
      >
        Jogaad Admin
      </motion.span>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-[#0A3D62] py-1 relative z-20">
      <div className="w-8 h-8 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-lg flex items-center justify-center">
        <IconShield className="h-5 w-5 text-white" />
      </div>
    </div>
  );
};