import { useCallback } from "react";
import { generateCSV, downloadCSV, generateExportFilename, BOOKING_CSV_FIELDS } from "@/utils/admin/csvExport";
import { Booking } from "@/components/admin/bookings/types";

interface UseBookingExportReturn {
  exportBookings: (bookings: Booking[]) => Promise<void>;
  isExportSupported: boolean;
}



export function useBookingExport(): UseBookingExportReturn {
  const isExportSupported = typeof window !== "undefined" && 
    document.createElement("a").download !== undefined;

  const exportBookings = useCallback(async (bookings: Booking[]) => {
    if (!isExportSupported) {
      console.warn("Export not supported in this browser");
      throw new Error("Export not supported in this browser");
    }

    if (!bookings || bookings.length === 0) {
      console.warn("No bookings to export");
      throw new Error("No bookings available to export");
    }

    try {
      const csvContent = generateCSV(bookings, BOOKING_CSV_FIELDS);
      const filename = generateExportFilename("bookings");
      
      // Add a small delay for better UX (allows loading state to show)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error("Export failed:", error);
      throw new Error("Failed to export bookings data");
    }
  }, [isExportSupported]);

  return {
    exportBookings,
    isExportSupported,
  };
}