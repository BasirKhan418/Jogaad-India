"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFieldExecAddEmployee } from "@/utils/fieldexecutive/useFieldExecAddEmployee";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  Briefcase,
  DollarSign,
  Upload,
  CheckCircle2,
  UserPlus,
  Building,
  CreditCard,
  Home,
  Check
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
 * Field Executive Add Employee Page
 * Allows field executives to add new employees with payment processing
 */
export default function FieldExecAddEmployeePage() {
  const pathname = usePathname();
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
    step,
    handleInputChange,
    handleCategorySelect,
    handleImageUpload,
    submitAddEmployee,
    nextStep,
    prevStep,
    isStepValid,
  } = useFieldExecAddEmployee();

  const { fieldExecData, loading: fieldExecLoading, error: fieldExecError } = useFieldExecData();
  const { handleLogout } = useFieldExecLogout();
  const { open, setOpen } = useFieldExecSidebar();
  const { links } = useFieldExecNavigation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 'optional') {
      await submitAddEmployee();
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

  // Loading state
  if (fieldExecLoading) {
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
          <p className="text-[#0A3D62] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (fieldExecError) {
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
          <p className="text-[#0A3D62]/70 mb-4">{fieldExecError}</p>
          <button 
            onClick={() => router.push('/field-executive/login')}
            className="bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden md:flex-row", "min-h-screen")}>
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
      <div className="flex-1 min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8 relative overflow-hidden bg-white">
        {/* Background Image with overlay - hidden on mobile for performance */}
        <div 
          className="hidden md:block absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
        
        {/* Gradient Orbs - hidden on mobile */}
        <div className="hidden lg:block absolute top-10 -left-32 w-80 h-80 bg-gradient-to-br from-[#2B9EB3]/20 to-[#0A3D62]/10 rounded-full blur-3xl z-10 animate-pulse"></div>
        <div className="hidden lg:block absolute bottom-10 -right-32 w-96 h-96 bg-gradient-to-tl from-[#F9A825]/20 to-[#2B9EB3]/10 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Form Container */}
        <div className="relative z-20 w-full max-w-2xl mx-auto">

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/60 shadow-2xl shadow-[#0A3D62]/10 relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-[#2B9EB3]/5 pointer-events-none"></div>
            
            <div className="relative z-10">
              {/* Header Section */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] mb-3 sm:mb-4 shadow-lg">
                  <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-2">
                  Add New Employee
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Register a new employee in 3 simple steps
                </p>
              </div>

              {/* Step Indicator */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((s, index) => {
                    const StepIcon = s.icon;
                    const isActive = currentStepIndex >= index;
                    const isCurrent = step === s.id;
                    
                    return (
                      <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                          <div className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300",
                            isActive 
                              ? "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white shadow-lg" 
                              : "bg-gray-200 text-gray-400"
                          )}>
                            {isActive && index < currentStepIndex ? (
                              <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                              <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                          </div>
                          <span className={cn(
                            "text-[10px] sm:text-xs font-medium text-center hidden sm:block",
                            isCurrent ? "text-[#0A3D62] font-bold" : "text-gray-500"
                          )}>
                            {s.label}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={cn(
                            "flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 transition-all duration-300 rounded",
                            currentStepIndex > index ? "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62]" : "bg-gray-200"
                          )} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                {/* Mobile step label */}
                <div className="text-center mt-3 sm:hidden">
                  <span className="text-sm font-medium text-[#0A3D62]">
                    {steps[currentStepIndex].label}
                  </span>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50/80 border border-red-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-xs sm:text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B9EB3] flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-[#0A3D62] font-medium">{success}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Step 1: Personal Information */}
                  {step === 'personal' && (
                    <div className="space-y-3 sm:space-y-4">
                      <LabelInputContainer>
                        <Label htmlFor="name" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter employee's full name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                        />
                      </LabelInputContainer>

                      <LabelInputContainer>
                        <Label htmlFor="email" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          placeholder="employee.email@example.com"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                        />
                      </LabelInputContainer>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <LabelInputContainer>
                          <Label htmlFor="phone" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

                        <LabelInputContainer>
                          <Label htmlFor="pincode" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Pincode *
                          </Label>
                          <Input
                            id="pincode"
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
                        <Label htmlFor="address" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Complete Address *
                        </Label>
                        <textarea
                          id="address"
                          placeholder="House/Flat No., Street, Area, Landmark..."
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm resize-none"
                        />
                      </LabelInputContainer>
                    </div>
                  )}

                  {/* Step 2: Service Information */}
                  {step === 'service' && (
                    <div className="space-y-3 sm:space-y-4">
                      <LabelInputContainer>
                        <Label htmlFor="categoryid" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                          <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Service Category *
                        </Label>
                        <select
                          id="categoryid"
                          value={formData.categoryid}
                          onChange={(e) => handleCategorySelect(e.target.value)}
                          required
                          className="h-10 sm:h-11 px-4 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                        >
                          <option value="">
                            {categories.length === 0 ? 'Loading categories...' : 'Select a service category'}
                          </option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.categoryName} ({category.categoryType})
                            </option>
                          ))}
                          <option value="others" className="font-semibold">Others (Custom service)</option>
                        </select>
                        {categories.length === 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            ⚠ If categories don't load, please refresh the page or contact support.
                          </p>
                        )}
                      </LabelInputContainer>

                      {formData.categoryid === 'others' && (
                        <LabelInputContainer>
                          <Label htmlFor="customDescription" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Service Description *
                          </Label>
                          <textarea
                            id="customDescription"
                            placeholder="Describe the service employee will provide..."
                            value={formData.customDescription || ''}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">Since this is a custom service, describe it in detail</p>
                        </LabelInputContainer>
                      )}

                      {selectedCategory && formData.categoryid && formData.categoryid !== '' && (
                        <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/40">
                          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
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

                      {(!formData.categoryid || formData.categoryid === '') && (
                        <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/40">
                          <p className="text-xs sm:text-sm text-[#0A3D62]">
                            <strong>Note:</strong> For custom services, you can set any rate. The profile will be reviewed before activation.
                          </p>
                        </div>
                      )}

                      <LabelInputContainer>
                        <Label htmlFor="payrate" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                          <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                    <div className="space-y-4 sm:space-y-5">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-[#0A3D62] mb-3 flex items-center gap-1.5">
                          <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                          Bank Information (Optional)
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          <LabelInputContainer>
                            <Label htmlFor="bankName" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                              <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                            <Label htmlFor="bankAccountNumber" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                            <Label htmlFor="bankIfscCode" className="text-[#0A3D62] font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                        <h3 className="text-sm sm:text-base font-semibold text-[#0A3D62] mb-3 flex items-center gap-1.5">
                          <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                          Profile Photo (Optional)
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {imagePreview && (
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-[#2B9EB3]/40">
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
                              <span className="text-xs sm:text-sm text-[#0A3D62] font-medium">
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
              <div className="flex gap-3 pt-4 sm:pt-6 border-t border-slate-200">
                {step !== 'personal' && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 h-10 sm:h-11 flex items-center justify-center gap-2 rounded-xl border-2 border-[#2B9EB3] text-[#2B9EB3] font-semibold hover:bg-[#2B9EB3]/5 transition-all text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                )}
                <EnhancedButton
                  type="submit"
                  disabled={loading || !isStepValid || uploadingImage}
                  loading={loading}
                  icon={step === 'optional' ? <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className={step === 'personal' ? 'flex-1' : 'flex-1'}
                >
                  {loading 
                    ? "Processing..." 
                    : step === 'optional' 
                      ? "Add Employee" 
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
        "group/btn relative flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-11 w-full rounded-xl",
        "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] font-semibold text-white text-sm",
        "shadow-lg hover:shadow-xl hover:shadow-[#2B9EB3]/25 transition-all duration-300",
        "transform hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-1.5 sm:gap-2 relative z-10">
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
