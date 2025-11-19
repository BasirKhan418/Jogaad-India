"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconSettings,
  IconUsers,
  IconCategory,
  IconCurrencyRupee,
  IconChartBar,
  IconLogout,
  IconDashboard,
  IconUser,
  IconDeviceFloppy,
  IconLoader2,
  IconCash,
  IconBriefcase,
  IconCurrencyRupee as IconUserDollar,
  IconRefresh,
  IconInfoCircle,
} from "@tabler/icons-react";
import { AdminData } from "@/utils/admin/adminAuthService";
import { getUserInitials } from "@/utils/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminData, useAdminLogout } from "@/utils/admin/useAdminHooks";
import { useFeesData } from "@/utils/admin/useFeesData";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function FeesPage() {
  const router = useRouter();
  const { adminData, loading, error } = useAdminData();
  const { handleLogout } = useAdminLogout();

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
          <p className="text-[#0A3D62] font-semibold">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error || !adminData) {
    router.push("/admin/signin");
    return null;
  }

  return (
    <div className={cn(
      "rounded-md flex flex-col md:flex-row bg-white w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
      "h-screen"
    )}>
      <AdminSidebar adminData={adminData} handleLogout={handleLogout} />
      
      <FeesContent adminData={adminData} />
    </div>
  );
}

