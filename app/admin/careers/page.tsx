"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { AdminData } from "@/utils/admin/adminAuthService";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminData, useAdminLogout } from "@/utils/admin/useAdminHooks";
import { useCareersData, Career, CareerFormData } from "@/utils/admin/useCareersData";
import CareersTable from "@/components/admin/careers/CareersTable";
import CareerModal from "@/components/admin/careers/CareerModal";
import DeleteCareerModal from "@/components/admin/careers/DeleteCareerModal";

export default function CareersPage() {
  const router = useRouter();
  const { adminData, loading, error } = useAdminData();
  const { handleLogout } = useAdminLogout();

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
          <p className="text-[#0A3D62] font-semibold">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error || !adminData) {
    router.push("/admin/signin");
    return null;
  }

  return (
    <div className={cn(
      "rounded-md flex flex-col md:flex-row bg-white w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
      "h-screen"
    )}>
      <AdminSidebar adminData={adminData} handleLogout={handleLogout} />
      <CareersContent adminData={adminData} />
    </div>
  );
}

const CareersContent = ({ adminData }: { adminData: AdminData | null }) => {
  const {
    careers,
    loading,
    error,
    actionLoading,
    createCareer,
    updateCareer,
    deleteCareer,
    toggleCareerStatus,
    fetchCareers,
  } = useCareersData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Filter careers based on search and filters
  const filteredCareers = careers.filter((career) => {
    const matchesSearch = 
      career.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMode = filterMode === "all" || career.mode === filterMode;
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "active" && career.isActive) ||
      (filterStatus === "inactive" && !career.isActive);

    return matchesSearch && matchesMode && matchesStatus;
  });

  const handleCreate = () => {
    setSelectedCareer(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (career: Career) => {
    setSelectedCareer(career);
    setIsEditModalOpen(true);
  };

  const handleDelete = (career: Career) => {
    setSelectedCareer(career);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (data: CareerFormData) => {
    const success = await createCareer(data);
    if (success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleEditSubmit = async (data: CareerFormData) => {
    if (selectedCareer) {
      const success = await updateCareer(selectedCareer._id, data);
      if (success) {
        setIsEditModalOpen(false);
        setSelectedCareer(null);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedCareer) {
      const success = await deleteCareer(selectedCareer._id);
      if (success) {
        setIsDeleteModalOpen(false);
        setSelectedCareer(null);
      }
    }
  };

  const handleToggleStatus = async (career: Career) => {
    await toggleCareerStatus(career._id, career.isActive);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#0A3D62] font-semibold">Loading careers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                  Careers Management
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Manage job postings and career opportunities
                </p>
              </div>
              <button
                onClick={handleCreate}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white font-semibold hover:shadow-lg transition-all duration-200"
              >
                + Create Career
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 border border-blue-200 dark:border-blue-700">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">
                Total Careers
              </div>
              <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {careers.length}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 border border-green-200 dark:border-green-700">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">
                Active Careers
              </div>
              <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {careers.filter((c) => c.isActive).length}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 border border-purple-200 dark:border-purple-700">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">
                Remote Positions
              </div>
              <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {careers.filter((c) => c.mode === "remote").length}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 border border-orange-200 dark:border-orange-700">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium mb-2">
                Departments
              </div>
              <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {new Set(careers.map((c) => c.department).filter(Boolean)).size}
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by role, department, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
            />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
            >
              <option value="all">All Modes</option>
              <option value="remote">Remote</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B9EB3] dark:bg-neutral-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Careers Table */}
          <CareersTable
            careers={filteredCareers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            actionLoading={actionLoading}
          />
        </div>
      </div>

      {/* Modals */}
      <CareerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        title="Create New Career"
        actionLoading={actionLoading}
      />

      <CareerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCareer(null);
        }}
        onSubmit={handleEditSubmit}
        title="Edit Career"
        career={selectedCareer}
        actionLoading={actionLoading}
      />

      <DeleteCareerModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCareer(null);
        }}
        onConfirm={handleDeleteConfirm}
        career={selectedCareer}
        actionLoading={actionLoading}
      />
    </>
  );
};
