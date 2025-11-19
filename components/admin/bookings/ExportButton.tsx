"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useBookingExport } from "@/utils/admin/useBookingExport";
import { downloadExcel, generateExcelFilename } from "@/utils/admin/excelExport";
import { toast } from "sonner";
import { Booking } from "./types";
import { ChevronDown } from "lucide-react";

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
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { exportBookings, isExportSupported } = useBookingExport();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCSVExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    setShowDropdown(false);
    try {
      await exportBookings(bookings);
      toast.success("CSV export started!", {
        description: "Your CSV file will download shortly."
      });
    } catch (error) {
      console.error("CSV export failed:", error);
      toast.error("CSV export failed", {
        description: error instanceof Error ? error.message : "Failed to export data. Please try again."
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExcelExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    setShowDropdown(false);
    try {
      const filename = generateExcelFilename("bookings");
      await downloadExcel(bookings, filename);
      toast.success("Excel export completed!", {
        description: "Your Excel file has been downloaded."
      });
    } catch (error) {
      console.error("Excel export failed:", error);
      toast.error("Excel export failed", {
        description: "Failed to generate Excel file. Please try again."
      });
    } finally {
      setIsExporting(false);
    }
  };

  const isDisabled = disabled || !bookings || bookings.length === 0 || isExporting;

  if (!isExportSupported) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        onClick={() => setShowDropdown(!showDropdown)}
        variant="outline" 
        disabled={isDisabled}
        className={`flex items-center gap-2 ${className || ""}`}
        title={isDisabled && !isExporting ? "No data to export" : isExporting ? "Exporting..." : "Export data"}
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
        {isExporting ? "Exporting..." : "Export"}
        {!isExporting && <ChevronDown className="w-4 h-4 ml-1" />}
      </Button>

      {/* Dropdown Menu */}
      {showDropdown && !isDisabled && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={handleCSVExport}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export as CSV
            </button>
            <button
              onClick={handleExcelExport}
              className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Export as Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};