// Fees Content Component
const FeesContent = ({ adminData }: { adminData: AdminData | null }) => {
  const { feesData, loading, saving, error, saveFees, refetch } = useFeesData();
  const [userFee, setUserFee] = useState<number>(0);
  const [employeeFee, setEmployeeFee] = useState<number>(0);
  const [fineFee, setFineFee] = useState<number>(0);
  const [hasChanges, setHasChanges] = useState(false);

  // Update form when fees data is loaded
  useEffect(() => {
    if (feesData) {
      setUserFee(feesData.userOneTimeFee);
      setEmployeeFee(feesData.employeeOneTimeFee);
      setFineFee(feesData.fineFees);
      setHasChanges(false);
    }
  }, [feesData]);

  // Track changes
  useEffect(() => {
    if (feesData) {
      const changed = 
        userFee !== feesData.userOneTimeFee || 
        employeeFee !== feesData.employeeOneTimeFee ||
        fineFee !== feesData.fineFees;
      setHasChanges(changed);
    } else {
      // If no fees exist yet, any non-zero value is a change
      setHasChanges(userFee > 0 || employeeFee > 0 || fineFee > 0);
    }
  }, [userFee, employeeFee, fineFee, feesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userFee < 0 || employeeFee < 0 || fineFee < 0) {
      toast.error("Fees cannot be negative");
      return;
    }

    const success = await saveFees(userFee, employeeFee, fineFee);
    if (success) {
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    if (feesData) {
      setUserFee(feesData.userOneTimeFee);
      setEmployeeFee(feesData.employeeOneTimeFee);
      setFineFee(feesData.fineFees);
    } else {
      setUserFee(0);
      setEmployeeFee(0);
      setFineFee(0);
    }
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#0A3D62] font-semibold">Loading fees configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                Fees Management
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Configure dynamic pricing for users and service providers
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 dark:hover:from-neutral-700 dark:hover:to-neutral-600 border border-neutral-200 dark:border-neutral-600 transition-all duration-200 shadow-sm hover:shadow-md"
              title="Refresh data"
            >
              <IconRefresh className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Fee Card */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">User Registration Fee</div>
              <IconUserDollar className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">
              ₹{feesData?.userOneTimeFee?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-500">
              One-time registration fee for users
            </div>
          </div>

          {/* Service Provider Fee Card */}
          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Service Provider Registration Fee</div>
              <IconBriefcase className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">
              ₹{feesData?.employeeOneTimeFee?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-500">
              One-time registration fee for service providers
            </div>
          </div>

          {/* Fine Fees Card */}
          <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Fine Fees</div>
              <IconCash className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">
              ₹{feesData?.fineFees?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-500">
              Penalty fee for violations or late payments
            </div>
          </div>
        </div>

        {/* Fees Configuration Form */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 max-w-3xl mx-auto">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Update Fees</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Modify registration fees for your platform</p>
            </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User One-Time Fee */}
                <LabelInputContainer>
                  <Label htmlFor="userFee" className="text-sm text-neutral-600 dark:text-neutral-400 font-medium flex items-center gap-2">
                    <IconUserDollar className="h-4 w-4 text-blue-500" />
                    User One-Time Fee (₹) *
                  </Label>
                  <Input
                    id="userFee"
                    placeholder="0"
                    type="number"
                    min="0"
                    step="0.01"
                    value={userFee}
                    onChange={(e) => setUserFee(parseFloat(e.target.value) || 0)}
                    required
                    className="h-11 rounded-lg border-2 border-neutral-200 dark:border-neutral-600 focus:border-[#2B9EB3] focus:ring-0 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Fee charged when a new user registers on the platform
                  </p>
                </LabelInputContainer>

                {/* Service Provider One-Time Fee */}
                <LabelInputContainer>
                  <Label htmlFor="employeeFee" className="text-sm text-neutral-600 dark:text-neutral-400 font-medium flex items-center gap-2">
                    <IconBriefcase className="h-4 w-4 text-purple-500" />
                    Service Provider One-Time Fee (₹) *
                  </Label>
                  <Input
                    id="employeeFee"
                    placeholder="0"
                    type="number"
                    min="0"
                    step="0.01"
                    value={employeeFee}
                    onChange={(e) => setEmployeeFee(parseFloat(e.target.value) || 0)}
                    required
                    className="h-11 rounded-lg border-2 border-neutral-200 dark:border-neutral-600 focus:border-[#2B9EB3] focus:ring-0 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Fee charged when a new service provider joins the platform
                  </p>
                </LabelInputContainer>

                {/* Fine Fees */}
                <LabelInputContainer>
                  <Label htmlFor="fineFee" className="text-sm text-neutral-600 dark:text-neutral-400 font-medium flex items-center gap-2">
                    <IconCash className="h-4 w-4 text-orange-500" />
                    Fine Fees (₹) *
                  </Label>
                  <Input
                    id="fineFee"
                    placeholder="0"
                    type="number"
                    min="0"
                    step="0.01"
                    value={fineFee}
                    onChange={(e) => setFineFee(parseFloat(e.target.value) || 0)}
                    required
                    className="h-11 rounded-lg border-2 border-neutral-200 dark:border-neutral-600 focus:border-[#2B9EB3] focus:ring-0 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Penalty fee for violations or late payments
                  </p>
                </LabelInputContainer>
                </div>

              {/* Info Banner */}
              {feesData && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <IconInfoCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-semibold mb-1">Last Updated</p>
                      <p>
                        {new Date(feesData.updatedAt || feesData.createdAt || '').toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className={cn(
                    "flex-1 h-11 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2",
                    "bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] hover:shadow-lg",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                  )}
                >
                  {saving ? (
                    <>
                      <IconLoader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <IconDeviceFloppy className="w-5 h-5" />
                      {feesData ? 'Update Fees' : 'Create Fees'}
                    </>
                  )}
                </button>

                {hasChanges && (
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={saving}
                    className="px-6 h-11 rounded-lg font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <IconRefresh className="w-5 h-5" />
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-6 bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <IconInfoCircle className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-[#2B9EB3] mt-1">•</span>
              <span>User and service provider fees are charged only once during registration for new accounts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2B9EB3] mt-1">•</span>
              <span>Fine fees are penalty charges applied for policy violations or late payments.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2B9EB3] mt-1">•</span>
              <span>Changes will take effect immediately for new registrations and future fines.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2B9EB3] mt-1">•</span>
              <span>Existing users and service providers will not be affected by fee changes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2B9EB3] mt-1">•</span>
              <span>Setting a fee to ₹0 makes that fee type inactive (free).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
