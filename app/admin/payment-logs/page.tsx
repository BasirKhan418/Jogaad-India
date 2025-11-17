"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconLogout,
  IconCalendar,
  IconAlertCircle,
  IconCircleCheck,
  IconClock,
  IconInfoCircle,
  IconRefresh,
  IconSearch,
  IconFileText,
  IconCurrencyRupee,
  IconChartBar,
  IconFilter,
} from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAdminNavigation } from "@/utils/admin/useAdminNavigation";
import { useAdminData, useAdminLogout, useAdminSidebar } from "@/utils/admin/useAdminHooks";
import { useTodayPaymentLogs, usePaymentLogsByDate } from "@/utils/admin/usePaymentLogs";
import { PaymentLog } from "@/repository/admin/paymentLogs";
import { extractPaymentDetails } from "@/utils/admin/paymentLogService";
import { getUserInitials } from "@/utils/auth";

export default function PaymentLogsPage() {
  const router = useRouter();
  const { adminData, loading, error } = useAdminData();
  const { handleLogout } = useAdminLogout();
  const { open, setOpen } = useAdminSidebar();
  const { links } = useAdminNavigation();

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
            <IconAlertCircle className="w-8 h-8 text-white" />
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
      
      <PaymentLogsContent />
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

// Payment Logs Content Component
const PaymentLogsContent = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"today" | "bydate">("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "payment.captured" | "payment.failed" | "error" | "info">("all");
  const [viewLog, setViewLog] = useState<PaymentLog | null>(null);

  // Handle stat card click to filter
  const handleStatCardClick = (type: "all" | "payment.captured" | "payment.failed" | "error" | "info") => {
    setFilterType(type);
    // Scroll to logs section
    const logsSection = document.getElementById("logs-section");
    if (logsSection) {
      logsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Fetch logs based on view mode
  const todayLogs = useTodayPaymentLogs();
  const dateLogs = usePaymentLogsByDate(selectedDate);

  const currentLogs = viewMode === "today" ? todayLogs : dateLogs;

  // Filter logs based on search and filter
  const filteredLogs = currentLogs.logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.timestamp.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      setViewMode("bydate");
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="p-2 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 dark:hover:from-neutral-700 dark:hover:to-neutral-600 border border-neutral-200 dark:border-neutral-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <IconArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                  Payment Logs
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Monitor and analyze payment transactions and system logs
                </p>
              </div>
            </div>
            
            <button
              onClick={() => currentLogs.refetch()}
              disabled={currentLogs.loading}
              className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconRefresh className={cn("h-5 w-5", currentLogs.loading && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode("today")}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2",
                viewMode === "today"
                  ? "bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white shadow-lg"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              )}
            >
              <IconClock className="h-5 w-5" />
              Today's Logs
            </button>
            <button
              onClick={() => setViewMode("bydate")}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2",
                viewMode === "bydate"
                  ? "bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white shadow-lg"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              )}
            >
              <IconCalendar className="h-5 w-5" />
              By Date
            </button>
          </div>

          {/* Date Picker for By Date mode */}
          {viewMode === "bydate" && (
            <form onSubmit={handleDateSubmit} className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#2B9EB3]"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white font-semibold hover:shadow-lg transition-all"
              >
                Load Logs
              </button>
            </form>
          )}
        </div>

        {/* Stats Overview */}
        {currentLogs.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatsCard 
              title="Total Logs" 
              value={currentLogs.stats.totalLogs.toString()} 
              icon={<IconFileText className="h-8 w-8 text-blue-500" />}
              gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
              border="border-blue-200 dark:border-blue-700"
              onClick={() => handleStatCardClick("all")}
              isActive={filterType === "all"}
            />
            <StatsCard 
              title="Captured Payments" 
              value={currentLogs.stats.capturedPayments.toString()} 
              icon={<IconCircleCheck className="h-8 w-8 text-green-500" />}
              gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
              border="border-green-200 dark:border-green-700"
              onClick={() => handleStatCardClick("payment.captured")}
              isActive={filterType === "payment.captured"}
            />
            <StatsCard 
              title="Failed Payments" 
              value={currentLogs.stats.failedPayments.toString()} 
              icon={<IconAlertCircle className="h-8 w-8 text-red-500" />}
              gradient="from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
              border="border-red-200 dark:border-red-700"
              onClick={() => handleStatCardClick("payment.failed")}
              isActive={filterType === "payment.failed"}
            />
            <StatsCard 
              title="Errors" 
              value={currentLogs.stats.errors.toString()} 
              icon={<IconAlertCircle className="h-8 w-8 text-orange-500" />}
              gradient="from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
              border="border-orange-200 dark:border-orange-700"
              onClick={() => handleStatCardClick("error")}
              isActive={filterType === "error"}
            />
            <StatsCard 
              title="Info Logs" 
              value={currentLogs.stats.infoLogs.toString()} 
              icon={<IconInfoCircle className="h-8 w-8 text-purple-500" />}
              gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
              border="border-purple-200 dark:border-purple-700"
              onClick={() => handleStatCardClick("info")}
              isActive={filterType === "info"}
            />
          </div>
        )}

        {/* Search and Filter */}
        <div id="logs-section" className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 relative min-w-[250px]">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search payment ID, order ID, amount, or message..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#2B9EB3]"
            />
          </div>
          <div className="flex gap-2 items-center">
            <IconFilter className="h-5 w-5 text-neutral-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] min-w-[200px]"
            >
              <option value="all">All Types</option>
              <option value="payment.captured">✓ Captured Payments</option>
              <option value="payment.failed">✗ Failed Payments</option>
              <option value="error">⚠ Errors</option>
              <option value="info">ℹ Info</option>
            </select>
            {filterType !== "all" && (
              <button
                onClick={() => setFilterType("all")}
                className="px-4 py-3 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors font-medium"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Filter Badge */}
        {filterType !== "all" && (
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white font-semibold text-sm">
              <IconFilter className="h-4 w-4" />
              Showing: {filterType === "payment.captured" ? "Captured Payments" : 
                        filterType === "payment.failed" ? "Failed Payments" : 
                        filterType === "error" ? "Errors" : "Info Logs"}
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20">
                {filteredLogs.length}
              </span>
            </div>
          </div>
        )}

        {/* Logs List */}
        <div className="space-y-4">
          {currentLogs.loading ? (
            <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-12 border border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B9EB3]"></div>
                <p className="text-neutral-600 dark:text-neutral-400">Loading payment logs...</p>
              </div>
            </div>
          ) : currentLogs.error ? (
            <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 border border-red-200 dark:border-red-700">
              <div className="flex items-center gap-4">
                <IconAlertCircle className="h-12 w-12 text-red-500" />
                <div>
                  <h3 className="text-lg font-bold text-red-800 dark:text-red-100 mb-1">Error Loading Logs</h3>
                  <p className="text-red-600 dark:text-red-300">{currentLogs.error}</p>
                </div>
              </div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-12 border border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-col items-center text-center space-y-4">
                <IconFileText className="h-16 w-16 text-neutral-400" />
                <div>
                  <h3 className="text-lg font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                    No Logs Found
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {searchQuery || filterType !== "all" 
                      ? "No logs match your search criteria." 
                      : "No payment logs available for this date."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <LogCard 
                key={index} 
                log={log} 
                index={index}
                onClick={() => setViewLog(log)}
              />
            ))
          )}
        </div>
      </div>

      {/* Log Detail Modal */}
      {viewLog && (
        <LogDetailModal 
          log={viewLog} 
          onClose={() => setViewLog(null)} 
        />
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  icon, 
  gradient, 
  border,
  onClick,
  isActive
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  gradient: string; 
  border: string;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "rounded-xl p-6 border cursor-pointer transition-all duration-200", 
        gradient, 
        border,
        isActive && "ring-2 ring-[#2B9EB3] shadow-lg"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "text-sm font-medium",
          isActive ? "text-[#2B9EB3] dark:text-[#2B9EB3]" : "text-neutral-600 dark:text-neutral-400"
        )}>
          {title}
        </div>
        {icon}
      </div>
      <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">{value}</div>
      {isActive && (
        <div className="mt-2 text-xs text-[#2B9EB3] font-semibold">
          ✓ Filtering
        </div>
      )}
    </motion.div>
  );
};

