"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScheduleDialog } from "./ScheduleDialog";

interface BookingsTableProps {
  bookings: any[];
  loading: boolean;
  onRefresh: () => void;
  isConfirmedTab: boolean;
}

export const BookingsTable: React.FC<BookingsTableProps> = ({ bookings, loading, onRefresh, isConfirmedTab }) => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSchedule = (booking: any) => {
    setSelectedBooking(booking);
    setIsScheduleOpen(true);
  };

  const toggleRowExpansion = (bookingId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">No bookings found.</div>;
  }

  return (
    <>
      <div className="rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="h-10 px-4 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400"></th>
                <th className="h-10 px-4 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Customer</th>
                <th className="h-10 px-4 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Service</th>
                <th className="h-10 px-4 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Date</th>
                <th className="h-10 px-4 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Amount</th>
                <th className="h-10 px-4 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                {isConfirmedTab && <th className="h-10 px-4 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {bookings.map((booking, idx) => (
                <React.Fragment key={booking._id}>
                  <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="p-4">
                      <button
                        onClick={() => toggleRowExpansion(booking._id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                        title="View Details"
                      >
                        <svg className={`h-4 w-4 transition-transform duration-200 ${expandedRows.has(booking._id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {booking.userid?.img ? (
                        <img src={booking.userid.img} alt={booking.userid.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {booking.userid?.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{booking.userid?.name || "Unknown"}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{booking.userid?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="text-neutral-700 dark:text-neutral-300">{booking.categoryid?.categoryName || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <svg className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">₹{booking.intialamount}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                        booking.status === 'started' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' : 
                        booking.status === 'completed' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                        booking.status === 'refunded' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                      {booking.status}
                    </span>
                  </td>
                    {isConfirmedTab && (
                      <td className="p-4 text-right">
                        <Button size="sm" onClick={() => handleSchedule(booking)}>
                          Schedule
                        </Button>
                      </td>
                    )}
                  </tr>
                  
                  {/* Expanded Detail Row */}
                  {expandedRows.has(booking._id) && (
                    <tr className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/50 dark:to-neutral-900/50">
                      <td colSpan={isConfirmedTab ? 7 : 6} className="p-0">
                        <div className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Customer Details Card */}
                            <div className="rounded-lg bg-white dark:bg-neutral-800 p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
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

                            {/* Service Details Card */}
                            <div className="space-y-4">
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
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ScheduleDialog 
        open={isScheduleOpen} 
        onOpenChange={setIsScheduleOpen}
        booking={selectedBooking}
        onSuccess={() => {
          setIsScheduleOpen(false);
          onRefresh();
        }}
      />
    </>
  );
};
