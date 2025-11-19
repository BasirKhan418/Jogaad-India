"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScheduleDialog } from "./ScheduleDialog";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import { ScheduleDetailsModal } from "./ScheduleDetailsModal";
import { ExportButton } from "./ExportButton";
import { LoadingState, EmptyState } from "./TableStates";
import { Booking, Schedule } from "./types";

interface BookingsTableProps {
  bookings: Booking[];
  loading: boolean;
  onRefresh: () => void;
  isConfirmedTab: boolean;
  schedules?: Schedule[];
}

export const BookingsTable: React.FC<BookingsTableProps> = ({ bookings, loading, onRefresh, isConfirmedTab, schedules = [] }) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedDetailBooking, setSelectedDetailBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [scheduleMode, setScheduleMode] = useState<'schedule' | 'reassign'>('schedule');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isScheduleDetailsOpen, setIsScheduleDetailsOpen] = useState(false);

  const handleSchedule = (booking: Booking, mode: 'schedule' | 'reassign' = 'schedule') => {
    setSelectedBooking(booking);
    setScheduleMode(mode);
    setIsScheduleOpen(true);
  };

  const handleViewScheduleDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsScheduleDetailsOpen(true);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedDetailBooking(booking);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (bookings.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <ExportButton bookings={bookings} />
      </div>
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
                        onClick={() => handleViewDetails(booking)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                        title="View Details"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                        {(() => {
                          const schedule = schedules.find(s => s.bookingid === booking._id);
                          if (schedule) {
                            return (
                              <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-2 p-1">
                                  {schedule.employeeid?.img && (
                                    <img src={schedule.employeeid.img} alt={schedule.employeeid.name} className="w-6 h-6 rounded-full object-cover" />
                                  )}
                                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                    {schedule.employeeid?.name}
                                  </span>
                                </div>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                  {Math.floor((new Date().getTime() - new Date(schedule.createdAt).getTime()) / 60000)} mins ago
                                </span>
                                <div className="flex gap-2 mt-1">
                                  <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    className="h-7 text-xs"
                                    onClick={() => handleViewScheduleDetails(schedule)}
                                  >
                                    View Details
                                  </Button>
                                  {!schedule.isAccepted && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-7 text-xs"
                                      onClick={() => handleSchedule(booking, 'reassign')}
                                    >
                                      Reassign
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <Button size="sm" onClick={() => handleSchedule(booking)}>
                              Schedule
                            </Button>
                          );
                        })()}
                      </td>
                    )}
                  </tr>
                  
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
        mode={scheduleMode}
        onSuccess={() => {
          setIsScheduleOpen(false);
          onRefresh();
        }}
      />

      <BookingDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        booking={selectedDetailBooking}
      />

      <ScheduleDetailsModal 
        open={isScheduleDetailsOpen}
        onOpenChange={setIsScheduleDetailsOpen}
        schedule={selectedSchedule}
        onReassign={() => {
          const booking = bookings.find(b => b._id === selectedSchedule?.bookingid);
          if (booking) {
            handleSchedule(booking, 'reassign');
          }
        }}
      />
    </>
  );
};
