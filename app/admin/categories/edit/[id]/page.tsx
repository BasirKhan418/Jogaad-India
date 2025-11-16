"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconLoader2,
  IconUpload,
  IconX,
  IconSettings,
  IconUsers,
  IconCategory,
  IconCurrencyDollar,
  IconChartBar,
  IconLogout,
  IconDashboard,
  IconUser,
} from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AdminData } from "@/utils/admin/adminAuthService";
import { getUserInitials } from "@/utils/auth";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useAdminNavigation } from "@/utils/admin/useAdminNavigation";
import { useAdminData, useAdminLogout, useAdminSidebar } from "@/utils/admin/useAdminHooks";
import Image from "next/image";

interface CategoryFormData {
  categoryName: string;
  categoryType: 'Service' | 'Maintenance';
  categoryDescription: string;
  categoryUnit: string;
  recommendationPrice: number;
  categoryMinPrice: number;
  categoryMaxPrice: number;
  categoryStatus: boolean;
  img: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const { adminData, loading: adminLoading, error: adminError } = useAdminData();
  const { handleLogout } = useAdminLogout();
  const { open, setOpen } = useAdminSidebar();
  const { links, logoutLink } = useAdminNavigation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
    categoryType: "Service",
    categoryDescription: "",
    categoryUnit: "",
    recommendationPrice: 0,
    categoryMinPrice: 0,
    categoryMaxPrice: 0,
    categoryStatus: true,
    img: ""
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/v1/admincategory?id=${categoryId}`);
        const data = await response.json();
        
        if (data.success && data.category) {
          setFormData({
            categoryName: data.category.categoryName || "",
            categoryType: data.category.categoryType || "Service",
            categoryDescription: data.category.categoryDescription || "",
            categoryUnit: data.category.categoryUnit || "",
            recommendationPrice: data.category.recommendationPrice || 0,
            categoryMinPrice: data.category.categoryMinPrice || 0,
            categoryMaxPrice: data.category.categoryMaxPrice || 0,
            categoryStatus: data.category.categoryStatus ?? true,
            img: data.category.img || ""
          });
          setImagePreview(data.category.img || "");
        } else {
          toast.error("Failed to load category");
          router.push("/admin/categories");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Error loading category");
        router.push("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    // Upload image
    setUploadingImage(true);
    try {
      // Get presigned URL
      const uploadResponse = await fetch('/api/v1/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.uploadURL || !uploadData.fileURL) {
        throw new Error('Failed to get upload URL');
      }

      // Upload file to S3
      const s3Response = await fetch(uploadData.uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!s3Response.ok) {
        throw new Error('Failed to upload image');
      }

      setFormData(prev => ({ ...prev, img: uploadData.fileURL }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setImagePreview(formData.img);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryName) {
      toast.error("Category name is required");
      return;
    }

    if (formData.categoryMinPrice && formData.categoryMaxPrice && formData.categoryMinPrice > formData.categoryMaxPrice) {
      toast.error("Minimum price cannot be greater than maximum price");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/v1/admincategory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: categoryId,
          ...formData
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category updated successfully!");
        setTimeout(() => {
          router.push('/admin/categories');
        }, 1500);
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("An error occurred while updating the category");
    } finally {
      setSaving(false);
    }
  };

  if (adminLoading || loading) {
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
          <p className="text-[#0A3D62] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (adminError || !adminData) {
    router.push("/admin/signin");
    return null;
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
      
      <EditCategoryContent categoryId={categoryId} />
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

// Edit Category Content Component
const EditCategoryContent = ({ categoryId }: { categoryId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
    categoryType: "Service",
    categoryDescription: "",
    categoryUnit: "",
    recommendationPrice: 0,
    categoryMinPrice: 0,
    categoryMaxPrice: 0,
    categoryStatus: true,
    img: ""
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/v1/admincategory?id=${categoryId}`);
        const data = await response.json();
        
        if (data.success && data.category) {
          setFormData({
            categoryName: data.category.categoryName || "",
            categoryType: data.category.categoryType || "Service",
            categoryDescription: data.category.categoryDescription || "",
            categoryUnit: data.category.categoryUnit || "",
            recommendationPrice: data.category.recommendationPrice || 0,
            categoryMinPrice: data.category.categoryMinPrice || 0,
            categoryMaxPrice: data.category.categoryMaxPrice || 0,
            categoryStatus: data.category.categoryStatus ?? true,
            img: data.category.img || ""
          });
          setImagePreview(data.category.img || "");
        } else {
          toast.error("Failed to load category");
          router.push("/admin/categories");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Error loading category");
        router.push("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    // Upload image
    setUploadingImage(true);
    try {
      // Get presigned URL
      const uploadResponse = await fetch('/api/v1/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.uploadURL || !uploadData.fileURL) {
        throw new Error('Failed to get upload URL');
      }

      // Upload file to S3
      const s3Response = await fetch(uploadData.uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!s3Response.ok) {
        throw new Error('Failed to upload image');
      }

      setFormData(prev => ({ ...prev, img: uploadData.fileURL }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setImagePreview(formData.img);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryName) {
      toast.error("Category name is required");
      return;
    }

    if (formData.categoryMinPrice && formData.categoryMaxPrice && formData.categoryMinPrice > formData.categoryMaxPrice) {
      toast.error("Minimum price cannot be greater than maximum price");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/v1/admincategory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: categoryId,
          ...formData
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category updated successfully!");
        setTimeout(() => {
          router.push('/admin/categories');
        }, 1500);
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("An error occurred while updating the category");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#F9A825] to-[#2B9EB3] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-[#0A3D62] font-semibold">Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl">
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => router.push('/admin/categories')}
                  className="p-2 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 dark:hover:from-neutral-700 dark:hover:to-neutral-600 border border-neutral-200 dark:border-neutral-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <IconArrowLeft className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                    Edit Category
                  </h1>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                    Update category information
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              {/* Image Upload */}
              <div className="flex justify-center">
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleImageClick}
                    disabled={uploadingImage}
                    className="relative w-32 h-32 rounded-full border-2 border-dashed border-[#2B9EB3]/50 hover:border-[#2B9EB3] transition-all duration-300 overflow-hidden group"
                  >
                    {uploadingImage ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                        <IconLoader2 className="w-6 h-6 text-[#2B9EB3] animate-spin" />
                      </div>
                    ) : imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Category preview"
                          
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <IconUpload className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#2B9EB3]">
                        <IconUpload className="w-10 h-10 mb-2" />
                        <span className="text-xs font-medium">Upload</span>
                      </div>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">Category Image (Optional)</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <Label htmlFor="categoryName" className="text-[#0A3D62] font-semibold">
                    Category Name *
                  </Label>
                  <Input
                    id="categoryName"
                    placeholder="Enter category name"
                    type="text"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    required
                    className="h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="categoryType" className="text-[#0A3D62] font-semibold">
                    Category Type *
                  </Label>
                  <select
                    id="categoryType"
                    value={formData.categoryType}
                    onChange={handleInputChange}
                    required
                    className="h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 px-3 text-[#0A3D62]"
                  >
                    <option value="Service">Service</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </LabelInputContainer>

                <LabelInputContainer className="md:col-span-2">
                  <Label htmlFor="categoryDescription" className="text-[#0A3D62] font-semibold">
                    Description
                  </Label>
                  <textarea
                    id="categoryDescription"
                    placeholder="Enter category description"
                    value={formData.categoryDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60 px-4 py-3 text-[#0A3D62] placeholder:text-gray-400"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="categoryUnit" className="text-[#0A3D62] font-semibold">
                    Unit
                  </Label>
                  <Input
                    id="categoryUnit"
                    placeholder="e.g., per hour, per service"
                    type="text"
                    value={formData.categoryUnit}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="recommendationPrice" className="text-[#0A3D62] font-semibold">
                    Recommended Price (₹) *
                  </Label>
                  <Input
                    id="recommendationPrice"
                    placeholder="0"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.recommendationPrice}
                    onChange={handleInputChange}
                    required
                    className="h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="categoryMinPrice" className="text-[#0A3D62] font-semibold">
                    Minimum Price (₹)
                  </Label>
                  <Input
                    id="categoryMinPrice"
                    placeholder="0"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.categoryMinPrice}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="categoryMaxPrice" className="text-[#0A3D62] font-semibold">
                    Maximum Price (₹)
                  </Label>
                  <Input
                    id="categoryMaxPrice"
                    placeholder="0"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.categoryMaxPrice}
                    onChange={handleInputChange}
                    className="h-11 rounded-xl border-2 border-gray-200/60 focus:border-[#2B9EB3] focus:ring-0 bg-white/60"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="categoryStatus" className="text-[#0A3D62] font-semibold flex items-center gap-2">
                    <input
                      id="categoryStatus"
                      type="checkbox"
                      checked={formData.categoryStatus}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 text-[#2B9EB3] focus:ring-[#2B9EB3]"
                    />
                    Active Status
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">Enable this category for users</p>
                </LabelInputContainer>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saving}
                className={cn(
                  "w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2",
                  "bg-gradient-to-r from-[#2B9EB3] to-[#0A3D62] shadow-lg hover:shadow-xl hover:shadow-[#2B9EB3]/25",
                  "transform hover:scale-[1.02] active:scale-[0.98]",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                )}
              >
                {saving ? (
                  <>
                    <IconLoader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <IconDeviceFloppy className="w-5 h-5" />
                    Update Category
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
