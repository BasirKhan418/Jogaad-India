import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/utils/fieldexecutive/fieldExecutiveApiService";

type Step = 'personal' | 'service' | 'optional';

interface Category {
  _id: string;
  categoryName: string;
  categoryType: string;
  categoryMinPrice: number;
  categoryMaxPrice: number;
  recommendationPrice: number;
  categoryStatus?: boolean;
}

interface FormData {
  description: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  address: string;
  categoryid: string;
  payrate: number | string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  img: string;
  customDescription?: string;
}

export const useFieldExecEditEmployee = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingEmployee, setFetchingEmployee] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('personal');

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    address: "",
    categoryid: "",
    payrate: "",
    bankName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    img: "",
    customDescription: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Set selected category when categories load and we have a categoryid
  useEffect(() => {
    if (categories.length > 0 && formData.categoryid && formData.categoryid !== 'others') {
      const category = categories.find(c => c._id === formData.categoryid);
      if (category && !selectedCategory) {
        setSelectedCategory(category);
      }
    }
  }, [categories, formData.categoryid, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/v1/category");
      
      // Check if response is ok
      if (!response.ok) {
        console.error("Failed to fetch categories, status:", response.status);
        toast.error("Failed to load categories");
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Invalid content type:", contentType);
        toast.error("Error loading categories");
        return;
      }

      const result = await response.json();
      
      // API returns categories in 'categories' property, not 'data'
      if (result.success && result.categories) {
        const activeCategories = result.categories.filter((cat: Category) => cat.categoryStatus === true);
        setCategories(activeCategories);
        if (activeCategories.length === 0) {
          toast.warning("No active categories found. Please contact admin.");
        }
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error loading categories");
    }
  };

  const loadEmployeeData = useCallback(async (employeeId: string) => {
    setFetchingEmployee(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/field-e/employee/${employeeId}`);
      
      // Check if response is ok
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Unauthorized access. Redirecting to login...");
          router.push("/field-executive/login");
          return;
        }
        setError("Failed to load employee data");
        toast.error("Failed to load employee data");
        setFetchingEmployee(false);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setError("Invalid response from server");
        toast.error("Invalid response from server");
        setFetchingEmployee(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.employee) {
        const employee = data.employee;
        
        // Populate form with employee data
        setFormData({
          name: employee.name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          city: employee.city || "",
          pincode: employee.pincode || "",
          address: employee.address || "",
          categoryid: employee.categoryid?._id || employee.categoryid || "",
          payrate: employee.payrate || "",
          bankName: employee.bankName || "",
          bankAccountNumber: employee.bankAccountNumber || "",
          bankIfscCode: employee.bankIfscCode || "",
          img: employee.img || "",
          customDescription: employee.customDescription || "",
        });

        if (employee.img) {
          setImagePreview(employee.img);
        }

        // Wait a bit for categories to load if they haven't yet
        if (categories.length === 0) {
          // Give categories time to load
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Set selected category if exists
        const categoryId = employee.categoryid?._id || employee.categoryid;
        if (categoryId && categoryId !== 'others') {
          // Try to find in current categories state
          const category = categories.find(c => c._id === categoryId);
          if (category) {
            setSelectedCategory(category);
          } else {
            // If not found, fetch categories again
            await fetchCategories();
            // Try one more time after refresh
            setTimeout(() => {
              const cat = categories.find(c => c._id === categoryId);
              if (cat) setSelectedCategory(cat);
            }, 100);
          }
        }
      } else {
        setError(data.message || "Failed to load employee data");
        toast.error(data.message || "Failed to load employee data");
      }
    } catch (error) {
      console.error("Error loading employee:", error);
      setError("Error loading employee data");
      toast.error("Error loading employee data");
    } finally {
      setFetchingEmployee(false);
    }
  }, [categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Validate price if payrate changes
    if (id === 'payrate' && selectedCategory && selectedCategory._id !== 'others') {
      const rate = parseFloat(value);
      if (rate < selectedCategory.categoryMinPrice || rate > selectedCategory.categoryMaxPrice) {
        setPriceError(
          `Rate must be between ₹${selectedCategory.categoryMinPrice} and ₹${selectedCategory.categoryMaxPrice}`
        );
      } else {
        setPriceError(null);
      }
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryid: categoryId,
      payrate: "",
    }));

    if (categoryId === 'others') {
      setSelectedCategory(null);
      setPriceError(null);
    } else {
      const category = categories.find((c) => c._id === categoryId);
      setSelectedCategory(category || null);
      
      if (category) {
        setPriceError(null);
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const response = await uploadImage(file);
      if (response.success && response.data) {
        const uploadedUrl = response.data.url;
        setFormData((prev) => ({
          ...prev,
          img: uploadedUrl,
        }));
        setImagePreview(uploadedUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(response.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const submitUpdateEmployee = async (employeeId: string) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        payrate: formData.payrate ? parseFloat(formData.payrate as string) : 0,
      };

      const response = await fetch("/api/v1/field-e/addemployee", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        toast.success("Employee updated successfully!");
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/field-executive/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Failed to update employee");
        toast.error(data.message || "Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("An error occurred while updating employee");
      toast.error("An error occurred while updating employee");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 'personal') {
      setStep('service');
    } else if (step === 'service') {
      setStep('optional');
    }
  };

  const prevStep = () => {
    if (step === 'optional') {
      setStep('service');
    } else if (step === 'service') {
      setStep('personal');
    }
  };

  const isStepValid = useCallback(() => {
    if (step === 'personal') {
      return (
        !!formData.name &&
        !!formData.email &&
        !!formData.phone && formData.phone.toString().length >= 10 &&
        !!formData.pincode && formData.pincode.toString().length === 6 &&
        !!formData.address
      );
    }
    
    if (step === 'service') {
      const basicValid = formData.categoryid && formData.payrate;
      const customDescValid = formData.categoryid === 'others' ? formData.customDescription : true;
      return basicValid && customDescValid && !priceError;
    }
    
    return true; // Optional step is always valid
  }, [step, formData, priceError]);

  return {
    loading,
    uploadingImage,
    error,
    success,
    formData,
    categories,
    selectedCategory,
    imagePreview,
    priceError,
    step,
    fetchingEmployee,
    handleInputChange,
    handleCategorySelect,
    handleImageUpload,
    submitUpdateEmployee,
    nextStep,
    prevStep,
    isStepValid: isStepValid(),
    loadEmployeeData,
  };
};
