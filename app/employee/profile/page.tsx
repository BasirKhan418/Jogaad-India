"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import { IconLogout } from "@tabler/icons-react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Code,
  DollarSign,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag,
  Save
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useEmployeeNavigation } from "@/utils/employee/useEmployeeNavigation";
import { useEmployeeData, useEmployeeLogout, useEmployeeSidebar } from "@/utils/employee/useEmployeeHooks";
import { useEmployeeUpdate } from "@/utils/employee/useEmployeeUpdate";
import { getUserInitials } from "@/utils/auth";
import Image from "next/image";

export default function EmployeeProfilePage() {
  const router = useRouter();
  const { employeeData, loading, error: fetchError } = useEmployeeData();
  const { handleLogout } = useEmployeeLogout();
  const { open, setOpen } = useEmployeeSidebar();
  const { links } = useEmployeeNavigation();

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
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
        <div className="relative z-20 text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#0A3D62] mb-2">Access Error</h2>
          <p className="text-[#0A3D62]/70 mb-4">{fetchError}</p>
          <button 
            onClick={() => router.push('/employee/login')}
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

      {/* Main Content */}
      <ProfileContent employeeData={employeeData} />

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <MobileBottomNav links={links} currentPath="/employee/profile" />
    </div>
  );
};

const Logo = () => {
  return (
    <a
      href="/employee/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India Logo" 
        className="h-8 w-auto"
      />
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="/employee/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India" 
        className="h-8 w-8 object-contain"
      />
    </a>
  );
};

// Mobile Bottom Navigation Component
const MobileBottomNav = ({ links, currentPath }: { links: any[], currentPath: string }) => {
  // Show only the first 5 most important navigation items for mobile
  const mobileLinks = links.slice(0, 5);
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-800 dark:border-neutral-700 pb-safe">
      <nav className="flex items-center justify-around px-2 py-3">
        {mobileLinks.map((link, idx) => {
          const isActive = currentPath === link.href;
          return (
            <Link
              key={idx}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[64px]",
                isActive 
                  ? "text-white" 
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62]" 
                  : "bg-transparent"
              )}>
                {React.cloneElement(link.icon, {
                  className: cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-200",
                    isActive ? "text-white" : "text-neutral-400"
                  )
                })}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-200",
                isActive ? "text-white" : "text-neutral-400"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

// Profile Content Component
const ProfileContent = ({ employeeData }: { employeeData: any }) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-3 md:gap-4 rounded-none md:rounded-tl-2xl border-0 md:border border-neutral-200 bg-white p-3 sm:p-6 md:p-10 pb-24 md:pb-3 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        {/* Header */}
        <div className="mb-3 md:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2 md:gap-3">
            <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#2B9EB3]" />
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Update your profile information and settings
          </p>
        </div>

        <EmployeeProfileForm initialData={employeeData} />
      </div>
    </div>
  );
};

// Employee Profile Form Component
const EmployeeProfileForm = React.memo(({ initialData }: { initialData: any }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    formData,
    loading,
    error,
    success,
    imagePreview,
    uploadingImage,
    isFormValid,
    categories,
    handleInputChange,
    handleImageUpload,
    submitEmployeeUpdate,
  } = useEmployeeUpdate(initialData);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitEmployeeUpdate();
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="p-3 md:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 md:gap-3">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs md:text-sm font-medium text-red-900 dark:text-red-200">Error</p>
            <p className="text-xs md:text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-3 md:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2 md:gap-3">
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs md:text-sm font-medium text-green-900 dark:text-green-200">Success</p>
            <p className="text-xs md:text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Profile Image Upload */}
      <div className="bg-neutral-50 dark:bg-neutral-800 p-4 md:p-6 rounded-lg md:rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3 md:mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
          Profile Picture
        </h3>
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div 
            className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-neutral-200 dark:border-neutral-700 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors group"
            onClick={handleImageClick}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
              </div>
            )}
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-white animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <button
            type="button"
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
            onClick={handleImageClick}
            disabled={uploadingImage}
          >
            {uploadingImage ? "Uploading..." : "Change Picture"}
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-neutral-50 dark:bg-neutral-800 p-4 md:p-6 rounded-lg md:rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3 md:mb-4 flex items-center gap-2">
          <User className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelInputContainer>
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 1234567890"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="pincode" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Pincode
            </Label>
            <Input
              id="pincode"
              name="pincode"
              type="text"
              placeholder="110001"
              value={formData.pincode}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer className="md:col-span-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="Your complete address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>
        </div>
      </div>

      {/* Bank Information */}
      <div className="bg-neutral-50 dark:bg-neutral-800 p-4 md:p-6 rounded-lg md:rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3 md:mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
          Bank Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelInputContainer className="md:col-span-2">
            <Label htmlFor="bankName" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Bank Name
            </Label>
            <Input
              id="bankName"
              name="bankName"
              type="text"
              placeholder="State Bank of India"
              value={formData.bankName}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="bankAccountNumber" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Account Number
            </Label>
            <Input
              id="bankAccountNumber"
              name="bankAccountNumber"
              type="text"
              placeholder="1234567890"
              value={formData.bankAccountNumber}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="bankIfscCode" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              IFSC Code
            </Label>
            <Input
              id="bankIfscCode"
              name="bankIfscCode"
              type="text"
              placeholder="SBIN0001234"
              value={formData.bankIfscCode}
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>
        </div>
      </div>

      {/* Category & Pricing */}
      <div className="bg-neutral-50 dark:bg-neutral-800 p-4 md:p-6 rounded-lg md:rounded-xl border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3 md:mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
          Category & Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelInputContainer>
            <Label htmlFor="categoryid" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Service Category
            </Label>
            <select
              id="categoryid"
              name="categoryid"
              value={formData.categoryid}
              onChange={handleInputChange}
              className="flex h-10 w-full border-none bg-white dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="payrate" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Hourly Rate (₹)
            </Label>
            <Input
              id="payrate"
              name="payrate"
              type="number"
              placeholder="500"
              value={formData.payrate}
              onChange={handleInputChange}
              required
              min="0"
            />
          </LabelInputContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-3 md:pt-4">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="flex-1 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Update Profile</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 sm:py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm sm:text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
});

EmployeeProfileForm.displayName = "EmployeeProfileForm";

// Label Input Container
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
