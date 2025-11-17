"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconLogout,
  IconUserPlus,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconEdit,
  IconTrash,
  IconEye,
  IconX,
  IconCheck
} from "@tabler/icons-react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Target,
  Calendar
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAdminNavigation } from "@/utils/admin/useAdminNavigation";
import { useAdminData, useAdminLogout, useAdminSidebar } from "@/utils/admin/useAdminHooks";
import { useFieldExecutiveCreation } from "@/utils/fieldexecutive/useFieldExecutiveCreation";
import { useFieldExecutiveUpdate } from "@/utils/fieldexecutive/useFieldExecutiveUpdate";
import { useFieldExecutiveData, FieldExecutive } from "@/utils/fieldexecutive/useFieldExecutiveData";
import { getUserInitials } from "@/utils/auth";
import { FieldExecAnalyticsModal } from "@/components/admin/FieldExecAnalyticsModal";
import Image from "next/image";

export default function FieldExecutivesPage() {
  const router = useRouter();
  const { adminData, loading, error } = useAdminData();
  const { handleLogout } = useAdminLogout();
  const { open, setOpen } = useAdminSidebar();
  const { links, logoutLink } = useAdminNavigation();

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
        <div className="relative z-20 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#0A3D62] font-semibold">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/40 backdrop-blur-sm z-10" />
        <div className="relative z-20 text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0A3D62] mb-2">Access Error</h2>
          <p className="text-[#0A3D62]/70 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/admin/signin')}
            className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden md:flex-row", "h-screen")}>
      <Toaster position="top-right" richColors />
      
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          
          {/* User Section */}
          <div>
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              {adminData && (
                <SidebarLink
                  link={{
                    label: adminData.name || adminData.email,
                    href: "/admin/profile",
                    icon: (
                      <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] flex items-center justify-center overflow-hidden relative">
                        {adminData.img && adminData.img.trim() !== "" ? (
                          <img
                            src={adminData.img}
                            alt={adminData.name}
                            className="h-7 w-7 rounded-full object-cover absolute inset-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className="text-white font-bold text-xs leading-none select-none" style={{ fontSize: '10px', color: 'white' }}>
                          {getUserInitials(adminData.name || adminData.email || "AD")}
                        </span>
                      </div>
                    ),
                  }}
                />
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full py-2 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors mt-2"
              >
                <IconLogout className="h-5 w-5 text-neutral-700 dark:text-neutral-200 shrink-0" />
                <motion.span
                  animate={{
                    display: open ? "inline-block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="text-sm text-neutral-700 dark:text-neutral-200"
                >
                  Logout
                </motion.span>
              </button>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      
      <FieldExecutivesContent adminData={adminData} />
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India Logo" 
        className="h-8 w-auto"
      />
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 py-1 relative z-20"
    >
      <img 
        src="/logo.png" 
        alt="Jogaad India" 
        className="h-8 w-8 object-contain"
      />
    </a>
  );
};

// Field Executives Content Component
const FieldExecutivesContent = ({ adminData }: { adminData: any }) => {
  const router = useRouter();
  const { fieldExecutives, stats, loading: fieldExecLoading, error: fieldExecError, refetch, handleDelete, handleToggleStatus, deleting, toggling } = useFieldExecutiveData();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [viewFieldExecutive, setViewFieldExecutive] = React.useState<FieldExecutive | null>(null);
  const [editFieldExecutive, setEditFieldExecutive] = React.useState<FieldExecutive | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [analyticsFieldExec, setAnalyticsFieldExec] = React.useState<FieldExecutive | null>(null);

  const handleCreateSuccess = () => {
    refetch();
    setShowCreateModal(false);
  };

  const handleUpdateSuccess = () => {
    refetch();
    setEditFieldExecutive(null);
  };

  const confirmDelete = async (id: string) => {
    const success = await handleDelete(id);
    if (success) {
      setDeleteConfirm(null);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    await handleToggleStatus(id, currentStatus);
  };

  if (fieldExecLoading) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-300 dark:border-neutral-600 mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading field executives...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="p-2 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 dark:hover:from-neutral-700 dark:hover:to-neutral-600 border border-neutral-200 dark:border-neutral-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <IconArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                  Field Executives Management
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Manage your field executive team and track their performance
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              <IconUserPlus className="h-5 w-5" />
              Add Field Executive
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Field Executives" 
            value={fieldExecLoading ? "..." : stats.total.toString()} 
            icon={<IconUsers className="h-8 w-8 text-blue-500" />}
            gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            border="border-blue-200 dark:border-blue-700"
            subtitle={fieldExecLoading ? "Loading..." : `${stats.total} total field executives`}
          />
          <StatsCard 
            title="Active" 
            value={fieldExecLoading ? "..." : stats.active.toString()} 
            icon={<IconUserCheck className="h-8 w-8 text-green-500" />}
            gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            border="border-green-200 dark:border-green-700"
            subtitle={fieldExecLoading ? "Loading..." : `${stats.active} active`}
          />
          <StatsCard 
            title="Inactive" 
            value={fieldExecLoading ? "..." : stats.inactive.toString()} 
            icon={<IconUserX className="h-8 w-8 text-orange-500" />}
            gradient="from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
            border="border-orange-200 dark:border-orange-700"
            subtitle={fieldExecLoading ? "Loading..." : `${stats.inactive} inactive`}
          />
        </div>

        {/* Field Executives List */}
        <div className="flex-1 overflow-y-auto">
          {fieldExecError ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium dark:text-red-400">{fieldExecError}</p>
              <button
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : fieldExecutives.length === 0 ? (
            <div className="text-center py-12">
              <IconUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Field Executives Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get started by adding your first field executive
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-colors"
              >
                <IconUserPlus className="h-5 w-5" />
                Add Field Executive
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fieldExecutives.map((fieldExec) => (
                <FieldExecutiveCard
                  key={fieldExec._id}
                  fieldExecutive={fieldExec}
                  onView={() => setViewFieldExecutive(fieldExec)}
                  onEdit={() => setEditFieldExecutive(fieldExec)}
                  onDelete={() => setDeleteConfirm(fieldExec._id)}
                  onToggleStatus={() => handleStatusToggle(fieldExec._id, fieldExec.isActive)}
                  onViewAnalytics={() => setAnalyticsFieldExec(fieldExec)}
                  isDeleting={deleting === fieldExec._id}
                  isToggling={toggling === fieldExec._id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {showCreateModal && (
          <CreateFieldExecutiveModal 
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateSuccess}
          />
        )}

        {viewFieldExecutive && (
          <ViewFieldExecutiveModal
            fieldExecutive={viewFieldExecutive}
            onClose={() => setViewFieldExecutive(null)}
          />
        )}

        {editFieldExecutive && (
          <EditFieldExecutiveModal
            fieldExecutive={editFieldExecutive}
            onClose={() => setEditFieldExecutive(null)}
            onSuccess={handleUpdateSuccess}
          />
        )}

        {deleteConfirm && (
          <DeleteConfirmModal
            fieldExecutiveId={deleteConfirm}
            onConfirm={() => confirmDelete(deleteConfirm)}
            onCancel={() => setDeleteConfirm(null)}
            isDeleting={deleting === deleteConfirm}
          />
        )}

        {analyticsFieldExec && (
          <FieldExecAnalyticsModal
            isOpen={true}
            onClose={() => setAnalyticsFieldExec(null)}
            fieldExecEmail={analyticsFieldExec.email}
            fieldExecName={analyticsFieldExec.name}
          />
        )}
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = React.memo(({ 
  title, 
  value, 
  icon, 
  gradient, 
  border, 
  subtitle 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  gradient: string; 
  border: string; 
  subtitle: string;
}) => {
  return (
    <div className={cn(
      "rounded-xl p-6 border shadow-sm",
      "bg-gradient-to-br",
      gradient,
      border
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</h3>
        </div>
      </div>
      <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">{value}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{subtitle}</p>
    </div>
  );
});

// Field Executive Card Component
const FieldExecutiveCard = React.memo(({ 
  fieldExecutive, 
  onView, 
  onEdit, 
  onDelete,
  onToggleStatus,
  onViewAnalytics,
  isDeleting, 
  isToggling 
}: { 
  fieldExecutive: FieldExecutive; 
  onView: () => void;
  onEdit: () => void; 
  onDelete: () => void;
  onToggleStatus: () => void;
  onViewAnalytics: () => void;
  isDeleting: boolean; 
  isToggling: boolean;
}) => {
  const initials = getUserInitials(fieldExecutive.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white dark:bg-neutral-800 p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {fieldExecutive.img ? (
              <Image
                src={fieldExecutive.img}
                alt={fieldExecutive.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] flex items-center justify-center text-white font-medium">
                {initials}
              </div>
            )}
            <div className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800",
              fieldExecutive.isActive ? "bg-green-500" : "bg-red-500"
            )} />
          </div>
          <div>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{fieldExecutive.name}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{fieldExecutive.email}</p>
          </div>
        </div>
        <span className={cn(
          "px-2 py-1 text-xs font-medium rounded-full",
          fieldExecutive.isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        )}>
          {fieldExecutive.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Phone className="w-4 h-4" />
          <span>{fieldExecutive.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <MapPin className="w-4 h-4" />
          <span>{fieldExecutive.block}, {fieldExecutive.pincode}</span>
        </div>
        {fieldExecutive.target && (
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Target className="w-4 h-4" />
            <span>Target: {fieldExecutive.target}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-2">
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={onView}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
            title="View Details"
          >
            <IconEye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
          <button
            onClick={onEdit}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
            title="Edit"
          >
            <IconEdit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
          <button
            onClick={onViewAnalytics}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#2B9EB3] dark:border-[#2B9EB3] bg-[#2B9EB3]/10 dark:bg-[#2B9EB3]/20 hover:bg-[#2B9EB3]/20 dark:hover:bg-[#2B9EB3]/30 transition-colors"
            title="View Analytics"
          >
            <Target className="w-4 h-4 text-[#2B9EB3]" />
          </button>
          <button
            onClick={onToggleStatus}
            disabled={isToggling}
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg border transition-colors",
              fieldExecutive.isActive
                ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                : "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400",
              isToggling && "opacity-50 cursor-not-allowed"
            )}
            title={fieldExecutive.isActive ? "Deactivate" : "Activate"}
          >
            {isToggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : fieldExecutive.isActive ? (
              <IconUserX className="w-4 h-4" />
            ) : (
              <IconUserCheck className="w-4 h-4" />
            )}
          </button>
        </div>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <IconTrash className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
});

// Create Field Executive Modal Component
const CreateFieldExecutiveModal = React.memo(({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    imagePreview,
    handleInputChange,
    handleImageUpload,
    submitFieldExecutiveCreation,
    isFormValid,
    resetForm
  } = useFieldExecutiveCreation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await submitFieldExecutiveCreation();
    if (result) {
      setTimeout(() => {
        resetForm();
        onSuccess();
        onClose();
      }, 1500);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Create Field Executive
            </h3>
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <IconX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <div 
              onClick={handleImageClick}
              className="relative w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
              ) : imagePreview ? (
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-neutral-400" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-sm text-neutral-500 text-center">
              Click to upload profile image<br />
              <span className="text-xs">PNG, JPG, GIF up to 5MB</span>
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pincode
              </Label>
              <Input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="block" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Block/Area
              </Label>
              <Input
                id="block"
                name="block"
                type="text"
                value={formData.block}
                onChange={handleInputChange}
                placeholder="Enter block or area"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Monthly Target
              </Label>
              <Input
                id="target"
                name="target"
                type="number"
                min="0"
                value={formData.target || ''}
                onChange={handleInputChange}
                placeholder="Enter monthly target"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Complete Address
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter complete address"
              className="w-full"
              required
            />
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid || uploadingImage}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                "bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white hover:shadow-lg",
                (loading || !isFormValid || uploadingImage) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <IconUserPlus className="w-5 h-5" />
                  Create Field Executive
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
});

// View Field Executive Modal Component
const ViewFieldExecutiveModal = React.memo(({ fieldExecutive, onClose }: { fieldExecutive: FieldExecutive; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Field Executive Details
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <IconX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {fieldExecutive.img ? (
              <Image
                src={fieldExecutive.img}
                alt={fieldExecutive.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] flex items-center justify-center text-white text-xl font-bold">
                {getUserInitials(fieldExecutive.name)}
              </div>
            )}
            <div>
              <h4 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {fieldExecutive.name}
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400">{fieldExecutive.email}</p>
              <span className={cn(
                "inline-block px-3 py-1 text-sm font-medium rounded-full mt-2",
                fieldExecutive.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              )}>
                {fieldExecutive.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoSection
              title="Contact Information"
              items={[
                { icon: Mail, label: "Email", value: fieldExecutive.email },
                { icon: Phone, label: "Phone", value: fieldExecutive.phone }
              ]}
            />

            <InfoSection
              title="Location Details"
              items={[
                { icon: MapPin, label: "Address", value: fieldExecutive.address || "Not provided" },
                { icon: Building2, label: "Block/Area", value: fieldExecutive.block || "Not provided" },
                { icon: MapPin, label: "Pincode", value: fieldExecutive.pincode || "Not provided" }
              ]}
            />

            <InfoSection
              title="Performance"
              items={[
                { icon: Target, label: "Monthly Target", value: fieldExecutive.target?.toString() || "Not set" },
                { icon: Calendar, label: "Target Date", value: fieldExecutive.targetDate ? new Date(fieldExecutive.targetDate).toLocaleDateString() : "Not set" }
              ]}
            />

            <InfoSection
              title="Account Information"
              items={[
                { icon: Calendar, label: "Created", value: new Date(fieldExecutive.createdAt).toLocaleDateString() },
                { icon: Calendar, label: "Last Updated", value: new Date(fieldExecutive.updatedAt).toLocaleDateString() }
              ]}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// Edit Field Executive Modal Component
const EditFieldExecutiveModal = React.memo(({ 
  fieldExecutive, 
  onClose, 
  onSuccess 
}: { 
  fieldExecutive: FieldExecutive; 
  onClose: () => void; 
  onSuccess: () => void;
}) => {
  const {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    imagePreview,
    handleInputChange,
    handleImageUpload,
    submitFieldExecutiveUpdate,
    isFormValid,
    setFormData
  } = useFieldExecutiveUpdate(fieldExecutive);

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (fieldExecutive) {
      setFormData({
        id: fieldExecutive._id,
        name: fieldExecutive.name,
        email: fieldExecutive.email,
        address: fieldExecutive.address || '',
        phone: fieldExecutive.phone,
        pincode: fieldExecutive.pincode || '',
        block: fieldExecutive.block || '',
        img: fieldExecutive.img || '',
        target: fieldExecutive.target || 0,
        isActive: fieldExecutive.isActive
      });
    }
  }, [fieldExecutive, setFormData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await submitFieldExecutiveUpdate();
    if (result) {
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Edit Field Executive
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <IconX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <div 
              onClick={handleImageClick}
              className="relative w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
              ) : imagePreview || formData.img ? (
                <Image 
                  src={imagePreview || formData.img || ''} 
                  alt="Preview" 
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] flex items-center justify-center text-white text-xl font-bold">
                  {getUserInitials(formData.name)}
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-sm text-neutral-500 text-center">
              Click to update profile image<br />
              <span className="text-xs">PNG, JPG, GIF up to 5MB</span>
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="w-full"
                required
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pincode
              </Label>
              <Input
                id="pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="block" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Block/Area
              </Label>
              <Input
                id="block"
                name="block"
                type="text"
                value={formData.block}
                onChange={handleInputChange}
                placeholder="Enter block or area"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Monthly Target
              </Label>
              <Input
                id="target"
                name="target"
                type="number"
                min="0"
                value={formData.target || ''}
                onChange={handleInputChange}
                placeholder="Enter monthly target"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Complete Address
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter complete address"
              className="w-full"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange({
                  target: { name: 'isActive', type: 'checkbox', checked: e.target.checked }
                } as any)}
                className="w-4 h-4 text-[#0A3D62] bg-white border-neutral-300 rounded focus:ring-[#0A3D62] focus:ring-2"
              />
              <Label htmlFor="isActive" className="text-sm font-medium">
                Active Status
              </Label>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formData.isActive ? 'Field Executive is currently active' : 'Field Executive is currently inactive'}
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid || uploadingImage}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                "bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white hover:shadow-lg",
                (loading || !isFormValid || uploadingImage) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <IconCheck className="w-5 h-5" />
                  Update Field Executive
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
});

// Delete Confirm Modal Component
const DeleteConfirmModal = React.memo(({
  fieldExecutiveId,
  onConfirm,
  onCancel,
  isDeleting
}: {
  fieldExecutiveId: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
            <IconTrash className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 text-center mb-2">
            Deactivate Field Executive
          </h3>
          
          <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
            Are you sure you want to deactivate this field executive? This action will set their status to inactive but won't permanently delete their data.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deactivating...
                </>
              ) : (
                <>
                  <IconUserX className="w-4 h-4" />
                  Deactivate
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// Info Section Component
const InfoSection = React.memo(({ title, items }: { 
  title: string; 
  items: Array<{ icon: any; label: string; value: string }> 
}) => {
  return (
    <div className="space-y-3">
      <h5 className="font-medium text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-700 pb-2">
        {title}
      </h5>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <item.icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.label}</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 break-words">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});