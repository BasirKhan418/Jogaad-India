"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X, MapPin, Loader2, AlertCircle } from "lucide-react";
import { validateAddress } from "@/utils/user/addressValidator";

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

interface BookingModalProps {
  category: Category;
  userData: UserData | null;
  onClose: () => void;
  onSuccess: () => void;
  onUserDataUpdate: (userData: UserData) => void;
}

/**
 * BookingModal Component
 * Handles address validation and booking creation
 * Follows SRP - Manages modal state and booking flow
 * Follows DRY - Reusable validation and API calls
 */
export const BookingModal: React.FC<BookingModalProps> = ({
  category,
  userData,
  onClose,
  onSuccess,
  onUserDataUpdate,
}) => {
  const [step, setStep] = useState<"validate" | "booking">("validate");
  const [loading, setLoading] = useState(false);
  const [addressData, setAddressData] = useState({
    address: userData?.address || "",
    pincode: userData?.pincode || "",
  });
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  // Check if address is already present
  const hasAddress = userData?.address && userData?.pincode;

  /**
   * Handle address update
   * Follows DRY - Single function for updating address
   */
  const handleAddressUpdate = async () => {
    // Validate address
    const validation = validateAddress(
      addressData.address,
      addressData.pincode
    );

    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/v1/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: userData?.name,
          phone: userData?.phone,
          address: addressData.address,
          pincode: addressData.pincode,
          img: userData?.img || "",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update address");
      }

      // Update parent component's user data
      onUserDataUpdate(data.data);
      toast.success("Address updated successfully!");
      setStep("booking");
    } catch (error: any) {
      console.error("Error updating address:", error);
      toast.error(error.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle booking creation
   * Follows DRY - Single function for creating booking
   */
  const handleCreateBooking = async () => {
    try {
      setLoading(true);

      // Validate booking date
      const selectedDate = new Date(bookingDate);
      const now = new Date();

      if (selectedDate <= now) {
        toast.error("Please select a future date and time");
        return;
      }

      const response = await fetch("/api/v1/user/createbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          categoryid: category._id,
          bookingDate: bookingDate,
          status: "pending",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create booking");
      }

      // Initialize Razorpay payment
      if (data.order && data.booking) {
        await initializeRazorpay(data.order, data.booking);
      } else {
        throw new Error("Invalid booking data received");
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Failed to create booking");
      setLoading(false);
    }
  };

  /**
   * Initialize Razorpay payment
   * Follows SRP - Handles payment initialization only
   */
  const initializeRazorpay = async (order: any, booking: any) => {
    // Check if Razorpay is loaded
    if (!(window as any).Razorpay) {
      toast.error("Payment service not available. Please refresh the page.");
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: order.amount,
      currency: order.currency,
      name: "Jogaad India",
      description: `Booking for ${category.categoryName}`,
      order_id: order.id,
      handler: function (response: any) {
        toast.success("Payment successful! Booking confirmed.");
        setLoading(false);
        onSuccess();
      },
      prefill: {
        name: userData?.name || "",
        email: userData?.email || "",
        contact: userData?.phone || "",
      },
      theme: {
        color: "#2B9EB3",
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          toast.info("Payment cancelled");
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  /**
   * Handle next step
   * Validates and moves to next step or creates booking
   */
  const handleNext = () => {
    if (hasAddress) {
      // If address already exists, directly create booking
      handleCreateBooking();
    } else if (step === "validate") {
      // Update address first
      handleAddressUpdate();
    } else {
      // Create booking
      handleCreateBooking();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">Book Service</h2>
                <p className="text-white/90 text-sm">{category.categoryName}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Address Validation Step */}
            {!hasAddress && step === "validate" && (
              <AddressForm
                addressData={addressData}
                setAddressData={setAddressData}
                loading={loading}
              />
            )}

            {/* Booking Step */}
            {(hasAddress || step === "booking") && (
              <BookingForm
                bookingDate={bookingDate}
                setBookingDate={setBookingDate}
                category={category}
                userData={userData}
                loading={loading}
              />
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] hover:from-[#0A3D62] hover:to-[#2B9EB3]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : hasAddress || step === "booking" ? (
                  "Proceed to Payment"
                ) : (
                  "Update Address"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/**
 * AddressForm Component
 * Follows SRP - Handles address input only
 */
const AddressForm: React.FC<{
  addressData: { address: string; pincode: string };
  setAddressData: React.Dispatch<
    React.SetStateAction<{ address: string; pincode: string }>
  >;
  loading: boolean;
}> = ({ addressData, setAddressData, loading }) => (
  <>
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-yellow-800 mb-1">
          Address Required
        </h3>
        <p className="text-sm text-yellow-700">
          Please provide your address to proceed with the booking. This
          information is required for service delivery.
        </p>
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <Label htmlFor="address" className="text-[#0A3D62] font-semibold">
          Complete Address *
        </Label>
        <Input
          id="address"
          type="text"
          placeholder="Enter your complete address"
          value={addressData.address}
          onChange={(e) =>
            setAddressData({ ...addressData, address: e.target.value })
          }
          className="mt-1"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="pincode" className="text-[#0A3D62] font-semibold">
          Pincode *
        </Label>
        <Input
          id="pincode"
          type="text"
          placeholder="Enter 6-digit pincode"
          value={addressData.pincode}
          onChange={(e) =>
            setAddressData({ ...addressData, pincode: e.target.value })
          }
          maxLength={6}
          className="mt-1"
          disabled={loading}
        />
      </div>
    </div>
  </>
);

/**
 * BookingForm Component
 * Follows SRP - Handles booking date selection only
 */
const BookingForm: React.FC<{
  bookingDate: string;
  setBookingDate: React.Dispatch<React.SetStateAction<string>>;
  category: Category;
  userData: UserData | null;
  loading: boolean;
}> = ({ bookingDate, setBookingDate, category, userData, loading }) => (
  <>
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
      <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-green-800 mb-1">Address Confirmed</h3>
        <p className="text-sm text-green-700">
          {userData?.address}, {userData?.pincode}
        </p>
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <Label htmlFor="bookingDate" className="text-[#0A3D62] font-semibold">
          Select Booking Date & Time *
        </Label>
        <Input
          id="bookingDate"
          type="datetime-local"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          className="mt-1"
          disabled={loading}
        />
      </div>

      {/* Service Details */}
      <div className="bg-slate-50 rounded-lg p-4">
        <h3 className="font-semibold text-[#0A3D62] mb-3">Service Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Service:</span>
            <span className="font-semibold text-[#0A3D62]">
              {category.categoryName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Type:</span>
            <span className="font-semibold text-[#0A3D62]">
              {category.categoryType}
            </span>
          </div>
          {category.recommendationPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600">Estimated Price:</span>
              <span className="font-semibold text-[#0A3D62]">
                ₹{category.recommendationPrice}
                {category.categoryUnit && ` / ${category.categoryUnit}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);
