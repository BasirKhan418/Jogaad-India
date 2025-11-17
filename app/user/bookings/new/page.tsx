"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

interface UserData {
  _id: string;
  name: string;
  email: string;
  address?: string;
  pincode?: string;
  phone: string;
  img?: string;
}

/**
 * User New Booking Page
 * Displays all categories and allows users to book services
 * Follows SRP - Each component has a single responsibility
 */
export default function NewBookingPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    fetchUserData();
  }, []);

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
   * Fetch user data to check address
   */
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/v1/user", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success && data.data) {
        setUserData(data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent mb-2">
            Book a Service
          </h1>
          <p className="text-slate-600">
            Choose from our wide range of services
          </p>
        </motion.div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard
                  category={category}
                  onBookNow={() => handleBookNow(category)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

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
          onUserDataUpdate={setUserData}
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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-[#2B9EB3] mx-auto mb-4" />
      <p className="text-[#0A3D62] font-semibold">Loading services...</p>
    </div>
  </div>
);

/**
 * Empty State Component
 * Follows SRP - Single responsibility of showing empty state
 */
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16"
  >
    <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-12 h-12 text-slate-400"
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
    <h2 className="text-2xl font-bold text-[#0A3D62] mb-2">
      No Services Available
    </h2>
    <p className="text-slate-600">
      Check back later for available services.
    </p>
  </motion.div>
);
