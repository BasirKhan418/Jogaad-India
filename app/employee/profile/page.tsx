"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconLogout,
  IconUser,
  IconCamera,
  IconShield,
} from "@tabler/icons-react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Code,
  DollarSign,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEmployeeNavigation } from "@/utils/employee/useEmployeeNavigation";
import { useEmployeeData, useEmployeeLogout, useEmployeeSidebar } from "@/utils/employee/useEmployeeHooks";
import { useEmployeeUpdate } from "@/utils/employee/useEmployeeUpdate";
import { getUserInitials } from "@/utils/auth";

export default function EmployeeProfile() {
  const router = useRouter();
  const { employeeData, loading, error: fetchError } = useEmployeeData();
  const { handleLogout } = useEmployeeLogout();
  const { open, setOpen } = useEmployeeSidebar();
  const { links } = useEmployeeNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    formData,
    loading: updateLoading,
    error: updateError,
    success,
    imagePreview,
    uploadingImage,
    isFormValid,
    categories,
    handleInputChange,
    handleImageUpload,
    submitEmployeeUpdate,
    setFormData,
  } = useEmployeeUpdate(employeeData as any);

  const [isSaving, setIsSaving] = useState(false);

  // Update form data when employeeData loads
  React.useEffect(() => {
    if (employeeData) {
      setFormData({
        name: employeeData.name || '',
        email: employeeData.email || '',
        address: employeeData.address || '',
        phone: employeeData.phone || '',
        pincode: employeeData.pincode || '',
        bankName: employeeData.bankName || '',
        bankAccountNumber: employeeData.bankAccountNumber || '',
        bankIfscCode: employeeData.bankIfscCode || '',
        img: employeeData.img || '',
        categoryid: employeeData.categoryid || '',
        payrate: employeeData.payrate || 0,
      });
    }
  }, [employeeData, setFormData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug: observe pincode before submit
    console.log('Submitting profile update with pincode:', formData.pincode);

    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    try {
      setIsSaving(true);
      await submitEmployeeUpdate();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Debug: track pincode field changes live
  React.useEffect(() => {
    if (formData.pincode !== undefined) {
      console.log('Pincode changed:', formData.pincode);
    }
  }, [formData.pincode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
        <div className="relative z-20 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#0A3D62] font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
        <div className="relative z-20 text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0A3D62] mb-2">Access Error</h2>
          <p className="text-[#0A3D62]/70 mb-4">{fetchError}</p>
          <button
            onClick={() => router.push("/employee/login")}
            className="bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden md:flex-row", "h-screen")}>
      <Toaster position="top-right" richColors />

      {/* Desktop Sidebar - Hidden on mobile */}
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
          
          {/* User Section */}
          <div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              {employeeData && (
                <SidebarLink
                  link={{
                    label: employeeData.name || employeeData.email,
                    href: "/employee/profile",
                    icon: (
                      <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center overflow-hidden relative">
                        {employeeData.img && employeeData.img.trim() !== "" ? (
                          <img
                            src={employeeData.img}
                            alt={employeeData.name}
                            className="h-7 w-7 rounded-full object-cover absolute inset-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
                          {getUserInitials(employeeData.name || employeeData.email || "EMP")}
                        </span>
                      </div>
                    ),
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

      <div className="flex flex-1  overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col rounded-none md:rounded-tl-2xl border-0 md:border border-neutral-200 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:border-neutral-700 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 overflow-y-auto pb-24 md:pb-0">
          {/* Hero Section with adequate height */}
          <div className="relative z-0 mt-20 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] h-32 sm:h-36 md:h-40">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-12 sm:-bottom-14 md:-bottom-16 left-1/2 transform -translate-x-1/2 z-20">
              <div className="relative">
                <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full bg-white dark:bg-neutral-800 p-1.5 shadow-2xl">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center text-white font-bold text-2xl md:text-3xl overflow-hidden relative">
                    {(imagePreview || formData.img) && (
                      <img
                        src={imagePreview || formData.img}
                        alt={formData.name}
                        className="h-full w-full rounded-full object-cover absolute inset-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span className="text-white font-bold leading-none">
                      {getUserInitials(formData.name || "EMP")}
                    </span>
                  </div>
                </div>
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-4 border-white"></div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 h-7 w-7 md:h-8 md:w-8 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed border-2 border-neutral-200 dark:border-neutral-700 group"
                >
                  <IconCamera className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#2B9EB3] group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-[#0A3D62] rounded-full animate-pulse"></span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Content Section - Adequate spacing for profile image */}
          <div className="mt-16 sm:mt-20 md:mt-24 px-3 sm:px-4 md:px-6 lg:px-8 pb-6 md:pb-8 relative z-10">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                {formData.name || "Employee"}
              </h1>
              <div className="flex items-center justify-center gap-2 flex-wrap mb-1.5">
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white rounded-full text-xs font-medium shadow-md">
                  Employee
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Click camera icon to update photo
              </p>
            </div>

            {/* Centered Form Container */}
            <div className="max-w-5xl mx-auto w-full">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* Error/Success Messages */}
                {updateError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 md:p-4 flex items-start gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-200">Error</p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">{updateError}</p>
                    </div>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 md:p-4 flex items-start gap-2"
                  >
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-200">Success</p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">{success}</p>
                    </div>
                  </motion.div>
                )}

                {/* Personal Information Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-[#2B9EB3]/10 to-[#0A3D62]/10 dark:from-[#2B9EB3]/20 dark:to-[#0A3D62]/20 px-4 sm:px-5 md:px-6 py-3 md:py-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                      <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center">
                        <IconUser className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                      </div>
                      Personal Information
                    </h2>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6 space-y-4 md:space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm md:text-base font-medium flex items-center gap-2">
                          <User className="h-3.5 w-3.5" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="h-10 md:h-11 text-sm md:text-base"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          Email Address
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            disabled
                            className="h-10 md:h-11 text-sm md:text-base bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed pr-9"
                          />
                          <svg
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Email cannot be changed
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter 10-digit phone number"
                          maxLength={10}
                          className="h-10 md:h-11 text-sm md:text-base"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="pincode" className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          Pincode
                        </Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="110001"
                          required
                          className="h-10 md:h-11 text-sm md:text-base"
                        />
                      </div>

                      <div className="space-y-1.5 lg:col-span-2">
                        <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" />
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Your complete address"
                          required
                          className="h-10 md:h-11 text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Bank Information Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                      <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <Building2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                      </div>
                      Bank Information
                    </h2>
                  </div>
                  <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5 lg:col-span-2">
                        <Label htmlFor="bankName" className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5" />
                          Bank Name
                        </Label>
                        <Input
                          id="bankName"
                          name="bankName"
                          type="text"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          placeholder="State Bank of India"
                          required
                          className="h-10 md:h-11 text-sm md:text-base"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="bankAccountNumber" className="text-sm font-medium flex items-center gap-2">
                          <CreditCard className="h-3.5 w-3.5" />
                          Account Number
                        </Label>
                        <Input
                          id="bankAccountNumber"
                          name="bankAccountNumber"
                          type="text"
                          value={formData.bankAccountNumber}
                          onChange={handleInputChange}
                          placeholder="1234567890"
                          required
                          className="h-10 md:h-11 text-sm md:text-base"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="bankIfscCode" className="text-sm font-medium flex items-center gap-2">
                          <Code className="h-3.5 w-3.5" />
                          IFSC Code
                        </Label>
                        <Input
                          id="bankIfscCode"
                          name="bankIfscCode"
                          type="text"
                          value={formData.bankIfscCode}
                          onChange={handleInputChange}
                          placeholder="SBIN0001234"
                          required
                          className="h-10 md:h-11 text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Category & Pricing Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                      <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Tag className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                      </div>
                      Category & Pricing
                    </h2>
                  </div>
                  <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="categoryid" className="text-sm font-medium flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5" />
                          Service Category
                        </Label>
                        <select
                          id="categoryid"
                          name="categoryid"
                          value={formData.categoryid}
                          onChange={handleInputChange}
                          className="flex h-10 md:h-11 w-full border-none bg-white dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm md:text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat: any) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="payrate" className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="h-3.5 w-3.5" />
                          Hourly Rate (₹)
                        </Label>
                        <Input
                          id="payrate"
                          name="payrate"
                          type="number"
                          value={formData.payrate}
                          onChange={handleInputChange}
                          placeholder="500"
                          required
                          min="0"
                          className="h-10 md:h-11 text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Account Details Card */}
                {employeeData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="bg-gradient-to-r from-[#2B9EB3]/10 to-[#0A3D62]/10 dark:from-[#2B9EB3]/20 dark:to-[#0A3D62]/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
                      <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                        <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center">
                          <IconShield className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                        </div>
                        Account Details
                      </h2>
                    </div>
                    <div className="p-4 md:p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#2B9EB3]/10 to-[#2B9EB3]/5 dark:from-[#2B9EB3]/20 dark:to-[#2B9EB3]/10">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                            Account Type
                          </div>
                          <div className="text-sm md:text-base font-bold text-neutral-800 dark:text-neutral-100">
                            Employee
                          </div>
                        </div>

                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#0A3D62]/10 to-[#0A3D62]/5 dark:from-[#0A3D62]/20 dark:to-[#0A3D62]/10">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                            Status
                          </div>
                          <div className="text-sm md:text-base font-bold text-neutral-800 dark:text-neutral-100">
                            Active
                          </div>
                        </div>

                        {employeeData?.createdAt && (
                          <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/10 sm:col-span-2 lg:col-span-1">
                            <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                              Member Since
                            </div>
                            <div className="text-sm md:text-base font-bold text-neutral-800 dark:text-neutral-100">
                              {new Date(employeeData.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-2.5 md:gap-3 justify-center pt-2"
                >
                  <Button
                    type="submit"
                    disabled={isSaving || updateLoading || !isFormValid}
                    className="bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white hover:shadow-xl hover:scale-105 transition-all h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-semibold"
                  >
                    {isSaving || updateLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/employee/dashboard")}
                    className="border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-semibold transition-all"
                  >
                    <IconArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </motion.div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <MobileBottomNav links={links} currentPath="/employee/profile" />
    </div>
  );
}

// Mobile Bottom Navigation Component
const MobileBottomNav = ({ links, currentPath }: { links: any[], currentPath: string }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-neutral-800 shadow-[0_-4px_24px_rgba(0,0,0,0.3)] pb-safe">
      <nav className="flex items-center justify-around px-4 py-2">
        {links.map((link, idx) => {
          const isActive = currentPath === link.href;
          return (
            <a
              key={idx}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 px-2 py-2 rounded-xl transition-all duration-300 min-w-[70px] relative",
                isActive 
                  ? "" 
                  : "hover:bg-neutral-800/50"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full" />
              )}
              
              <div className={cn(
                "flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 relative",
                isActive 
                  ? "bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] shadow-lg shadow-[#2B9EB3]/30" 
                  : "bg-neutral-800/50"
              )}>
                {React.cloneElement(link.icon, {
                  className: cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isActive ? "text-white" : "text-neutral-400"
                  )
                })}
              </div>
              <span className={cn(
                "text-[11px] font-semibold transition-all duration-300 tracking-tight",
                isActive 
                  ? "text-white" 
                  : "text-neutral-400"
              )}>
                {link.label}
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};

const Logo = () => {
  return (
    <a
      href="/employee/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img src="/logo.png" alt="Jogaad India Logo" className="h-8 w-auto" />
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="/employee/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img src="/logo.png" alt="Jogaad India" className="h-8 w-8 object-contain" />
    </a>
  );
};
