import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  fetchAllCategories,
  createEmployeeAccount,
  uploadImage,
  CategoryData,
  EmployeeCreateRequest,
  ApiResponse
} from './employeeApiService';
import { useRouter } from 'next/navigation';

export interface UseEmployeeCreationReturn {
  loading: boolean;
  uploadingImage: boolean;
  error: string;
  success: string;
  formData: EmployeeCreateRequest;
  categories: CategoryData[];
  selectedCategory: CategoryData | null;
  imagePreview: string;
  
  setFormData: (data: EmployeeCreateRequest) => void;
  clearMessages: () => void;
  resetForm: () => void;
  
  fetchCategories: () => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCategorySelect: (categoryId: string) => void;
  handleImageUpload: (file: File) => Promise<void>;
  submitEmployeeCreation: () => Promise<boolean>;
  
  isFormValid: boolean;
  priceError: string;
}

const initialFormData: EmployeeCreateRequest = {
  name: '',
  email: '',
  address: '',
  phone: '',
  pincode: '',
  bankName: '',
  bankAccountNumber: '',
  bankIfscCode: '',
  img: '',
  categoryid: '',
  payrate: 0
};

export const useEmployeeCreation = (): UseEmployeeCreationReturn => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [priceError, setPriceError] = useState('');
  const [formData, setFormData] = useState<EmployeeCreateRequest>(initialFormData);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
    setPriceError('');
  }, []);

  const validatePrice = useCallback((price: number): boolean => {
    if (!selectedCategory) {
      setPriceError('Please select a category first');
      return false;
    }

    const minPrice = selectedCategory.categoryMinPrice || 0;
    const maxPrice = selectedCategory.categoryMaxPrice || 0;

    if (price < minPrice) {
      setPriceError(`Price must be at least ₹${minPrice.toLocaleString()}`);
      return false;
    }

    if (price > maxPrice) {
      setPriceError(`Price cannot exceed ₹${maxPrice.toLocaleString()}`);
      return false;
    }

    setPriceError('');
    return true;
  }, [selectedCategory]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSelectedCategory(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview('');
    clearMessages();
    setLoading(false);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [clearMessages, imagePreview]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount

  // Validate price when category or payrate changes
  useEffect(() => {
    if (selectedCategory && formData.payrate > 0) {
      validatePrice(formData.payrate);
    } else {
      setPriceError('');
    }
  }, [selectedCategory, formData.payrate, validatePrice]);

  const fetchCategories = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const result = await fetchAllCategories(abortControllerRef.current.signal);
      
      if (result.success && result.data?.categories) {
        // Filter only active categories
        const activeCategories = result.data.categories.filter(cat => cat.categoryStatus);
        setCategories(activeCategories);
      } else {
        toast.error(result.message || 'Failed to fetch categories');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      toast.error('Failed to fetch categories');
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = parseFloat(value) || 0;
      setFormData(prev => ({ ...prev, [id]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
    
    clearMessages();
  }, [clearMessages]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    setSelectedCategory(category || null);
    setFormData(prev => ({ 
      ...prev, 
      categoryid: categoryId,
      payrate: category?.recommendationPrice || 0
    }));
    clearMessages();
  }, [categories, clearMessages]);

  const handleImageUpload = useCallback(async (file: File) => {
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
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(preview);

    // Upload image
    setUploadingImage(true);
    try {
      const result = await uploadImage(file);
      if (result.success && result.data?.fileURL) {
        setFormData(prev => ({ ...prev, img: result.data!.fileURL }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload image');
        setImagePreview('');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  }, [imagePreview]);

  const submitEmployeeCreation = useCallback(async (): Promise<boolean> => {
    clearMessages();

    // Validate required fields
    if (!formData.name) {
      toast.error('Please enter employee name');
      return false;
    }

    if (!formData.email) {
      toast.error('Please enter employee email');
      return false;
    }

    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number (at least 10 digits)');
      return false;
    }

    if (!formData.categoryid) {
      toast.error('Please select a category');
      return false;
    }

    if (!formData.payrate || formData.payrate <= 0) {
      toast.error('Please enter a valid pay rate');
      return false;
    }

    // Validate price range
    if (!validatePrice(formData.payrate)) {
      return false;
    }

    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const result = await createEmployeeAccount(formData, abortControllerRef.current.signal);
      
      if (result.success) {
        if (result.redirect) {
          toast.success('Employee account already exists and is paid');
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 1500);
          return true;
        }

        if (result.order) {
          toast.success(result.message || 'Employee created! Payment order generated.');
          setSuccess(result.message || 'Employee account created successfully');
          
          // Could redirect to payment page or show payment details
          setTimeout(() => {
            resetForm();
          }, 2000);
          return true;
        }

        toast.success(result.message || 'Employee created successfully');
        setSuccess(result.message || 'Employee account created successfully');
        
        setTimeout(() => {
          resetForm();
        }, 2000);
        
        return true;
      } else {
        const errorMsg = result.message || 'Failed to create employee account';
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
      
      const errorMsg = 'Network error occurred. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validatePrice, clearMessages, resetForm, router]);

  const isFormValid = !!(
    formData.name &&
    formData.email &&
    formData.phone &&
    formData.phone.length >= 10 &&
    formData.categoryid &&
    formData.payrate > 0 &&
    !priceError
  );

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
    
    setFormData,
    clearMessages,
    resetForm,
    
    fetchCategories,
    handleInputChange,
    handleCategorySelect,
    handleImageUpload,
    submitEmployeeCreation,
    
    isFormValid
  };
};