// Log Card Component
const LogCard = ({ 
  log, 
  index,
  onClick 
}: { 
  log: PaymentLog; 
  index: number;
  onClick: () => void;
}) => {
  const getLogColor = (type: PaymentLog["type"]) => {
    switch (type) {
      case "payment.captured":
        return {
          bg: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
          border: "border-green-200 dark:border-green-700",
          icon: "text-green-500",
          badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
        };
      case "payment.failed":
        return {
          bg: "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
          border: "border-red-200 dark:border-red-700",
          icon: "text-red-500",
          badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
        };
      case "error":
        return {
          bg: "from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20",
          border: "border-orange-200 dark:border-orange-700",
          icon: "text-orange-500",
          badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
        };
      default:
        return {
          bg: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
          border: "border-blue-200 dark:border-blue-700",
          icon: "text-blue-500",
          badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
        };
    }
  };

  const colors = getLogColor(log.type);
  const paymentDetails = extractPaymentDetails(log);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        "rounded-xl p-6 border cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br",
        colors.bg,
        colors.border
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={cn("p-3 rounded-lg", colors.icon)}>
            {log.type === "payment.captured" && <IconCircleCheck className="h-6 w-6" />}
            {log.type === "payment.failed" && <IconAlertCircle className="h-6 w-6" />}
            {log.type === "error" && <IconAlertCircle className="h-6 w-6" />}
            {log.type === "info" && <IconInfoCircle className="h-6 w-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", colors.badge)}>
                {log.type === "payment.captured" && "✓ "}
                {log.type === "payment.failed" && "✗ "}
                {log.type.replace(".", " ").toUpperCase()}
              </span>
              {paymentDetails?.status && (
                <span className={cn(
                  "px-2 py-1 rounded-md text-xs font-bold",
                  paymentDetails.status === "captured" 
                    ? "bg-green-500 text-white" 
                    : "bg-red-500 text-white"
                )}>
                  {paymentDetails.status.toUpperCase()}
                </span>
              )}
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2 mb-3">
              {log.message.length > 150 ? log.message.substring(0, 150) + "..." : log.message}
            </p>
            {paymentDetails && (
              <div className="flex gap-4 text-xs flex-wrap">
                {paymentDetails.paymentId && (
                  <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                    <span className="font-semibold text-neutral-600 dark:text-neutral-400">ID:</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{paymentDetails.paymentId.substring(0, 20)}...</span>
                  </div>
                )}
                {paymentDetails.amount && (
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                    <IconCurrencyRupee className="h-3 w-3 text-green-700 dark:text-green-400" />
                    <span className="font-bold text-green-700 dark:text-green-400">{paymentDetails.amount.toFixed(2)}</span>
                  </div>
                )}
                {paymentDetails.orderId && (
                  <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Order:</span>
                    <span className="font-mono text-blue-800 dark:text-blue-300">{paymentDetails.orderId.substring(0, 15)}...</span>
                  </div>
                )}
              </div>
            )}
            <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 italic">
              Click to view full details →
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg transition-all",
            log.type === "payment.captured" && "bg-green-100 dark:bg-green-900/30",
            log.type === "payment.failed" && "bg-red-100 dark:bg-red-900/30",
            log.type === "error" && "bg-orange-100 dark:bg-orange-900/30",
            log.type === "info" && "bg-blue-100 dark:bg-blue-900/30"
          )}>
            <IconChartBar className={cn(
              "h-5 w-5",
              log.type === "payment.captured" && "text-green-600 dark:text-green-400",
              log.type === "payment.failed" && "text-red-600 dark:text-red-400",
              log.type === "error" && "text-orange-600 dark:text-orange-400",
              log.type === "info" && "text-blue-600 dark:text-blue-400"
            )} />
          </div>
          <span className="text-xs text-neutral-400 font-medium">View</span>
        </div>
      </div>
    </motion.div>
  );
};

