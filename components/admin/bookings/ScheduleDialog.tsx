"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Provider {
  _id: string;
  name: string;
  address: string;
  payrate: number;
}

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
  onSuccess: () => void;
}

export const ScheduleDialog: React.FC<ScheduleDialogProps> = ({ open, onOpenChange, booking, onSuccess }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && booking) {
      fetchProviders();
      setSelectedProvider(null);
    }
  }, [open, booking?._id]); // Only depend on booking ID to prevent unnecessary re-fetches

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const categoryId = booking.categoryid?._id || booking.categoryid;
      if (!categoryId) {
        console.error("No category ID found");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/v1/schedule?category=${categoryId}`);
      
      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", await res.text());
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setProviders(data.data || []);
      } else {
        console.error("Failed to fetch providers:", data.message);
      }
    } catch (error) {
      console.error("Error fetching providers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedProvider || !booking) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking._id,
          employeeId: selectedProvider._id
        })
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
        onOpenChange(false);
      } else {
        alert(data.message || "Failed to schedule");
      }
    } catch (error) {
      console.error("Error scheduling", error);
      alert("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogClose onClose={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Schedule Booking</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground">
            Select a service provider for booking #{booking?.orderid}
          </div>

          {loading ? (
            <div className="flex justify-center p-8">Loading providers...</div>
          ) : providers.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No providers found for this category.</div>
          ) : (
            <div className="grid gap-3 max-h-[50vh] overflow-y-auto pr-2">
              {providers.map((provider) => (
                <div
                  key={provider._id}
                  onClick={() => setSelectedProvider(provider)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    flex justify-between items-center
                    ${selectedProvider?._id === provider._id 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "hover:bg-muted/50 border-border"}
                  `}
                >
                  <div>
                    <h4 className="font-medium">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground">{provider.address || "No address"}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">
                      ₹{provider.payrate || 0}/hr
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedProvider || submitting}
            >
              {submitting ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
