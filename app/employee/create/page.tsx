"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEmployeeSignup } from "@/utils/employee/useEmployeeSignup";
import Image from "next/image";
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

export default function EmployeeSignupPage() {
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
    submitSignup,
    nextStep,
    prevStep,
    isStepValid,
    isFormValid
  } = useEmployeeSignup();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 'optional') {
      await submitSignup();
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

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 pt-20 sm:pt-24 pb-8 sm:pb-12 relative overflow-hidden">
      {/* Background Image with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/40 to-slate-50/30 backdrop-blur-sm z-10" />
      
      {/* Gradient Orbs - hidden on mobile for better performance */}
      <div className="hidden sm:block absolute top-10 -left-32 w-80 h-80 bg-gradient-to-br from-[#2B9EB3]/25 to-[#0A3D62]/15 rounded-full blur-3xl z-10 animate-pulse"></div>
      <div className="hidden sm:block absolute bottom-10 -right-32 w-96 h-96 bg-gradient-to-tl from-[#F9A825]/25 to-[#2B9EB3]/15 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Main Card - responsive width */}
      <div className="relative z-20 mx-auto w-full max-w-2xl">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/60 shadow-2xl shadow-[#0A3D62]/10 relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-[#2B9EB3]/5 pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Logo Section - smaller on mobile */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative group">
                <Image
                  src="/logo.png"
                  alt="Jogaad India Logo"
                  width={120}
                  height={60}
                  className="h-8 sm:h-10 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
            
            {/* Header Section */}
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-2">
                Join as Service Professional
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Create your employee account in 3 simple steps
              </p>
            </div>

            {/* Step Indicator */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {steps.map((s, index) => {
                  const StepIcon = s.icon;
                  const isActive = currentStepIndex >= index;
                  const isCurrent = step === s.id;
                  
                  return (
                    <React.Fragment key={s.id}>
                      <div className="flex flex-col items-center gap-2">
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
                          "text-xs sm:text-sm font-medium text-center hidden sm:block",
                          isCurrent ? "text-[#0A3D62]" : "text-gray-500"
                        )}>
                          {s.label}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={cn(
                          "flex-1 h-0.5 mx-2 transition-all duration-300",
                          currentStepIndex > index ? "bg-[#2B9EB3]" : "bg-gray-200"
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
                <div className="space-y-4">
                  <LabelInputContainer>
                    <Label htmlFor="name" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                    />
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label htmlFor="email" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      placeholder="your.email@example.com"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-10 sm:h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                    />
                  </LabelInputContainer>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <LabelInputContainer>
                      <Label htmlFor="phone" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
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

                    <LabelInputContainer>
                      <Label htmlFor="pincode" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
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
                    <Label htmlFor="address" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
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
                    <Label htmlFor="categoryid" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4" />
                      Service Category *
                    </Label>
                    <select
                      id="categoryid"
                      value={formData.categoryid}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      required
                      className="h-10 sm:h-11 px-4 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm"
                    >
                      <option value="">Select a service category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName} ({category.categoryType})
                        </option>
                      ))}
                      <option value="others" className="font-semibold">Others (Describe your service)</option>
                    </select>
                  </LabelInputContainer>

                  {formData.categoryid === 'others' && (
                    <LabelInputContainer>
                      <Label htmlFor="customDescription" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4" />
                        Service Description *
                      </Label>
                      <textarea
                        id="customDescription"
                        placeholder="Please describe your service in detail..."
                        value={formData.customDescription || ''}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 text-sm resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Describe what service you provide since it's not in our categories</p>
                    </LabelInputContainer>
                  )}

                  {selectedCategory && formData.categoryid !== 'others' && (
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

                  {formData.categoryid === 'others' && (
                    <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#F9A825]/10 to-[#2B9EB3]/10 border border-[#2B9EB3]/40">
                      <p className="text-xs sm:text-sm text-[#0A3D62]">
                        <strong>Note:</strong> Since you selected 'Others', you can set any service rate. Our team will review your profile before activation.
                      </p>
                    </div>
                  )}

                  <LabelInputContainer>
                    <Label htmlFor="payrate" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4" />
                      Your Service Rate *
                    </Label>
                    <Input
                      id="payrate"
                      placeholder="Enter your service rate"
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
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#0A3D62] mb-3 flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Bank Information (Optional)
                    </h3>
                    <div className="space-y-4">
                      <LabelInputContainer>
                        <Label htmlFor="bankName" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
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
                        <Label htmlFor="bankAccountNumber" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
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
                        <Label htmlFor="bankIfscCode" className="text-[#0A3D62] font-semibold flex items-center gap-2 text-sm">
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
                    <h3 className="text-base sm:text-lg font-semibold text-[#0A3D62] mb-3 flex items-center gap-2">
                      <Upload className="w-5 h-5" />
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
              <div className="flex gap-3 pt-4">
                {step !== 'personal' && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 h-10 sm:h-11 flex items-center justify-center gap-2 rounded-xl border-2 border-[#2B9EB3] text-[#2B9EB3] font-semibold hover:bg-[#2B9EB3]/5 transition-all text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
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
                      ? "Create Account" 
                      : "Continue"}
                </EnhancedButton>
              </div>

              {/* Sign in link */}
              {step === 'personal' && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 sm:px-4 bg-white/60 text-gray-500 rounded-full text-xs">or</span>
                    </div>
                  </div>

                  <p className="text-center text-xs sm:text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link 
                      href="/employee/signin" 
                      className="text-[#2B9EB3] hover:text-[#0A3D62] font-semibold hover:underline transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      Sign in here
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        "group/btn relative flex items-center justify-center gap-2 h-10 sm:h-11 w-full rounded-xl",
        "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] font-semibold text-white text-sm sm:text-base",
        "shadow-lg hover:shadow-xl hover:shadow-[#2B9EB3]/25 transition-all duration-300",
        "transform hover:scale-[1.02] active:scale-[0.98]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2 relative z-10">
        {loading ? (
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
