"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Shield, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  img?: string;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DeleteAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: Admin | null;
  onSuccess: () => void;
}

export const DeleteAdminModal: React.FC<DeleteAdminModalProps> = ({
  open,
  onOpenChange,
  admin,
  onSuccess
}) => {
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!admin) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/v1/admin/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: admin._id }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Admin deleted successfully", {
          description: `${admin.name} has been removed from the system.`
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error("Failed to delete admin", {
          description: result.message || "An error occurred while deleting the admin."
        });
      }
    } catch (error) {
      console.error("Delete admin error:", error);
      toast.error("Network error", {
        description: "Failed to delete admin. Please try again."
      });
    } finally {
      setDeleting(false);
    }
  };

  if (!admin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Delete Administrator
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
              ⚠️ Warning: This action cannot be undone
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              You are about to permanently delete this administrator account. All associated data will be removed.
            </p>
          </div>

          {/* Admin Details */}
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start gap-3 mb-3">
              {admin.img ? (
                <img 
                  src={admin.img} 
                  alt={admin.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center border-2 border-neutral-200 dark:border-neutral-600">
                  <span className="text-white font-bold text-sm">
                    {admin.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-neutral-800 dark:text-neutral-100">
                    {admin.name}
                  </h4>
                  {admin.isSuperAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                      <Shield className="w-3 h-3" />
                      Super Admin
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Mail className="w-3 h-3" />
                    <span>{admin.email}</span>
                  </div>
                  {admin.phone && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Phone className="w-3 h-3" />
                      <span>{admin.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {admin.isSuperAdmin && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                ⚠️ Super Admin Account
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                This is a super administrator account with elevated privileges.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Admin"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};