// Log Detail Modal
const LogDetailModal = ({ 
  log, 
  onClose 
}: { 
  log: PaymentLog; 
  onClose: () => void;
}) => {
  const paymentDetails = extractPaymentDetails(log);

  const getLogColor = (type: PaymentLog["type"]) => {
    switch (type) {
      case "payment.captured":
        return {
          bg: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
          icon: <IconCircleCheck className="h-6 w-6 text-green-500" />,
          title: "text-green-800 dark:text-green-100"
        };
      case "payment.failed":
        return {
          bg: "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
          icon: <IconAlertCircle className="h-6 w-6 text-red-500" />,
          title: "text-red-800 dark:text-red-100"
        };
      case "error":
        return {
          bg: "from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20",
          icon: <IconAlertCircle className="h-6 w-6 text-orange-500" />,
          title: "text-orange-800 dark:text-orange-100"
        };
      default:
        return {
          bg: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
          icon: <IconInfoCircle className="h-6 w-6 text-blue-500" />,
          title: "text-blue-800 dark:text-blue-100"
        };
    }
  };

  const colors = getLogColor(log.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-neutral-200 dark:border-neutral-700"
      >
        {/* Header */}
        <div className={cn("p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r", colors.bg)}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20">
                {colors.icon}
              </div>
              <div>
                <h2 className={cn("text-xl font-bold", colors.title)}>
                  {log.type.replace(".", " ").toUpperCase()}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {new Date(log.timestamp).toLocaleString("en-IN", {
                    dateStyle: "full",
                    timeStyle: "medium"
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
            >
              <IconAlertCircle className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Payment Success/Failure Banner */}
          {(log.type === "payment.captured" || log.type === "payment.failed") && (
            <div className={cn(
              "mb-6 p-6 rounded-xl border-2",
              log.type === "payment.captured" 
                ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700"
                : "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-red-300 dark:border-red-700"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-4 rounded-full",
                  log.type === "payment.captured" 
                    ? "bg-green-500" 
                    : "bg-red-500"
                )}>
                  {log.type === "payment.captured" ? (
                    <IconCircleCheck className="h-8 w-8 text-white" />
                  ) : (
                    <IconAlertCircle className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={cn(
                    "text-2xl font-bold mb-2",
                    log.type === "payment.captured" 
                      ? "text-green-800 dark:text-green-100" 
                      : "text-red-800 dark:text-red-100"
                  )}>
                    {log.type === "payment.captured" ? "Payment Successful ✓" : "Payment Failed ✗"}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    log.type === "payment.captured" 
                      ? "text-green-700 dark:text-green-300" 
                      : "text-red-700 dark:text-red-300"
                  )}>
                    {log.type === "payment.captured" 
                      ? "This payment has been successfully captured and processed." 
                      : "This payment attempt has failed. Check the details below for more information."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Details */}
          {paymentDetails && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Payment Details</h3>
                {paymentDetails.status && (
                  <span className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold",
                    paymentDetails.status === "captured" 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-300"
                  )}>
                    {paymentDetails.status.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentDetails.paymentId && (
                  <DetailCard label="Payment ID" value={paymentDetails.paymentId} />
                )}
                {paymentDetails.orderId && (
                  <DetailCard label="Order ID" value={paymentDetails.orderId} />
                )}
                {paymentDetails.amount && (
                  <DetailCard 
                    label="Amount" 
                    value={`₹${paymentDetails.amount.toFixed(2)}`}
                    valueClass="text-2xl font-bold text-green-600 dark:text-green-400"
                  />
                )}
                {paymentDetails.currency && (
                  <DetailCard label="Currency" value={paymentDetails.currency.toUpperCase()} />
                )}
              </div>
            </div>
          )}

          {/* Log Message */}
          <div>
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">Full Log Message</h3>
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <pre className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap break-words font-mono">
                {log.message}
              </pre>
            </div>
          </div>

          {/* Timestamp */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">Timestamp</h3>
            <DetailCard 
              label="ISO 8601" 
              value={log.timestamp}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white font-semibold hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DetailCard = ({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) => (
  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 bg-white dark:bg-neutral-800">
    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
    <p className={cn("text-sm font-semibold text-neutral-800 dark:text-neutral-100 break-words", valueClass)}>
      {value}
    </p>
  </div>
);
