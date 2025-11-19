"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminData, useAdminLogout } from "@/utils/admin/useAdminHooks";

const tabs = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "in-progress", label: "In Progress" },
  { id: "started", label: "Started" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "refunded", label: "Refunded" },
];

export default function BookingsPage() {
  const router = useRouter();
  const { adminData, loading: adminLoading, error: adminError } = useAdminData();
  const { handleLogout } = useAdminLogout();

  if (adminLoading) {
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

  if (adminError) {
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
          <p className="text-[#0A3D62]/70 mb-4">{adminError}</p>
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
      
      <AdminSidebar adminData={adminData} handleLogout={handleLogout} />
      
      <BookingsContent />
    </div>
  );
}

function BookingsContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allBookings, setAllBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const url = activeTab === "all" 
        ? "/api/v1/adminbooking" 
        : `/api/v1/adminbooking?status=${activeTab}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setBookings(data.data);
      } else {
        console.error("Failed to fetch bookings:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const fetchAllBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/adminbooking");
      const data = await res.json();
      if (data.success) {
        setAllBookings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch all bookings", error);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const getStatusCount = (status: string) => {
    return allBookings.filter((b: any) => b.status === status).length;
  };

  const getTotalAmount = () => {
    return allBookings.reduce((sum: number, b: any) => sum + (b.intialamount || 0), 0);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-6 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-100">Bookings Management</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Track and manage all customer bookings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl p-4 border shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Bookings</h3>
              <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{allBookings.length}</p>
          </div>

          <div className="rounded-xl p-4 border shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Confirmed</h3>
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{getStatusCount('confirmed')}</p>
          </div>

          <div className="rounded-xl p-4 border shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Completed</h3>
              <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{getStatusCount('completed')}</p>
          </div>

          <div className="rounded-xl p-4 border shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Revenue</h3>
              <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">₹{getTotalAmount()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md" 
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-800 dark:hover:text-neutral-100"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        <BookingsTable 
          bookings={bookings} 
          loading={loading} 
          onRefresh={() => {
            fetchBookings();
            fetchAllBookings();
          }}
          isConfirmedTab={activeTab === "confirmed"}
        />
      </div>
    </div>
  );
}
