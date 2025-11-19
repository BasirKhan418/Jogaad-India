"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Loader2,
  IndianRupee,
  User,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { BikeAnimation } from "./BikeAnimation";
import { RatingDialog } from "./RatingDialog";
import { CancelBookingDialog } from "./CancelBookingDialog";


const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
};

interface Booking {
  _id: string;
  userid: {
    _id: string;
    name: string;
    email: string;
    address: string;
    pincode: string;
  };
  categoryid: {
    _id: string;
    categoryName: string;
    categoryType: string;
    categoryDescription: string;
    img: string;
  };
  employeeid?: {
    _id: string;
    name: string;
    phone: string;
    img?: string;
  };
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
  feedback?: string;
  rating?: number;
  isRated?: boolean;
  refundStatus?: string;
  refundAmount?: number;
  renderPaymentButton: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BookingCardProps {
  booking: Booking;
  onPayNow: (booking: Booking) => void;
  onRefresh: () => void;
}


export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPayNow,
  onRefresh
}) => {
  const [cancelling, setCancelling] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Calculate expiry time once using useMemo
  const paymentExpiry = useMemo(() => {
    try {
      const createdAt = new Date(booking.createdAt);
      if (isNaN(createdAt.getTime())) {
        console.error('Invalid createdAt date:', booking.createdAt);
        return null;
      }
      return new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error('Error calculating payment expiry:', error);
      return null;
    }
  }, [booking.createdAt]);

  // Check if payment window has expired
  const isPaymentExpired = useMemo(() => {
    if (!paymentExpiry) return false;
    return new Date() > paymentExpiry;
  }, [paymentExpiry]);

  // Calculate time remaining for payment
  const timeRemaining = useMemo(() => {
    if (!paymentExpiry) return "N/A";
    
    const now = new Date();
    const remaining = paymentExpiry.getTime() - now.getTime();
    
    if (remaining <= 0) return "Expired";
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }, [paymentExpiry]);

  // Get status color and icon using useMemo
  const statusDisplay = useMemo(() => {
    switch (booking.status) {
      case "pending":
        return {
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          icon: <Clock className="w-4 h-4" />,
          label: "Payment Pending"
        };
      case "confirmed":
        return {
          color: "text-green-600 bg-green-50 border-green-200",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Booking Confirmed"
        };
      case "in-progress":
      case "started":
        return {
          color: "text-blue-600 bg-blue-50 border-blue-200",
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          label: "In Progress"
        };
      case "completed":
        return {
          color: "text-green-600 bg-green-50 border-green-200",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Service Completed"
        };
      case "cancelled":
        return {
          color: "text-red-600 bg-red-50 border-red-200",
          icon: <XCircle className="w-4 h-4" />,
          label: "Booking Cancelled"
        };
      case "refunded":
        return {
          color: "text-purple-600 bg-purple-50 border-purple-200",
          icon: <IndianRupee className="w-4 h-4" />,
          label: "Amount Refunded"
        };
      default:
        return {
          color: "text-gray-600 bg-gray-50 border-gray-200",
          icon: <AlertCircle className="w-4 h-4" />,
          label: booking.status
        };
    }
  }, [booking.status]);

  // Handle cancel booking
  const handleCancel = () => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      const response = await fetch("/api/v1/user/cancelbooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: booking._id })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Booking cancelled successfully");
        onRefresh();
        setIsCancelDialogOpen(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
    >
      {/* Header with image and status */}
      <div className="relative h-28 md:h-32 bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62]">
        {booking.categoryid.img && (
          <img 
            src={booking.categoryid.img} 
            alt={booking.categoryid.categoryName}
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute top-2 md:top-3 right-2 md:right-3">
          <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${statusDisplay.color}`}>
            {statusDisplay.icon}
            <span className="hidden sm:inline">{statusDisplay.label}</span>
          </span>
        </div>
        <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 right-2 md:right-3 text-white">
          <h3 className="text-base md:text-lg font-bold truncate">{booking.categoryid.categoryName}</h3>
          <p className="text-xs text-white/80 truncate">{booking.categoryid.categoryType}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        {/* Booking Details */}
        <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
          <div className="flex items-start gap-2 text-slate-600">
            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#2B9EB3]" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-700 text-xs">Scheduled Date</p>
              <p className="truncate">{new Date(booking.bookingDate).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-slate-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#2B9EB3]" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-700 text-xs">Address</p>
              <p className="line-clamp-2">
                {[booking.userid?.address, booking.userid?.pincode].filter(Boolean).join(", ") || "Address not available"}
              </p>
            </div>
          </div>

          {booking.employeeid && (
            <div className="flex items-start gap-2 text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
              {booking.employeeid.img ? (
                <img 
                  src={booking.employeeid.img} 
                  alt={booking.employeeid.name} 
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-blue-200" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-700 text-xs">Assigned Engineer</p>
                <p className="truncate font-medium text-[#0A3D62]">{booking.employeeid.name}</p>
                <p className="text-xs text-slate-500">{booking.employeeid.phone}</p>
                {(booking.status === "confirmed" || booking.status === "in-progress" || booking.status === "started") && (
                  <p className="text-[10px] text-green-600 font-medium mt-0.5">Will reach soon</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bike Animation for Confirmed but not assigned */}
        {booking.status === "confirmed" && !booking.employeeid && (
          <div className="py-2">
            <BikeAnimation />
            <p className="text-xs text-center text-slate-500 mt-2">
              A new engineer will be assigned soon
            </p>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-2.5 md:p-3 space-y-1 md:space-y-1.5 text-xs md:text-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Initial Fee:</span>
            <span className="font-bold text-[#0A3D62]">₹{booking.intialamount}</span>
          </div>
          {booking.bookingAmount && (
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Amount:</span>
              <span className="font-bold text-[#0A3D62]">₹{booking.bookingAmount}</span>
            </div>
          )}
          {booking.refundAmount && booking.refundAmount > 0 && (
            <div className="flex justify-between items-center text-purple-600 pt-1 border-t border-purple-200">
              <span className="font-medium">Refund Amount:</span>
              <span className="font-bold">₹{booking.refundAmount}</span>
            </div>
          )}
        </div>

        {/* Pending Payment Warning */}
        {booking.status === "pending" && !isPaymentExpired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-2 md:p-3 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800 flex-1">
              <p className="font-semibold">Payment pending (24-hour window)</p>
              <p className="font-bold text-sm md:text-base mt-0.5">Time remaining: {timeRemaining}</p>
              <p className="text-xs mt-1 opacity-80">Complete payment to confirm your booking</p>
            </div>
          </motion.div>
        )}

        {/* Expired Warning */}
        {booking.status === "pending" && isPaymentExpired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-300 rounded-lg p-2 md:p-3 flex items-start gap-2"
          >
            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-800 flex-1">
              <p className="font-semibold">Payment window expired</p>
              <p className="mt-0.5">This booking will be automatically cancelled</p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {booking.status === "pending" && !isPaymentExpired && (
            <>
              <Button
                onClick={() => onPayNow(booking)}
                className="flex-1 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] hover:from-[#0A3D62] hover:to-[#2B9EB3] text-white font-semibold shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
              >
                <IndianRupee className="w-4 h-4 mr-1" />
                Pay Now
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 font-semibold text-sm md:text-base"
                disabled={cancelling}
              >
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel"}
              </Button>
            </>
          )}

          {booking.status === "confirmed" && !booking.employeeid && (
            <div className="w-full text-center text-xs md:text-sm bg-green-50 text-green-700 py-2.5 rounded-lg font-semibold border border-green-200">
              ✓ Booking confirmed!
            </div>
          )}

          {booking.status === "completed" && (
            <div className="w-full flex flex-col gap-2">
              <div className="w-full text-center text-xs md:text-sm bg-green-50 text-green-700 py-2.5 rounded-lg font-semibold border border-green-200">
                ✓ Service completed successfully
              </div>
              {!booking.isRated && (
                <Button 
                  onClick={() => setIsRatingOpen(true)}
                  variant="outline"
                  className="w-full border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                >
                  <Star className="w-4 h-4 mr-2 fill-yellow-400" />
                  Rate Service
                </Button>
              )}
              {booking.isRated && booking.rating && (
                <div className="flex items-center justify-center gap-1 text-yellow-500 text-sm font-medium bg-yellow-50 py-1 rounded border border-yellow-100">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span>You rated: {booking.rating}/5</span>
                </div>
              )}
            </div>
          )}

          {booking.status === "cancelled" && (
            <div className="w-full text-center text-xs md:text-sm bg-red-50 text-red-700 py-2.5 rounded-lg font-semibold border border-red-200 flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" />
              Booking cancelled
            </div>
          )}

          {booking.status === "refunded" && (
            <div className="w-full space-y-2">
              <div className="text-center text-xs md:text-sm bg-purple-50 text-purple-700 py-2.5 rounded-lg font-semibold border border-purple-200 flex items-center justify-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Refund processed successfully
              </div>
              {booking.refundStatus && (
                <p className="text-xs text-center text-slate-600">
                  Refund Status: <span className="font-semibold">{booking.refundStatus}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Booking ID and Created time */}
        <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="font-mono">ID: {booking._id.slice(-8)}</span>
            <span className="text-slate-400">Created {formatDistanceToNow(new Date(booking.createdAt))}</span>
          </div>
        </div>
      </div>

      <RatingDialog 
        open={isRatingOpen} 
        onOpenChange={setIsRatingOpen}
        bookingId={booking._id}
        onSuccess={onRefresh}
      />

      <CancelBookingDialog 
        open={isCancelDialogOpen} 
        onOpenChange={setIsCancelDialogOpen}
        onConfirm={confirmCancel}
        loading={cancelling}
      />
    </motion.div>
  );
};
