"use client";
import React, { useEffect, Suspense } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFieldExecEditEmployee } from "@/utils/fieldexecutive/useFieldExecEditEmployee";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  Briefcase,
  IndianRupee,
  Upload,
  CheckCircle2,
  UserPlus,
  Building,
  CreditCard,
  Home,
  Check,
  Loader2
} from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useFieldExecNavigation } from "@/utils/fieldexecutive/useFieldExecNavigation";
import { 
  useFieldExecData, 
  useFieldExecLogout, 
  useFieldExecSidebar 
} from "@/utils/fieldexecutive/useFieldExecHooks";
import { IconLogout } from "@tabler/icons-react";
import { getUserInitials } from "@/utils/auth";
import { Toaster } from "sonner";

/**
 * Employee Edit Service Provider Page Content Component
 * Allows employees to edit service provider details within 12 hours of creation
 */
function FieldExecEditEmployeePageContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');

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
    step,
    fetchingEmployee,
    handleInputChange,
    handleCategorySelect,
    handleImageUpload,
    submitUpdateEmployee,
    nextStep,
    prevStep,
    isStepValid,
    loadEmployeeData,
  } = useFieldExecEditEmployee();

  const { fieldExecData, loading: fieldExecLoading, error: fieldExecError } = useFieldExecData();
  const { handleLogout } = useFieldExecLogout();
  const { open, setOpen } = useFieldExecSidebar();
  const { links } = useFieldExecNavigation();

  // Load service provider data on mount
  useEffect(() => {
    if (employeeId) {
      loadEmployeeData(employeeId);
    }
  }, [employeeId, loadEmployeeData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 'optional') {
      await submitUpdateEmployee(employeeId!);
    } else {
      nextStep();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const steps = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'service', label: 'Service Details', icon: Briefcase },
    { id: 'optional', label: 'Additional Info', icon: Building }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  // Redirect if no employee ID
  if (!employeeId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0A3D62] mb-4">Invalid Request</h2>
          <p className="text-slate-600 mb-6">No service provider ID provided</p>
          <button
            onClick={() => router.push('/field-executive/dashboard')}
            className="px-6 py-2 bg-[#2B9EB3] text-white rounded-lg hover:bg-[#0A3D62] transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Loading state for fetching service provider
  if (fetchingEmployee || fieldExecLoading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2B9EB3] animate-spin mx-auto mb-4" />
          <p className="text-lg text-[#0A3D62] font-semibold">Loading service provider data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* Decorative Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(43, 158, 179, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(10, 61, 98, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      <div className="flex flex-col md:flex-row w-full h-screen relative z-10">
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
            
            {/* User Section */}
            <div>
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                {fieldExecData && (
                  <SidebarLink
                    link={{
                      label: fieldExecData.name || fieldExecData.email,
                      href: "/field-executive/profile",
                      icon: (
                        <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center overflow-hidden relative">
                          {fieldExecData.img && fieldExecData.img.trim() !== "" ? (
                            <img
                              src={fieldExecData.img}
                              alt={fieldExecData.name}
                              className="h-7 w-7 rounded-full object-cover absolute inset-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
                            {getUserInitials(fieldExecData.name || fieldExecData.email || "FE")}
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
        <div className="flex-1 overflow-auto bg-white overscroll-contain">
          <div className="max-w-4xl mx-auto px-4 py-6 pb-24 md:pb-8">
            
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-[#2B9EB3] hover:text-[#0A3D62] mb-4 transition-colors font-medium touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h1 className="text-3xl font-bold text-[#0A3D62] mb-2">
                Edit Service Provider
              </h1>
              <p className="text-base text-slate-600">
                Update service provider information
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                {steps.map((s, index) => (
                  <React.Fragment key={s.id}>
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 shadow-sm",
                        index <= currentStepIndex
                          ? "border-[#2B9EB3] bg-[#2B9EB3] text-white shadow-[#2B9EB3]/20"
                          : "border-gray-300 bg-white text-gray-400"
                      )}>
                        {index < currentStepIndex ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <s.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-600 text-center mt-2 w-20">
                        {s.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "h-0.5 transition-all duration-300 mx-2 mb-6",
                        "flex-1 min-w-[30px]",
                        index < currentStepIndex ? "bg-[#2B9EB3]" : "bg-gray-300"
                      )} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-800 font-medium">Service provider updated successfully!</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Step 1: Personal Information */}
                  {step === 'personal' && (
                    <div className="space-y-3 sm:space-y-4">
                      <LabelInputContainer>
                        <Label htmlFor="name" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                          <User className="w-4 h-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                        />
                      </LabelInputContainer>

                      <LabelInputContainer>
                        <Label htmlFor="email" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                          <Mail className="w-4 h-4" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          placeholder="employee@example.com"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled
                          className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-gray-100 text-sm cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-500">Email cannot be changed</p>
                      </LabelInputContainer>

                      <LabelInputContainer>
                        <Label htmlFor="phone" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                          <Phone className="w-4 h-4" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          placeholder="10-digit mobile"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          maxLength={10}
                          className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                        />
                      </LabelInputContainer>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <LabelInputContainer>
                          <Label htmlFor="pincode" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                            <MapPin className="w-4 h-4" />
                            Pincode *
                          </Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            placeholder="6-digit"
                            type="text"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            required
                            maxLength={6}
                            pattern="[0-9]{6}"
                            className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm font-mono tracking-wider"
                          />
                        </LabelInputContainer>
                      </div>

                      <LabelInputContainer>
                        <Label htmlFor="address" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                          <Home className="w-4 h-4" />
                          Complete Address *
                        </Label>
                        <textarea
                          id="address"
                          placeholder="House/Flat No., Street, Area, Landmark..."
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm resize-none"
                        />
                      </LabelInputContainer>
                    </div>
                  )}

                  {/* Step 2: Service Information */}
                  {step === 'service' && (
                    <div className="space-y-4">
                      <LabelInputContainer>
                        <Label htmlFor="categoryid" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                          <Briefcase className="w-4 h-4" />
                          Service Category *
                        </Label>
                        <select
                          id="categoryid"
                          value={formData.categoryid}
                          onChange={(e) => handleCategorySelect(e.target.value)}
                          required
                          disabled
                          className="h-10 sm:h-11 px-4 rounded-xl border-2 border-gray-200/60 bg-gray-100 text-sm cursor-not-allowed"
                        >
                          <option value="">
                            {categories.length === 0 ? 'Loading categories...' : 'Select a service category'}
                          </option>
                          {categories.map((category: any) => (
                            <option key={category._id} value={category._id}>
                              {category.categoryName} ({category.categoryType})
                            </option>
                          ))}
                          <option value="others" className="font-semibold">Others (Custom service)</option>
                        </select>
                        <p className="text-xs text-slate-500">Category cannot be changed</p>
                      </LabelInputContainer>

                      {formData.categoryid === 'others' && (
                        <LabelInputContainer>
                          <Label htmlFor="customDescription" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                            <Briefcase className="w-4 h-4" />
                            Service Description *
                          </Label>
                          <textarea
                            id="customDescription"
                            placeholder="Describe the service employee will provide..."
                            value={formData.customDescription || ''}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm resize-none"
                          />
                        </LabelInputContainer>
                      )}

                      {selectedCategory && formData.categoryid !== 'others' && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/40">
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600 font-medium mb-1">Recommended</p>
                              <p className="text-[#0A3D62] font-bold">₹{selectedCategory.recommendationPrice?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium mb-1">Minimum</p>
                              <p className="text-[#0A3D62] font-bold">₹{selectedCategory.categoryMinPrice?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium mb-1">Maximum</p>
                              <p className="text-[#0A3D62] font-bold">₹{selectedCategory.categoryMaxPrice?.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <LabelInputContainer>
                        <Label htmlFor="payrate" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                          <IndianRupee className="w-4 h-4" />
                          Service Rate *
                        </Label>
                        <Input
                          id="payrate"
                          placeholder="Enter service rate"
                          type="number"
                          value={formData.payrate || ''}
                          onChange={handleInputChange}
                          required
                          min={selectedCategory?.categoryMinPrice || 0}
                          max={selectedCategory?.categoryMaxPrice || 100000}
                          className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                        />
                        {priceError && (
                          <p className="text-xs text-red-600 mt-1">{priceError}</p>
                        )}
                      </LabelInputContainer>
                    </div>
                  )}

                  {/* Step 3: Optional Information */}
                  {step === 'optional' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-base font-semibold text-[#0A3D62] mb-3 flex items-center gap-1.5">
                          <Building className="w-5 h-5" />
                          Bank Information (Optional)
                        </h3>
                        <div className="space-y-4">
                          <LabelInputContainer>
                            <Label htmlFor="bankName" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                              <Building className="w-4 h-4" />
                              Bank Name
                            </Label>
                            <Input
                              id="bankName"
                              placeholder="e.g., State Bank of India"
                              type="text"
                              value={formData.bankName}
                              onChange={handleInputChange}
                              className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                            />
                          </LabelInputContainer>

                          <LabelInputContainer>
                            <Label htmlFor="bankAccountNumber" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                              <CreditCard className="w-4 h-4" />
                              Account Number
                            </Label>
                            <Input
                              id="bankAccountNumber"
                              placeholder="Bank account number"
                              type="text"
                              value={formData.bankAccountNumber}
                              onChange={handleInputChange}
                              className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                            />
                          </LabelInputContainer>

                          <LabelInputContainer>
                            <Label htmlFor="bankIfscCode" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-sm">
                              <CreditCard className="w-4 h-4" />
                              IFSC Code
                            </Label>
                            <Input
                              id="bankIfscCode"
                              placeholder="e.g., SBIN0001234"
                              type="text"
                              value={formData.bankIfscCode}
                              onChange={handleInputChange}
                              className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                            />
                          </LabelInputContainer>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-[#0A3D62] mb-3 flex items-center gap-1.5">
                          <Upload className="w-5 h-5" />
                          Profile Photo (Optional)
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {imagePreview && (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#2B9EB3]/40">
                              <Image
                                src={imagePreview}
                                alt="Profile preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <label className="flex-1 w-full cursor-pointer">
                            <div className="flex items-center justify-center gap-2 h-10 sm:h-11 px-4 rounded-xl border-2 border-dashed border-[#2B9EB3]/40 bg-white/60 hover:bg-[#2B9EB3]/5 transition-all duration-300">
                              <Upload className="w-4 h-4 text-[#2B9EB3]" />
                              <span className="text-sm text-[#0A3D62] font-medium">
                                {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Max file size: 5MB</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-slate-200">
                    {step !== 'personal' && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-[#2B9EB3] text-[#2B9EB3] font-semibold hover:bg-[#2B9EB3]/5 active:bg-[#2B9EB3]/10 transition-all text-sm touch-manipulation"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                      </button>
                    )}
                    <EnhancedButton
                      type="submit"
                      disabled={loading || !isStepValid || uploadingImage}
                      loading={loading}
                      icon={step === 'optional' ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                      className={step === 'personal' ? 'flex-1' : 'flex-1'}
                    >
                      {loading 
                        ? "Updating..." 
                        : step === 'optional' 
                          ? "Update Service Provider" 
                          : "Continue"}
                    </EnhancedButton>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav
            links={links}
            currentPath={pathname}
          />
        </div>
      </div>
    </div>
  );
}

// Logo Components
const Logo = () => (
  <Link href="/field-executive/dashboard" className="flex items-center gap-2 px-2 py-1">
    <Image
      src="/logo.png"
      alt="Jogaad India"
      width={120}
      height={60}
      className="h-8 w-auto object-contain"
      priority
    />
  </Link>
);

const LogoIcon = () => (
  <Link href="/field-executive/dashboard" className="flex items-center justify-center p-2">
    <Image
      src="/logo.png"
      alt="Jogaad India"
      width={32}
      height={32}
      className="h-8 w-8 object-contain"
      priority
    />
  </Link>
);

// Mobile Bottom Navigation
const MobileBottomNav = ({ links, currentPath }: { links: any[], currentPath: string }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-neutral-800 shadow-[0_-4px_24px_rgba(0,0,0,0.3)] pb-safe">
      <nav className="flex items-center justify-around px-4 py-2">
        {links.map((link, idx) => {
          const isActive = currentPath === link.href;
          
          return (
            <Link
              key={idx}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 px-2 py-2 rounded-xl transition-all duration-300 min-w-[70px] relative",
                isActive 
                  ? "" 
                  : "hover:bg-neutral-800/50"
              )}
            >
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
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

// Enhanced Button Component
const EnhancedButton = ({ 
  children, 
  loading = false, 
  icon, 
  className = "", 
  ...props 
}: {
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button
      className={cn(
        "group/btn relative flex items-center justify-center gap-2 h-12 w-full rounded-xl",
        "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] font-semibold text-white text-sm",
        "shadow-lg hover:shadow-xl hover:shadow-[#2B9EB3]/25 active:shadow-[#2B9EB3]/30 transition-all duration-300",
        "transform hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg",
        "touch-manipulation",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2 relative z-10">
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : icon}
        {children}
      </span>
      <EnhancedBottomGradient />
    </button>
  );
};

// Enhanced Bottom Gradient Effect
const EnhancedBottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-[#F9A825] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-[#2B9EB3] to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

// Enhanced Label Input Container
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

/**
 * Main Page Component with Suspense Boundary
 */
export default function FieldExecEditEmployeePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2B9EB3] animate-spin mx-auto mb-4" />
          <p className="text-lg text-[#0A3D62] font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <FieldExecEditEmployeePageContent />
    </Suspense>
  );
}
