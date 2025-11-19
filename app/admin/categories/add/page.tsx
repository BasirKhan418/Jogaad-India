"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconSettings,
  IconUsers,
  IconCategory,
  IconCurrencyRupee,
  IconChartBar,
  IconLogout,
  IconDashboard,
  IconUser,
  IconCheck,
  IconX,
  IconPhoto
} from "@tabler/icons-react";
import { AdminData } from "@/utils/admin/adminAuthService";
import { createCategory, uploadFile } from "@/utils/admin/adminApiService";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { FileUpload } from "@/components/ui/file-upload";
import { useAdminNavigation } from "@/utils/admin/useAdminNavigation";
import { useAdminData, useAdminLogout, useAdminSidebar } from "@/utils/admin/useAdminHooks";

// Charging unit options based on CSV data
const chargingUnits = [
  "Per admission process",
  "Per camera / monthly", 
  "Per campaign / per project",
  "Per case / consultation",
  "Per client handled / monthly",
  "Per consultation / per hour",
  "Per deal / commission-based",
  "Per event / per hour",
  "Per guard per hour",
  "Per hour / per chef",
  "Per hour / per person",
  "Per hour / per session",
  "Per job / per hour",
  "Per km / per load",
  "Per km / per trip",
  "Per policy or commission-based",
  "Per project / sq. ft.",
  "Per property managed",
  "Per session / per treatment",
  "Per sq. ft. / per month",
  "Per ton / per trip",
  "Per trip / per day",
  "Per trip / per km",
  "Per 1000 liters",
  "Per acre",
  "Per device per month",
  "Per electrical point",
  "Per item repaired",
  "Per machine per month",
  "Per service visit",
  "Per sq. ft.",
  "Per sq. ft. of structure",
  "Per sq. ft. or per hour",
  "Per sq. meter",
  "Per system per month",
  "Per ton of AC capacity",
  "Per vehicle per month"
].sort();

interface CategoryFormData {
  categoryName: string;
  categoryType: 'Service' | 'Maintenance' | '';
  categoryDescription: string;
  categoryUnit: string;
  recommendationPrice: number;
  categoryMinPrice: number;
  categoryMaxPrice: number;
  categoryStatus: boolean;
  img?: string;
}

