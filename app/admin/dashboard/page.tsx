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
  IconCurrencyRupee,
} from "@tabler/icons-react";
import { AdminData } from "@/utils/admin/adminAuthService";
import { getUserInitials } from "@/utils/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminData, useAdminLogout } from "@/utils/admin/useAdminHooks";
import { useDashboardStats } from "@/utils/admin/useDashboardStats";

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { adminData, loading, error } = useAdminData();
  const { handleLogout } = useAdminLogout();

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
      
      <AdminSidebar adminData={adminData} handleLogout={handleLogout} />
      
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
  const router = useRouter();
  const { stats, loading: statsLoading, error: statsError, refetch } = useDashboardStats();
  const [employees, setEmployees] = React.useState<any[]>([]);
  const [fieldExecutives, setFieldExecutives] = React.useState<any[]>([]);
  const [recentEmployeesLoading, setRecentEmployeesLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchRecentData = async () => {
      setRecentEmployeesLoading(true);
      try {
        const [employeesRes, fieldExecRes] = await Promise.all([
          fetch('/api/v1/employees'),
          fetch('/api/v1/manage-field-e')
        ]);
        
        const employeesData = await employeesRes.json();
        const fieldExecData = await fieldExecRes.json();
        
        if (employeesData.success) {
          // Get last 5 employees
          const sortedEmployees = (employeesData.employees || []).sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5);
          setEmployees(sortedEmployees);
        }
        
        if (fieldExecData.success) {
          // Get last 5 field executives
          const sortedFieldExec = (fieldExecData.data || []).sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5);
          setFieldExecutives(sortedFieldExec);
        }
      } catch (error) {
        console.error('Error fetching recent data:', error);
      } finally {
        setRecentEmployeesLoading(false);
      }
    };

    fetchRecentData();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
            Welcome back, {adminData?.name || "Admin"}!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <DashboardStatCard 
            title="Total Employees" 
            value={statsLoading ? "..." : (stats?.employees.total.toString() || "0")}
            subtitle={statsLoading ? "Loading..." : `${stats?.employees.active || 0} active`}
            icon={<IconUsers className="h-8 w-8 text-blue-500" />}
            gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            border="border-blue-200 dark:border-blue-700"
          />
          <DashboardStatCard 
            title="Field Executives" 
            value={statsLoading ? "..." : (stats?.fieldExecutives.total.toString() || "0")}
            subtitle={statsLoading ? "Loading..." : `${stats?.fieldExecutives.active || 0} active`}
            icon={<IconCategory className="h-8 w-8 text-green-500" />}
            gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            border="border-green-200 dark:border-green-700"
          />
          <DashboardStatCard 
            title="Categories" 
            value={statsLoading ? "..." : (stats?.categories.total.toString() || "0")}
            subtitle={statsLoading ? "Loading..." : `${stats?.categories.service || 0} service types`}
            icon={<IconChartBar className="h-8 w-8 text-purple-500" />}
            gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            border="border-purple-200 dark:border-purple-700"
          />
          <DashboardStatCard 
            title="Pending Payments" 
            value={statsLoading ? "..." : (stats?.employees.pending.toString() || "0")}
            subtitle={statsLoading ? "Loading..." : "Employees unpaid"}
            icon={<IconCurrencyRupee className="h-8 w-8 text-orange-500" />}
            gradient="from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
            border="border-orange-200 dark:border-orange-700"
          />
          <DashboardStatCard 
            title="Employee Fee" 
            value={statsLoading ? "..." : `₹${stats?.fees.employeeFee || 0}`}
            subtitle={statsLoading ? "Loading..." : "Current rate"}
            icon={<IconCurrencyRupee className="h-8 w-8 text-yellow-500" />}
            gradient="from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
            border="border-yellow-200 dark:border-yellow-700"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Manage Employees */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/employees')}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconUsers className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-800 dark:text-blue-100 mb-2">Manage Employees</h3>
                  <p className="text-blue-600 dark:text-blue-300 text-sm">View and manage all employee accounts</p>
                </div>
              </div>
            </motion.div>

            {/* Manage Field Executives */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/field-executives')}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconCategory className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-100 mb-2">Field Executives</h3>
                  <p className="text-green-600 dark:text-green-300 text-sm">Manage field executive accounts</p>
                </div>
              </div>
            </motion.div>

            {/* Manage Categories */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/categories')}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 p-8 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconChartBar className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-800 dark:text-purple-100 mb-2">Categories</h3>
                  <p className="text-purple-600 dark:text-purple-300 text-sm">Manage service categories</p>
                </div>
              </div>
            </motion.div>

            {/* Manage Fees */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/fees')}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 p-8 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconCurrencyRupee className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-800 dark:text-orange-100 mb-2">Manage Fees</h3>
                  <p className="text-orange-600 dark:text-orange-300 text-sm">Update user and employee fees</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Detailed Stats */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

            {/* Field Executive & Category Overview */}
            <DashboardContentCard title="Field Executive & Category Overview">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Field Executives</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">{stats.fieldExecutives.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Active FEs</span>
                  <span className="font-semibold text-green-600">{stats.fieldExecutives.active}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Inactive FEs</span>
                  <span className="font-semibold text-red-600">{stats.fieldExecutives.inactive}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Categories</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">{stats.categories.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Service Categories</span>
                  <span className="font-semibold text-purple-600">{stats.categories.service}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Maintenance Categories</span>
                  <span className="font-semibold text-purple-600">{stats.categories.maintenance}</span>
                </div>
              </div>
            </DashboardContentCard>

            {/* Payment Overview */}
            <DashboardContentCard title="Payment Overview">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Paid Employees</span>
                  <span className="font-semibold text-green-600">{stats.employees.paid}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Pending Payments</span>
                  <span className="font-semibold text-orange-600">{stats.employees.pending}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">User Fee</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">₹{stats.fees.userFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Employee Fee</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">₹{stats.fees.employeeFee}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">Payment Completion Rate</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                    {stats.employees.total > 0 
                      ? Math.round((stats.employees.paid / stats.employees.total) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </DashboardContentCard>

            {/* Category Breakdown */}
            <DashboardContentCard title="Category Breakdown">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Total Categories</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">{stats.categories.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Service Type</span>
                  <span className="font-semibold text-blue-600">{stats.categories.service}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Maintenance Type</span>
                  <span className="font-semibold text-purple-600">{stats.categories.maintenance}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">Service Distribution</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                    {stats.categories.total > 0 
                      ? Math.round((stats.categories.service / stats.categories.total) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Maintenance Distribution</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                    {stats.categories.total > 0 
                      ? Math.round((stats.categories.maintenance / stats.categories.total) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </DashboardContentCard>
          </div>
        )}

        {/* Recent Employees & Field Executives */}
        {!recentEmployeesLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Employees */}
            <DashboardContentCard title="Recent Employees">
              {employees.length > 0 ? (
                <div className="space-y-3">
                  {employees.map((employee: any, index: number) => (
                    <motion.div
                      key={employee._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {employee.img ? (
                          <img 
                            src={employee.img} 
                            alt={employee.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {getUserInitials(employee.name)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{employee.name}</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">{employee.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {employee.isPaid ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                            Paid
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                            Pending
                          </span>
                        )}
                        {employee.isActive ? (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => router.push('/admin/employees')}
                    className="w-full mt-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    View all employees →
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
                  No employees found
                </div>
              )}
            </DashboardContentCard>

            {/* Recent Field Executives */}
            <DashboardContentCard title="Recent Field Executives">
              {fieldExecutives.length > 0 ? (
                <div className="space-y-3">
                  {fieldExecutives.map((fe: any, index: number) => (
                    <motion.div
                      key={fe._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {fe.img ? (
                          <img 
                            src={fe.img} 
                            alt={fe.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {getUserInitials(fe.name)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{fe.name}</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">{fe.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {fe.isActive ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => router.push('/admin/field-executives')}
                    className="w-full mt-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                  >
                    View all field executives →
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
                  No field executives found
                </div>
              )}
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
  gradient,
  border
}: { 
  title: string; 
  value: string; 
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: string;
  border?: string;
}) => {
  return (
    <div className={cn(
      "rounded-xl p-6 border shadow-sm",
      "bg-gradient-to-br",
      gradient || "from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900",
      border || "border-neutral-200 dark:border-neutral-700"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-neutral-500 dark:text-neutral-400">
              {icon}
            </div>
          )}
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</h3>
        </div>
      </div>
      <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-neutral-600 dark:text-neutral-400">{subtitle}</p>
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