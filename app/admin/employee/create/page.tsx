"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
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
  IconPlus,
  IconBuildingStore
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
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminData, useAdminLogout } from "@/utils/admin/useAdminHooks";
import { useEmployeeCreation } from "@/utils/employee/useEmployeeCreation";
import { getUserInitials } from "@/utils/auth";
import Image from "next/image";

export default function AdminEmployeeCreationPage() {
  const router = useRouter();
  const { adminData, loading: adminLoading, error: adminError } = useAdminData();
  const { handleLogout } = useAdminLogout();

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
    submitEmployeeCreation,
    isFormValid
  } = useEmployeeCreation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitEmployeeCreation();
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Loading state
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

  // Error state
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
            <AlertCircle className="w-8 h-8 text-white" />
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

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full bg-white relative">
            {/* Background */}
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

            {/* Content */}
            <div className="relative z-20 p-6 md:p-8 lg:p-12">
              {/* Header */}
              <div className="mb-8">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-[#0A3D62] hover:text-[#2B9EB3] transition-colors mb-4 group"
                >
                  <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back</span>
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-xl flex items-center justify-center">
                    <IconUsers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[#0A3D62]">Create Employee Account</h1>
                    <p className="text-[#0A3D62]/60 mt-1">
                      Register a new employee with category and pricing
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
                  <form onSubmit={handleSubmit} className="p-8">
                    {/* Error/Success Messages */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">Error</p>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                      </motion.div>
                    )}

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-900">Success</p>
                          <p className="text-sm text-green-700 mt-1">{success}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Profile Image Upload */}
                    <div className="mb-8">
                      <Label className="text-sm text-neutral-600 font-medium mb-3 block">
                        Profile Image (Optional)
                      </Label>
                      <div className="flex items-center gap-6">
                        <div
                          onClick={handleImageClick}
                          className="relative w-24 h-24 rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#2B9EB3] transition-colors cursor-pointer overflow-hidden group"
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
                              <ImageIcon className="w-8 h-8 mb-1" />
                              <span className="text-xs">Click to upload</span>
                            </div>
                          )}
                          {uploadingImage && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-600 mb-1">
                            Upload employee profile picture
                          </p>
                          <p className="text-xs text-neutral-500">
                            PNG, JPG up to 5MB
                          </p>
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
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-[#0A3D62] mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LabelInputContainer>
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="bg-white"
                          />
                        </LabelInputContainer>

                        <LabelInputContainer>
                          <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="bg-white"
                          />
                        </LabelInputContainer>

                        <LabelInputContainer>
                          <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            minLength={10}
                            className="bg-white"
                          />
                        </LabelInputContainer>

                        <LabelInputContainer>
                          <Label htmlFor="pincode" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Pincode *
                          </Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            type="text"
                            placeholder="123456"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                            maxLength={6}
                            pattern="[0-9]{6}"
                            className="bg-white"
                          />
                        </LabelInputContainer>

                        <LabelInputContainer>
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Address (Optional)
                          </Label>
                          <Input
                            id="address"
                            type="text"
                            placeholder="Street, City, State"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="bg-white"
                          />
                        </LabelInputContainer>
                      </div>
                    </div>

                    {/* Category and Pricing */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-[#0A3D62] mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Category & Pricing
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LabelInputContainer>
                          <Label htmlFor="categoryid" className="flex items-center gap-2">
                            <IconCategory className="w-4 h-4" />
                            Service Category *
                          </Label>
                          <select
                            id="categoryid"
                            value={formData.categoryid}
                            onChange={(e) => handleCategorySelect(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B9EB3] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                          <Label htmlFor="payrate" className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Pay Rate (₹) *
                          </Label>
                          <Input
                            id="payrate"
                            type="number"
                            placeholder="0"
                            value={formData.payrate || ''}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className={cn(
                              "bg-white",
                              priceError && "border-red-500 focus-visible:ring-red-500"
                            )}
                          />
                          {priceError && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {priceError}
                            </p>
                          )}
                        </LabelInputContainer>
                      </div>

                      {/* Category Info Display */}
                      {selectedCategory && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-neutral-600 font-medium mb-1">Recommended Price</p>
                              <p className="text-[#0A3D62] font-bold text-lg">
                                ₹{selectedCategory.recommendationPrice.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-neutral-600 font-medium mb-1">Minimum Price</p>
                              <p className="text-[#0A3D62] font-semibold">
                                ₹{(selectedCategory.categoryMinPrice || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-neutral-600 font-medium mb-1">Maximum Price</p>
                              <p className="text-[#0A3D62] font-semibold">
                                ₹{(selectedCategory.categoryMaxPrice || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {selectedCategory.categoryDescription && (
                            <p className="text-xs text-neutral-600 mt-3 border-t border-blue-200 pt-3">
                              {selectedCategory.categoryDescription}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Bank Details */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-[#0A3D62] mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Bank Details (Optional)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <LabelInputContainer>
                          <Label htmlFor="bankName" className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Bank Name
                          </Label>
                          <Input
                            id="bankName"
                            type="text"
                            placeholder="State Bank of India"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            className="bg-white"
                          />
                        </LabelInputContainer>

                        <LabelInputContainer>
                          <Label htmlFor="bankAccountNumber" className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Account Number
                          </Label>
                          <Input
                            id="bankAccountNumber"
                            type="text"
                            placeholder="1234567890"
                            value={formData.bankAccountNumber}
                            onChange={handleInputChange}
                            className="bg-white"
                          />
                        </LabelInputContainer>

                        <LabelInputContainer>
                          <Label htmlFor="bankIfscCode" className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            IFSC Code
                          </Label>
                          <Input
                            id="bankIfscCode"
                            type="text"
                            placeholder="SBIN0001234"
                            value={formData.bankIfscCode}
                            onChange={handleInputChange}
                            className="bg-white"
                          />
                        </LabelInputContainer>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className={cn(
                          "flex-1 h-12 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2",
                          "bg-gradient-to-r from-[#F9A825] to-[#2B9EB3]",
                          "hover:shadow-lg hover:shadow-[#2B9EB3]/20",
                          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        )}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Employee...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Create Employee Account
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components
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
