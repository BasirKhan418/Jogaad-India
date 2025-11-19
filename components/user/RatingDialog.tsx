"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  onSuccess: () => void;
}

export const RatingDialog: React.FC<RatingDialogProps> = ({ open, onOpenChange, bookingId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setRating(0);
      setFeedback("");
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/user/addreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bookingid: bookingId,
          rating,
          review: feedback
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        toast.success("Thank you for your feedback!");
        setRating(0);
        setFeedback("");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing while submitting
    if (!submitting) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`} 
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
