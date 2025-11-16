"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconUserCircle,
  IconRefresh,
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
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEmployeeUpdate } from "@/utils/employee/useEmployeeUpdate";
import Image from "next/image";

export default function EmployeeProfilePage() {
  const router = useRouter();
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch employee profile data
  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      try {
        // Replace with actual API endpoint to get logged-in employee data
        const response = await fetch('/api/v1/employee-profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setEmployeeData(data.employee);
        } else {
          toast.error('Failed to load profile');
          router.push('/employee/signin');
        }
      } catch (error) {
        toast.error('Failed to load profile');
        router.push('/employee/signin');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchEmployeeProfile();
  }, [router]);

  if (loadingProfile) {
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
          <p className="text-[#0A3D62] font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Toaster position="top-right" richColors />
      
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
      
      <div className="relative z-20 container mx-auto px-4 py-8 max-w-4xl">
        {employeeData && <EmployeeProfileForm initialData={employeeData} />}
      </div>
    </div>
  );
}

// Employee Profile Form Component
const EmployeeProfileForm = React.memo(({ initialData }: { initialData: any }) => {
  const router = useRouter();
  const {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    categories,
    selectedCategory,
    imagePreview,
    priceError,
    handleInputChange,
    handleCategorySelect,
    handleImageUpload,
    submitEmployeeUpdate,
    isFormValid,
    setFormData
  } = useEmployeeUpdate({
    name: initialData.name || '',
    email: initialData.email || '',
    address: initialData.address || '',
    phone: initialData.phone || '',
    pincode: initialData.pincode || '',
    bankName: initialData.bankName || '',
    bankAccountNumber: initialData.bankAccountNumber || '',
    bankIfscCode: initialData.bankIfscCode || '',
    img: initialData.img || '',
    categoryid: initialData.categoryid?._id || initialData.categoryid || '',
    payrate: initialData.payrate || 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = React.useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitEmployeeUpdate();
  }, [submitEmployeeUpdate]);

  const handleImageClick = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            >
              <IconArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <IconUserCircle className="h-7 w-7" />
                Employee Profile
              </h1>
              <p className="text-white/80 text-sm mt-1">Update your profile information</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-200">Error</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-200">Success</p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">{success}</p>
            </div>
          </motion.div>
        )}

        {/* Profile Image Upload */}
        <div className="mb-8">
          <Label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-3 block">
            Profile Image
          </Label>
          <div className="flex items-center gap-6">
            <div
              onClick={handleImageClick}
              className="relative w-32 h-32 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-[#2B9EB3] transition-colors cursor-pointer overflow-hidden group"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400 group-hover:text-[#2B9EB3] transition-colors">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-xs">Upload</span>
                </div>
              )}
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
                Upload employee profile picture
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                PNG, JPG up to 5MB
              </p>
              <button
                type="button"
                onClick={handleImageClick}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
              >
                Choose Image
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled
                className="bg-neutral-50 dark:bg-neutral-800"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                type="text"
                placeholder="123456"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                minLength={6}
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </LabelInputContainer>

            <LabelInputContainer className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St, City, State"
                value={formData.address}
                onChange={handleInputChange}
              />
            </LabelInputContainer>
          </div>
        </div>

        {/* Bank Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-500" />
            Bank Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                type="text"
                placeholder="State Bank of India"
                value={formData.bankName}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="bankAccountNumber">Account Number</Label>
              <Input
                id="bankAccountNumber"
                type="text"
                placeholder="1234567890"
                value={formData.bankAccountNumber}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="bankIfscCode">IFSC Code</Label>
              <Input
                id="bankIfscCode"
                type="text"
                placeholder="SBIN0001234"
                value={formData.bankIfscCode}
                onChange={handleInputChange}
              />
            </LabelInputContainer>
          </div>
        </div>

        {/* Category & Pricing */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-500" />
            Category & Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="categoryid">Service Category *</Label>
              <select
                id="categoryid"
                value={formData.categoryid}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName} ({category.categoryType})
                  </option>
                ))}
              </select>
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="payrate">Pay Rate (₹) *</Label>
              <Input
                id="payrate"
                type="number"
                placeholder="5000"
                value={formData.payrate || ''}
                onChange={handleInputChange}
                required
              />
              {selectedCategory && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Recommended: ₹{selectedCategory.recommendationPrice?.toLocaleString()} 
                  (Range: ₹{selectedCategory.categoryMinPrice?.toLocaleString()} - ₹{selectedCategory.categoryMaxPrice?.toLocaleString()})
                </p>
              )}
              {priceError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {priceError}
                </p>
              )}
            </LabelInputContainer>
          </div>

          {selectedCategory && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-2">
                Selected Category: {selectedCategory.categoryName}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {selectedCategory.categoryDescription || 'No description available'}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={cn(
              "flex-1 h-12 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2",
              isFormValid && !loading
                ? "bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white hover:shadow-lg hover:scale-105"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <IconDeviceFloppy className="w-5 h-5" />
                Update Profile
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 h-12 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
});

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
