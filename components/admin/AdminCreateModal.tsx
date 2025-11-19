/**
 * Admin Creation Modal Component
 * 
 * Modal dialog for creating new admin accounts
 */

"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAdminCreate } from "@/utils/admin/useAdminCreate";
import Image from "next/image";
import { 
  User, 
  Mail, 
  Phone, 
  CheckCircle2,
  UserPlus,
  Upload,
  Image as ImageIcon,
  Loader2,
  X
} from "lucide-react";

interface AdminCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdminCreateModal({ isOpen, onClose, onSuccess }: AdminCreateModalProps) {
  const {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    imagePreview,
    handleInputChange,
    createAdmin,
    handleImageUpload,
    isFormValid
  } = useAdminCreate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createAdmin();
    if (result) {
      if (onSuccess) onSuccess();
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-10"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                    Create New Admin
                  </h2>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Add a new administrator to manage the platform
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">{success}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section */}
                <div className="flex justify-center">
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleImageClick}
                      disabled={uploadingImage}
                      className="relative w-24 h-24 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 overflow-hidden group"
                    >
                      {uploadingImage ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-neutral-800">
                          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                        </div>
                      ) : imagePreview ? (
                        <>
                          <Image
                            src={imagePreview}
                            alt="Admin preview"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-5 h-5 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
                          <ImageIcon className="w-8 h-8 mb-1" />
                          <span className="text-xs font-medium">Upload</span>
                        </div>
                      )}
                    </button>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2">
                      Profile Image (Optional)
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabelInputContainer>
                    <Label htmlFor="name" className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter admin full name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-11 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
                    />
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      placeholder="admin@jogaad.com"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-11 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
                    />
                  </LabelInputContainer>

                  <LabelInputContainer className="md:col-span-2">
                    <Label htmlFor="phone" className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="10-digit phone number"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="h-11 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Optional</p>
                  </LabelInputContainer>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 h-11 rounded-lg font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading || !isFormValid}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex-1 h-11 rounded-lg font-semibold text-white",
                      "bg-gradient-to-r from-blue-600 to-cyan-600",
                      "hover:from-blue-700 hover:to-cyan-700",
                      "shadow-lg hover:shadow-xl transition-all duration-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Create Admin
                      </>
                    )}
                  </motion.button>
                </div>

                <p className="text-xs text-center text-neutral-500 dark:text-neutral-400">
                  The new admin will receive a welcome email with instructions to sign in.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

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
