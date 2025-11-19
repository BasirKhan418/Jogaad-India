"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";
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
  Search,
  Filter,
  Users,
  Edit,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  CheckCircle,
  XCircle,
  Calendar,
  Briefcase,
  ArrowUpDown,
} from "lucide-react";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  pincode?: string;
  img?: string;
  isPaid: boolean;
  isActive: boolean;
  paymentStatus: string;
  categoryid?: {
    categoryName?: string;
  };
  payrate?: number;
  createdAt: string;
  updatedAt: string;
}

export default function FieldExecEmployeesPage() {
  const router = useRouter();
  const { fieldExecData, loading: fieldExecLoading, error: fieldExecError } = useFieldExecData();
  const { handleLogout } = useFieldExecLogout();
  const { open, setOpen } = useFieldExecSidebar();
  const { links } = useFieldExecNavigation();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "paid" | "unpaid">("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "payment">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const itemsPerPage = 12;

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/field-e/analytics/recentdata");
      const data = await response.json();

      if (data.success) {
        setEmployees(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch service providers");
      }
    } catch (error) {
      console.error("Error fetching service providers:", error);
      toast.error("Failed to load service providers");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search service providers
  const filteredEmployees = employees
    .filter((emp) => {
      // Search filter
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.includes(searchQuery);

      // Status filter
      let matchesStatus = true;
      if (filterStatus === "active") matchesStatus = emp.isActive;
      else if (filterStatus === "inactive") matchesStatus = !emp.isActive;
      else if (filterStatus === "paid") matchesStatus = emp.isPaid;
      else if (filterStatus === "unpaid") matchesStatus = !emp.isPaid;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "payment") return (b.isPaid ? 1 : 0) - (a.isPaid ? 1 : 0);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleEdit = (employeeId: string, createdAt: string) => {
    const hoursSinceCreation = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 12) {
      toast.error("Cannot edit service provider after 12 hours of creation");
      return;
    }
    router.push(`/field-executive/edit-employee?id=${employeeId}`);
  };

  if (fieldExecLoading) {
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
          <p className="text-[#0A3D62] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (fieldExecError) {
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
          <p className="text-[#0A3D62]/70 mb-4">{fieldExecError}</p>
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
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : null}
                          <span
                            className="text-white font-bold text-xs leading-none select-none"
                            style={{ fontSize: "10px", color: "white" }}
                          >
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-2">
              All Service Providers
            </h1>
            <p className="text-slate-600">
              Manage and view all service providers under your supervision
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 md:p-3 bg-gradient-to-br from-[#2B9EB3]/10 to-[#0A3D62]/10 rounded-xl">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-[#2B9EB3]" />
                </div>
              </div>
              <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Total Service Providers</h3>
              <p className="text-2xl md:text-3xl font-bold text-[#0A3D62]">{employees.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 md:p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Active</h3>
              <p className="text-2xl md:text-3xl font-bold text-[#0A3D62]">{employees.filter((e) => e.isActive).length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl">
                  <IndianRupee className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Paid</h3>
              <p className="text-2xl md:text-3xl font-bold text-[#0A3D62]">{employees.filter((e) => e.isPaid).length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 md:p-3 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-xl">
                  <XCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-slate-600 text-xs md:text-sm font-medium mb-1">Pending</h3>
              <p className="text-2xl md:text-3xl font-bold text-[#0A3D62]">{employees.filter((e) => !e.isPaid).length}</p>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all",
                      filterStatus !== "all"
                        ? "bg-[#2B9EB3] text-white border-[#2B9EB3]"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>

                  {/* Filter Dropdown */}
                  <AnimatePresence>
                    {showFilterMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
                      >
                        {[
                          { value: "all", label: "All Service Providers" },
                          { value: "active", label: "Active Only" },
                          { value: "inactive", label: "Inactive Only" },
                          { value: "paid", label: "Paid Only" },
                          { value: "unpaid", label: "Unpaid Only" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setFilterStatus(option.value as any);
                              setShowFilterMenu(false);
                              setCurrentPage(1);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm transition-colors",
                              filterStatus === option.value
                                ? "bg-[#2B9EB3] text-white"
                                : "text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => {
                    const sortOptions: Array<"name" | "date" | "payment"> = ["name", "date", "payment"];
                    const currentIndex = sortOptions.indexOf(sortBy);
                    setSortBy(sortOptions[(currentIndex + 1) % sortOptions.length]);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {sortBy === "name" ? "Name" : sortBy === "date" ? "Date" : "Payment"}
                  </span>
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filterStatus !== "all" || searchQuery) && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2B9EB3]/10 text-[#2B9EB3] text-xs rounded-full">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")} className="hover:text-[#0A3D62]">
                      ×
                    </button>
                  </span>
                )}
                {filterStatus !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2B9EB3]/10 text-[#2B9EB3] text-xs rounded-full">
                    {filterStatus}
                    <button onClick={() => setFilterStatus("all")} className="hover:text-[#0A3D62]">
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Employees Grid */}
          {loading ? (
            <LoadingGrid />
          ) : filteredEmployees.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {paginatedEmployees.map((employee, index) => (
                  <EmployeeCard
                    key={employee._id}
                    employee={employee}
                    index={index}
                    onEdit={handleEdit}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <MobileBottomNav 
        links={links} 
        currentPath="/field-executive/employees"
      />
    </div>
  );
}

/* Employee Card Component */
const EmployeeCard = ({ employee, index, onEdit }: any) => {
  const hoursSinceCreation = (Date.now() - new Date(employee.createdAt).getTime()) / (1000 * 60 * 60);
  const canEdit = hoursSinceCreation <= 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Header with Image */}
      <div className="relative h-28 md:h-32 bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62]">
        <div className="absolute -bottom-10 left-4">
          {employee.img ? (
            <img
              src={employee.img}
              alt={employee.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-[#2B9EB3]">
                {employee.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {employee.isActive && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Active
            </span>
          )}
          {employee.isPaid && (
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full flex items-center gap-1">
              <IndianRupee className="w-3 h-3" />
              Paid
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 p-4">
        <h3 className="text-lg font-bold text-[#0A3D62] mb-1 truncate">{employee.name}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{employee.phone}</span>
          </div>
          {employee.city && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{employee.city}</span>
            </div>
          )}
          {employee.categoryid?.categoryName && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{employee.categoryid.categoryName}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {canEdit ? (
          <button
            onClick={() => onEdit(employee._id, employee.createdAt)}
            className="w-full py-2.5 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <Edit className="w-4 h-4" />
            Edit Service Provider
          </button>
        ) : (
          <div className="w-full py-2.5 bg-slate-100 text-slate-500 rounded-lg font-medium text-center text-sm">
            Edit period expired
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* Pagination Component */
const Pagination = ({ currentPage, totalPages, onPageChange }: any) => (
  <div className="flex items-center justify-center gap-2 mt-8">
    <button
      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>

    <div className="flex gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => {
          // Show first, last, current, and adjacent pages
          return (
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 1
          );
        })
        .map((page, index, array) => (
          <React.Fragment key={page}>
            {index > 0 && array[index - 1] !== page - 1 && (
              <span className="px-2 flex items-center">...</span>
            )}
            <button
              onClick={() => onPageChange(page)}
              className={cn(
                "w-10 h-10 rounded-lg font-medium transition-all",
                currentPage === page
                  ? "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white shadow-lg"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {page}
            </button>
          </React.Fragment>
        ))}
    </div>

    <button
      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);

// Loading States
const LoadingState = () => (
  <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: "url(/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
    <div className="relative z-20 text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
      <p className="text-[#0A3D62] font-semibold">Loading...</p>
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: "url(/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
    <div className="relative z-20 text-center max-w-md mx-auto p-6">
      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-bold text-[#0A3D62] mb-2">Access Error</h2>
      <p className="text-[#0A3D62]/70 mb-4">{error}</p>
      <Link
        href="/field-executive/login"
        className="inline-block bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
      >
        Go to Login
      </Link>
    </div>
  </div>
);

const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
        <div className="pt-12 p-4 space-y-3">
          <div className="h-6 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
          <div className="h-10 bg-slate-200 rounded animate-pulse mt-4" />
        </div>
      </div>
    ))}
  </div>
);

/* Empty State Component */
const EmptyState = ({ searchQuery }: { searchQuery: string }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 text-center">
    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Users className="w-8 h-8 md:w-10 md:h-10 text-slate-400" />
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-[#0A3D62] mb-2">
      {searchQuery ? "No service providers found" : "No service providers yet"}
    </h3>
    <p className="text-slate-600 mb-6">
      {searchQuery
        ? "Try adjusting your search or filter criteria"
        : "Start by adding your first service provider"}
    </p>
    {!searchQuery && (
      <Link
        href="/field-executive/add-employee"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
      >
        <Users className="w-5 h-5" />
        Add Service Provider
      </Link>
    )}
  </div>
);

/* Logo Components */
const Logo = () => {
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

const LogoIcon = () => {
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
                isActive ? "" : "hover:bg-neutral-800/50"
              )}
            >
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full" />
              )}

              <div
                className={cn(
                  "flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 relative",
                  isActive
                    ? "bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] shadow-lg shadow-[#2B9EB3]/30"
                    : "bg-neutral-800/50"
                )}
              >
                {React.cloneElement(link.icon, {
                  className: cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isActive ? "text-white" : "text-neutral-400"
                  ),
                })}
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold transition-all duration-300 tracking-tight",
                  isActive ? "text-white" : "text-neutral-400"
                )}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
