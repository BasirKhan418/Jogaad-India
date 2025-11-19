"use client";

import React from "react";
import { motion } from "framer-motion";
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
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Booking {
  _id: string;
  userid: {
    _id: string;
    name: string;
    email: string;
    address: string;
    pincode: string;
    phone?: string;
  };
  categoryid: {
    _id: string;
    categoryName: string;
    categoryType: string;
    img: string;
  };
  status: "pending" | "confirmed" | "in-progress" | "started" | "completed" | "cancelled" | "refunded";
  bookingDate: string;
  intialamount: number;
  bookingAmount?: number;
  paymentStatus?: string;
  createdAt: string;
}

interface BookingCardProps {
  booking: Booking;
  type: "pending" | "active" | "history";
  onAction?: (action: string, booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  type,
  onAction
}) => {
  const statusColors = {
    pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
    confirmed: "text-blue-600 bg-blue-50 border-blue-200",
    "in-progress": "text-blue-600 bg-blue-50 border-blue-200",
    started: "text-purple-600 bg-purple-50 border-purple-200",
    completed: "text-green-600 bg-green-50 border-green-200",
    cancelled: "text-red-600 bg-red-50 border-red-200",
    refunded: "text-gray-600 bg-gray-50 border-gray-200",
  };

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    "in-progress": Loader2,
    started: Loader2,
    completed: CheckCircle,
    cancelled: XCircle,
    refunded: IndianRupee,
  };

  const StatusIcon = statusIcons[booking.status] || AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="relative h-24 bg-gradient-to-r from-slate-800 to-slate-900">
        {booking.categoryid?.img && (
          <img 
            src={booking.categoryid.img} 
            alt={booking.categoryid.categoryName}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute top-3 right-3">
          <span className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", statusColors[booking.status])}>
            <StatusIcon className="w-3.5 h-3.5" />
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-bold text-lg">{booking.categoryid?.categoryName}</h3>
          <p className="text-xs text-slate-300">{booking.categoryid?.categoryType}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* User Details */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{booking.userid?.name}</p>
            <p className="text-xs text-slate-500">{booking.userid?.email}</p>
            {booking.userid?.phone && (
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
                <Phone className="w-3 h-3" />
                {booking.userid.phone}
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Booking Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Date
            </p>
            <p className="font-medium text-slate-700">
              {new Date(booking.bookingDate).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time
            </p>
            <p className="font-medium text-slate-700">
              {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Location
          </p>
          <p className="text-sm font-medium text-slate-700 line-clamp-2">
            {booking.userid?.address}, {booking.userid?.pincode}
          </p>
        </div>

        {/* Actions */}
        {type === "pending" && (
          <button 
            onClick={() => onAction?.("accept", booking)}
            className="w-full mt-2 bg-[#2B9EB3] hover:bg-[#238a9e] text-white py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Accept Booking
          </button>
        )}

        {type === "active" && (booking.status === "confirmed" || booking.status === "in-progress") && (
          <button 
            onClick={() => onAction?.("start", booking)}
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4" />
            Start Service
          </button>
        )}

        {type === "active" && booking.status === "started" && (
          booking.paymentStatus === "paid" ? (
            <div className="w-full mt-2 bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Payment Completed - Awaiting Auto-completion
            </div>
          ) : booking.paymentStatus === "pending" ? (
            <div className="w-full mt-2 bg-blue-100 text-blue-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Waiting for customer payment
            </div>
          ) : (
            <button 
              onClick={() => onAction?.("payment", booking)}
              className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <IndianRupee className="w-4 h-4" />
              Request Payment
            </button>
          )
        )}
      </div>
    </motion.div>
  );
};
