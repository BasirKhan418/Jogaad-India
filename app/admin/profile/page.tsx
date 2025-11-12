"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconSettings,
  IconUsers,
  IconCategory,
  IconCurrencyDollar,
  IconChartBar,
  IconLogout,
  IconDashboard,
  IconUser,
  IconUpload,
  IconCamera,
  IconShield,
} from "@tabler/icons-react";
import { AdminData, updateAdminProfile } from "@/utils/admin/adminAuthService";
import { uploadFile } from "@/utils/admin/adminApiService";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAdminNavigation } from "@/utils/admin/useAdminNavigation";
import { useAdminDataWithForm, useAdminLogout, useAdminSidebar } from "@/utils/admin/useAdminHooks";

export default function AdminProfile() {
  const router = useRouter();
  const { adminData, loading, error, formData, setFormData, refetch } = useAdminDataWithForm({
    name: '',
    email: '',
    phone: '',
    img: '',
  });
  const { handleLogout } = useAdminLogout();
  const { open, setOpen } = useAdminSidebar();
  const { links, logoutLink } = useAdminNavigation();
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);

      const result = await uploadFile(file);

      if (result.success && result.data?.fileUrl) {
        setFormData((prev: any) => ({
          ...prev,
          img: result.data!.fileUrl,
        }));

        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const profileUpdateData = {
        name: formData.name,
        phone: formData.phone,
        img: formData.img,
      };
      
      const result = await updateAdminProfile(profileUpdateData);

      if (result.success) {
        toast.success("Profile updated successfully");
        refetch(); // Refresh admin data
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
          <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#0A3D62] font-semibold">Loading profile...</p>
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
          <p className="text-[#0A3D62]/70 mb-4">{error}</p>
          <button
            onClick={() => router.push("/admin/signin")}
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
              {adminData && (
                <SidebarLink
                  link={{
                    label: adminData.name || adminData.email,
                    href: "#",
                    icon: (
                      <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] flex items-center justify-center overflow-hidden relative">
                        {adminData.img && adminData.img.trim() !== "" ? (
                          <img
                            src={adminData.img}
                            alt={adminData.name}
                            className="h-7 w-7 rounded-full object-cover absolute inset-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
                          {getUserInitials(adminData.name || adminData.email || "AD")}
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

      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:border-neutral-700 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 overflow-y-auto">
          {/* Hero Section - Minimal height */}
          <div className="relative z-0 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] h-24 md:h-32">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-10 md:-bottom-12 left-1/2 transform -translate-x-1/2 z-20">
              <div className="relative">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white dark:bg-neutral-800 p-1.5 shadow-2xl">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-[#F9A825] to-[#2B9EB3] flex items-center justify-center text-white font-bold text-2xl md:text-3xl overflow-hidden">
                    {formData.img && formData.img.trim() !== "" ? (
                      <img
                        src={formData.img}
                        alt={formData.name}
                        className="h-full w-full rounded-full object-cover"
                        onError={(e) => {
                          setFormData((prev: any) => ({ ...prev, img: "" }));
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    {(!formData.img || formData.img.trim() === "") && (
                      <span className="text-white font-bold leading-none">
                        {getUserInitials(formData.name || "AD")}
                      </span>
                    )}
                  </div>
                </div>
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-4 border-white"></div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="absolute bottom-0 right-0 h-7 w-7 md:h-8 md:w-8 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed border-2 border-neutral-200 dark:border-neutral-700 group"
                >
                  <IconCamera className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#2B9EB3] group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-[#F9A825] rounded-full animate-pulse"></span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Content Section - Compact spacing */}
          <div className="mt-14 md:mt-16 px-3 md:px-6 lg:px-8 pb-4 md:pb-6 relative z-10">
            <div className="text-center mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1.5">
                {formData.name || "Admin User"}
              </h1>
              <div className="flex items-center justify-center gap-2 flex-wrap mb-1.5">
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white rounded-full text-xs font-medium shadow-md">
                  {adminData?.isSuperAdmin ? "Super Admin" : "Admin"}
                </span>
                {adminData?.isVerified && (
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Click camera icon to update photo
              </p>
            </div>

            {/* Centered Form Container */}
            <div className="max-w-5xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                {/* Personal Information Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 dark:from-[#F9A825]/20 dark:to-[#2B9EB3]/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                      <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-[#F9A825] to-[#2B9EB3] flex items-center justify-center">
                        <IconUser className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                      </div>
                      Personal Information
                    </h2>
                  </div>
                  <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
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
                          className="h-9 md:h-10 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            disabled
                            className="h-9 md:h-10 text-sm bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed pr-9"
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

                      <div className="space-y-1.5 lg:col-span-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
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
                          className="h-9 md:h-10 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Account Details Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 dark:from-[#F9A825]/20 dark:to-[#2B9EB3]/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                      <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-[#F9A825] to-[#2B9EB3] flex items-center justify-center">
                        <IconShield className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                      </div>
                      Account Details
                    </h2>
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#F9A825]/10 to-[#F9A825]/5 dark:from-[#F9A825]/20 dark:to-[#F9A825]/10">
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Account Type
                        </div>
                        <div className="text-sm md:text-base font-bold text-neutral-800 dark:text-neutral-100">
                          {adminData?.isSuperAdmin ? "Super Admin" : "Admin"}
                        </div>
                      </div>

                      <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#2B9EB3]/10 to-[#2B9EB3]/5 dark:from-[#2B9EB3]/20 dark:to-[#2B9EB3]/10">
                        <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                          Status
                        </div>
                        <div className="text-sm md:text-base font-bold text-neutral-800 dark:text-neutral-100">
                          {adminData?.isVerified ? "Verified" : "Pending"}
                        </div>
                      </div>

                      {adminData?.createdAt && (
                        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/10 sm:col-span-2 lg:col-span-1">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                            Member Since
                          </div>
                          <div className="text-sm md:text-base font-bold text-neutral-800 dark:text-neutral-100">
                            {new Date(adminData.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-2.5 md:gap-3 justify-center pt-2"
                >
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white hover:shadow-xl hover:scale-105 transition-all h-9 md:h-10 px-5 md:px-6 text-sm font-semibold"
                  >
                    {isSaving ? (
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
                    onClick={() => router.push("/admin/dashboard")}
                    className="border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 h-9 md:h-10 px-5 md:px-6 text-sm font-semibold transition-all"
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
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img src="/logo.png" alt="Jogaad India Logo" className="h-8 w-auto" />
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img src="/logo.png" alt="Jogaad India" className="h-8 w-8 object-contain" />
    </a>
  );
};
