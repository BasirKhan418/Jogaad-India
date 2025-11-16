"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconLogout,
  IconUserPlus,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconEdit,
  IconTrash,
  IconEye,
  IconX,
  IconCurrencyDollar,
  IconCheck
} from "@tabler/icons-react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Code,
  DollarSign,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAdminNavigation } from "@/utils/admin/useAdminNavigation";
import { useAdminData, useAdminLogout, useAdminSidebar } from "@/utils/admin/useAdminHooks";
import { useEmployeeCreation } from "@/utils/employee/useEmployeeCreation";
import { useEmployeeUpdate } from "@/utils/employee/useEmployeeUpdate";
import { useEmployeeData, Employee } from "@/utils/employee/useEmployeeData";
import { getUserInitials } from "@/utils/auth";
import Image from "next/image";

export default function EmployeesPage() {
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
      
      <EmployeesContent adminData={adminData} />
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

// Employees Content Component
const EmployeesContent = ({ adminData }: { adminData: any }) => {
  const router = useRouter();
  const { employees, stats, loading: employeeLoading, error: employeeError, refetch, handleDelete, deleting } = useEmployeeData();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [viewEmployee, setViewEmployee] = React.useState<Employee | null>(null);
  const [editEmployee, setEditEmployee] = React.useState<Employee | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'active' | 'pending'>('all');

  const handleCloseCreateModal = React.useCallback(() => {
    setShowCreateModal(false);
    refetch(); // Refresh the list after creating
  }, [refetch]);

  const handleCloseViewModal = React.useCallback(() => {
    setViewEmployee(null);
  }, []);

  const handleShowCreateModal = React.useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleViewEmployee = React.useCallback((employee: Employee) => {
    setViewEmployee(employee);
  }, []);

  const handleEditEmployee = React.useCallback((employee: Employee) => {
    setEditEmployee(employee);
  }, []);

  const handleCloseEditModal = React.useCallback(() => {
    setEditEmployee(null);
    refetch(); // Refresh the list after editing
  }, [refetch]);

  const handleDeleteRequest = React.useCallback((email: string) => {
    setDeleteConfirm(email);
  }, []);

  const handleCancelDelete = React.useCallback(() => {
    setDeleteConfirm(null);
  }, []);

  const handleFilterActive = React.useCallback(() => {
    setFilter('active');
  }, []);

  const handleFilterPending = React.useCallback(() => {
    setFilter('pending');
  }, []);

  const handleFilterAll = React.useCallback(() => {
    setFilter('all');
  }, []);

  const onDelete = React.useCallback(async (email: string) => {
    const success = await handleDelete(email);
    if (success) {
      setDeleteConfirm(null);
      refetch(); // Refresh the list after deletion
    }
  }, [handleDelete, refetch]);

  const filteredEmployees = React.useMemo(() => {
    if (filter === 'active') {
      return employees.filter(emp => emp.isActive);
    } else if (filter === 'pending') {
      return employees.filter(emp => !emp.isPaid);
    }
    return employees;
  }, [employees, filter]);
  
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
                  Employee Management
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Manage employee accounts, categories, and payment status
                </p>
              </div>
            </div>
            
            <button
              onClick={handleShowCreateModal}
              className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              <IconUserPlus className="h-5 w-5" />
              Add New Employee
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatsCard 
            title="Total Employees" 
            value={employeeLoading ? "..." : stats.total.toString()} 
            icon={<IconUsers className="h-8 w-8 text-blue-500" />}
            gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            border="border-blue-200 dark:border-blue-700"
            subtitle={employeeLoading ? "Loading..." : `${stats.total} total employees`}
          />
          <StatsCard 
            title="Active" 
            value={employeeLoading ? "..." : stats.active.toString()} 
            icon={<IconUserCheck className="h-8 w-8 text-green-500" />}
            gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            border="border-green-200 dark:border-green-700"
            subtitle={employeeLoading ? "Loading..." : `${stats.active} active`}
          />
          <StatsCard 
            title="Inactive" 
            value={employeeLoading ? "..." : stats.inactive.toString()} 
            icon={<IconUserX className="h-8 w-8 text-orange-500" />}
            gradient="from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
            border="border-orange-200 dark:border-orange-700"
            subtitle={employeeLoading ? "Loading..." : `${stats.inactive} inactive`}
          />
          <StatsCard 
            title="Paid" 
            value={employeeLoading ? "..." : stats.paid.toString()} 
            icon={<IconCheck className="h-8 w-8 text-purple-500" />}
            gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            border="border-purple-200 dark:border-purple-700"
            subtitle={employeeLoading ? "Loading..." : `${stats.paid} paid`}
          />
          <StatsCard 
            title="Pending" 
            value={employeeLoading ? "..." : stats.pending.toString()} 
            icon={<IconCurrencyDollar className="h-8 w-8 text-red-500" />}
            gradient="from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
            border="border-red-200 dark:border-red-700"
            subtitle={employeeLoading ? "Loading..." : `${stats.pending} pending payment`}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Add New Employee */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShowCreateModal}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconUserPlus className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-100 mb-2">Add New Employee</h3>
                  <p className="text-green-600 dark:text-green-300 text-sm">Create a new employee account with category and pricing</p>
                </div>
              </div>
            </motion.div>

            {/* View Active Employees */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFilterActive}
              className={cn(
                "cursor-pointer rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 border hover:shadow-lg transition-all duration-300 group",
                filter === 'active' 
                  ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg" 
                  : "border-blue-200 dark:border-blue-700"
              )}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconUserCheck className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-800 dark:text-blue-100 mb-2">Active Employees</h3>
                  <p className="text-blue-600 dark:text-blue-300 text-sm">View all active employee accounts and their details</p>
                </div>
              </div>
            </motion.div>

            {/* View Pending Payments */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFilterPending}
              className={cn(
                "cursor-pointer rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 p-8 border hover:shadow-lg transition-all duration-300 group",
                filter === 'pending' 
                  ? "border-purple-500 dark:border-purple-400 ring-2 ring-purple-500 dark:ring-purple-400 shadow-lg" 
                  : "border-purple-200 dark:border-purple-700"
              )}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconCurrencyDollar className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-800 dark:text-purple-100 mb-2">Pending Payments</h3>
                  <p className="text-purple-600 dark:text-purple-300 text-sm">View employees with pending payment verification</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Recent Employees */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
              {filter === 'all' ? 'All Employees' : filter === 'active' ? 'Active Employees' : 'Pending Payments'}
              {filter !== 'all' && (
                <span className="ml-2 text-sm font-normal text-neutral-600 dark:text-neutral-400">
                  ({filteredEmployees.length} {filter === 'active' ? 'active' : 'pending'})
                </span>
              )}
            </h2>
            {filter !== 'all' && (
              <button
                onClick={handleFilterAll}
                className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <IconX className="h-4 w-4" />
                Clear Filter
              </button>
            )}
          </div>
          {employeeLoading ? (
            <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-8 border border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B9EB3]"></div>
                <p className="text-neutral-600 dark:text-neutral-400">Loading employees...</p>
              </div>
            </div>
          ) : filteredEmployees.length > 0 ? (
            <div className="space-y-4">
              {filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {employee.img ? (
                        <img 
                          src={employee.img} 
                          alt={employee.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {getUserInitials(employee.name)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{employee.name}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {employee.email} • {employee.phone}{employee.pincode ? ` • ${employee.pincode}` : ''}
                          {employee.isPaid ? (
                            <span className="ml-2 text-green-600 dark:text-green-400">• Paid</span>
                          ) : (
                            <span className="ml-2 text-orange-600 dark:text-orange-400">• Pending</span>
                          )}
                          {employee.isActive ? (
                            <span className="ml-2 text-green-600 dark:text-green-400">• Active</span>
                          ) : (
                            <span className="ml-2 text-red-600 dark:text-red-400">• Inactive</span>
                          )}
                        </p>
                        {employee.payrate && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            Pay Rate: ₹{employee.payrate.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewEmployee(employee)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 transition-colors"
                        title="Edit Employee"
                      >
                        <IconEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(employee.email)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                        title="Delete Employee"
                        disabled={deleting === employee.email}
                      >
                        {deleting === employee.email ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                        ) : (
                          <IconTrash className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-12 border border-neutral-200 dark:border-neutral-700 text-center">
              <IconUsers className="h-16 w-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                {filter === 'all' ? 'No Employees Found' : filter === 'active' ? 'No Active Employees' : 'No Pending Payments'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {filter === 'all' ? 'Get started by adding your first employee' : filter === 'active' ? 'No employees are currently active' : 'All employees have completed their payments'}
              </p>
              <button
                onClick={handleShowCreateModal}
                className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
              >
                <IconUserPlus className="h-5 w-5" />
                Add Employee
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Employee Modal */}
      {showCreateModal && (
        <CreateEmployeeModal
          onClose={handleCloseCreateModal}
        />
      )}

      {/* View Employee Modal */}
      {viewEmployee && (
        <ViewEmployeeModal
          employee={viewEmployee}
          onClose={handleCloseViewModal}
        />
      )}

      {/* Edit Employee Modal */}
      {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          onClose={handleCloseEditModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          employeeEmail={deleteConfirm}
          onConfirm={() => onDelete(deleteConfirm)}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = React.memo(({ 
  title, 
  value, 
  icon, 
  gradient, 
  border, 
  subtitle 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  gradient: string; 
  border: string; 
  subtitle: string;
}) => {
  return (
    <div className={cn(
      "rounded-xl p-6 border shadow-sm",
      "bg-gradient-to-br",
      gradient,
      border
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</h3>
        </div>
      </div>
      <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">{value}</p>
      <p className="text-xs text-neutral-600 dark:text-neutral-400">{subtitle}</p>
    </div>
  );
});

// Create Employee Modal Component
const CreateEmployeeModal = React.memo(({ onClose }: { onClose: () => void }) => {
  const {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    categories,
    selectedCategory,
    imagePreview,
    priceError,
    handleInputChange,
    handleCategorySelect,
    handleImageUpload,
    submitEmployeeCreation,
    isFormValid,
    resetForm
  } = useEmployeeCreation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await submitEmployeeCreation();
    if (result) {
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Create New Employee</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <IconX className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-200">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-200">Success</p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
              </div>
            </motion.div>
          )}

          {/* Profile Image Upload */}
          <div className="mb-6">
            <Label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-3 block">
              Profile Image (Optional)
            </Label>
            <div className="flex items-center gap-6">
              <div
                onClick={handleImageClick}
                className="relative w-24 h-24 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-[#2B9EB3] transition-colors cursor-pointer overflow-hidden group"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-400 group-hover:text-[#2B9EB3] transition-colors">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs">Upload</span>
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
                  Upload employee profile picture
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  PNG, JPG up to 5MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  minLength={10}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  placeholder="123456"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Street, City, State"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </LabelInputContainer>
            </div>
          </div>

          {/* Category and Pricing */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-500" />
              Category & Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="categoryid">Service Category *</Label>
                <select
                  id="categoryid"
                  value={formData.categoryid}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B9EB3] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName} ({category.categoryType})
                    </option>
                  ))}
                </select>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="payrate">Pay Rate (₹) *</Label>
                <Input
                  id="payrate"
                  type="number"
                  placeholder="0"
                  value={formData.payrate || ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className={cn(priceError && "border-red-500")}
                />
                {priceError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {priceError}
                  </p>
                )}
              </LabelInputContainer>
            </div>

            {/* Category Info Display */}
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium mb-1">Recommended</p>
                    <p className="text-neutral-800 dark:text-neutral-100 font-bold text-lg">
                      ₹{selectedCategory.recommendationPrice.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium mb-1">Min Price</p>
                    <p className="text-neutral-800 dark:text-neutral-100 font-semibold">
                      ₹{(selectedCategory.categoryMinPrice || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium mb-1">Max Price</p>
                    <p className="text-neutral-800 dark:text-neutral-100 font-semibold">
                      ₹{(selectedCategory.categoryMaxPrice || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bank Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-500" />
              Bank Details (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LabelInputContainer>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="State Bank of India"
                  value={formData.bankName}
                  onChange={handleInputChange}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="bankAccountNumber">Account Number</Label>
                <Input
                  id="bankAccountNumber"
                  type="text"
                  placeholder="1234567890"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="bankIfscCode">IFSC Code</Label>
                <Input
                  id="bankIfscCode"
                  type="text"
                  placeholder="SBIN0001234"
                  value={formData.bankIfscCode}
                  onChange={handleInputChange}
                />
              </LabelInputContainer>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-lg font-semibold border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={cn(
                "flex-1 h-12 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2",
                "bg-gradient-to-r from-[#F9A825] to-[#2B9EB3]",
                "hover:shadow-lg hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <IconUserPlus className="w-5 h-5" />
                  Create Employee
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
});

// View Employee Modal Component
const ViewEmployeeModal = React.memo(({ employee, onClose }: { employee: Employee; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Employee Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <IconX className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            {employee.img ? (
              <img 
                src={employee.img} 
                alt={employee.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {getUserInitials(employee.name)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">{employee.name}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{employee.email}</p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              employee.isPaid 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            )}>
              {employee.isPaid ? "Paid" : "Payment Pending"}
            </span>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              employee.isActive 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {employee.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Phone" value={employee.phone} />
            <DetailItem label="Pincode" value={employee.pincode || 'N/A'} />
            <DetailItem label="Pay Rate" value={employee.payrate ? `₹${employee.payrate.toLocaleString()}` : 'N/A'} />
            {employee.address && <DetailItem label="Address" value={employee.address} className="col-span-2" />}
            {employee.bankName && <DetailItem label="Bank Name" value={employee.bankName} />}
            {employee.bankAccountNumber && <DetailItem label="Account Number" value={employee.bankAccountNumber} />}
            {employee.bankIfscCode && <DetailItem label="IFSC Code" value={employee.bankIfscCode} />}
            <DetailItem label="Payment Status" value={employee.paymentStatus} />
            {employee.orderid && <DetailItem label="Order ID" value={employee.orderid} className="col-span-2" />}
            {employee.paymentid && <DetailItem label="Payment ID" value={employee.paymentid} className="col-span-2" />}
          </div>

          <button
            onClick={onClose}
            className="w-full h-12 rounded-lg bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white font-semibold hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
});

// Edit Employee Modal Component
const EditEmployeeModal = React.memo(({ employee, onClose }: { employee: Employee; onClose: () => void }) => {
  const {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    categories,
    selectedCategory,
    imagePreview,
    priceError,
    handleInputChange,
    handleCategorySelect,
    handleImageUpload,
    submitEmployeeUpdate,
    isFormValid,
  } = useEmployeeUpdate({
    name: employee.name || '',
    email: employee.email || '',
    address: employee.address || '',
    phone: employee.phone || '',
    pincode: employee.pincode || '',
    bankName: employee.bankName || '',
    bankAccountNumber: employee.bankAccountNumber || '',
    bankIfscCode: employee.bankIfscCode || '',
    img: employee.img || '',
    categoryid: (typeof employee.categoryid === 'string' ? employee.categoryid : employee.categoryid?._id) || '',
    payrate: employee.payrate || 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = React.useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await submitEmployeeUpdate();
    if (result) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [submitEmployeeUpdate, onClose]);

  const handleImageClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Edit Employee</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <IconX className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-200">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900 dark:text-green-200">Success</p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
              </div>
            </motion.div>
          )}

          {/* Profile Image Upload */}
          <div className="mb-6">
            <Label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-3 block">
              Profile Image
            </Label>
            <div className="flex items-center gap-6">
              <div
                onClick={handleImageClick}
                className="relative w-24 h-24 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-[#2B9EB3] transition-colors cursor-pointer overflow-hidden group"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-400 group-hover:text-[#2B9EB3] transition-colors">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs">Upload</span>
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
                  Upload employee profile picture
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  PNG, JPG up to 5MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="bg-neutral-50 dark:bg-neutral-800 cursor-not-allowed"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  placeholder="123456"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
              </LabelInputContainer>

              <LabelInputContainer className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main St, City, State"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </LabelInputContainer>
            </div>
          </div>

          {/* Bank Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-500" />
              Bank Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  type="text"
                  placeholder="State Bank of India"
                  value={formData.bankName}
                  onChange={handleInputChange}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="bankAccountNumber">Account Number</Label>
                <Input
                  id="bankAccountNumber"
                  type="text"
                  placeholder="1234567890"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="bankIfscCode">IFSC Code</Label>
                <Input
                  id="bankIfscCode"
                  type="text"
                  placeholder="SBIN0001234"
                  value={formData.bankIfscCode}
                  onChange={handleInputChange}
                />
              </LabelInputContainer>
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-500" />
              Category & Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabelInputContainer>
                <Label htmlFor="categoryid">Service Category *</Label>
                <select
                  id="categoryid"
                  value={formData.categoryid}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName} ({category.categoryType})
                    </option>
                  ))}
                </select>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="payrate">Pay Rate (₹) *</Label>
                <Input
                  id="payrate"
                  type="number"
                  placeholder="5000"
                  value={formData.payrate || ''}
                  onChange={handleInputChange}
                  required
                />
                {selectedCategory && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Recommended: ₹{selectedCategory.recommendationPrice?.toLocaleString()} 
                    (Range: ₹{selectedCategory.categoryMinPrice?.toLocaleString()} - ₹{selectedCategory.categoryMaxPrice?.toLocaleString()})
                  </p>
                )}
                {priceError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {priceError}
                  </p>
                )}
              </LabelInputContainer>
            </div>

            {selectedCategory && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-2">
                  Selected Category: {selectedCategory.categoryName}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {selectedCategory.categoryDescription || 'No description available'}
                </p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-lg font-semibold border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={cn(
                "flex-1 h-12 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2",
                "bg-gradient-to-r from-[#F9A825] to-[#2B9EB3]",
                "hover:shadow-lg hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <IconEdit className="w-5 h-5" />
                  Update Employee
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
});

// Delete Confirmation Modal
const DeleteConfirmModal = React.memo(({ 
  employeeEmail, 
  onConfirm, 
  onCancel 
}: { 
  employeeEmail: string; 
  onConfirm: () => void; 
  onCancel: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <IconTrash className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Delete Employee?</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Are you sure you want to delete this employee? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 h-12 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-12 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// Detail Item Component
const DetailItem = React.memo(({ 
  label, 
  value, 
  className 
}: { 
  label: string; 
  value: string; 
  className?: string;
}) => {
  return (
    <div className={className}>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{label}</p>
      <p className="text-neutral-800 dark:text-neutral-100 font-medium">{value}</p>
    </div>
  );
});

// Label Input Container
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
