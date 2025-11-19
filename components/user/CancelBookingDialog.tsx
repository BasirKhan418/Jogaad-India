"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}

export const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  loading 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>Cancel Booking</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to cancel this booking? This action cannot be undone.
            If you have already paid, the refund process will be initiated automatically.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={loading}
          >
            Keep Booking
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Yes, Cancel Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
