"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useEmployeeNavigation } from "@/utils/employee/useEmployeeNavigation";
import { useEmployeeData, useEmployeeLogout, useEmployeeSidebar } from "@/utils/employee/useEmployeeHooks";
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
  Calendar,
  Filter,
  Loader2,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  List,
  AlertTriangle,
  Package,
  Ban,
  Search,
  PlayCircle,
  History
} from "lucide-react";
import { ConfirmDialog } from "@/components/employee/ConfirmDialog";
import { PaymentModal } from "@/components/employee/PaymentModal";
import Link from "next/link";
import { getUserInitials } from "@/utils/auth";

type TabType = "pending" | "in-progress" | "started" | "history";

export default function EmployeeBookingsPage() {
  const { employeeData, loading: authLoading } = useEmployeeData();
  const { handleLogout } = useEmployeeLogout();
  const { open, setOpen } = useEmployeeSidebar();
  const { links } = useEmployeeNavigation();

  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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
    
    // Poll every 15 seconds
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      // Fetch Pending Bookings (Schedules)
      const pendingRes = await fetch("/api/v1/emp/bookings/pendings");
      const pendingData = await pendingRes.json();
      
      if (pendingData.success) {
        // Extract booking from schedule
        const bookings = pendingData.schedules.map((s: any) => ({
          ...s.bookingid,
          scheduleId: s._id // Keep schedule ID if needed
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
    }
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
        toast.success("Payment link generated successfully");
        setPaymentModalOpen(false);
        fetchBookings(); // Refresh data
        // Optionally move to history or stay on started until paid
      } else {
        toast.error(data.message || "Failed to generate payment");
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

  if (authLoading) return <LoadingScreen />;

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
      
      {/* Sidebar */}
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
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full py-2 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors mt-2"
                >
                  <IconLogout className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />
                  <motion.span
                    animate={{ display: open ? "inline-block" : "none", opacity: open ? 1 : 0 }}
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
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-neutral-900">
        <div className="p-4 md:p-8 pb-24">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              My Bookings
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Manage your service requests and history
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 bg-white p-1 rounded-xl border border-slate-200 w-fit">
            <TabButton 
              active={activeTab === "pending"} 
              onClick={() => setActiveTab("pending")}
              icon={<IconClock className="w-4 h-4" />}
              label="Pending"
              count={pendingBookings.length}
            />
            <TabButton 
              active={activeTab === "in-progress"} 
              onClick={() => setActiveTab("in-progress")}
              icon={<IconLoader className="w-4 h-4" />}
              label="In Progress"
              count={allBookings.filter(b => b.status === "confirmed" || b.status === "in-progress").length}
            />
            <TabButton 
              active={activeTab === "started"} 
              onClick={() => setActiveTab("started")}
              icon={<IconPlayerPlay className="w-4 h-4" />}
              label="Started"
              count={allBookings.filter(b => b.status === "started").length}
            />
            <TabButton 
              active={activeTab === "prev"} 
              onClick={() => setActiveTab("prev")}
              icon={<IconHistory className="w-4 h-4" />}
              label="History"
              count={allBookings.filter(b => ["completed", "cancelled", "refunded"].includes(b.status)).length}
            />
          </div>

          {/* Bookings Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B9EB3]"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconClipboardList className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No bookings found</h3>
              <p className="text-slate-500">There are no bookings in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookings.map((booking) => (
                <BookingCard 
                  key={booking._id} 
                  booking={booking} 
                  type={activeTab === "pending" ? "pending" : activeTab === "prev" ? "history" : "active"}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label, count }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
      active 
        ? "bg-[#2B9EB3] text-white shadow-md" 
        : "text-slate-600 hover:bg-slate-50"
    )}
  >
    {icon}
    {label}
    {count > 0 && (
      <span className={cn(
        "px-1.5 py-0.5 rounded-full text-[10px]",
        active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
      )}>
        {count}
      </span>
    )}
  </button>
);

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B9EB3]"></div>
  </div>
);

export const Logo = () => (
  <Link
    href="/employee/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img src="/logo.png" alt="Jogaad India Logo" className="h-8 w-auto" />
  </Link>
);

export const LogoIcon = () => (
  <Link
    href="/employee/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img src="/logo.png" alt="Jogaad India" className="h-8 w-8 object-contain" />
  </Link>
);
