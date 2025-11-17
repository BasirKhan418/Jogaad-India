"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconLogout } from "@tabler/icons-react";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useUserNavigation } from "@/utils/user/useUserNavigation";
import { 
  useUserData, 
  useUserLogout, 
  useUserSidebar 
} from "@/utils/user/useUserHooks";
import { MobileBottomNav } from "@/components/user/MobileBottomNav";
import { CategoryCard } from "@/components/user/CategoryCard";
import { BookingModal } from "@/components/user/BookingModal";
import { Loader2 } from "lucide-react";

interface Category {
  _id: string;
  categoryName: string;
  categoryType: string;
  categoryDescription: string;
  categoryUnit: string;
  recommendationPrice: number;
  categoryMinPrice: number;
  categoryMaxPrice: number;
  categoryStatus: boolean;
  img: string;
}

/**
 * User New Booking Page
 * Displays all categories and allows users to book services
 * Follows SRP - Each component has a single responsibility
 */
export default function NewBookingPage() {
  const router = useRouter();
  const { userData, loading: userLoading, error } = useUserData();
  const { handleLogout } = useUserLogout();
  const { open, setOpen } = useUserSidebar();
  const { links } = useUserNavigation();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.categoryDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.categoryType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * Fetch all categories from API
   * Follows DRY principle - Single function for fetching
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/category", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success && data.categories) {
        // Filter only active categories
        const activeCategories = data.categories.filter(
          (cat: Category) => cat.categoryStatus === true
        );
        setCategories(activeCategories);
      } else {
        toast.error(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle book now click
   * Validates address before opening modal
   */
  const handleBookNow = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  /**
   * Handle successful booking
   */
  const handleBookingSuccess = () => {
    setShowModal(false);
    setSelectedCategory(null);
    toast.success("Booking created successfully!");
    // Redirect to bookings page after a short delay
    setTimeout(() => {
      router.push("/user/bookings");
    }, 1500);
  };

  if (userLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
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
                        <UserAvatar userData={userData} />
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
      <div className="flex-1 overflow-auto bg-white">
        <div className="p-3 md:p-8 pb-24 md:pb-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-1 md:mb-2">
                  Book a Service
                </h1>
                <p className="text-slate-600 text-xs md:text-base">
                  Choose from our wide range of professional services
                </p>
              </div>
            </div>
            
            {/* Stats Banner */}
            <div className="mt-3 md:mt-4 bg-gradient-to-r from-[#2B9EB3]/10 to-[#0A3D62]/10 border border-[#2B9EB3]/20 rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-[#0A3D62]">{categories.length} Active Services</p>
                    <p className="text-xs text-slate-600">Available for booking now</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 md:mb-6"
          >
            <div className="relative">
              <svg
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm md:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2B9EB3] focus:ring-2 focus:ring-[#2B9EB3]/20 focus:bg-white transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-slate-400 hover:text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-xs md:text-sm text-slate-600 flex items-center gap-1"
              >
                <svg className="w-4 h-4 text-[#2B9EB3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Found <span className="font-semibold">{filteredCategories.length}</span> service{filteredCategories.length !== 1 ? 's' : ''}
              </motion.p>
            )}
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-[#2B9EB3] mx-auto mb-4" />
                <p className="text-[#0A3D62] font-semibold text-sm md:text-base">Loading services...</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <EmptyState />
          ) : filteredCategories.length === 0 ? (
            <NoSearchResults searchQuery={searchQuery} onClear={() => setSearchQuery("")} />
          ) : (
            <>
              <div className="mb-3 md:mb-4 flex items-center justify-between">
                <h2 className="text-base md:text-lg font-bold text-[#0A3D62]">
                  Available Services
                </h2>
                <span className="text-xs md:text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {filteredCategories.length} services
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CategoryCard
                      category={category}
                      onBookNow={() => handleBookNow(category)}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        links={links} 
        currentPath="/user/bookings/new"
      />

      {/* Booking Modal */}
      {showModal && selectedCategory && (
        <BookingModal
          category={selectedCategory}
          userData={userData}
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
          }}
          onSuccess={handleBookingSuccess}
          onUserDataUpdate={() => {}}
        />
      )}
    </div>
  );
}

/**
 * Loading Screen Component
 * Follows SRP - Single responsibility of showing loading state
 */
const LoadingScreen = () => (
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

/**
 * Error Screen Component - Follows SRP
 */
const ErrorScreen = ({ error }: { error: string }) => {
  const router = useRouter();
  
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
          onClick={() => router.push('/signin')}
          className="bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

/**
 * User Avatar Component - Follows SRP
 */
const UserAvatar = ({ userData }: { userData: any }) => (
  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] flex items-center justify-center overflow-hidden relative">
    {userData.img && userData.img.trim() !== "" ? (
      <img
        src={userData.img}
        alt={userData.name}
        className="h-7 w-7 rounded-full object-cover absolute inset-0"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    ) : null}
    <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
      {getUserInitials(userData.name || userData.email || "U")}
    </span>
  </div>
);

/**
 * Empty State Component
 * Follows SRP - Single responsibility of showing empty state
 */
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 md:p-12 text-center border-2 border-dashed border-slate-300"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] rounded-full mb-4">
      <svg
        className="w-8 h-8 md:w-10 md:h-10 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
    <h2 className="text-xl md:text-2xl font-bold text-[#0A3D62] mb-2">
      No Services Available
    </h2>
    <p className="text-slate-600 text-sm md:text-base max-w-md mx-auto">
      We're currently updating our services. Please check back later for new offerings.
    </p>
  </motion.div>
);

/**
 * No Search Results Component
 * Follows SRP - Single responsibility of showing no search results
 */
const NoSearchResults = ({ searchQuery, onClear }: { searchQuery: string; onClear: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 md:p-12 text-center border-2 border-dashed border-slate-300"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-slate-200 rounded-full mb-4">
      <svg
        className="w-8 h-8 md:w-10 md:h-10 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <h2 className="text-xl md:text-2xl font-bold text-[#0A3D62] mb-2">
      No Services Found
    </h2>
    <p className="text-slate-600 text-sm md:text-base mb-6 max-w-md mx-auto">
      No services match <span className="font-semibold">"{searchQuery}"</span>. Try searching with different keywords.
    </p>
    <button
      onClick={onClear}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 text-sm md:text-base hover:-translate-y-1"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      Clear Search
    </button>
  </motion.div>
);

/* Logo Components - Follows DRY */
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
