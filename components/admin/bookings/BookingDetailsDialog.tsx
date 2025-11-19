"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Booking } from "./types";

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
}

export const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({ open, onOpenChange, booking }) => {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details #{booking.orderid}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Customer Details Card */}
          <div className="rounded-lg bg-white dark:bg-neutral-800 p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm h-fit">
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Information
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {booking.userid?.img ? (
                  <img src={booking.userid.img} alt={booking.userid.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-2 border-blue-200 dark:border-blue-700">
                    <span className="text-white font-bold text-xl">
                      {booking.userid?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-neutral-800 dark:text-neutral-100">{booking.userid?.name || "Unknown"}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{booking.userid?.email}</p>
                  {booking.userid?.phone && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {booking.userid.phone}
                    </p>
                  )}
                </div>
              </div>
              {booking.userid?.address && (
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">Address</p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                    <svg className="h-4 w-4 mt-0.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{booking.userid.address}{booking.userid.pincode ? `, ${booking.userid.pincode}` : ''}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Service Details Card */}
            <div className="rounded-lg bg-white dark:bg-neutral-800 p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Service Details
              </h4>
              <div className="space-y-3">
                {booking.categoryid?.img && (
                  <img src={booking.categoryid.img} alt={booking.categoryid.categoryName} className="w-full h-32 object-cover rounded-lg mb-3" />
                )}
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Service Name</p>
                  <p className="text-base font-semibold text-neutral-800 dark:text-neutral-100 mt-1">{booking.categoryid?.categoryName || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Type</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">{booking.categoryid?.categoryType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Unit</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">{booking.categoryid?.categoryUnit || "N/A"}</p>
                  </div>
                </div>
                {booking.categoryid?.categoryDescription && (
                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Description</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">{booking.categoryid.categoryDescription}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Service Provider Details (if assigned) */}
            {booking.employeeid && (
              <div className="rounded-lg bg-white dark:bg-neutral-800 p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Assigned Service Provider
                </h4>
                <div className="flex items-center gap-3">
                  {booking.employeeid?.img ? (
                    <img src={booking.employeeid.img} alt={booking.employeeid.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {booking.employeeid?.name?.charAt(0).toUpperCase() || "E"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-neutral-800 dark:text-neutral-100">{booking.employeeid.name}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{booking.employeeid.email}</p>
                    {booking.employeeid.phone && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{booking.employeeid.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details */}
            <div className="rounded-lg bg-white dark:bg-neutral-800 p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Payment Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Order ID</p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1 font-mono break-all">{booking.orderid}</p>
                </div>
                {booking.paymentid && (
                  <div>
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Payment ID</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1 font-mono break-all">{booking.paymentid}</p>
                  </div>
                )}
                {booking.refundid && (
                  <div>
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Refund ID</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1 font-mono break-all">{booking.refundid}</p>
                  </div>
                )}
                {booking.refundAmount && (
                  <div>
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Refund Amount</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">₹{booking.refundAmount}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
