"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Schedule } from "./types";
import { Button } from "@/components/ui/button";

interface ScheduleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: Schedule | null;
  onReassign: () => void;
}

export const ScheduleDetailsModal: React.FC<ScheduleDetailsModalProps> = ({ 
  open, 
  onOpenChange, 
  schedule,
  onReassign 
}) => {
  if (!schedule) return null;

  const { employeeid, createdAt, isAccepted } = schedule;
  const timeAgo = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / 60000);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Details</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          {/* Employee Profile */}
          <div className="flex flex-col items-center gap-3 text-center">
            {employeeid.img ? (
              <img 
                src={employeeid.img} 
                alt={employeeid.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-neutral-100 dark:border-neutral-800" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {employeeid.name.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {employeeid.name}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {employeeid.email}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-500 uppercase">Phone</span>
              <span className="text-sm font-medium">{employeeid.phone || "N/A"}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-500 uppercase">Status</span>
              <span className={`text-sm font-medium ${isAccepted ? 'text-green-600' : 'text-yellow-600'}`}>
                {isAccepted ? 'Accepted' : 'Pending Acceptance'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-500 uppercase">Scheduled At</span>
              <span className="text-sm font-medium">
                {new Date(createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-500 uppercase">Time Elapsed</span>
              <span className="text-sm font-medium">{timeAgo} mins ago</span>
            </div>
          </div>

          {/* Actions */}
          {!isAccepted && (
            <div className="flex justify-end pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false);
                  onReassign();
                }}
              >
                Reassign Employee
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
