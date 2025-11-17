"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlight";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLogOut, FiHome, FiCheckCircle, FiAlertCircle, FiEdit3, FiSave, FiX, FiCamera, FiUpload, FiLock } from "react-icons/fi";
import { logoutUser } from "@/actions/logout";
import { toast } from "sonner";
import { useProfile } from "@/utils/profile";

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  img?: string;
  isImposedFine: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    loading: profileLoading,
    uploading,
    error: profileError,
    success: profileSuccess,
    isEditing,
    profileData,
    validationErrors,
    setIsEditing,
    setProfileData,
    handleInputChange,
    updateUserProfile,
    uploadImage,
    validateImage,
    validateProfile,
    resetProfileData,
    cancelEdit,
    clearMessages
  } = useProfile();

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/v1/getdata", {
          signal: abortController.signal
        });
        const data = await response.json();

        if (!data.success) {
          router.push("/signin");
          return;
        }

        const userData = data.data;
        setUser(userData);
        // Reset profile data inline to avoid dependency issues
        setProfileData({
          name: userData.name,
          phone: userData.phone || '',
          address: userData.address || '',
          img: userData.img
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Request was cancelled, ignore the error
        }
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    return () => {
      abortController.abort('Component unmounted');
    };
  }, [router]); // Remove resetProfileData to prevent infinite re-renders

  useEffect(() => {
    if (user && profileSuccess) {
      // Refresh user data after successful profile update
      setUser(prev => prev ? {
        ...prev,
        name: profileData.name || prev.name,
        phone: profileData.phone || prev.phone,
        address: profileData.address || prev.address,
        img: profileData.img || prev.img
      } : null);
    }
  }, [profileSuccess, profileData]); // Remove user to prevent infinite loop

  const handleLogout = async () => {
    logoutUser().then(() => {
      router.push("/signin");
      toast.success("Logged out successfully!");
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate image first
    const validationError = validateImage(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      // Upload image
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        // Update the profile data with new image
        setProfileData({ ...profileData, img: imageUrl });
        
        // Update user profile with the new image URL
        const success = await updateUserProfile({ ...user, img: imageUrl });
        
        if (success) {
          // Update user state with new image
          setUser(prev => prev ? { ...prev, img: imageUrl } : null);
          toast.success("Profile picture updated successfully!");
        }
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    // Validate the profile data
    const errors = validateProfile(profileData);
    
    // If there are validation errors, don't proceed
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    const success = await updateUserProfile(user);
    if (success) {
      // Update local user state with new data
      setUser(prev => prev ? {
        ...prev,
        name: profileData.name || prev.name,
        phone: profileData.phone ?? prev.phone,
        address: profileData.address ?? prev.address
      } : null);
      
      // Exit editing mode after successful save
      setIsEditing(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (user) cancelEdit(user);
    } else {
      setIsEditing(true);
      clearMessages();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xs z-10" />
        
        <div className="text-center relative z-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#2B9EB3] border-r-[#F9A825] border-b-[#0A3D62] border-l-transparent mx-auto"></div>
          <p className="mt-6 text-[#0A3D62] font-medium text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xs z-10" />
        
        <div className="text-center relative z-20 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/40">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold mb-4">{error || "User not found"}</p>
          <Link href="/signin" className="inline-block px-6 py-3 rounded-md bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white hover:shadow-lg transition-all font-medium">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-6 sm:py-12 px-2 sm:px-4">.
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xs z-10" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-10 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(10, 61, 98) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Spotlight Effects */}
      <div className="hidden lg:block">
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(249, 168, 37, 0.10) 0, rgba(249, 168, 37, 0.05) 50%, rgba(249, 168, 37, 0) 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(43, 158, 179, 0.08) 0, rgba(43, 158, 179, 0.03) 80%, transparent 100%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(249, 168, 37, 0.07) 0, rgba(249, 168, 37, 0.03) 80%, transparent 100%)"
          translateY={-300}
          width={600}
          height={1400}
          duration={8}
          xOffset={120}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#2B9EB3]/30 to-[#0A3D62]/20 rounded-full blur-3xl z-10 animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-[#F9A825]/30 to-[#2B9EB3]/20 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-[#0A3D62]/20 to-[#F9A825]/20 rounded-full blur-3xl z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-4xl w-full mx-auto relative z-20 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-lg relative border border-white/50 w-full h-auto rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-shadow duration-500">
          {/* Header Section with Avatar */}
          <div className="w-full mb-8">
            <div className="flex flex-col items-center text-center">
                {/* Large Avatar with Upload */}
                <div className="relative mb-6 group">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#2B9EB3] via-[#F9A825] to-[#0A3D62] p-1 shadow-xl">
                    <div className="h-full w-full rounded-full bg-white/95 flex items-center justify-center overflow-hidden">
                      {user.img ? (
                        <img 
                          src={user.img} 
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <span 
                        className={`text-5xl font-bold bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] bg-clip-text text-transparent ${user.img ? 'hidden' : ''}`}
                      >
                        {getInitials(user.name)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Upload Button Overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-black/60 to-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50 backdrop-blur-sm border-2 border-white/20"
                    title="Upload profile picture (JPEG, PNG, WebP - Max 5MB)"
                    aria-label="Upload or change profile picture"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2 transform scale-110">
                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-white/30 border-t-white" />
                        <span className="text-xs text-white font-semibold tracking-wide">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 transform group-hover:scale-110 transition-transform duration-300">
                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                          <FiCamera className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs text-white font-semibold tracking-wide">Change Photo</span>
                      </div>
                    )}
                  </button>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    {user.isImposedFine ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white shadow-lg">
                        <FiAlertCircle className="w-3 h-3" />
                        Fine Imposed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg">
                        <FiCheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Name and Title */}
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] bg-clip-text text-transparent mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 font-medium mb-1">{user.email}</p>
                <p className="text-xs text-gray-500">Hover over avatar to change profile picture</p>
                
                {/* Edit Button */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleEditToggle}
                    disabled={profileLoading || uploading}
                    className={`group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isEditing 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        : 'bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] hover:from-[#0A3D62] hover:to-[#2B9EB3] text-white'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <FiX className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Cancel Changes
                      </>
                    ) : (
                      <>
                        <FiEdit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        Edit Profile
                      </>
                    )}
                  </button>
                  
                  {isEditing && (
                    <button
                      onClick={handleSaveProfile}
                      disabled={profileLoading || uploading}
                      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {profileLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          Save Changes
                        </>
                      )}
                    </button>
                  )}
                </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {(profileError || profileSuccess) && (
            <div className="w-full mb-6">
              {profileError && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/80 backdrop-blur-sm border-2 border-red-200 text-red-800 shadow-lg">
                  <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="font-medium">{profileError}</p>
                </div>
              )}
              {profileSuccess && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50/80 backdrop-blur-sm border-2 border-green-200 text-green-800 shadow-lg">
                  <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="font-medium">{profileSuccess}</p>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

          {/* Profile Information Grid */}
          <div className="w-full mb-8">
            <h2 className="text-2xl font-bold text-[#0A3D62] mb-6 text-center">
              Profile Information
            </h2>
            
            <div className="space-y-6">
              {/* Full Name */}
              <div className="group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-[#2B9EB3] to-[#0A3D62] text-white shadow-lg">
                    <FiUser className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor="profile-name" className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Full Name
                    </label>
                    {isEditing ? (
                      <div className="mt-2">
                        <input
                          id="profile-name"
                          type="text"
                          name="name"
                          value={profileData.name || ''}
                          onChange={handleInputChange}
                          aria-describedby={validationErrors.name ? "name-error" : undefined}
                          aria-invalid={validationErrors.name ? "true" : "false"}
                          className={`w-full px-4 py-3 text-lg font-semibold text-[#0A3D62] bg-white/70 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm ${
                            validationErrors.name 
                              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                              : 'border-gray-200 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10'
                          }`}
                          placeholder="Enter your full name"
                          required
                        />
                        {validationErrors.name && (
                          <p id="name-error" role="alert" className="text-sm text-red-500 mt-2 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                            {validationErrors.name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-lg font-bold text-[#0A3D62]">
                        {user.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-[#F9A825] to-[#2B9EB3] text-white shadow-lg">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Email Address
                    </label>
                    <p className="mt-2 text-lg font-bold text-[#0A3D62] break-words">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <FiLock className="inline w-3 h-3 mr-1" />
                      Email cannot be changed
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-[#0A3D62] to-[#F9A825] text-white shadow-lg">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor="profile-phone" className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <div className="mt-2">
                        <input
                          id="profile-phone"
                          type="tel"
                          name="phone"
                          value={profileData.phone || ''}
                          onChange={handleInputChange}
                          aria-describedby={validationErrors.phone ? "phone-error" : undefined}
                          aria-invalid={validationErrors.phone ? "true" : "false"}
                          className={`w-full px-4 py-3 text-lg font-semibold text-[#0A3D62] bg-white/70 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 shadow-sm ${
                            validationErrors.phone 
                              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                              : 'border-gray-200 focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10'
                          }`}
                          placeholder="+91 1234567890"
                        />
                        {validationErrors.phone && (
                          <p id="phone-error" role="alert" className="text-sm text-red-500 mt-2 flex items-center gap-1">
                            <FiAlertCircle className="w-4 h-4" aria-hidden="true" />
                            {validationErrors.phone}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-lg font-bold text-[#0A3D62]">
                        {user.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-[#2B9EB3] to-[#F9A825] text-white shadow-lg">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor="profile-address" className="block text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Address
                    </label>
                    {isEditing ? (
                      <div className="mt-2">
                        <textarea
                          id="profile-address"
                          name="address"
                          value={profileData.address || ''}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 text-lg font-semibold text-[#0A3D62] bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2B9EB3] focus:ring-4 focus:ring-[#2B9EB3]/10 transition-all duration-300 shadow-sm resize-none"
                          placeholder="Enter your address"
                          aria-label="Address (optional)"
                        />
                      </div>
                    ) : (
                      <p className="mt-2 text-lg font-bold text-[#0A3D62]">
                        {user.address || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full border-t border-gray-200 pt-8 mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
              >
                <FiHome className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Go to Home</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <button
                onClick={handleLogout}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl border-2 border-red-500 bg-white/50 backdrop-blur-sm text-red-600 font-semibold shadow-lg hover:bg-red-50 hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
              >
                <FiLogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
