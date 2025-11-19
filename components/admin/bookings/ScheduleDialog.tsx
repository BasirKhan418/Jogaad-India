"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booking } from "./types";

interface Provider {
  _id: string;
  name: string;
  address: string;
  payrate: number;
  img?: string;
  phone?: string;
}

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
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
  }, [open, booking?._id]); 

  const fetchProviders = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      const categoryId = booking?.categoryid?._id || booking?.categoryid;
      if (!categoryId) {
        console.error("No category ID found");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/v1/adminbooking/schedule?categoryid=${categoryId}`);
      
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
      const res = await fetch("/api/v1/adminbooking/schedule/do", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingid: booking._id,
          employeeid: selectedProvider._id
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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Booking</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-sm font-medium mb-4">Select a Service Provider</h3>
          
          {loading ? (
            <div className="text-center py-8">Loading providers...</div>
          ) : providers.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">No providers found for this category.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <div 
                  key={provider._id}
                  onClick={() => setSelectedProvider(provider)}
                  className={`
                    cursor-pointer rounded-xl border p-4 transition-all
                    ${selectedProvider?._id === provider._id 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20" 
                      : "border-neutral-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-700"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    {provider.img ? (
                      <img src={provider.img} alt={provider.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <span className="text-lg font-bold text-neutral-500">{provider.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{provider.name}</h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{provider.phone}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{provider.address}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-xs font-medium text-green-700 dark:text-green-300">
                          ₹{provider.payrate}/hr
                        </span>
                      </div>
                    </div>
                    {selectedProvider?._id === provider._id && (
                      <div className="text-blue-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedProvider || submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? "Scheduling..." : "Confirm Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
