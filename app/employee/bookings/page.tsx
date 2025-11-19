"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useEmployeeNavigation } from "@/utils/employee/useEmployeeNavigation";
import { useEmployeeData, useEmployeeLogout, useEmployeeSidebar } from "@/utils/employee/useEmployeeHooks";
import { getUserInitials } from "@/utils/auth";
import { BookingCard } from "@/components/employee/BookingCard";
import { 
  IconLogout,
  IconClipboardList,
  IconClock,
  IconPlayerPlay,
  IconHistory,
  IconLoader
} from "@tabler/icons-react";
import { 
  Clock,
  CheckCircle,
  PlayCircle,
  History,
  Loader2,
  RefreshCw,
  Package,
  AlertTriangle
} from "lucide-react";
import { ConfirmDialog } from "@/components/employee/ConfirmDialog";
import { PaymentModal } from "@/components/employee/PaymentModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TabType = "pending" | "in-progress" | "started" | "prev";

export default function EmployeeBookingsPage() {
  const router = useRouter();
  const { employeeData, loading: authLoading, error } = useEmployeeData();
  const { handleLogout } = useEmployeeLogout();
  const { open, setOpen } = useEmployeeSidebar();
  const { links } = useEmployeeNavigation();

  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    action: "",
    bookingId: "",
    confirmText: "Confirm",
    variant: "default" as "default" | "destructive"
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
    
    // Poll every 30 seconds for status updates
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      // Fetch Pending Bookings (Schedules)
      const pendingRes = await fetch("/api/v1/emp/bookings/pendings");
      const pendingData = await pendingRes.json();
      
      if (pendingData.success) {
        // Extract booking from schedule and filter out accepted ones
        const bookings = pendingData.schedules
          .filter((s: any) => !s.isAccepted) 
          .map((s: any) => ({
            ...s.bookingid,
            scheduleId: s._id
          }));
        setPendingBookings(bookings);
      }

      // Fetch All Bookings
      const allRes = await fetch("/api/v1/emp/bookings");
      const allData = await allRes.json();

      if (allData.success) {
        setAllBookings(allData.bookings);
      }

    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (!silent) toast.error("Failed to load bookings");
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getFilteredBookings = () => {
    switch (activeTab) {
      case "pending":
        return pendingBookings;
      case "in-progress":
        return allBookings.filter(b => b.status === "confirmed" || b.status === "in-progress");
      case "started":
        return allBookings.filter(b => b.status === "started");
      case "prev":
        return allBookings.filter(b => ["completed", "cancelled", "refunded"].includes(b.status));
      default:
        return [];
    }
  };

  const filteredBookings = getFilteredBookings();

  const getTabCounts = () => ({
    pending: pendingBookings.length,
    inProgress: allBookings.filter(b => b.status === "confirmed" || b.status === "in-progress").length,
    started: allBookings.filter(b => b.status === "started").length,
    prev: allBookings.filter(b => ["completed", "cancelled", "refunded"].includes(b.status)).length
  });

  const tabCounts = getTabCounts();

  const handleAction = (action: string, booking: any) => {
    if (action === "accept") {
      setDialogConfig({
        title: "Accept Booking",
        description: "Are you sure you want to accept this job? Once accepted, you are expected to complete the service.",
        action: "accept",
        bookingId: booking._id,
        confirmText: "Accept Job",
        variant: "default"
      });
      setDialogOpen(true);
    } else if (action === "start") {
      setDialogConfig({
        title: "Start Service",
        description: "Are you ready to start the service? This will notify the customer.",
        action: "start",
        bookingId: booking._id,
        confirmText: "Start Service",
        variant: "default"
      });
      setDialogOpen(true);
    } else if (action === "payment") {
      setSelectedBookingId(booking._id);
      setPaymentModalOpen(true);
    }
  };

  const handlePaymentConfirm = async (amount: number) => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/v1/emp/bookings/takepayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bookingId: selectedBookingId,
          amount: amount 
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Payment request sent to customer. They will receive notification to complete payment.");
        setPaymentModalOpen(false);
        fetchBookings(); // Refresh to show updated status
      } else {
        toast.error(data.message || "Failed to generate payment request");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    setActionLoading(true);
    try {
      let endpoint = "";
      if (dialogConfig.action === "accept") {
        endpoint = "/api/v1/emp/bookings/accept";
      } else if (dialogConfig.action === "start") {
        endpoint = "/api/v1/emp/bookings/start";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: dialogConfig.bookingId })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Action successful");
        setDialogOpen(false);
        fetchBookings(); // Refresh data
        
        // Switch tab if needed
        if (dialogConfig.action === "accept") {
          setActiveTab("in-progress");
        } else if (dialogConfig.action === "start") {
          setActiveTab("started");
        }
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden md:flex-row", "h-screen")}>
      <Toaster position="top-right" richColors />
      
      <ConfirmDialog 
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmAction}
        title={dialogConfig.title}
        description={dialogConfig.description}
        confirmText={dialogConfig.confirmText}
        variant={dialogConfig.variant}
        loading={actionLoading}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        loading={actionLoading}
        bookingId={selectedBookingId}
      />
      
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
            
            <div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                {employeeData && (
                  <SidebarLink
                    link={{
                      label: employeeData.name || employeeData.email,
                      href: "/employee/profile",
                      icon: <EmployeeAvatar employeeData={employeeData} />,
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
        <div className="p-3 md:p-8 pb-24 md:pb-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-1 md:mb-2">
                  My Bookings
                </h1>
                <p className="text-slate-600 text-xs md:text-base">
                  Manage and track your service requests
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Auto-refresh every 30s
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Refresh bookings"
                >
                  <RefreshCw className={cn("w-5 h-5 text-slate-600", refreshing && "animate-spin")} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <SummaryCard
                label="Pending"
                count={tabCounts.pending}
                icon={<Clock className="w-4 h-4 md:w-5 md:h-5" />}
                color="yellow"
                active={activeTab === "pending"}
                onClick={() => setActiveTab("pending")}
              />
              <SummaryCard
                label="In Progress"
                count={tabCounts.inProgress}
                icon={<CheckCircle className="w-4 h-4 md:w-5 md:h-5" />}
                color="blue"
                active={activeTab === "in-progress"}
                onClick={() => setActiveTab("in-progress")}
              />
              <SummaryCard
                label="Started"
                count={tabCounts.started}
                icon={<PlayCircle className="w-4 h-4 md:w-5 md:h-5" />}
                color="green"
                active={activeTab === "started"}
                onClick={() => setActiveTab("started")}
              />
              <SummaryCard
                label="History"
                count={tabCounts.prev}
                icon={<History className="w-4 h-4 md:w-5 md:h-5" />}
                color="purple"
                active={activeTab === "prev"}
                onClick={() => setActiveTab("prev")}
              />
            </div>
          </motion.div>

          {/* All Bookings Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold text-[#0A3D62] flex items-center gap-2">
                {activeTab === "pending" && (
                  <>
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                    Pending Jobs
                  </>
                )}
                {activeTab === "in-progress" && (
                  <>
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    In Progress
                  </>
                )}
                {activeTab === "started" && (
                  <>
                    <PlayCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    Started Services
                  </>
                )}
                {activeTab === "prev" && (
                  <>
                    <History className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                    History
                  </>
                )}
                <span className="text-sm font-normal text-slate-500">
                  ({filteredBookings.length})
                </span>
              </h2>
            </div>

            {/* Bookings List */}
            {loading ? (
              <div className="flex flex-col justify-center items-center py-16 md:py-20">
                <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-[#2B9EB3] mb-3" />
                <p className="text-slate-500 text-sm">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <EmptyState activeTab={activeTab} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <BookingCard 
                      booking={booking} 
                      type={activeTab === "pending" ? "pending" : activeTab === "prev" ? "history" : "active"}
                      onAction={handleAction}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Summary Card Component
const SummaryCard: React.FC<{
  label: string;
  count: number;
  icon: React.ReactNode;
  color: "yellow" | "blue" | "green" | "purple";
  active: boolean;
  onClick: () => void;
}> = ({ label, count, icon, color, active, onClick }) => {
  const colorClasses = {
    yellow: {
      bg: "from-yellow-500/10 to-yellow-600/10",
      border: "border-yellow-500/30",
      icon: "bg-yellow-500 text-white",
      activeBg: "from-yellow-500 to-yellow-600",
      text: "text-yellow-700"
    },
    blue: {
      bg: "from-blue-500/10 to-blue-600/10",
      border: "border-blue-500/30",
      icon: "bg-blue-500 text-white",
      activeBg: "from-blue-500 to-blue-600",
      text: "text-blue-700"
    },
    green: {
      bg: "from-green-500/10 to-green-600/10",
      border: "border-green-500/30",
      icon: "bg-green-500 text-white",
      activeBg: "from-green-500 to-green-600",
      text: "text-green-700"
    },
    purple: {
      bg: "from-purple-500/10 to-purple-600/10",
      border: "border-purple-500/30",
      icon: "bg-purple-500 text-white",
      activeBg: "from-purple-500 to-purple-600",
      text: "text-purple-700"
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-xl p-3 md:p-4 border transition-all cursor-pointer",
        active
          ? `bg-gradient-to-br ${colors.activeBg} border-transparent shadow-lg`
          : `bg-gradient-to-br ${colors.bg} ${colors.border} hover:shadow-md`
      )}
    >
      <div className={cn(
        "flex items-center gap-2 md:gap-3",
        active ? "text-white" : colors.text
      )}>
        <div className={cn(
          "p-1.5 md:p-2 rounded-lg",
          active ? "bg-white/20" : colors.icon
        )}>
          {icon}
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className={cn(
            "text-xs md:text-sm font-medium truncate",
            active ? "text-white" : "text-slate-600"
          )}>
            {label}
          </p>
          <p className={cn(
            "text-lg md:text-2xl font-bold",
            active ? "text-white" : colors.text
          )}>
            {count}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

// Empty State Component
const EmptyState: React.FC<{ activeTab: TabType }> = ({ activeTab }) => {
  const messages = {
    pending: {
      title: "No pending jobs",
      description: "You're all caught up! New booking requests will appear here.",
      icon: <Clock className="w-16 h-16 md:w-20 md:h-20" />,
      color: "text-yellow-500"
    },
    "in-progress": {
      title: "No active jobs",
      description: "Accept pending jobs to see them here.",
      icon: <CheckCircle className="w-16 h-16 md:w-20 md:h-20" />,
      color: "text-blue-500"
    },
    started: {
      title: "No started services",
      description: "Jobs you've started will appear here.",
      icon: <PlayCircle className="w-16 h-16 md:w-20 md:h-20" />,
      color: "text-green-500"
    },
    prev: {
      title: "No history yet",
      description: "Your completed and cancelled jobs will appear here.",
      icon: <History className="w-16 h-16 md:w-20 md:h-20" />,
      color: "text-purple-500"
    }
  };

  const message = messages[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 md:p-12 text-center border-2 border-dashed border-slate-300"
    >
      <div className={`mb-4 inline-flex items-center justify-center ${message.color}`}>
        {message.icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-[#0A3D62] mb-2">
        {message.title}
      </h3>
      <p className="text-slate-600 mb-6 text-sm md:text-base max-w-md mx-auto">
        {message.description}
      </p>
    </motion.div>
  );
};

// Loading Screen Component
const LoadingScreen = () => (
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
      <p className="text-[#0A3D62] font-semibold">Loading bookings...</p>
    </div>
  </div>
);

// Error Screen Component
const ErrorScreen: React.FC<{ error: string }> = ({ error }) => {
  const router = useRouter();
  
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
};

// Logo Components
const Logo = () => (
  <Link
    href="/employee/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India Logo" 
      className="h-8 w-auto"
    />
  </Link>
);

const LogoIcon = () => (
  <Link
    href="/employee/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India" 
      className="h-8 w-8 object-contain"
    />
  </Link>
);

// Employee Avatar Component
const EmployeeAvatar = ({ employeeData }: { employeeData: any }) => (
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
      {getUserInitials(employeeData.name || employeeData.email || "E")}
    </span>
  </div>
);
