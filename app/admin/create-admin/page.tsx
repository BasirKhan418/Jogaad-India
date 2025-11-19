"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminData, useAdminLogout } from "@/utils/admin/useAdminHooks";
import AdminCreateModal from "@/components/admin/AdminCreateModal";
import { motion } from "framer-motion";
import { UserPlus, Shield, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { getUserInitials } from "@/utils/auth";

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  img?: string;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ManageAdminsPage() {
  const router = useRouter();
  const { adminData, loading, error } = useAdminData();
  const { handleLogout } = useAdminLogout();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [adminsError, setAdminsError] = useState("");

  // Fetch all admins
  const fetchAdmins = async () => {
    setAdminsLoading(true);
    setAdminsError("");
    try {
      const response = await fetch('/api/v1/admins', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setAdmins(data.data);
      } else {
        setAdminsError(data.message || "Failed to fetch admins");
        toast.error(data.message || "Failed to fetch admins");
      }
    } catch (error) {
      setAdminsError("Network error occurred");
      toast.error("Network error occurred");
    } finally {
      setAdminsLoading(false);
    }
  };

  useEffect(() => {
    if (adminData) {
      fetchAdmins();
    }
  }, [adminData]);

  const handleModalSuccess = () => {
    fetchAdmins();
  };

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
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
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
      
      <AdminSidebar adminData={adminData} handleLogout={handleLogout} />
      
      <AdminCreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
          {/* Header with centered content */}
          <div className="w-full max-w-7xl mx-auto p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                  Manage Administrators
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  View all platform administrators
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <UserPlus className="w-5 h-5" />
                Create Admin
              </motion.button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-xl p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Admins</p>
                    <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                      {adminsLoading ? "..." : admins.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Super Admins</p>
                    <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                      {adminsLoading ? "..." : admins.filter(a => a.isSuperAdmin).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Regular Admins</p>
                    <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                      {adminsLoading ? "..." : admins.filter(a => !a.isSuperAdmin).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admins List */}
            {adminsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400">Loading administrators...</p>
                </div>
              </div>
            ) : adminsError ? (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-6 text-center">
                <p className="text-red-700 dark:text-red-400">{adminsError}</p>
                <button
                  onClick={fetchAdmins}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : admins.length === 0 ? (
              <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                <Shield className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">No administrators found</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Create First Admin
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin, index) => (
                  <motion.div
                    key={admin._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl p-6 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Admin Avatar */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        {admin.img && admin.img.trim() !== "" ? (
                          <img
                            src={admin.img}
                            alt={admin.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-700">
                            <span className="text-white font-bold text-lg">
                              {getUserInitials(admin.name)}
                            </span>
                          </div>
                        )}
                        {admin.isSuperAdmin && (
                          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 truncate">
                          {admin.name}
                        </h3>
                        {admin.isSuperAdmin && (
                          <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                            Super Admin
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Admin Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{admin.email}</span>
                      </div>
                      {admin.phone && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{admin.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>Joined {new Date(admin.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
