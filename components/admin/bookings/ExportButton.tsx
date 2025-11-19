"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useBookingExport } from "@/utils/admin/useBookingExport";
import { toast } from "sonner";
import { Booking } from "./types";

interface ExportButtonProps {
  bookings: Booking[];
  disabled?: boolean;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  bookings, 
  disabled = false, 
  className 
}) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const { exportBookings, isExportSupported } = useBookingExport();

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      await exportBookings(bookings);
      toast.success("Export started successfully!", {
        description: "Your CSV file will download shortly."
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Failed to export data. Please try again."
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isExportSupported) {
    return null;
  }

  const isDisabled = disabled || !bookings || bookings.length === 0 || isExporting;

  return (
    <Button 
      onClick={handleExport} 
      variant="outline" 
      disabled={isDisabled}
      className={`flex items-center gap-2 ${className || ""}`}
      title={isDisabled && !isExporting ? "No data to export" : isExporting ? "Exporting..." : "Export to CSV"}
    >
      {isExporting ? (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
          />
        </svg>
      )}
      {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  );
};