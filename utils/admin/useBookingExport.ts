import { useCallback } from "react";
import { generateCSV, downloadCSV, generateExportFilename, BOOKING_CSV_FIELDS } from "@/utils/admin/csvExport";
import { downloadExcel, generateExcelFilename } from "@/utils/admin/excelExport";
import { Booking } from "@/components/admin/bookings/types";

interface UseBookingExportReturn {
  exportBookings: (bookings: Booking[]) => Promise<void>;
  exportExcel: (bookings: Booking[]) => Promise<void>;
  isExportSupported: boolean;
}



export function useBookingExport(): UseBookingExportReturn {
  const isExportSupported = typeof window !== "undefined" && 
    (typeof document !== "undefined" && 
     (document.createElement("a").download !== undefined || 
      (window.navigator && (window.navigator as any).msSaveBlob) ||
      window.open));

  const exportBookings = useCallback(async (bookings: Booking[]) => {
    if (!isExportSupported) {
      console.warn("Export not supported in this browser");
      throw new Error("Export is not supported in this browser environment");
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
      // Re-throw with more user-friendly message
      throw error instanceof Error ? error : new Error("Failed to export bookings data");
    }
  }, [isExportSupported]);

  const exportExcel = useCallback(async (bookings: Booking[]) => {
    if (!isExportSupported) {
      console.warn("Excel export not supported in this browser");
      throw new Error("Excel export is not supported in this browser environment");
    }

    if (!bookings || bookings.length === 0) {
      console.warn("No bookings to export to Excel");
      throw new Error("No bookings available to export");
    }

    try {
      const filename = generateExcelFilename("bookings");
      
      // Add a small delay for better UX (allows loading state to show)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await downloadExcel(bookings, filename);
    } catch (error) {
      console.error("Excel export failed:", error);
      throw error instanceof Error ? error : new Error("Failed to export bookings to Excel");
    }
  }, [isExportSupported]);

  return {
    exportBookings,
    exportExcel,
    isExportSupported,
  };
}