export default function AddCategoryPage() {
  const router = useRouter();
  const { adminData, loading, error } = useAdminData();
  const { handleLogout } = useAdminLogout();
  const { open, setOpen } = useAdminSidebar();
  const { links, logoutLink } = useAdminNavigation();
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: '',
    categoryType: '',
    categoryDescription: '',
    categoryUnit: '',
    recommendationPrice: 0,
    categoryMinPrice: 0,
    categoryMaxPrice: 0,
    categoryStatus: true,
    img: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.categoryName.trim()) {
      toast.error('Category name is required');
      return false;
    }
    if (!formData.categoryType) {
      toast.error('Category type is required');
      return false;
    }
    if (!formData.categoryDescription.trim()) {
      toast.error('Category description is required');
      return false;
    }
    if (formData.categoryMinPrice < 0 || formData.categoryMaxPrice < 0 || formData.recommendationPrice < 0) {
      toast.error('Prices cannot be negative');
      return false;
    }
    if (formData.categoryMinPrice > 0 && formData.categoryMaxPrice > 0 && formData.categoryMinPrice >= formData.categoryMaxPrice) {
      toast.error('Minimum price must be less than maximum price');
      return false;
    }
    return true;
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setImageUploading(true);
    try {
      const result = await uploadFile(file);
      
      if (result.success && result.data?.fileUrl) {
        toast.success('Image uploaded successfully!');
        return result.data.fileUrl;
      } else {
        toast.error(result.message || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Error uploading image. Please try again.');
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      let imageUrl = formData.img;
      
      // Upload image first if a new file is selected
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (!uploadedUrl) {
          setSubmitting(false);
          return;
        }
        imageUrl = uploadedUrl;
      }
      
      // Filter and type-safe the data for API call
      const submitData = {
        categoryName: formData.categoryName,
        categoryType: formData.categoryType as 'Service' | 'Maintenance',
        categoryDescription: formData.categoryDescription,
        categoryUnit: formData.categoryUnit || undefined,
        recommendationPrice: formData.recommendationPrice,
        categoryMinPrice: formData.categoryMinPrice || undefined,
        categoryMaxPrice: formData.categoryMaxPrice || undefined,
        categoryStatus: formData.categoryStatus,
        img: imageUrl?.trim() || undefined
      };

      const result = await createCategory(submitData);

      if (result.success) {
        toast.success('Category created successfully!');
        // Reset form
        setFormData({
          categoryName: '',
          categoryType: '',
          categoryDescription: '',
          categoryUnit: '',
          recommendationPrice: 0,
          categoryMinPrice: 0,
          categoryMaxPrice: 0,
          categoryStatus: true,
          img: ''
        });
        setImageFile(null);
        setImagePreviewUrl('');
        
        // Redirect to categories page after short delay
        setTimeout(() => {
          router.push('/admin/categories');
        }, 1000);
       
      } else {
        toast.error(result.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error creating category');
    } finally {
      setSubmitting(false);
    }
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
                    href: "/admin/profile",
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
        <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:border-neutral-700 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
          
          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
            
            {/* Hero Section */}
            <div className="relative z-0 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] h-32 md:h-40 rounded-xl shadow-lg mb-20">
              <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
              <div className="absolute -bottom-12 md:-bottom-16 left-1/2 transform -translate-x-1/2 z-20">
                <div className="relative">
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-white dark:bg-neutral-800 p-2 shadow-2xl">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-[#F9A825] to-[#2B9EB3] flex items-center justify-center text-white font-bold text-2xl md:text-3xl overflow-hidden">
                      <IconCategory className="h-10 w-10 md:h-14 md:w-14" />
                    </div>
                  </div>
                  <button
                    onClick={() => router.back()}
                    className="absolute -top-2 -left-2 h-8 w-8 md:h-10 md:w-10 rounded-full bg-white dark:bg-neutral-700 shadow-lg flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors border border-neutral-200 dark:border-neutral-600"
                  >
                    <IconArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 dark:text-neutral-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
              {/* Header Text */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                  Add New Category
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base max-w-md mx-auto">
                  Create a new service or maintenance category with pricing details
                </p>
              </div>

              {/* Centered Form Container */}
              <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                
                {/* Basic Information Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 dark:from-[#F9A825]/20 dark:to-[#2B9EB3]/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                      <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-[#F9A825] to-[#2B9EB3] flex items-center justify-center">
                        <IconCategory className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                      </div>
                      Basic Information
                    </h2>
                  </div>
                  <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="categoryName" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          id="categoryName"
                          name="categoryName"
                          value={formData.categoryName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent transition-all duration-200 text-neutral-800 dark:text-neutral-100"
                          placeholder="Enter category name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="categoryType" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Category Type *
                        </label>
                        <select
                          id="categoryType"
                          name="categoryType"
                          value={formData.categoryType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent transition-all duration-200 text-neutral-800 dark:text-neutral-100"
                        >
                          <option value="">Select category type</option>
                          <option value="Service">Service</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="categoryDescription" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Category Description *
                      </label>
                      <textarea
                        id="categoryDescription"
                        name="categoryDescription"
                        value={formData.categoryDescription}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent transition-all duration-200 text-neutral-800 dark:text-neutral-100 resize-none"
                        placeholder="Describe what this category includes..."
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Pricing Information Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                      <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <IconCurrencyRupee className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                      </div>
                      Pricing & Units
                    </h2>
                  </div>
                  <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="categoryUnit" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Charging Unit
                      </label>
                      <select
                        id="categoryUnit"
                        name="categoryUnit"
                        value={formData.categoryUnit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent transition-all duration-200 text-neutral-800 dark:text-neutral-100"
                      >
                        <option value="">Select charging unit (optional)</option>
                        {chargingUnits.map((unit, index) => (
                          <option key={index} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="recommendationPrice" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Recommended Price (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-500 dark:text-neutral-400 text-sm">₹</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            id="recommendationPrice"
                            name="recommendationPrice"
                            value={formData.recommendationPrice === 0 ? '' : formData.recommendationPrice.toString()}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setFormData(prev => ({ 
                                ...prev, 
                                recommendationPrice: value === '' ? 0 : Number(value)
                              }));
                            }}
                            className="w-full pl-8 pr-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent transition-all duration-200 text-neutral-800 dark:text-neutral-100"
                            placeholder="2500"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="categoryMinPrice" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Minimum Price (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-500 dark:text-neutral-400 text-sm">₹</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            id="categoryMinPrice"
                            name="categoryMinPrice"
                            value={formData.categoryMinPrice === 0 ? '' : formData.categoryMinPrice.toString()}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setFormData(prev => ({ 
                                ...prev, 
                                categoryMinPrice: value === '' ? 0 : Number(value)
                              }));
                            }}
                            className="w-full pl-8 pr-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent transition-all duration-200 text-neutral-800 dark:text-neutral-100"
                            placeholder="1500"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="categoryMaxPrice" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Maximum Price (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-neutral-500 dark:text-neutral-400 text-sm">₹</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            id="categoryMaxPrice"
                            name="categoryMaxPrice"
                            value={formData.categoryMaxPrice === 0 ? '' : formData.categoryMaxPrice.toString()}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setFormData(prev => ({ 
                                ...prev, 
                                categoryMaxPrice: value === '' ? 0 : Number(value)
                              }));
                            }}
                            className="w-full pl-8 pr-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-[#2B9EB3] focus:border-transparent transition-all duration-200 text-neutral-800 dark:text-neutral-100"
                            placeholder="5000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Media Upload Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                      <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <IconPhoto className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                      </div>
                      Category Image (Optional)
                    </h2>
                  </div>
                  <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-600">
                      <FileUpload
                        onChange={(files) => {
                          if (files.length > 0) {
                            const file = files[0];
                            
                            // Validate file type and size
                            if (!file.type.startsWith('image/')) {
                              toast.error('Please select a valid image file');
                              return;
                            }
                            
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error('Image size should be less than 5MB');
                              return;
                            }
                            
                            // Create preview URL and store file
                            const previewUrl = URL.createObjectURL(file);
                            setImageFile(file);
                            setImagePreviewUrl(previewUrl);
                            setFormData(prev => ({ ...prev, img: '' })); // Clear any existing URL
                            toast.success('Image selected successfully!');
                          }
                        }}
                      />
                    </div>
                    
                    {(imagePreviewUrl || formData.img) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={imagePreviewUrl || formData.img}
                              alt="Category preview"
                              className="w-16 h-16 object-cover rounded-lg border border-neutral-200 dark:border-neutral-600"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <div className={`absolute -top-1 -right-1 rounded-full p-0.5 ${
                              imageUploading ? 'bg-yellow-500' : 'bg-green-500'
                            } text-white`}>
                              {imageUploading ? (
                                <svg className="h-2.5 w-2.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              ) : (
                                <IconCheck className="h-2.5 w-2.5" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Image Preview</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {imageUploading ? 'Uploading image...' : 
                               imageFile ? 'Ready to upload' : 'Category image uploaded successfully'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, img: '' }));
                              setImageFile(null);
                              setImagePreviewUrl('');
                              if (imagePreviewUrl) {
                                URL.revokeObjectURL(imagePreviewUrl);
                              }
                            }}
                            disabled={imageUploading}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <IconX className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Settings Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 px-4 md:px-5 py-2.5 md:py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                      <div className="h-6 w-6 md:h-7 md:w-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <IconSettings className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                      </div>
                      Category Settings
                    </h2>
                  </div>
                  <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <input
                        type="checkbox"
                        id="categoryStatus"
                        name="categoryStatus"
                        checked={formData.categoryStatus}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#2B9EB3] focus:ring-[#2B9EB3] border-neutral-300 rounded"
                      />
                      <label htmlFor="categoryStatus" className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        <IconCheck className="h-3.5 w-3.5 text-green-600" />
                        Active Category - This category will be available for users
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3 md:gap-4 pt-4"
                >
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-6 py-2.5 md:py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <IconCheck className="h-4 w-4" />
                        Create Category
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 md:py-3 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm md:text-base"
                  >
                    <IconX className="h-4 w-4" />
                    Cancel
                  </button>
                </motion.div>
                </form>
              </div>
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
      href="#"
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