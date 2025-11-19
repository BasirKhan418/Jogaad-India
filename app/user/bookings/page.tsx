"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { IconLogout } from "@tabler/icons-react";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useUserNavigation } from "@/utils/user/useUserNavigation";
import { 
  useUserData, 
  useUserLogout, 
  useUserSidebar 
} from "@/utils/user/useUserHooks";
import { MobileBottomNav } from "@/components/user/MobileBottomNav";
import { BookingCard } from "@/components/user/BookingCard";
import { RatingDialog } from "@/components/user/RatingDialog";
import { CancelBookingDialog } from "@/components/user/CancelBookingDialog";
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
  Search
} from "lucide-react";

type TabType = "all" | "pending" | "confirmed" | "completed" | "cancelled" | "refunded";

interface Booking {
  _id: string;
  userid: any;
  categoryid: any;
  employeeid?: any;
  status: "pending" | "confirmed" | "in-progress" | "started" | "completed" | "cancelled" | "refunded";
  bookingDate: string;
  isActive: boolean;
  isDone: boolean;
  intialamount: number;
  bookingAmount?: number;
  orderid: string;
  paymentid?: string;
  paymentStatus?: string;
  intialPaymentStatus?: string;
  refundStatus?: string;
  refundAmount?: number;
  renderPaymentButton: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User Bookings Page
 * Displays all bookings with filtering and actions
 * Follows SRP and DRY principles
 */
export default function UserBookingsPage() {
  const router = useRouter();
  const { userData, loading: userLoading, error } = useUserData();
  const { handleLogout } = useUserLogout();
  const { open, setOpen } = useUserSidebar();
  const { links } = useUserNavigation();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "amount-high" | "amount-low">("newest");
  const [dateFilter, setDateFilter] = useState("");

  // Modal states
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Fetch bookings on mount and set up polling
  useEffect(() => {
    fetchBookings();
    
    // Poll every 30 seconds for status updates
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Fetch all bookings for the user
   * @param silent - If true, don't show loading state
   */
  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const response = await fetch("/api/v1/user/booking", {
        method: "GET",
        credentials: "include",
        cache: "no-store"
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.data || []);
        
        // Debug: Log bookings with payment requests
        if (process.env.NODE_ENV === 'development' && !silent) {
          const paymentRequests = (data.data || []).filter((b: Booking) => 
            b.status === 'started' && b.paymentStatus === 'pending' && b.bookingAmount
          );
          if (paymentRequests.length > 0) {
            console.log('📌 Bookings with payment requests:', paymentRequests);
          }
        }
      } else {
        if (!silent) {
          toast.error(data.message || "Failed to fetch bookings");
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (!silent) {
        toast.error("Failed to load bookings");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  /**
   * Handle rating modal
   */
  const handleRate = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsRatingOpen(true);
  };

  /**
   * Handle cancel booking modal
   */
  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  /**
   * Confirm and process booking cancellation
   */
  const confirmCancel = async () => {
    if (!selectedBooking) return;
    
    setCancelling(true);
    try {
      const response = await fetch("/api/v1/user/cancelbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: selectedBooking._id })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings();
        setIsCancelDialogOpen(false);
        setSelectedBooking(null);
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  /**
   * Handle Pay Now action
   * Initializes Razorpay payment for pending bookings or service completion payment
   */
  const handlePayNow = async (booking: Booking) => {
    // Check if Razorpay is loaded
    if (!(window as any).Razorpay) {
      toast.error("Payment service not available. Please refresh the page.");
      return;
    }

    // Determine amount based on payment type
    // If booking has bookingAmount and status is started, it's service completion payment
    const isServicePayment = booking.status === "started" && booking.bookingAmount;
    const amount = isServicePayment ? booking.bookingAmount! : booking.intialamount;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: amount * 100, // Convert to paise
      currency: "INR",
      image:"https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png",
      name: "Jogaad India",
      description: isServicePayment 
        ? `Service completion payment for ${booking.categoryid.categoryName}`
        : `Booking payment for ${booking.categoryid.categoryName}`,
      order_id: booking.orderid,
      handler: async function (response: any) {
        // Verify payment with backend
        try {
          const verifyResponse = await fetch("/api/v1/user/verify-payment/v2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: userData?.email
            })
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            toast.success("Payment successful! Booking confirmed.");
            
            setTimeout(()=>{
              fetchBookings();
            },1000);
            
          } else {
            toast.error(verifyData.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Failed to verify payment");
        }
      },
      prefill: {
        name: userData?.name || "",
        email: userData?.email || "",
        contact: userData?.phone || ""
      },
      notes: {
        bookingId: booking._id,
        categoryName: booking.categoryid.categoryName
      },
      theme: {
        color: "#2B9EB3"
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment cancelled");
        }
      }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };



  /**
   * Filter and sort bookings based on active tab, search, date, and sort criteria
   */
  const getFilteredBookings = (): Booking[] => {
    let filtered = bookings;

    // 1. Filter by Tab
    switch (activeTab) {
      case "pending":
        filtered = filtered.filter(b => {
          if (b.status !== "pending") return false;
          // Hide if older than 24 hours
          const createdAt = new Date(b.createdAt);
          const now = new Date();
          const diffMs = now.getTime() - createdAt.getTime();
          const hours = diffMs / (1000 * 60 * 60);
          return hours < 24;
        });
        break;
      case "confirmed":
        filtered = filtered.filter(b => 
          b.status === "confirmed" || 
          b.status === "in-progress" || 
          b.status === "started" // Started bookings shown here (in progress)
        );
        break;
      case "completed":
        filtered = filtered.filter(b => b.status === "completed");
        break;
      case "cancelled":
        filtered = filtered.filter(b => b.status === "cancelled");
        break;
      case "refunded":
        filtered = filtered.filter(b => b.status === "refunded");
        break;
      case "all":
      default:
        // No tab filtering
        break;
    }

    // 2. Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.categoryid?.categoryName?.toLowerCase().includes(query) ||
        b.orderid?.toLowerCase().includes(query) ||
        b._id.toLowerCase().includes(query)
      );
    }

    // 3. Filter by Date
    if (dateFilter) {
      filtered = filtered.filter(b => {
        const bDate = new Date(b.bookingDate).toISOString().split('T')[0];
        return bDate === dateFilter;
      });
    }

    // 4. Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount-high":
          return (b.intialamount || 0) - (a.intialamount || 0);
        case "amount-low":
          return (a.intialamount || 0) - (b.intialamount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredBookings = getFilteredBookings();

  /**
   * Get tab counts
   */
  const getTabCounts = () => ({
    all: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => 
      b.status === "confirmed" || 
      b.status === "in-progress" || 
      b.status === "started"
    ).length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    refunded: bookings.filter(b => b.status === "refunded").length
  });

  const tabCounts = getTabCounts();

  if (userLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
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
            
            <div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                {userData && (
                  <SidebarLink
                    link={{
                      label: userData.name || userData.email,
                      href: "/user/profile",
                      icon: <UserAvatar userData={userData} />,
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
                  Manage and track your service bookings
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
              <SummaryCard
                label="All Bookings"
                count={tabCounts.all}
                icon={<List className="w-4 h-4 md:w-5 md:h-5" />}
                color="slate"
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
              />
              <SummaryCard
                label="Pending"
                count={tabCounts.pending}
                icon={<Clock className="w-4 h-4 md:w-5 md:h-5" />}
                color="yellow"
                active={activeTab === "pending"}
                onClick={() => setActiveTab("pending")}
              />
              <SummaryCard
                label="Confirmed"
                count={tabCounts.confirmed}
                icon={<CheckCircle className="w-4 h-4 md:w-5 md:h-5" />}
                color="blue"
                active={activeTab === "confirmed"}
                onClick={() => setActiveTab("confirmed")}
              />
              <SummaryCard
                label="Completed"
                count={tabCounts.completed}
                icon={<CheckCircle className="w-4 h-4 md:w-5 md:h-5" />}
                color="green"
                active={activeTab === "completed"}
                onClick={() => setActiveTab("completed")}
              />
              <SummaryCard
                label="Cancelled"
                count={tabCounts.cancelled}
                icon={<XCircle className="w-4 h-4 md:w-5 md:h-5" />}
                color="red"
                active={activeTab === "cancelled"}
                onClick={() => setActiveTab("cancelled")}
              />
              <SummaryCard
                label="Refunded"
                count={tabCounts.refunded}
                icon={<IndianRupee className="w-4 h-4 md:w-5 md:h-5" />}
                color="purple"
                active={activeTab === "refunded"}
                onClick={() => setActiveTab("refunded")}
              />
            </div>
          </motion.div>

          {/* All Bookings Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Filters Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by service or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B9EB3]/20 focus:border-[#2B9EB3]"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full md:w-auto pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B9EB3]/20 focus:border-[#2B9EB3]"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full md:w-auto pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2B9EB3]/20 focus:border-[#2B9EB3] appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount: High to Low</option>
                  <option value="amount-low">Amount: Low to High</option>
                </select>
              </div>
              
              {/* Clear Filters */}
              {(searchQuery || dateFilter || sortBy !== "newest") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDateFilter("");
                    setSortBy("newest");
                  }}
                  className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold text-[#0A3D62] flex items-center gap-2">
                {activeTab === "all" && (
                  <>
                    <List className="w-5 h-5 md:w-6 md:h-6 text-[#2B9EB3]" />
                    All Bookings
                  </>
                )}
                {activeTab === "pending" && (
                  <>
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
                    Pending Payments
                  </>
                )}
                {activeTab === "confirmed" && (
                  <>
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    Active Bookings
                  </>
                )}
                {activeTab === "completed" && (
                  <>
                    <Package className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    Completed Services
                  </>
                )}
                {activeTab === "cancelled" && (
                  <>
                    <Ban className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                    Cancelled Bookings
                  </>
                )}
                {activeTab === "refunded" && (
                  <>
                    <IndianRupee className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                    Refunded Bookings
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
                      onPayNow={handlePayNow}
                      onRefresh={fetchBookings}
                      onRate={handleRate}
                      onCancel={handleCancelBooking}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileBottomNav links={links} currentPath="/user/bookings" />
      </div>

      {/* Rating Modal - Single instance at page level */}
      <RatingDialog 
        open={isRatingOpen} 
        onOpenChange={setIsRatingOpen}
        bookingId={selectedBooking?._id || ""}
        onSuccess={() => {
          fetchBookings();
          setSelectedBooking(null);
        }}
      />

      {/* Cancel Booking Modal - Single instance at page level */}
      <CancelBookingDialog 
        open={isCancelDialogOpen} 
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={confirmCancel}
        loading={cancelling}
      />
    </div>
  );
}

// Summary Card Component - New compact design for overview
const SummaryCard: React.FC<{
  label: string;
  count: number;
  icon: React.ReactNode;
  color: "slate" | "yellow" | "blue" | "green" | "red" | "purple";
  active: boolean;
  onClick: () => void;
}> = ({ label, count, icon, color, active, onClick }) => {
  const colorClasses = {
    slate: {
      bg: "from-[#2B9EB3]/10 to-[#0A3D62]/10",
      border: "border-[#2B9EB3]/30",
      icon: "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white",
      activeBg: "from-[#2B9EB3] to-[#0A3D62]",
      text: "text-[#0A3D62]"
    },
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
    red: {
      bg: "from-red-500/10 to-red-600/10",
      border: "border-red-500/30",
      icon: "bg-red-500 text-white",
      activeBg: "from-red-500 to-red-600",
      text: "text-red-700"
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

// Tab Button Component
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}> = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
      active
        ? "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white shadow-md"
        : "bg-white text-slate-600 hover:bg-slate-50"
    )}
  >
    {icon}
    <span>{label}</span>
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-bold",
      active ? "bg-white/20" : "bg-slate-100"
    )}>
      {count}
    </span>
  </button>
);

// Empty State Component
const EmptyState: React.FC<{ activeTab: TabType }> = ({ activeTab }) => {
  const messages = {
    all: {
      title: "No bookings yet",
      description: "Start your journey by booking your first service with us!",
      icon: <List className="w-16 h-16 md:w-20 md:h-20" />,
      color: "text-[#2B9EB3]"
    },
    pending: {
      title: "No pending bookings",
      description: "All payments are complete! Time to book another service.",
      icon: <Clock className="w-16 h-16 md:w-20 md:h-20" />,
      color: "text-yellow-500"
    },
    confirmed: {
      title: "No active bookings",
      description: "Book a service and we'll confirm it right away!",
      icon: <CheckCircle className="w-16 h-16 md:w-20 md:h-20" />,
      color: "text-blue-500"
    },
    completed: {
      title: "No completed bookings yet",
      description: "Your completed services will appear here.",
      icon: <Package className="w-16 h-16 md:w-20 md:h-20" />,
      color: "text-green-500"
    },
    cancelled: {
      title: "No cancelled bookings",
      description: "That's great! All your bookings are on track.",
      icon: <Ban className="w-16 h-16 md:w-20 md:h-20" />,
      color: "text-red-500"
    },
    refunded: {
      title: "No refunded bookings",
      description: "You haven't requested any refunds yet.",
      icon: <IndianRupee className="w-16 h-16 md:w-20 md:h-20" />,
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
      <Link
        href="/services"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:-translate-y-1"
      >
        <Calendar className="w-5 h-5" />
        Browse Services
      </Link>
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
          onClick={() => router.push('/signin')}
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
    href="/user/dashboard"
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
    href="/user/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India" 
      className="h-8 w-8 object-contain"
    />
  </Link>
);

// User Avatar Component
const UserAvatar = ({ userData }: { userData: any }) => (
  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center overflow-hidden relative">
    {userData.img && userData.img.trim() !== "" ? (
      <img
        src={userData.img}
        alt={userData.name}
        className="h-7 w-7 rounded-full object-cover absolute inset-0"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    ) : null}
    <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
      {getUserInitials(userData.name || userData.email || "U")}
    </span>
  </div>
);
