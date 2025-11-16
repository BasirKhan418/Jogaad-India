"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconSettings,
  IconUsers,
  IconCategory,
  IconCurrencyDollar,
  IconChartBar,
  IconLogout,
  IconDashboard,
  IconUser,
  IconPlus,
  IconList,
  IconTools,
  IconBuildingStore,
  IconEdit,
  IconTrash,
  IconEye,
  IconX
} from "@tabler/icons-react";
import { AdminData } from "@/utils/admin/adminAuthService";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAdminNavigation } from "@/utils/admin/useAdminNavigation";
import { useAdminData, useAdminLogout, useAdminSidebar } from "@/utils/admin/useAdminHooks";
import { useCategoryData } from "@/utils/admin/useCategoryData";
import { Category } from "@/utils/admin/categoryService";
import Image from "next/image";

export default function CategoriesPage() {
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
      
      <CategoriesContent adminData={adminData} />
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

// Categories Content Component
const CategoriesContent = ({ adminData }: { adminData: AdminData | null }) => {
  const router = useRouter();
  const { categories, serviceCategories, maintenanceCategories, stats, loading: categoryLoading, error: categoryError, refetch, handleDelete, deleting } = useCategoryData();
  const [showServiceModal, setShowServiceModal] = React.useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = React.useState(false);
  const [viewCategory, setViewCategory] = React.useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

  const onDelete = async (categoryId: string) => {
    const success = await handleDelete(categoryId);
    if (success) {
      setDeleteConfirm(null);
    }
  };
  
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
                  Categories Management
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Manage service and maintenance categories for your platform
                </p>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/admin/categories/add')}
              className="bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105"
            >
              <IconPlus className="h-5 w-5" />
              Add New Category
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Categories" 
            value={categoryLoading ? "..." : stats.total.toString()} 
            icon={<IconCategory className="h-8 w-8 text-blue-500" />}
            gradient="from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
            border="border-blue-200 dark:border-blue-700"
            subtitle={categoryLoading ? "Loading..." : `${stats.total} total categories`}
          />
          <StatsCard 
            title="Service Categories" 
            value={categoryLoading ? "..." : stats.service.toString()} 
            icon={<IconBuildingStore className="h-8 w-8 text-green-500" />}
            gradient="from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
            border="border-green-200 dark:border-green-700"
            subtitle={categoryLoading ? "Loading..." : `${stats.service} service categories`}
          />
          <StatsCard 
            title="Maintenance Categories" 
            value={categoryLoading ? "..." : stats.maintenance.toString()} 
            icon={<IconTools className="h-8 w-8 text-purple-500" />}
            gradient="from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
            border="border-purple-200 dark:border-purple-700"
            subtitle={categoryLoading ? "Loading..." : `${stats.maintenance} maintenance categories`}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Add New Category */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/admin/categories/add')}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconPlus className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-100 mb-2">Add New Category</h3>
                  <p className="text-green-600 dark:text-green-300 text-sm">Create a new service or maintenance category with pricing details</p>
                </div>
              </div>
            </motion.div>

            {/* View Service Categories */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowServiceModal(true)}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconBuildingStore className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-800 dark:text-blue-100 mb-2">Service Categories</h3>
                  <p className="text-blue-600 dark:text-blue-300 text-sm">View and manage all service-related categories and their pricing</p>
                </div>
              </div>
            </motion.div>

            {/* View Maintenance Categories */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMaintenanceModal(true)}
              className="cursor-pointer rounded-xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 p-8 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconTools className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-800 dark:text-purple-100 mb-2">Maintenance Categories</h3>
                  <p className="text-purple-600 dark:text-purple-300 text-sm">View and manage all maintenance-related categories and pricing</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Recent Activity</h2>
          {categoryLoading ? (
            <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-8 border border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B9EB3]"></div>
                <p className="text-neutral-600 dark:text-neutral-400">Loading recent activity...</p>
              </div>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-4">
              {categories.slice(0, 5).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {category.img ? (
                        <img 
                          src={category.img} 
                          alt={category.categoryName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          category.categoryType === 'Service' 
                            ? "bg-gradient-to-br from-green-400 to-green-600" 
                            : "bg-gradient-to-br from-purple-400 to-purple-600"
                        )}>
                          {category.categoryType === 'Service' ? (
                            <IconBuildingStore className="h-6 w-6 text-white" />
                          ) : (
                            <IconTools className="h-6 w-6 text-white" />
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{category.categoryName}</h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {category.categoryType} • ₹{category.recommendationPrice || 0}
                          {category.categoryStatus ? (
                            <span className="ml-2 text-green-600 dark:text-green-400">• Active</span>
                          ) : (
                            <span className="ml-2 text-red-600 dark:text-red-400">• Inactive</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewCategory(category)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/categories/edit/${category._id}`)}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 transition-colors"
                        title="Edit Category"
                      >
                        <IconEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category._id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                        title="Delete Category"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 p-8 border border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <IconList className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">No Recent Activity</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md">
                    No recent category activity to display. Create your first category to get started and see activity here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <CategoryModal 
          isOpen={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          categories={serviceCategories}
          type="Service"
          loading={categoryLoading}
          onView={setViewCategory}
          onEdit={(id) => router.push(`/admin/categories/edit/${id}`)}
          onDelete={setDeleteConfirm}
        />
        
        <CategoryModal 
          isOpen={showMaintenanceModal}
          onClose={() => setShowMaintenanceModal(false)}
          categories={maintenanceCategories}
          type="Maintenance"
          loading={categoryLoading}
          onView={setViewCategory}
          onEdit={(id) => router.push(`/admin/categories/edit/${id}`)}
          onDelete={setDeleteConfirm}
        />

        {/* View Category Modal */}
        {viewCategory && (
          <ViewCategoryModal
            category={viewCategory}
            onClose={() => setViewCategory(null)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <DeleteConfirmModal
            categoryId={deleteConfirm}
            onConfirm={() => onDelete(deleteConfirm)}
            onCancel={() => setDeleteConfirm(null)}
            deleting={deleting}
          />
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ 
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
  subtitle?: string;
}) => {
  return (
    <div className={cn("rounded-xl p-6 border", gradient, border)}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{title}</div>
        {icon}
      </div>
      <div className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">{value}</div>
      <div className="text-xs text-neutral-500 dark:text-neutral-500">{subtitle || "Loading stats..."}</div>
    </div>
  );
};

// Category Modal Component
const CategoryModal = ({ 
  isOpen, 
  onClose, 
  categories, 
  type,
  loading,
  onView,
  onEdit,
  onDelete
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  categories: Category[]; 
  type: 'Service' | 'Maintenance';
  loading: boolean;
  onView: (category: Category) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  if (!isOpen) return null;

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.categoryDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.categoryType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-neutral-200 dark:border-neutral-700"
      >
        {/* Header */}
        <div className={cn(
          "p-6 border-b border-neutral-200 dark:border-neutral-700",
          type === 'Service' 
            ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
            : "bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {type === 'Service' ? (
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  <IconBuildingStore className="h-6 w-6" />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg">
                  <IconTools className="h-6 w-6" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{type} Categories</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {filteredCategories.length} {filteredCategories.length === categories.length ? '' : `of ${categories.length}`} categories {searchQuery ? 'found' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <svg className="w-6 h-6 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${type.toLowerCase()} categories...`}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#2B9EB3] focus:ring-0 transition-all duration-300"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <IconX className="w-4 h-4 text-neutral-500" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-220px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B9EB3]"></div>
              <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading categories...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "rounded-xl p-5 border hover:shadow-lg transition-all duration-300 cursor-pointer",
                    type === 'Service'
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-700"
                      : "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border-purple-200 dark:border-purple-700"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {category.img ? (
                      <img 
                        src={category.img} 
                        alt={category.categoryName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className={cn(
                        "w-16 h-16 rounded-lg flex items-center justify-center shrink-0",
                        type === 'Service'
                          ? "bg-gradient-to-br from-green-400 to-green-600"
                          : "bg-gradient-to-br from-purple-400 to-purple-600"
                      )}>
                        {type === 'Service' ? (
                          <IconBuildingStore className="h-8 w-8 text-white" />
                        ) : (
                          <IconTools className="h-8 w-8 text-white" />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-1 truncate">
                        {category.categoryName}
                      </h3>
                      {category.categoryDescription && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
                          {category.categoryDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-semibold text-[#2B9EB3]">
                          ₹{category.recommendationPrice || 0}
                        </span>
                        {category.categoryUnit && (
                          <span className="text-neutral-500 dark:text-neutral-400">
                            / {category.categoryUnit}
                          </span>
                        )}
                        {category.categoryStatus ? (
                          <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(category);
                            onClose();
                          }}
                          className="flex-1 p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          <IconEye className="h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(category._id);
                          }}
                          className="flex-1 p-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          <IconEdit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(category._id);
                            onClose();
                          }}
                          className="flex-1 p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          <IconTrash className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-700 mb-4">
                <svg className="w-8 h-8 text-neutral-500 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                No Results Found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center max-w-md mb-4">
                No {type.toLowerCase()} categories match your search "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-lg bg-[#2B9EB3] text-white font-medium hover:shadow-lg transition-all"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-700 mb-4">
                <IconList className="h-8 w-8 text-neutral-500 dark:text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                No {type} Categories Found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm text-center max-w-md">
                There are no {type.toLowerCase()} categories yet. Create your first category to get started.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// View Category Modal
const ViewCategoryModal = ({ 
  category, 
  onClose 
}: { 
  category: Category; 
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-neutral-200 dark:border-neutral-700"
      >
        {/* Header */}
        <div className={cn(
          "p-6 border-b border-neutral-200 dark:border-neutral-700",
          category.categoryType === 'Service' 
            ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
            : "bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {category.categoryType === 'Service' ? (
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  <IconBuildingStore className="h-6 w-6" />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg">
                  <IconTools className="h-6 w-6" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{category.categoryName}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{category.categoryType} Category</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <IconX className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-6">
            {/* Image */}
            {category.img && (
              <div className="flex justify-center">
                <img 
                  src={category.img} 
                  alt={category.categoryName}
                  className="w-48 h-48 rounded-xl object-cover border-2 border-neutral-200 dark:border-neutral-700"
                />
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailCard label="Category Name" value={category.categoryName} />
              <DetailCard label="Type" value={category.categoryType} />
              <DetailCard label="Recommended Price" value={`₹${category.recommendationPrice || 0}`} />
              {category.categoryUnit && (
                <DetailCard label="Unit" value={category.categoryUnit} />
              )}
              {category.categoryMinPrice !== undefined && (
                <DetailCard label="Min Price" value={`₹${category.categoryMinPrice}`} />
              )}
              {category.categoryMaxPrice !== undefined && (
                <DetailCard label="Max Price" value={`₹${category.categoryMaxPrice}`} />
              )}
              <DetailCard 
                label="Status" 
                value={category.categoryStatus ? 'Active' : 'Inactive'}
                valueClass={category.categoryStatus ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
              />
              <DetailCard 
                label="Last Updated" 
                value={new Date(category.updatedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              />
            </div>

            {/* Description */}
            {category.categoryDescription && (
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Description</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {category.categoryDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DetailCard = ({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) => (
  <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-3">
    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
    <p className={cn("text-sm font-semibold text-neutral-800 dark:text-neutral-100", valueClass)}>
      {value}
    </p>
  </div>
);

// Delete Confirmation Modal
const DeleteConfirmModal = ({ 
  categoryId, 
  onConfirm, 
  onCancel,
  deleting 
}: { 
  categoryId: string; 
  onConfirm: () => void; 
  onCancel: () => void;
  deleting: boolean;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
              <IconTrash className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Delete Category</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            Are you sure you want to delete this category? All associated data will be permanently removed from the system.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <IconTrash className="h-4 w-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};