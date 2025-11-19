"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconLogout,
  IconUser,
  IconCamera,
} from "@tabler/icons-react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUserNavigation } from "@/utils/user/useUserNavigation";
import { useUserData, useUserLogout, useUserSidebar } from "@/utils/user/useUserHooks";
import { useUserUpdate } from "@/utils/user/useUserUpdate";
import { getUserInitials } from "@/utils/auth";
import { MobileBottomNav } from "@/components/user/MobileBottomNav";
import Link from "next/link";


export default function UserProfile() {
  const router = useRouter();
  const { userData, loading, error: fetchError } = useUserData();
  const { handleLogout } = useUserLogout();
  const { open, setOpen } = useUserSidebar();
  const { links } = useUserNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    formData,
    loading: updateLoading,
    error: updateError,
    success,
    imagePreview,
    uploadingImage,
    isFormValid,
    handleInputChange,
    handleImageUpload,
    submitUserUpdate,
    setFormData,
  } = useUserUpdate(userData as any);

  const [isSaving, setIsSaving] = useState(false);

  // Update form data when userData loads
  React.useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        address: userData.address || '',
        phone: userData.phone || '',
        pincode: userData.pincode || '',
        img: userData.img || '',
      });
    }
  }, [userData, setFormData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
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

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      toast.error("Pincode must be 6 digits");
      return;
    }

    try {
      setIsSaving(true);
      const result = await submitUserUpdate();
      if (result) {
        // Optionally refresh page or redirect
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (fetchError) {
    return <ErrorScreen error={fetchError} />;
  }

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden md:flex-row", "h-screen")}>
      <Toaster position="top-right" richColors />

      {/* Desktop Sidebar */}
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
            
            <div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                {userData && (
                  <SidebarLink
                    link={{
                      label: userData.name || userData.email,
                      href: "/user/profile",
                      icon: (
                        <UserAvatar userData={userData} formData={formData} imagePreview={imagePreview} />
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

      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col rounded-none md:rounded-tl-2xl border-0 md:border border-neutral-200 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:border-neutral-700 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 overflow-y-auto pb-24 md:pb-0">
          <div className="relative z-0 mt-0 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] h-24 md:h-32">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-10 md:-bottom-12 left-1/2 transform -translate-x-1/2 z-20">
              <ProfileImageSection 
                imagePreview={imagePreview}
                formData={formData}
                uploadingImage={uploadingImage}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="mt-14 md:mt-16 px-3 md:px-6 lg:px-8 pb-4 md:pb-6 relative z-10">
            <div className="text-center mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1.5">
                {formData.name || "User"}
              </h1>
              <div className="flex items-center justify-center gap-2 flex-wrap mb-1.5">
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white rounded-full text-xs font-medium shadow-md">
                  {userData?.isVerified ? 'Verified User' : 'User'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Click camera icon to update photo
              </p>
            </div>

            {/* Form Container */}
            <div className="max-w-5xl mx-auto w-full">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                {/* Error/Success Messages */}
                <StatusMessages updateError={updateError} success={success} />

                {/* Personal Information Card */}
                <PersonalInfoCard 
                  formData={formData}
                  handleInputChange={handleInputChange}
                />

                {/* Action Buttons */}
                <ActionButtons 
                  isSaving={isSaving}
                  updateLoading={updateLoading}
                  isFormValid={isFormValid}
                />
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        links={links} 
        currentPath="/user/profile"
      />
    </div>
  );
}


const LoadingScreen = () => (
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

/**
 * Component: Error Screen
 * Follows SRP
 */
const ErrorScreen = ({ error }: { error: string }) => {
  const router = useRouter();
  
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
          onClick={() => router.push("/signin")}
          className="bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};


const UserAvatar = ({ userData, formData, imagePreview }: any) => (
  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center overflow-hidden relative">
    {(imagePreview || formData?.img || userData?.img) && (
      <img
        src={imagePreview || formData?.img || userData?.img}
        alt={userData?.name || "User"}
        className="h-7 w-7 rounded-full object-cover absolute inset-0"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    )}
    <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
      {getUserInitials(userData?.name || userData?.email || "U")}
    </span>
  </div>
);


const ProfileImageSection = ({ imagePreview, formData, uploadingImage, fileInputRef, handleFileChange }: any) => (
  <div className="relative">
    <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white dark:bg-neutral-800 p-1.5 shadow-2xl">
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
          {getUserInitials(formData.name || "U")}
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
);


const StatusMessages = ({ updateError, success }: { updateError: string; success: string }) => (
  <>
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
  </>
);

const PersonalInfoCard = ({ formData, handleInputChange }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
  >
    <div className="bg-gradient-to-r from-[#2B9EB3]/10 to-[#0A3D62]/10 dark:from-[#2B9EB3]/20 dark:to-[#0A3D62]/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
      <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
        <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center">
          <IconUser className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
        </div>
        Personal Information
      </h2>
    </div>
    <div className="p-4 md:p-5 space-y-3 md:space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
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
            className="h-9 md:h-10 text-sm"
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
            className="h-9 md:h-10 text-sm"
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
            value={formData.pincode}
            onChange={handleInputChange}
            placeholder="Enter 6-digit pincode"
            maxLength={6}
            className="h-9 md:h-10 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          Address
        </Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your complete address"
          rows={3}
          className="text-sm resize-none"
        />
      </div>
    </div>
  </motion.div>
);

const ActionButtons = ({ isSaving, updateLoading, isFormValid }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="flex flex-col sm:flex-row gap-2.5 md:gap-3 justify-center pt-2"
  >
    <Button
      type="submit"
      disabled={isSaving || updateLoading || !isFormValid}
      className="bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white hover:shadow-xl hover:scale-105 transition-all h-9 md:h-10 px-5 md:px-6 text-sm font-semibold w-full sm:w-auto order-1 sm:order-1"
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
      onClick={() => window.history.back()}
      disabled={isSaving || updateLoading}
      className="border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 h-9 md:h-10 px-5 md:px-6 text-sm font-semibold transition-all w-full sm:w-auto order-2 sm:order-2"
    >
      Cancel
    </Button>
  </motion.div>
);

export const Logo = () => (
  <Link
    href="/user/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India Logo" 
      className="h-8 w-auto"
    />
  </Link>
);

export const LogoIcon = () => (
  <Link
    href="/user/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
  >
    <img 
      src="/logo.png" 
      alt="Jogaad India" 
      className="h-8 w-8 object-contain"
    />
  </Link>
);
